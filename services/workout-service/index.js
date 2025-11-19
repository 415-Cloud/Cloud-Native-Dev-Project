const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const EventPublisher = require('./eventPublisher');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection with Prisma ORM
const prisma = new PrismaClient();

// Event publisher
const eventPublisher = new EventPublisher();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'workout-service' });
});

// Log a workout - YOUR MAIN API ENDPOINT
app.post('/workouts', async (req, res) => {
  try {
    const { userId, type, distance, duration, calories, notes } = req.body;
    
    // Basic validation
    if (!userId || !type || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into database using Prisma ORM
    const workout = await prisma.workout.create({
      data: {
        userId,
        type,
        distance,
        duration,
        calories,
        notes
      }
    });

    // Publish event to other services
    try {
      await eventPublisher.publishWorkoutLogged(workout);
      console.log('Workout logged and event published:', workout);
    } catch (eventError) {
      console.error('Failed to publish workout event:', eventError);
      // Don't fail the request if event publishing fails
    }

    res.status(201).json({ 
      success: true, 
      workout: workout
    });
  } catch (error) {
    console.error('Error logging workout:', error);
    res.status(500).json({ error: 'Failed to log workout' });
  }
});

// Get user's workouts
app.get('/users/:userId/workouts', async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await prisma.workout.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({ workouts: workouts });
  } catch (error) {
    console.error('Error getting workouts:', error);
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

// Get workout by ID
app.get('/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workout = await prisma.workout.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    res.json({ workout: workout });
  } catch (error) {
    console.error('Error getting workout:', error);
    res.status(500).json({ error: 'Failed to get workout' });
  }
});

// Update workout
app.put('/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, distance, duration, calories, notes } = req.body;
    
    const workout = await prisma.workout.update({
      where: {
        id: parseInt(id)
      },
      data: {
        type,
        distance,
        duration,
        calories,
        notes
      }
    });
    
    res.json({ 
      success: true, 
      workout: workout 
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Delete workout
app.delete('/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.workout.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Workout deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Workout Service...');
  await eventPublisher.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Workout Service...');
  await eventPublisher.close();
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Workout Service running on port ${PORT}`);
});