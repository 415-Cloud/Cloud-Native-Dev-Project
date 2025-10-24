const amqp = require('amqplib');

class EventConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchangeName = 'fitness_events';
  }

  async connect() {
    try {
      // Connect to RabbitMQ
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      
      // Create exchange for fitness events
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      
      console.log('Connected to RabbitMQ for event consumption');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async subscribeToWorkoutEvents() {
    try {
      if (!this.channel) {
        await this.connect();
      }

      // Create a queue for challenge service
      const queue = await this.channel.assertQueue('challenge-service-workouts', { durable: true });
      
      // Bind to workout.logged events
      await this.channel.bindQueue(queue.queue, this.exchangeName, 'workout.logged');
      
      // Consume messages
      await this.channel.consume(queue.queue, (msg) => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            this.handleWorkoutLogged(event);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing workout event:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      console.log('Subscribed to workout events');
    } catch (error) {
      console.error('Failed to subscribe to workout events:', error);
      throw error;
    }
  }

  async handleWorkoutLogged(event) {
    console.log('Received WorkoutLogged event:', event);
    
    try {
      // Validate event data
      if (!event.data || !event.data.userId || !event.data.workoutId) {
        console.error('Invalid workout event data:', event);
        return;
      }

      // 1. Check if the user is participating in any challenges
      const { Pool } = require('pg');
      const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'fitness_tracker',
        user: 'postgres',
        password: 'password'
      });

      const userChallenges = await pool.query(
        `SELECT COUNT(*) as challenge_count 
         FROM challenge_participants p 
         JOIN challenges c ON p.challenge_id = c.id 
         WHERE p.user_id = $1 AND c.status = 'active' AND p.status = 'active'
         AND c.start_date <= CURRENT_DATE AND c.end_date >= CURRENT_DATE`,
        [event.data.userId]
      );

      const challengeCount = parseInt(userChallenges.rows[0].challenge_count);
      console.log(`User ${event.data.userId} is participating in ${challengeCount} active challenges`);

      if (challengeCount > 0) {
        // 2. Update challenge progress
        await this.updateChallengeProgress(event.data);
        
        // 3. Check for challenge completion
        await this.checkChallengeCompletion(event.data.userId);
      } else {
        console.log(`User ${event.data.userId} is not participating in any active challenges`);
      }

      await pool.end();
    } catch (error) {
      console.error('Error handling workout logged event:', error);
    }
  }

  async updateChallengeProgress(workoutData) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'fitness_tracker',
        user: 'postgres',
        password: 'password'
      });

      // 1. Query database for user's active challenges
      const userChallenges = await pool.query(
        `SELECT c.*, p.joined_at 
         FROM challenges c 
         JOIN challenge_participants p ON c.id = p.challenge_id 
         WHERE p.user_id = $1 AND c.status = 'active' AND p.status = 'active'
         AND c.start_date <= CURRENT_DATE AND c.end_date >= CURRENT_DATE`,
        [workoutData.userId]
      );

      console.log(`Found ${userChallenges.rows.length} active challenges for user ${workoutData.userId}`);

      // 2. Calculate progress based on workout type and challenge requirements
      for (const challenge of userChallenges.rows) {
        let progressValue = 0;
        let isRelevant = false;

        // Check if workout type matches challenge type
        if (challenge.type === workoutData.type || 
            (challenge.type === 'steps' && workoutData.type === 'walking') ||
            (challenge.type === 'running' && workoutData.type === 'running')) {
          
          isRelevant = true;
          
          // Calculate progress based on challenge type
          switch (challenge.type) {
            case 'steps':
              // For step challenges, use distance converted to steps (rough estimate)
              progressValue = workoutData.distance ? Math.round(workoutData.distance * 2000) : 0;
              break;
            case 'running':
            case 'cycling':
              // For distance challenges, use the distance value
              progressValue = workoutData.distance || 0;
              break;
            case 'duration':
              // For time-based challenges, use duration in minutes
              progressValue = workoutData.duration || 0;
              break;
            default:
              progressValue = workoutData.distance || workoutData.duration || 0;
          }

          if (progressValue > 0) {
            // 3. Update challenge progress in database
            await pool.query(
              `INSERT INTO challenge_progress (challenge_id, user_id, workout_id, progress_value, workout_type, created_at)
               VALUES ($1, $2, $3, $4, $5, NOW())
               ON CONFLICT (challenge_id, user_id, workout_id) 
               DO UPDATE SET progress_value = EXCLUDED.progress_value`,
              [challenge.id, workoutData.userId, workoutData.workoutId, progressValue, workoutData.type]
            );

            console.log(`Updated progress for challenge ${challenge.name}: +${progressValue} ${challenge.target_unit}`);

            // 4. Publish challenge progress events
            await this.publishChallengeProgressEvent(challenge.id, workoutData.userId, {
              challengeName: challenge.name,
              progressValue,
              targetValue: challenge.target_value,
              targetUnit: challenge.target_unit,
              workoutType: workoutData.type,
              workoutId: workoutData.workoutId
            });
          }
        }

        if (!isRelevant) {
          console.log(`Workout type ${workoutData.type} doesn't match challenge type ${challenge.type}`);
        }
      }

      await pool.end();
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  }

  async publishChallengeProgressEvent(challengeId, userId, progressData) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const event = {
        type: 'ChallengeProgress',
        timestamp: new Date().toISOString(),
        data: {
          challengeId,
          userId,
          progress: progressData
        }
      };

      // Publish to challenge.progress topic
      await this.channel.publish(
        this.exchangeName,
        'challenge.progress',
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );

      console.log('Published ChallengeProgress event:', event);
    } catch (error) {
      console.error('Failed to publish ChallengeProgress event:', error);
    }
  }

  async checkChallengeCompletion(userId) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'fitness_tracker',
        user: 'postgres',
        password: 'password'
      });

      // Get user's active challenges with their progress
      const challengesWithProgress = await pool.query(
        `SELECT c.id, c.name, c.target_value, c.target_unit, c.type,
                COALESCE(SUM(cp.progress_value), 0) as total_progress
         FROM challenges c
         JOIN challenge_participants p ON c.id = p.challenge_id
         LEFT JOIN challenge_progress cp ON c.id = cp.challenge_id AND cp.user_id = p.user_id
         WHERE p.user_id = $1 AND c.status = 'active' AND p.status = 'active'
         AND c.start_date <= CURRENT_DATE AND c.end_date >= CURRENT_DATE
         GROUP BY c.id, c.name, c.target_value, c.target_unit, c.type`,
        [userId]
      );

      for (const challenge of challengesWithProgress.rows) {
        const progressPercentage = (challenge.total_progress / challenge.target_value) * 100;
        
        console.log(`Challenge ${challenge.name}: ${challenge.total_progress}/${challenge.target_value} ${challenge.target_unit} (${progressPercentage.toFixed(1)}%)`);

        // Check if challenge is completed
        if (challenge.total_progress >= challenge.target_value) {
          console.log(`🎉 Challenge completed: ${challenge.name}`);
          
          // Update participant status to completed
          await pool.query(
            'UPDATE challenge_participants SET status = $1 WHERE challenge_id = $2 AND user_id = $3',
            ['completed', challenge.id, userId]
          );

          // Publish challenge completion event
          await this.publishChallengeCompletionEvent(challenge.id, userId, {
            challengeName: challenge.name,
            targetValue: challenge.target_value,
            targetUnit: challenge.target_unit,
            totalProgress: challenge.total_progress,
            completionDate: new Date().toISOString()
          });
        }
      }

      await pool.end();
    } catch (error) {
      console.error('Error checking challenge completion:', error);
    }
  }

  async publishChallengeCompletionEvent(challengeId, userId, completionData) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const event = {
        type: 'ChallengeCompleted',
        timestamp: new Date().toISOString(),
        data: {
          challengeId,
          userId,
          completion: completionData
        }
      };

      // Publish to challenge.completed topic
      await this.channel.publish(
        this.exchangeName,
        'challenge.completed',
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );

      console.log('Published ChallengeCompleted event:', event);
    } catch (error) {
      console.error('Failed to publish ChallengeCompleted event:', error);
    }
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

module.exports = EventConsumer;
