-- Seed script for challenge-service tables (challenges, challenge_participants, challenge_progress)

BEGIN;

-- Clear existing data so the seed loads cleanly
TRUNCATE TABLE challenge_progress, challenge_participants, challenges RESTART IDENTITY CASCADE;

-- Seed challenges
INSERT INTO challenges (name, description, type, start_date, end_date, target_value, target_unit, created_by, status) VALUES
  ('Push Day Power-Up', 'Complete three ruthless upper-body strength sessions with spicy finishers.', 'strength', CURRENT_DATE - INTERVAL '4 day', CURRENT_DATE + INTERVAL '26 day', 3.0, 'sessions', 'coach-strong', 'active'),
  ('Core & Cardio Gauntlet', 'Rack up 120 minutes of HIIT-core hybrids without repeating a circuit.', 'hiit', CURRENT_DATE - INTERVAL '2 day', CURRENT_DATE + INTERVAL '28 day', 120.0, 'minutes', 'coach-core', 'active'),
  ('Leg Day Blast', 'Crush 120 km of low-cadence hill work before the month wraps.', 'cycling', CURRENT_DATE - INTERVAL '3 day', CURRENT_DATE + INTERVAL '27 day', 120.0, 'km', 'coach-legs', 'active');

-- Seed challenge participants
INSERT INTO challenge_participants (challenge_id, user_id, joined_at, status) VALUES
  (1, 'user-200', CURRENT_TIMESTAMP - INTERVAL '3 day', 'active'),
  (2, 'user-200', CURRENT_TIMESTAMP - INTERVAL '1 day', 'active'),
  (3, 'user-201', CURRENT_TIMESTAMP - INTERVAL '2 day', 'active');

-- Seed challenge progress records (links workouts to challenges)
-- Note: workout_id references workouts in the workout-service database
INSERT INTO challenge_progress (challenge_id, user_id, workout_id, progress_value, workout_type, created_at) VALUES
  (1, 'user-200', 1, 1.0, 'strength', NOW() - INTERVAL '2 day'),
  (2, 'user-200', 2, 32.0, 'hiit', NOW() - INTERVAL '20 hour'),
  (3, 'user-201', 3, 24.6, 'cycling', NOW() - INTERVAL '8 hour');

COMMIT;

