-- Simple workout table
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    distance DECIMAL(10,2),
    duration INTEGER NOT NULL,
    calories INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge definitions table
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'steps', 'running', 'cycling', etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_value DECIMAL(10,2), -- e.g., 10000 steps, 5.0 miles
    target_unit VARCHAR(20), -- 'steps', 'miles', 'km', 'minutes'
    created_by VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge participants table
CREATE TABLE challenge_participants (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'dropped'
    UNIQUE(challenge_id, user_id)
);

-- Challenge progress tracking table
CREATE TABLE challenge_progress (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
    progress_value DECIMAL(10,2) NOT NULL,
    workout_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id, workout_id)
);
