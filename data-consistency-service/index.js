const { Pool } = require('pg');
const amqp = require('amqplib');

class DataConsistencyService {
  constructor() {
    // Use raw PostgreSQL connections instead of Prisma for multi-database access
    this.workoutPool = new Pool({
      host: process.env.WORKOUT_DB_HOST || 'workout-db',
      port: 5432,
      database: 'fitness_tracker_workouts',
      user: 'postgres',
      password: 'password'
    });
    
    this.challengePool = new Pool({
      host: process.env.CHALLENGE_DB_HOST || 'challenge-db',
      port: 5432,
      database: 'fitness_tracker_challenges',
      user: 'postgres',
      password: 'password'
    });
    
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertExchange('fitness_events', 'topic', { durable: true });
      console.log('Data Consistency Service connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async subscribeToEvents() {
    try {
      // Subscribe to workout events
      const workoutQueue = await this.channel.assertQueue('data-consistency-workouts', { durable: true });
      await this.channel.bindQueue(workoutQueue.queue, 'fitness_events', 'workout.logged');
      
      await this.channel.consume(workoutQueue.queue, async (msg) => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            await this.handleWorkoutEvent(event);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing workout event:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      // Subscribe to challenge events
      const challengeQueue = await this.channel.assertQueue('data-consistency-challenges', { durable: true });
      await this.channel.bindQueue(challengeQueue.queue, 'fitness_events', 'challenge.*');
      
      await this.channel.consume(challengeQueue.queue, async (msg) => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            await this.handleChallengeEvent(event);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing challenge event:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      console.log('Data Consistency Service subscribed to events');
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
      throw error;
    }
  }

  async handleWorkoutEvent(event) {
    console.log('Processing workout event for data consistency:', event.type);
    
    // Implement eventual consistency patterns
    if (event.type === 'WorkoutLogged') {
      await this.ensureWorkoutConsistency(event.data);
    }
  }

  async handleChallengeEvent(event) {
    console.log('Processing challenge event for data consistency:', event.type);
    
    // Implement eventual consistency patterns
    if (event.type === 'ChallengeProgress') {
      await this.ensureChallengeConsistency(event.data);
    }
  }

  async ensureWorkoutConsistency(workoutData) {
    try {
      // Verify workout exists in workout service
      const workoutResult = await this.workoutPool.query(
        'SELECT * FROM workouts WHERE id = $1',
        [workoutData.workoutId]
      );

      if (workoutResult.rows.length === 0) {
        console.error('Data inconsistency: Workout not found in workout service');
        // Implement compensation logic here
        return;
      }

      // Check if challenge progress needs to be recalculated
      await this.recalculateChallengeProgress(workoutData.userId);
      
      console.log('Workout data consistency verified');
    } catch (error) {
      console.error('Error ensuring workout consistency:', error);
    }
  }

  async ensureChallengeConsistency(challengeData) {
    try {
      // Verify challenge exists in challenge service
      const challengeResult = await this.challengePool.query(
        'SELECT * FROM challenges WHERE id = $1',
        [challengeData.challengeId]
      );

      if (challengeResult.rows.length === 0) {
        console.error('Data inconsistency: Challenge not found in challenge service');
        return;
      }

      // Verify participant exists
      const participantResult = await this.challengePool.query(
        'SELECT * FROM challenge_participants WHERE challenge_id = $1 AND user_id = $2',
        [challengeData.challengeId, challengeData.userId]
      );

      if (participantResult.rows.length === 0) {
        console.error('Data inconsistency: Participant not found');
        return;
      }

      console.log('Challenge data consistency verified');
    } catch (error) {
      console.error('Error ensuring challenge consistency:', error);
    }
  }

  async recalculateChallengeProgress(userId) {
    try {
      // Get all active challenges for user with their progress
      const challengesResult = await this.challengePool.query(
        `SELECT c.*, COALESCE(SUM(cp.progress_value), 0) as total_progress
         FROM challenges c
         JOIN challenge_participants p ON c.id = p.challenge_id
         LEFT JOIN challenge_progress cp ON c.id = cp.challenge_id AND cp.user_id = p.user_id
         WHERE p.user_id = $1 AND c.status = 'active' AND p.status = 'active'
         GROUP BY c.id, c.name, c.target_value, c.target_unit`,
        [userId]
      );

      for (const challenge of challengesResult.rows) {
        const totalProgress = parseFloat(challenge.total_progress);
        const targetValue = parseFloat(challenge.target_value);
        const progressPercentage = (totalProgress / targetValue) * 100;
        
        console.log(`Challenge ${challenge.name}: ${totalProgress}/${targetValue} (${progressPercentage.toFixed(1)}%)`);
        
        // Check if challenge is completed
        if (totalProgress >= targetValue) {
          await this.challengePool.query(
            'UPDATE challenge_participants SET status = $1 WHERE challenge_id = $2 AND user_id = $3',
            ['completed', challenge.id, userId]
          );
          
          console.log(`🎉 Challenge completed: ${challenge.name}`);
        }
      }
    } catch (error) {
      console.error('Error recalculating challenge progress:', error);
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
      await this.workoutPool.end();
      await this.challengePool.end();
      console.log('Data Consistency Service disconnected');
    } catch (error) {
      console.error('Error closing Data Consistency Service:', error);
    }
  }
}

// Start the service
const consistencyService = new DataConsistencyService();

async function startService() {
  try {
    await consistencyService.connect();
    await consistencyService.subscribeToEvents();
    console.log('Data Consistency Service started');
  } catch (error) {
    console.error('Failed to start Data Consistency Service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Data Consistency Service...');
  await consistencyService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Data Consistency Service...');
  await consistencyService.close();
  process.exit(0);
});

startService();

