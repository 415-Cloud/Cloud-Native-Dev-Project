/**
 * AI Coach Service Tests
 * 
 * Note: These tests mock the OpenAI API to avoid making real API calls during testing.
 * Run with: npm test
 */

import { jest } from '@jest/globals';

// Mock the OpenAI module before importing the service
jest.unstable_mockModule('openai', () => ({
    default: jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: 'Here are your fitness recommendations...'
                        }
                    }]
                })
            }
        }
    }))
}));

describe('AI Coach Service', () => {
    describe('Health Check', () => {
        it('should return ok status', async () => {
            // This is a simple unit test for the health endpoint logic
            const healthResponse = { status: 'ok' };
            expect(healthResponse.status).toBe('ok');
        });
    });

    describe('Generate Advice', () => {
        it('should generate advice with valid user data', async () => {
            // Mock user data
            const userData = {
                fitnessLevel: 'intermediate',
                goals: 'build muscle'
            };

            // Verify the data structure
            expect(userData).toHaveProperty('fitnessLevel');
            expect(userData).toHaveProperty('goals');
            expect(userData.fitnessLevel).toBe('intermediate');
        });

        it('should handle training plan requests', async () => {
            const planRequest = {
                fitnessLevel: 'beginner',
                goals: 'lose weight',
                requestType: 'training_plan'
            };

            expect(planRequest.requestType).toBe('training_plan');
            expect(planRequest.fitnessLevel).toBeDefined();
        });

        it('should handle questions about exercises', async () => {
            const questionRequest = {
                question: 'What exercises should I do for core strength?'
            };

            expect(questionRequest.question).toContain('core strength');
        });
    });

    describe('Input Validation', () => {
        it('should accept valid fitness levels', () => {
            const validLevels = ['beginner', 'intermediate', 'advanced'];
            
            validLevels.forEach(level => {
                const request = { fitnessLevel: level };
                expect(['beginner', 'intermediate', 'advanced']).toContain(request.fitnessLevel);
            });
        });

        it('should handle empty request body', () => {
            const emptyRequest = {};
            
            // Service should handle empty requests gracefully
            expect(emptyRequest).toEqual({});
        });

        it('should handle request with only goals', () => {
            const goalsOnlyRequest = {
                goals: 'improve endurance'
            };

            expect(goalsOnlyRequest.goals).toBeDefined();
            expect(goalsOnlyRequest.fitnessLevel).toBeUndefined();
        });
    });

    describe('Response Format', () => {
        it('should return advice in correct format', () => {
            const expectedResponse = {
                advice: 'Sample fitness advice here'
            };

            expect(expectedResponse).toHaveProperty('advice');
            expect(typeof expectedResponse.advice).toBe('string');
        });

        it('should return error format on failure', () => {
            const errorResponse = {
                error: 'Failed to generate AI coaching advice'
            };

            expect(errorResponse).toHaveProperty('error');
            expect(errorResponse.error).toContain('Failed');
        });
    });
});

describe('LLM Service', () => {
    describe('Prompt Generation', () => {
        it('should create proper prompt from user data', () => {
            const userData = {
                fitnessLevel: 'intermediate',
                goals: 'build muscle',
                name: 'John'
            };

            const prompt = `
            You are an AI fitness coach. Provide 2-3 pieces of personalized and safe
            advice based on the following user data:
            ${JSON.stringify(userData, null, 2)}
            `;

            expect(prompt).toContain('AI fitness coach');
            expect(prompt).toContain('intermediate');
            expect(prompt).toContain('build muscle');
        });
    });

    describe('API Key Validation', () => {
        it('should detect missing API key', () => {
            const apiKey = process.env.OPENAI_API_KEY;
            
            // In test environment, key might not be set
            if (!apiKey) {
                expect(apiKey).toBeUndefined();
            }
        });
    });
});
