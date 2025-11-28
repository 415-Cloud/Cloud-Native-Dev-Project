-- Seed script for workout-service workouts table

BEGIN;

-- Clear existing data so the seed loads cleanly
TRUNCATE TABLE workouts RESTART IDENTITY CASCADE;

-- Seed workouts
INSERT INTO workouts (user_id, type, distance, duration, calories, notes, created_at) VALUES
  ('user-200', 'strength', NULL, 60, 505, 'Push Day: heavy bench ladder + burnout push-up dropset', NOW() - INTERVAL '2 day'),
  ('user-200', 'hiit', NULL, 32, 468, 'Core & Cardio: rower sprints with kettlebell halo EMOM', NOW() - INTERVAL '20 hour'),
  ('user-201', 'cycling', 24.6, 78, 640, 'Leg Day Blast: big gear climb repeats with standing surge finish', NOW() - INTERVAL '8 hour');

COMMIT;

