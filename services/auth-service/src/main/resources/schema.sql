-- Auth Service Database Schema
-- This schema defines the credentials table for authentication

CREATE TABLE IF NOT EXISTS credentials (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_credentials_email ON credentials(email);

