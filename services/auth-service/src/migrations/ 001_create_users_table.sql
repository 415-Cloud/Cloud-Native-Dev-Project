-- 001_create_users_table.sql

-- Enable the uuid-ossp extension, which allows for generating universally unique IDs.
-- If this extension is not already installed on your database, uncomment and run the line below:
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    -- Primary Key: A unique ID for the user, essential for linking to all other services/tables.
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Authentication and Contact Information
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Stores the secure hash of the password (e.g., bcrypt output)
    username VARCHAR(100) UNIQUE NOT NULL,

    -- Profile and Coach Service (AI-lite) Data
    display_name VARCHAR(100),
    
    -- Goal and preference data needed by the Coach Service
    fitness_goal VARCHAR(50) NOT NULL DEFAULT 'Maintain Fitness', -- e.g., 'Weight Loss', 'Endurance', 'Muscle Gain'
    preferred_activity VARCHAR(50) NOT NULL DEFAULT 'Running',    -- e.g., 'Running', 'Cycling', 'Steps'

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create a function and trigger to automatically update 'updated_at' column
-- This is a standard practice for tracking record changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();