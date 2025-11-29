import axios from 'axios';

// Base URLs for services - use environment variables with fallback to localhost
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8080/api/auth';
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8081/api/users';
const WORKOUT_SERVICE_URL = process.env.REACT_APP_WORKOUT_SERVICE_URL || 'http://localhost:3001/api';
const CHALLENGE_SERVICE_URL = process.env.REACT_APP_CHALLENGE_SERVICE_URL || 'http://localhost:3002/api';
const LEADERBOARD_SERVICE_URL = process.env.REACT_APP_LEADERBOARD_SERVICE_URL || 'http://localhost:8083/api';
const AI_COACH_SERVICE_URL = process.env.REACT_APP_AI_COACH_SERVICE_URL || 'http://localhost:3004/api';

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

// AI Coach Service API calls
export const aiCoachAPI = {
  /**
   * Get coaching advice
   * @param {Object} context - User context (workouts, goals, etc.)
   * @returns {Promise} - AI advice
   */
  getAdvice: async (context) => {
    const response = await apiClient.post(`${AI_COACH_SERVICE_URL}/coach/advice`, context);
    return response.data;
  },
};

export default apiClient;

// Workout Service API calls
export const workoutAPI = {
  /**
   * Get all workouts for the current user
   * @returns {Promise} - List of workouts
   */
  getAll: async () => {
    const response = await apiClient.get(`${WORKOUT_SERVICE_URL}/workouts`);
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
   * Join a challenge
   * @param {string} id - Challenge ID
   * @returns {Promise} - Join status
   */
  join: async (id) => {
    const response = await apiClient.post(`${CHALLENGE_SERVICE_URL}/challenges/${id}/join`);
    return response.data;
  },

  /**
   * Get challenges the user has joined
   * @returns {Promise} - List of user's challenges
   */
  getUserChallenges: async () => {
    const response = await apiClient.get(`${CHALLENGE_SERVICE_URL}/challenges/my-challenges`);
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
    const response = await apiClient.get(`${LEADERBOARD_SERVICE_URL}/leaderboard/global?limit=${limit}`);
    return response.data;
  },

  /**
   * Get friends leaderboard
   * @returns {Promise} - Leaderboard entries for friends
   */
  getFriends: async () => {
    const response = await apiClient.get(`${LEADERBOARD_SERVICE_URL}/leaderboard/friends`);
    return response.data;
  },

  /**
   * Get user's rank
   * @returns {Promise} - User's rank details
   */
  getUserRank: async () => {
    const response = await apiClient.get(`${LEADERBOARD_SERVICE_URL}/leaderboard/my-rank`);
    return response.data;
  },
};
