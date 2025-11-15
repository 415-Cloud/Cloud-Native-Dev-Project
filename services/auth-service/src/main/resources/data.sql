-- Sample data for development/testing
-- Note: In production, credentials should only be created through proper registration flow

-- Sample credential (password_hash is a placeholder - never use in production)
-- Using ON CONFLICT to avoid errors if data already exists
INSERT INTO credentials (user_id, email, password_hash)
VALUES (
    'sample-user-123',
    'john.doe@example.com',
    '$2a$10$placeholder_use_bcrypt_in_production'
)
ON CONFLICT (user_id) DO NOTHING;
