const amqp = require('amqplib');

class EventPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchangeName = 'fitness_events';
  }
// Producer → Exchange → Queue → Consumer
  async connect() {
    try {
      // Clean up any existing connection
      if (this.channel) {
        try {
          await this.channel.close();
        } catch (e) {
          // Ignore errors when closing
        }
      }
      if (this.connection) {
        try {
          await this.connection.close();
        } catch (e) {
          // Ignore errors when closing
        }
      }

      // Connect to RabbitMQ
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
      this.connection = await amqp.connect(rabbitmqUrl);
      
      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err.message);
        this.channel = null;
        this.connection = null;
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.channel = null;
        this.connection = null;
      });

      this.channel = await this.connection.createChannel();
      
      // Create exchange for fitness events
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      
      console.log('Connected to RabbitMQ and created exchange');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error.message);
      this.channel = null;
      this.connection = null;
      throw error;
    }
  }

  async publishWorkoutLogged(workoutData) {
    try {
      // Ensure connection exists
      if (!this.channel || !this.connection) {
        await this.connect();
      }

      // Check if channel is still open
      if (this.channel === null) {
        throw new Error('Channel is null, connection may be closed');
      }

      // The producer creates a message and sends it to an exchange in RabbitMQ.
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

      // this is the exchange in rabbitmq
      // Publish to workout.logged topic
      await this.channel.publish(
        this.exchangeName,
        'workout.logged',
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );

      console.log('Published WorkoutLogged event:', event);
    } catch (error) {
      console.error('Failed to publish WorkoutLogged event:', error.message);
      // Reset connection state on error so it will retry next time
      this.channel = null;
      this.connection = null;
      // Don't throw - allow the API to succeed even if event publishing fails
      // This ensures the workout is saved even if RabbitMQ is temporarily unavailable
    }
  }

  async publishChallengeProgress(challengeId, userId, progressData) {
    try {
      // Ensure connection exists
      if (!this.channel || !this.connection) {
        await this.connect();
      }

      // Check if channel is still open
      if (this.channel === null) {
        throw new Error('Channel is null, connection may be closed');
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
      console.error('Failed to publish ChallengeProgress event:', error.message);
      // Reset connection state on error so it will retry next time
      this.channel = null;
      this.connection = null;
      // Don't throw - allow graceful degradation
    }
  }

  // close connection
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
