const { PrismaClient } = require('@prisma/client');
const amqp = require('amqplib');

class DataConsistencyService {
  constructor() {
    this.workoutPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.WORKOUT_DATABASE_URL || "postgresql://postgres:password@workout-db:5432/fitness_tracker_workouts"
        }
      }
    });
    
    this.challengePrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.CHALLENGE_DATABASE_URL || "postgresql://postgres:password@challenge-db:5432/fitness_tracker_challenges"
        }
      }
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
      const workout = await this.workoutPrisma.workout.findUnique({
        where: { id: workoutData.workoutId }
      });

      if (!workout) {
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
      const challenge = await this.challengePrisma.challenge.findUnique({
        where: { id: challengeData.challengeId }
      });

      if (!challenge) {
        console.error('Data inconsistency: Challenge not found in challenge service');
        return;
      }

      // Verify participant exists
      const participant = await this.challengePrisma.challengeParticipant.findFirst({
        where: {
          challengeId: challengeData.challengeId,
          userId: challengeData.userId
        }
      });

      if (!participant) {
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
      // Get all active challenges for user
      const challenges = await this.challengePrisma.challenge.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
              status: 'active'
            }
          },
          status: 'active'
        },
        include: {
          progress: {
            where: {
              userId: userId
            }
          }
        }
      });

      for (const challenge of challenges) {
        const totalProgress = challenge.progress.reduce((sum, p) => sum + p.progressValue, 0);
        const progressPercentage = (totalProgress / challenge.targetValue) * 100;
        
        console.log(`Challenge ${challenge.name}: ${totalProgress}/${challenge.targetValue} (${progressPercentage.toFixed(1)}%)`);
        
        // Check if challenge is completed
        if (totalProgress >= challenge.targetValue) {
          await this.challengePrisma.challengeParticipant.updateMany({
            where: {
              challengeId: challenge.id,
              userId: userId
            },
            data: {
              status: 'completed'
            }
          });
          
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
      await this.workoutPrisma.$disconnect();
      await this.challengePrisma.$disconnect();
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

