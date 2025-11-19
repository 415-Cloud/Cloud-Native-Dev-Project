const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const EventConsumer = require('./eventConsumer');

const app = express();
const PORT = 3002;

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'fitness_tracker',
  user: 'postgres',
  password: 'password'
});

// Event consumer
const eventConsumer = new EventConsumer();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'challenge-service' });
});

// Create a new challenge
app.post('/challenges', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      type, 
      startDate, 
      endDate, 
      targetValue, 
      targetUnit, 
      createdBy 
    } = req.body;
    
    // Basic validation
    if (!name || !type || !startDate || !endDate || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Insert challenge
    const result = await pool.query(
      `INSERT INTO challenges (name, description, type, start_date, end_date, target_value, target_unit, created_by, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active') RETURNING *`,
      [name, description, type, startDate, endDate, targetValue, targetUnit, createdBy]
    );

    res.status(201).json({ 
      success: true, 
      challenge: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Get all active challenges
app.get('/challenges', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              COUNT(p.user_id) as participant_count
       FROM challenges c 
       LEFT JOIN challenge_participants p ON c.id = p.challenge_id 
       WHERE c.status = 'active' 
       GROUP BY c.id 
       ORDER BY c.created_at DESC`
    );
    res.json({ challenges: result.rows });
  } catch (error) {
    console.error('Error getting challenges:', error);
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

// Get challenge by ID
app.get('/challenges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.*, 
              COUNT(p.user_id) as participant_count
       FROM challenges c 
       LEFT JOIN challenge_participants p ON c.id = p.challenge_id 
       WHERE c.id = $1 
       GROUP BY c.id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json({ challenge: result.rows[0] });
  } catch (error) {
    console.error('Error getting challenge:', error);
    res.status(500).json({ error: 'Failed to get challenge' });
  }
});

// Join a challenge
app.post('/challenges/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if challenge exists and is active
    const challengeCheck = await pool.query(
      'SELECT * FROM challenges WHERE id = $1 AND status = $2',
      [id, 'active']
    );
    
    if (challengeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found or not active' });
    }

    // Check if user is already participating
    const existingParticipation = await pool.query(
      'SELECT * FROM challenge_participants WHERE challenge_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (existingParticipation.rows.length > 0) {
      return res.status(400).json({ error: 'User is already participating in this challenge' });
    }

    // Add participant
    const result = await pool.query(
      'INSERT INTO challenge_participants (challenge_id, user_id, joined_at) VALUES ($1, $2, NOW()) RETURNING *',
      [id, userId]
    );

    res.status(201).json({ 
      success: true, 
      participation: result.rows[0] 
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

// Leave a challenge
app.delete('/challenges/:id/leave', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Remove participant
    const result = await pool.query(
      'DELETE FROM challenge_participants WHERE challenge_id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User is not participating in this challenge' });
    }

    res.json({ 
      success: true, 
      message: 'Successfully left challenge' 
    });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({ error: 'Failed to leave challenge' });
  }
});

// Get user's challenges
app.get('/users/:userId/challenges', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT c.*, p.joined_at, p.status as participation_status
       FROM challenges c 
       JOIN challenge_participants p ON c.id = p.challenge_id 
       WHERE p.user_id = $1 
       ORDER BY p.joined_at DESC`,
      [userId]
    );
    res.json({ challenges: result.rows });
  } catch (error) {
    console.error('Error getting user challenges:', error);
    res.status(500).json({ error: 'Failed to get user challenges' });
  }
});

// Get challenge participants
app.get('/challenges/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.user_id, p.joined_at, p.status
       FROM challenge_participants p 
       WHERE p.challenge_id = $1 
       ORDER BY p.joined_at ASC`,
      [id]
    );
    res.json({ participants: result.rows });
  } catch (error) {
    console.error('Error getting challenge participants:', error);
    res.status(500).json({ error: 'Failed to get challenge participants' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Challenge Service...');
  await eventConsumer.close();
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down Challenge Service...');
  await eventConsumer.close();
  await pool.end();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`Challenge Service running on port ${PORT}`);
  
  // Start listening to events
  try {
    await eventConsumer.subscribeToWorkoutEvents();
  } catch (error) {
    console.error('Failed to start event consumer:', error);
  }
});
