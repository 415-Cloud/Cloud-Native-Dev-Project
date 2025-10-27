-- Sample data for development/testing
-- Note: In production, user creation should only happen through proper registration flow

-- Sample user (password_hash is a placeholder - never use in production)
INSERT INTO users (user_id, email, password_hash, name, profile_info, fitness_level, goals)
VALUES (
    'sample-user-123',
    'john.doe@example.com',
    '$2a$10$placeholder', -- This is not a real hash
    'John Doe',
    'Active runner, enjoys cycling',
    'Intermediate',
    'Complete a marathon, improve cycling endurance'
);

