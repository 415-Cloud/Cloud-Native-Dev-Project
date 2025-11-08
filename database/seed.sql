-- Seed script for workout-service and challenge-service tables
-- Usage:
--   psql -h localhost -U postgres -d fitness_tracker -f database/seed.sql
-- Adjust connection settings or wrap in Docker compose exec as needed.

BEGIN;

-- Clear existing data so the seed loads cleanly
TRUNCATE TABLE challenge_progress, challenge_participants, challenges RESTART IDENTITY CASCADE;
TRUNCATE TABLE workouts RESTART IDENTITY CASCADE;

-- Seed workouts (workout-service)
INSERT INTO workouts (user_id, type, distance, duration, calories, notes, created_at) VALUES
  ('user-100', 'running', 5.2, 28, 420, 'Morning tempo run', NOW() - INTERVAL '2 day'),
  ('user-100', 'cycling', 18.5, 52, 560, 'Lunch ride with hills', NOW() - INTERVAL '1 day'),
  ('user-101', 'walking', 3.0, 45, 210, 'Evening walk with dog', NOW() - INTERVAL '12 hour');

-- Seed challenges (challenge-service)
INSERT INTO challenges (name, description, type, start_date, end_date, target_value, target_unit, created_by, status) VALUES
  ('May Distance Builder', 'Accumulate 20 km of running during May.', 'running', CURRENT_DATE - INTERVAL '5 day', CURRENT_DATE + INTERVAL '25 day', 20.0, 'km', 'coach-1', 'active'),
  ('30-Day Cycling Sprint', 'Ride 250 km in 30 days.', 'cycling', CURRENT_DATE - INTERVAL '10 day', CURRENT_DATE + INTERVAL '20 day', 250.0, 'km', 'coach-2', 'active'),
  ('Step Into Summer', 'Reach 120,000 steps before summer.', 'steps', CURRENT_DATE - INTERVAL '3 day', CURRENT_DATE + INTERVAL '27 day', 120000, 'steps', 'coach-3', 'active');

-- Seed challenge participants
INSERT INTO challenge_participants (challenge_id, user_id, joined_at, status) VALUES
  (1, 'user-100', CURRENT_TIMESTAMP - INTERVAL '4 day', 'active'),
  (2, 'user-100', CURRENT_TIMESTAMP - INTERVAL '9 day', 'active'),
  (3, 'user-101', CURRENT_TIMESTAMP - INTERVAL '2 day', 'active');

-- Seed challenge progress records (links workouts to challenges)
INSERT INTO challenge_progress (challenge_id, user_id, workout_id, progress_value, workout_type, created_at) VALUES
  (1, 'user-100', 1, 5.2, 'running', NOW() - INTERVAL '2 day'),
  (2, 'user-100', 2, 18.5, 'cycling', NOW() - INTERVAL '1 day'),
  (3, 'user-101', 3, 6000, 'walking', NOW() - INTERVAL '12 hour'); -- walking workout mapped to ~6k steps

COMMIT;

