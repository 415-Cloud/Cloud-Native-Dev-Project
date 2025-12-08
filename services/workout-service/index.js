require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const EventPublisher = require('./eventPublisher');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection with PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

    // Insert into database
    const result = await pool.query(
      'INSERT INTO workouts (user_id, type, distance, duration, calories, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, type, distance || null, duration, calories || null, notes || null]
    );
    const workout = result.rows[0];

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
    const result = await pool.query(
      'SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    const workouts = result.rows;
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
    const result = await pool.query(
      'SELECT * FROM workouts WHERE id = $1',
      [parseInt(id)]
    );
    const workout = result.rows[0];
    
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
    
    const result = await pool.query(
      'UPDATE workouts SET type = $1, distance = $2, duration = $3, calories = $4, notes = $5 WHERE id = $6 RETURNING *',
      [type, distance || null, duration, calories || null, notes || null, parseInt(id)]
    );
    const workout = result.rows[0];
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
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
    
    const result = await pool.query(
      'DELETE FROM workouts WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
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
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Workout Service...');
  await eventPublisher.close();
  await pool.end();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`Workout Service running on port ${PORT}`);
  
  // Initialize event publisher connection with retry logic
  const maxRetries = 10;
  const retryDelay = 3000; // 3 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await eventPublisher.connect();
      console.log('Successfully connected to RabbitMQ and initialized event publisher');
      break;
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('Max retries reached. Event publisher not initialized. Events will be published lazily.');
      }
    }
  }
});