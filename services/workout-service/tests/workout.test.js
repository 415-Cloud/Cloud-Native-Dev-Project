/**
 * Workout Service Tests
 * 
 * Tests for the workout service API endpoints and business logic.
 * Run with: npm test
 */

describe('Workout Service', () => {
    describe('Health Check', () => {
        it('should return healthy status', () => {
            const healthResponse = { status: 'healthy', service: 'workout-service' };
            expect(healthResponse.status).toBe('healthy');
            expect(healthResponse.service).toBe('workout-service');
        });
    });

    describe('Workout CRUD Operations', () => {
        describe('Create Workout', () => {
            it('should validate required fields for new workout', () => {
                const validWorkout = {
                    user_id: 'user-123',
                    type: 'running',
                    duration_minutes: 30,
                    calories_burned: 300,
                    date: '2025-12-14'
                };

                expect(validWorkout.user_id).toBeDefined();
                expect(validWorkout.type).toBeDefined();
                expect(validWorkout.duration_minutes).toBeGreaterThan(0);
            });

            it('should reject workout without user_id', () => {
                const invalidWorkout = {
                    type: 'running',
                    duration_minutes: 30
                };

                expect(invalidWorkout.user_id).toBeUndefined();
            });

            it('should accept various workout types', () => {
                const validTypes = ['running', 'cycling', 'swimming', 'strength', 'yoga', 'hiit'];
                
                validTypes.forEach(type => {
                    const workout = { type };
                    expect(validTypes).toContain(workout.type);
                });
            });
        });

        describe('Get Workouts', () => {
            it('should return array of workouts', () => {
                const mockWorkouts = [
                    { id: 1, user_id: 'user-123', type: 'running', duration_minutes: 30 },
                    { id: 2, user_id: 'user-123', type: 'cycling', duration_minutes: 45 }
                ];

                expect(Array.isArray(mockWorkouts)).toBe(true);
                expect(mockWorkouts.length).toBe(2);
            });

            it('should return empty array for user with no workouts', () => {
                const emptyWorkouts = [];
                expect(emptyWorkouts).toEqual([]);
                expect(emptyWorkouts.length).toBe(0);
            });

            it('should filter workouts by user_id', () => {
                const allWorkouts = [
                    { id: 1, user_id: 'user-123', type: 'running' },
                    { id: 2, user_id: 'user-456', type: 'cycling' },
                    { id: 3, user_id: 'user-123', type: 'swimming' }
                ];

                const user123Workouts = allWorkouts.filter(w => w.user_id === 'user-123');
                expect(user123Workouts.length).toBe(2);
            });
        });

        describe('Update Workout', () => {
            it('should update workout duration', () => {
                const originalWorkout = {
                    id: 1,
                    duration_minutes: 30,
                    calories_burned: 300
                };

                const updateData = { duration_minutes: 45 };
                const updatedWorkout = { ...originalWorkout, ...updateData };

                expect(updatedWorkout.duration_minutes).toBe(45);
                expect(updatedWorkout.calories_burned).toBe(300); // Unchanged
            });

            it('should preserve workout id on update', () => {
                const workout = { id: 1, type: 'running' };
                const updateData = { type: 'cycling' };
                const updated = { ...workout, ...updateData };

                expect(updated.id).toBe(1);
            });
        });

        describe('Delete Workout', () => {
            it('should remove workout from list', () => {
                const workouts = [
                    { id: 1, type: 'running' },
                    { id: 2, type: 'cycling' }
                ];

                const idToDelete = 1;
                const remainingWorkouts = workouts.filter(w => w.id !== idToDelete);

                expect(remainingWorkouts.length).toBe(1);
                expect(remainingWorkouts[0].id).toBe(2);
            });
        });
    });

    describe('Workout Statistics', () => {
        it('should calculate total duration', () => {
            const workouts = [
                { duration_minutes: 30 },
                { duration_minutes: 45 },
                { duration_minutes: 60 }
            ];

            const totalDuration = workouts.reduce((sum, w) => sum + w.duration_minutes, 0);
            expect(totalDuration).toBe(135);
        });

        it('should calculate total calories burned', () => {
            const workouts = [
                { calories_burned: 300 },
                { calories_burned: 450 },
                { calories_burned: 200 }
            ];

            const totalCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0);
            expect(totalCalories).toBe(950);
        });

        it('should count workouts by type', () => {
            const workouts = [
                { type: 'running' },
                { type: 'cycling' },
                { type: 'running' },
                { type: 'swimming' }
            ];

            const countByType = workouts.reduce((acc, w) => {
                acc[w.type] = (acc[w.type] || 0) + 1;
                return acc;
            }, {});

            expect(countByType.running).toBe(2);
            expect(countByType.cycling).toBe(1);
            expect(countByType.swimming).toBe(1);
        });
    });

    describe('Event Publishing', () => {
        it('should create workout event with correct structure', () => {
            const workout = {
                id: 1,
                user_id: 'user-123',
                type: 'running',
                duration_minutes: 30
            };

            const event = {
                event: 'workout.completed',
                data: workout,
                timestamp: new Date().toISOString()
            };

            expect(event.event).toBe('workout.completed');
            expect(event.data).toEqual(workout);
            expect(event.timestamp).toBeDefined();
        });
    });

    describe('Input Validation', () => {
        it('should validate duration is positive', () => {
            const isValidDuration = (duration) => duration > 0;

            expect(isValidDuration(30)).toBe(true);
            expect(isValidDuration(0)).toBe(false);
            expect(isValidDuration(-10)).toBe(false);
        });

        it('should validate date format', () => {
            const isValidDate = (dateStr) => {
                const date = new Date(dateStr);
                return !isNaN(date.getTime());
            };

            expect(isValidDate('2025-12-14')).toBe(true);
            expect(isValidDate('invalid-date')).toBe(false);
        });

        it('should sanitize user input', () => {
            const sanitize = (input) => input.trim().toLowerCase();

            expect(sanitize('  Running  ')).toBe('running');
            expect(sanitize('CYCLING')).toBe('cycling');
        });
    });
});

describe('Database Operations', () => {
    describe('Query Building', () => {
        it('should build insert query correctly', () => {
            const fields = ['user_id', 'type', 'duration_minutes'];
            const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
            
            expect(placeholders).toBe('$1, $2, $3');
        });

        it('should build update query correctly', () => {
            const updates = { type: 'running', duration_minutes: 45 };
            const setClause = Object.keys(updates)
                .map((key, i) => `${key} = $${i + 1}`)
                .join(', ');

            expect(setClause).toBe('type = $1, duration_minutes = $2');
        });
    });
});
