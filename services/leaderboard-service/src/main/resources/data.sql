-- Leaderboard Service Seed Data
-- Sample leaderboard entries for testing

INSERT INTO leaderboard_entries (user_id, score, streak_count, last_activity_date)
VALUES 
    ('user-001', 1500.0, 7, CURRENT_DATE),
    ('user-002', 1350.0, 5, CURRENT_DATE),
    ('user-003', 1200.0, 3, CURRENT_DATE - INTERVAL '1 day'),
    ('user-004', 1100.0, 10, CURRENT_DATE),
    ('user-005', 950.0, 2, CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT (user_id) DO NOTHING;

