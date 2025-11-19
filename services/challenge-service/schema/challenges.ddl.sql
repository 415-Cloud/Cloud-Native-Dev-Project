-- Migration: 001_initial_challenges.sql
-- Description: Create initial challenges, participants, and progress tables
-- Created: 2024-01-01

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_value DECIMAL(10,2),
    target_unit VARCHAR(20),
    created_by VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    UNIQUE(challenge_id, user_id)
);

-- Create challenge progress table
CREATE TABLE IF NOT EXISTS challenge_progress (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    workout_id INTEGER NOT NULL, -- References workout from workout service
    progress_value DECIMAL(10,2) NOT NULL,
    workout_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id, workout_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_challenge_id ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_challenge_id ON challenge_progress(challenge_id);

