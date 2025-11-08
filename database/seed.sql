-- Seed script for workout-service and challenge-service tables

BEGIN;

-- Clear existing data so the seed loads cleanly
TRUNCATE TABLE challenge_progress, challenge_participants, challenges RESTART IDENTITY CASCADE;
TRUNCATE TABLE workouts RESTART IDENTITY CASCADE;

-- Seed workouts (workout-service)
INSERT INTO workouts (user_id, type, distance, duration, calories, notes, created_at) VALUES
  ('user-200', 'strength', NULL, 60, 480, 'Push Day power session focusing on chest and triceps', NOW() - INTERVAL '3 day'),
  ('user-200', 'hiit', NULL, 45, 520, 'Core & Cardio fusion circuit with medicine ball finishers', NOW() - INTERVAL '2 day'),
  ('user-201', 'cycling', 22.5, 70, 650, 'Leg Day Blast climb ride with heavy resistance', NOW() - INTERVAL '1 day');

-- Seed challenges (challenge-service)
INSERT INTO challenges (name, description, type, start_date, end_date, target_value, target_unit, created_by, status) VALUES
  ('Push Day Power-Up', 'Complete five focused upper-body strength sessions this month.', 'strength', CURRENT_DATE - INTERVAL '7 day', CURRENT_DATE + INTERVAL '23 day', 5.0, 'sessions', 'coach-strong', 'active'),
  ('Core & Cardio Fusion', 'Log 200 total minutes of HIIT or core cardio work.', 'hiit', CURRENT_DATE - INTERVAL '4 day', CURRENT_DATE + INTERVAL '26 day', 200.0, 'minutes', 'coach-core', 'active'),
  ('Leg Day Blast', 'Rack up 150 km of heavy-resistance cycling.', 'cycling', CURRENT_DATE - INTERVAL '6 day', CURRENT_DATE + INTERVAL '24 day', 150.0, 'km', 'coach-legs', 'active');

-- Seed challenge participants
INSERT INTO challenge_participants (challenge_id, user_id, joined_at, status) VALUES
  (1, 'user-200', CURRENT_TIMESTAMP - INTERVAL '6 day', 'active'),
  (2, 'user-200', CURRENT_TIMESTAMP - INTERVAL '3 day', 'active'),
  (3, 'user-201', CURRENT_TIMESTAMP - INTERVAL '5 day', 'active');

-- Seed challenge progress records (links workouts to challenges)
INSERT INTO challenge_progress (challenge_id, user_id, workout_id, progress_value, workout_type, created_at) VALUES
  (1, 'user-200', 1, 1.0, 'strength', NOW() - INTERVAL '3 day'), -- counts as one push day session
  (2, 'user-200', 2, 45.0, 'hiit', NOW() - INTERVAL '2 day'),   -- 45 minutes toward the 200-minute goal
  (3, 'user-201', 3, 22.5, 'cycling', NOW() - INTERVAL '1 day'); -- 22.5 km toward the cycling target

COMMIT;

