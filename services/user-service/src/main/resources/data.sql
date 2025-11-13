-- Sample data for development/testing
-- Note: In production, user creation should only happen through proper registration flow

-- Sample user (password_hash is a placeholder - never use in production)
-- Using ON CONFLICT to avoid errors if data already exists
INSERT INTO users (user_id, email, password_hash, name, profile_info, fitness_level, goals)
VALUES (
    'sample-user-123',
    'john.doe@example.com',
    'placeholder_hash_not_for_production',
    'John Doe',
    'Active runner, enjoys cycling',
    'Intermediate',
    'Complete a marathon, improve cycling endurance'
)
ON CONFLICT (user_id) DO NOTHING;
