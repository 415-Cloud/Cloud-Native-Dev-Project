const amqp = require('amqplib');

class EventPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchangeName = 'fitness_events';
  }

  async connect() {
    try {
      // Connect to RabbitMQ
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      // Create exchange for fitness events
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      
      console.log('Connected to RabbitMQ and created exchange');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publishWorkoutLogged(workoutData) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const event = {
        type: 'WorkoutLogged',
        timestamp: new Date().toISOString(),
        data: {
          workoutId: workoutData.id,
          userId: workoutData.user_id,
          type: workoutData.type,
          distance: workoutData.distance,
          duration: workoutData.duration,
          calories: workoutData.calories,
          createdAt: workoutData.created_at
        }
      };

      // Publish to workout.logged topic
      await this.channel.publish(
        this.exchangeName,
        'workout.logged',
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );

      console.log('Published WorkoutLogged event:', event);
    } catch (error) {
      console.error('Failed to publish WorkoutLogged event:', error);
      throw error;
    }
  }

  async publishChallengeProgress(challengeId, userId, progressData) {
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
      throw error;
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

module.exports = EventPublisher;
