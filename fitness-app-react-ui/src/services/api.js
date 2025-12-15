import axios from 'axios';

// Base URLs for services - use environment variables with fallback to localhost
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || '/api/auth';
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || '/api/users';
const WORKOUT_SERVICE_URL = process.env.REACT_APP_WORKOUT_SERVICE_URL || '';
const CHALLENGE_SERVICE_URL = process.env.REACT_APP_CHALLENGE_SERVICE_URL || '';
const LEADERBOARD_SERVICE_URL = process.env.REACT_APP_LEADERBOARD_SERVICE_URL || '';
const AI_COACH_SERVICE_URL = process.env.REACT_APP_AI_COACH_SERVICE_URL || '/api/coach';

// Create axios instance with default config
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      // Note: Navigation should be handled in components, not here
    }
    return Promise.reject(error);
  }
);

// Auth Service API calls
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} registrationData - { email, password, name?, profileInfo?, fitnessLevel?, goals? }
   * @returns {Promise} - { token, userId }
   */
  register: async (registrationData) => {
    const response = await axios.post(`${AUTH_SERVICE_URL}/register`, registrationData);
    return response.data;
  },

  /**
   * Login an existing user
   * @param {Object} loginData - { email, password }
   * @returns {Promise} - { token, userId }
   */
  login: async (loginData) => {
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, loginData);
    return response.data;
  },
};

// Helper function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT', e);
    return null;
  }
};

// User Service API calls
export const userAPI = {
  /**
   * Get user profile by userId
   * @param {string} userId - The user ID
   * @returns {Promise} - User profile data
   */
  getProfile: async (userId) => {
    const response = await apiClient.get(`${USER_SERVICE_URL}/${userId}`);
    return response.data;
  },

  /**
   * Create user profile (internal endpoint, doesn't require auth)
   * @param {string} userId - The user ID
   * @param {string} email - The user's email
   * @param {Object} profileData - { name?, profileInfo?, fitnessLevel?, goals?, measuringSystem? }
   * @returns {Promise} - Created profile
   */
  createProfile: async (userId, email, profileData = {}) => {
    // Use axios directly (not apiClient) since this endpoint doesn't require auth
    const response = await axios.post(`${USER_SERVICE_URL}/create`, {
      userId,
      email,
      passwordHash: 'temp', // Required by backend but not used
      name: profileData.name || null,
      profileInfo: profileData.profileInfo || null,
      fitnessLevel: profileData.fitnessLevel || null,
      goals: profileData.goals || null,
      measuringSystem: profileData.measuringSystem || null,
    });
    return response.data;
  },

  /**
   * Update user profile
   * @param {string} userId - The user ID
   * @param {Object} updateData - { name?, profileInfo?, fitnessLevel?, goals?, measuringSystem? }
   * @returns {Promise} - Updated user profile data
   */
  updateProfile: async (userId, updateData) => {
    const response = await apiClient.put(`${USER_SERVICE_URL}/${userId}`, updateData);
    return response.data;
  },
};

// AI Coach Service API calls
export const aiCoachAPI = {
  /**
   * Get AI-generated fitness advice based on user data
   * @param {Object} userData - User profile and fitness data for context
   * @returns {Promise} - { advice: string } AI-generated coaching advice
   */
  getAdvice: async (userData) => {
    const response = await apiClient.post(`${AI_COACH_SERVICE_URL}/advice`, userData);
    return response.data;
  },

  /**
   * Generate a personalized training plan
   * @param {Object} userData - { fitnessLevel, goals, preferences, etc. }
   * @returns {Promise} - { advice: string } AI-generated training plan
   */
  generateTrainingPlan: async (userData) => {
    const planRequest = {
      ...userData,
      requestType: 'training_plan',
      prompt: `Generate a detailed weekly training plan for someone with fitness level: ${userData.fitnessLevel || 'intermediate'}, goals: ${userData.goals || 'general fitness'}. Include specific exercises, durations, and rest days.`
    };
    const response = await apiClient.post(`${AI_COACH_SERVICE_URL}/advice`, planRequest);
    return response.data;
  },
};

// Helper function to store auth data
export const storeAuthData = (token, userId) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
};

// Helper function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token') && !!localStorage.getItem('userId');
};

// Helper function to get stored auth data
export const getAuthData = () => {
  return {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
  };
};

export default apiClient;

// Workout Service API calls
export const workoutAPI = {
  /**
   * Get all workouts for the current user
   * @param {string} userId - User ID
   * @returns {Promise} - List of workouts
   */
  getUserWorkouts: async (userId) => {
    const response = await apiClient.get(`${WORKOUT_SERVICE_URL}/users/${userId}/workouts`);
    return response.data;
  },

  /**
   * Get a specific workout by ID
   * @param {string} id - Workout ID
   * @returns {Promise} - Workout details
   */
  getById: async (id) => {
    const response = await apiClient.get(`${WORKOUT_SERVICE_URL}/workouts/${id}`);
    return response.data;
  },

  /**
   * Create a new workout
   * @param {Object} workoutData - Workout data
   * @returns {Promise} - Created workout
   */
  create: async (workoutData) => {
    const response = await apiClient.post(`${WORKOUT_SERVICE_URL}/workouts`, workoutData);
    return response.data;
  },

  /**
   * Update an existing workout
   * @param {string} id - Workout ID
   * @param {Object} workoutData - Updated workout data
   * @returns {Promise} - Updated workout
   */
  update: async (id, workoutData) => {
    const response = await apiClient.put(`${WORKOUT_SERVICE_URL}/workouts/${id}`, workoutData);
    return response.data;
  },

  /**
   * Delete a workout
   * @param {string} id - Workout ID
   * @returns {Promise} - Success message
   */
  delete: async (id) => {
    const response = await apiClient.delete(`${WORKOUT_SERVICE_URL}/workouts/${id}`);
    return response.data;
  },
};

// Challenge Service API calls
export const challengeAPI = {
  /**
   * Get all available challenges
   * @returns {Promise} - List of challenges
   */
  getAll: async () => {
    const response = await apiClient.get(`${CHALLENGE_SERVICE_URL}/challenges`);
    return response.data;
  },

  /**
   * Get a specific challenge by ID
   * @param {string} id - Challenge ID
   * @returns {Promise} - Challenge details
   */
  getById: async (id) => {
    const response = await apiClient.get(`${CHALLENGE_SERVICE_URL}/challenges/${id}`);
    return response.data;
  },

  /**
   * Create a new challenge
   * @param {Object} challengeData - Challenge data
   * @returns {Promise} - Created challenge
   */
  create: async (challengeData) => {
    const response = await apiClient.post(`${CHALLENGE_SERVICE_URL}/challenges`, challengeData);
    return response.data;
  },

  /**
   * Join a challenge
   * @param {string} id - Challenge ID
   * @returns {Promise} - Join status
   */
  join: async (id) => {
    const { userId } = getAuthData();
    const response = await apiClient.post(`${CHALLENGE_SERVICE_URL}/challenges/${id}/join`, { userId });
    return response.data;
  },

  /**
   * Leave a challenge
   * @param {string} id - Challenge ID
   * @returns {Promise} - Leave status
   */
  leave: async (id) => {
    const { userId } = getAuthData();
    // Note: The backend expects DELETE method with body, but standard axios/fetch DELETE doesn't support body well in all browsers/proxies.
    // However, axios does support 'data' config in delete.
    const response = await apiClient.delete(`${CHALLENGE_SERVICE_URL}/challenges/${id}/leave`, {
      data: { userId }
    });
    return response.data;
  },

  /**
   * Get challenges the user has joined
   * @returns {Promise} - List of user's challenges
   */
  getUserChallenges: async () => {
    const { userId } = getAuthData();
    if (!userId) return { challenges: [] };
    // Since CHALLENGE_SERVICE_URL is empty, this becomes /challenges/users/:userId/challenges
    // The challenge service handles this path to avoid conflict with workout-service /users route
    const response = await apiClient.get(`${CHALLENGE_SERVICE_URL}/challenges/users/${userId}/challenges`);
    return response.data;
  },
};

// Leaderboard Service API calls
export const leaderboardAPI = {
  /**
   * Get global leaderboard
   * @param {number} limit - Number of entries to return
   * @returns {Promise} - Leaderboard entries
   */
  getGlobal: async (limit = 10) => {
    const response = await apiClient.get(`${LEADERBOARD_SERVICE_URL}/leaderboard/top/${limit}`);
    return response.data;
  },

  /**
   * Get user's rank
   * @returns {Promise} - User's rank details
   */
  getUserRank: async () => {
    const { userId } = getAuthData();
    if (!userId) return null;
    try {
      const response = await apiClient.get(`${LEADERBOARD_SERVICE_URL}/leaderboard/rank/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // User not ranked yet
      }
      throw error;
    }
  },
};
