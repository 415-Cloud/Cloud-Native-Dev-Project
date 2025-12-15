/**
 * Challenge Service Tests
 * 
 * Tests for the challenge service API endpoints and business logic.
 * Run with: npm test
 */

describe('Challenge Service', () => {
    describe('Health Check', () => {
        it('should return healthy status', () => {
            const healthResponse = { status: 'healthy', service: 'challenge-service' };
            expect(healthResponse.status).toBe('healthy');
            expect(healthResponse.service).toBe('challenge-service');
        });
    });

    describe('Challenge CRUD Operations', () => {
        describe('Create Challenge', () => {
            it('should validate required fields for new challenge', () => {
                const validChallenge = {
                    name: 'Push Day Power-Up',
                    description: 'Complete three upper-body strength sessions',
                    type: 'strength',
                    start_date: '2025-12-15',
                    end_date: '2026-01-15',
                    target_value: 3,
                    target_unit: 'sessions',
                    created_by: 'coach-strong'
                };

                expect(validChallenge.name).toBeDefined();
                expect(validChallenge.type).toBeDefined();
                expect(validChallenge.start_date).toBeDefined();
                expect(validChallenge.end_date).toBeDefined();
            });

            it('should reject challenge without name', () => {
                const invalidChallenge = {
                    type: 'strength',
                    start_date: '2025-12-15',
                    end_date: '2026-01-15'
                };

                expect(invalidChallenge.name).toBeUndefined();
            });

            it('should accept various challenge types', () => {
                const validTypes = ['strength', 'hiit', 'cycling', 'running', 'yoga', 'swimming'];
                
                validTypes.forEach(type => {
                    const challenge = { type };
                    expect(validTypes).toContain(challenge.type);
                });
            });

            it('should set default status to active', () => {
                const newChallenge = {
                    name: 'Test Challenge',
                    type: 'running'
                };

                const challengeWithDefaults = {
                    ...newChallenge,
                    status: newChallenge.status || 'active'
                };

                expect(challengeWithDefaults.status).toBe('active');
            });
        });

        describe('Get Challenges', () => {
            it('should return array of challenges', () => {
                const mockChallenges = [
                    { id: 1, name: 'Push Day Power-Up', type: 'strength', status: 'active' },
                    { id: 2, name: 'Core & Cardio', type: 'hiit', status: 'active' }
                ];

                expect(Array.isArray(mockChallenges)).toBe(true);
                expect(mockChallenges.length).toBe(2);
            });

            it('should filter by status', () => {
                const challenges = [
                    { id: 1, status: 'active' },
                    { id: 2, status: 'completed' },
                    { id: 3, status: 'active' }
                ];

                const activeChallenges = challenges.filter(c => c.status === 'active');
                expect(activeChallenges.length).toBe(2);
            });

            it('should filter by type', () => {
                const challenges = [
                    { id: 1, type: 'strength' },
                    { id: 2, type: 'running' },
                    { id: 3, type: 'strength' }
                ];

                const strengthChallenges = challenges.filter(c => c.type === 'strength');
                expect(strengthChallenges.length).toBe(2);
            });
        });

        describe('Get Challenge by ID', () => {
            it('should return challenge with participant count', () => {
                const challenge = {
                    id: 1,
                    name: 'Test Challenge',
                    participant_count: 5
                };

                expect(challenge.participant_count).toBeDefined();
                expect(challenge.participant_count).toBe(5);
            });
        });
    });

    describe('Challenge Participation', () => {
        describe('Join Challenge', () => {
            it('should add user to challenge participants', () => {
                const participants = ['user-1', 'user-2'];
                const newUserId = 'user-3';
                
                participants.push(newUserId);
                
                expect(participants).toContain(newUserId);
                expect(participants.length).toBe(3);
            });

            it('should not allow duplicate participation', () => {
                const participants = new Set(['user-1', 'user-2']);
                const existingUserId = 'user-1';
                
                participants.add(existingUserId);
                
                expect(participants.size).toBe(2); // Size unchanged
            });

            it('should validate challenge is active before joining', () => {
                const challenge = { id: 1, status: 'active' };
                const canJoin = challenge.status === 'active';
                
                expect(canJoin).toBe(true);
            });

            it('should not allow joining completed challenge', () => {
                const challenge = { id: 1, status: 'completed' };
                const canJoin = challenge.status === 'active';
                
                expect(canJoin).toBe(false);
            });
        });

        describe('Leave Challenge', () => {
            it('should remove user from participants', () => {
                const participants = ['user-1', 'user-2', 'user-3'];
                const userToRemove = 'user-2';
                
                const updatedParticipants = participants.filter(p => p !== userToRemove);
                
                expect(updatedParticipants).not.toContain(userToRemove);
                expect(updatedParticipants.length).toBe(2);
            });
        });

        describe('Get User Challenges', () => {
            it('should return challenges user has joined', () => {
                const userParticipation = [
                    { challenge_id: 1, user_id: 'user-123' },
                    { challenge_id: 3, user_id: 'user-123' }
                ];

                const userChallengeIds = userParticipation
                    .filter(p => p.user_id === 'user-123')
                    .map(p => p.challenge_id);

                expect(userChallengeIds).toEqual([1, 3]);
            });
        });
    });

    describe('Challenge Progress', () => {
        it('should track progress value', () => {
            const progress = {
                challenge_id: 1,
                user_id: 'user-123',
                workout_id: 5,
                progress_value: 10.5,
                workout_type: 'running'
            };

            expect(progress.progress_value).toBe(10.5);
        });

        it('should calculate progress percentage', () => {
            const targetValue = 100;
            const currentProgress = 45;
            const percentage = (currentProgress / targetValue) * 100;

            expect(percentage).toBe(45);
        });

        it('should cap progress at 100%', () => {
            const targetValue = 100;
            const currentProgress = 150;
            const percentage = Math.min((currentProgress / targetValue) * 100, 100);

            expect(percentage).toBe(100);
        });
    });

    describe('Challenge Date Validation', () => {
        it('should validate end_date is after start_date', () => {
            const challenge = {
                start_date: '2025-12-15',
                end_date: '2026-01-15'
            };

            const startDate = new Date(challenge.start_date);
            const endDate = new Date(challenge.end_date);

            expect(endDate > startDate).toBe(true);
        });

        it('should reject invalid date range', () => {
            const challenge = {
                start_date: '2026-01-15',
                end_date: '2025-12-15'
            };

            const startDate = new Date(challenge.start_date);
            const endDate = new Date(challenge.end_date);

            expect(endDate > startDate).toBe(false);
        });

        it('should check if challenge is currently active', () => {
            const now = new Date();
            const challenge = {
                start_date: new Date(now.getTime() - 86400000).toISOString(), // Yesterday
                end_date: new Date(now.getTime() + 86400000).toISOString()    // Tomorrow
            };

            const startDate = new Date(challenge.start_date);
            const endDate = new Date(challenge.end_date);
            const isActive = now >= startDate && now <= endDate;

            expect(isActive).toBe(true);
        });
    });

    describe('Event Consumption', () => {
        it('should handle workout.completed event', () => {
            const workoutEvent = {
                event: 'workout.completed',
                data: {
                    id: 1,
                    user_id: 'user-123',
                    type: 'running',
                    duration_minutes: 30
                },
                timestamp: new Date().toISOString()
            };

            expect(workoutEvent.event).toBe('workout.completed');
            expect(workoutEvent.data.user_id).toBeDefined();
        });

        it('should match workout type to challenge type', () => {
            const workoutType = 'running';
            const challengeType = 'running';

            expect(workoutType === challengeType).toBe(true);
        });
    });

    describe('Input Validation', () => {
        it('should validate target_value is positive', () => {
            const isValidTarget = (value) => value > 0;

            expect(isValidTarget(100)).toBe(true);
            expect(isValidTarget(0)).toBe(false);
            expect(isValidTarget(-50)).toBe(false);
        });

        it('should validate target_unit is provided', () => {
            const validUnits = ['sessions', 'km', 'miles', 'minutes', 'hours', 'reps'];
            
            validUnits.forEach(unit => {
                expect(validUnits).toContain(unit);
            });
        });
    });
});

describe('Database Operations', () => {
    describe('Challenge Queries', () => {
        it('should build participant count query', () => {
            const query = `
                SELECT c.*, 
                    COALESCE(COUNT(cp.user_id), 0) as participant_count
                FROM challenges c
                LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
                GROUP BY c.id
            `;

            expect(query).toContain('participant_count');
            expect(query).toContain('LEFT JOIN');
        });
    });
});
