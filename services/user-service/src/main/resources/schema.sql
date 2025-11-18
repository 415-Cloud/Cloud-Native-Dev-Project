-- User Service Database Schema
-- This schema defines the Users table structure

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    profile_info TEXT,
    fitness_level VARCHAR(50),
    goals TEXT,
    measuring_system VARCHAR(20) DEFAULT 'metric',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index for fitness level queries
CREATE INDEX IF NOT EXISTS idx_users_fitness_level ON users(fitness_level);

