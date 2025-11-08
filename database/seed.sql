-- Seed script for workout-service and challenge-service tables

BEGIN;

-- Clear existing data so the seed loads cleanly
TRUNCATE TABLE challenge_progress, challenge_participants, challenges RESTART IDENTITY CASCADE;
TRUNCATE TABLE workouts RESTART IDENTITY CASCADE;

-- Seed workouts (workout-service)
INSERT INTO workouts (user_id, type, distance, duration, calories, notes, created_at) VALUES
  ('user-200', 'strength', NULL, 62, 515, 'Push Day: pyramid bench press, weighted ring dips, sled pushes to failure', NOW() - INTERVAL '5 day'),
  ('user-200', 'strength', NULL, 58, 498, 'Push Day: incline tempo sets, bamboo bar stabilizers, prowler relay finisher', NOW() - INTERVAL '2 day'),
  ('user-200', 'hiit', NULL, 38, 542, 'Core & Cardio: assault bike sprints + battle rope ladder, EMOM hollow holds', NOW() - INTERVAL '36 hour'),
  ('user-200', 'hiit', NULL, 41, 556, 'Core & Cardio: kettlebell flow, sandbag get-ups, ramped burpee finish', NOW() - INTERVAL '12 hour'),
  ('user-201', 'cycling', 27.8, 82, 688, 'Leg Day Blast: low-cadence hill repeats with 6-minute grinder climbs', NOW() - INTERVAL '18 hour'),
  ('user-201', 'cycling', 32.4, 94, 732, 'Leg Day Blast: muscle-tension intervals + standing sprint finishers', NOW() - INTERVAL '4 hour');

-- Seed challenges (challenge-service)
INSERT INTO challenges (name, description, type, start_date, end_date, target_value, target_unit, created_by, status) VALUES
  ('Push Day Power-Up', 'Log six ruthless upper-body strength sessions with finishers that leave your arms shaking.', 'strength', CURRENT_DATE - INTERVAL '9 day', CURRENT_DATE + INTERVAL '21 day', 6.0, 'sessions', 'coach-strong', 'active'),
  ('Core & Cardio Gauntlet', 'Accumulate 240 minutes of breathless HIIT + core mashups—no two circuits the same.', 'hiit', CURRENT_DATE - INTERVAL '5 day', CURRENT_DATE + INTERVAL '25 day', 240.0, 'minutes', 'coach-core', 'active'),
  ('Leg Day Blast', 'Stack 180 km of strength-focused cycling grinds before the month detonates your quads.', 'cycling', CURRENT_DATE - INTERVAL '7 day', CURRENT_DATE + INTERVAL '23 day', 180.0, 'km', 'coach-legs', 'active');

-- Seed challenge participants
INSERT INTO challenge_participants (challenge_id, user_id, joined_at, status) VALUES
  (1, 'user-200', CURRENT_TIMESTAMP - INTERVAL '8 day', 'active'),
  (2, 'user-200', CURRENT_TIMESTAMP - INTERVAL '4 day', 'active'),
  (3, 'user-201', CURRENT_TIMESTAMP - INTERVAL '6 day', 'active');

-- Seed challenge progress records (links workouts to challenges)
INSERT INTO challenge_progress (challenge_id, user_id, workout_id, progress_value, workout_type, created_at) VALUES
  (1, 'user-200', 1, 1.0, 'strength', NOW() - INTERVAL '5 day'),
  (1, 'user-200', 2, 1.0, 'strength', NOW() - INTERVAL '2 day'),
  (2, 'user-200', 3, 38.0, 'hiit', NOW() - INTERVAL '36 hour'),
  (2, 'user-200', 4, 41.0, 'hiit', NOW() - INTERVAL '12 hour'),
  (3, 'user-201', 5, 27.8, 'cycling', NOW() - INTERVAL '18 hour'),
  (3, 'user-201', 6, 32.4, 'cycling', NOW() - INTERVAL '4 hour');

COMMIT;

