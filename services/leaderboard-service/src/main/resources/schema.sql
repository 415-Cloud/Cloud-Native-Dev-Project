-- Leaderboard Service Database Schema
-- This schema mirrors the Redis sorted set + hash functionality

-- Leaderboard entries table
-- Stores user scores and streak information (previously stored in Redis ZSet + Hash)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    user_id VARCHAR(255) PRIMARY KEY,
    score DOUBLE PRECISION NOT NULL DEFAULT 0,
    streak_count BIGINT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient ranking queries (equivalent to Redis ZREVRANK)
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard_entries(score DESC);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard_entries(user_id);
