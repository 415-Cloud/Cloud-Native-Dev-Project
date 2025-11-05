import axios from 'axios';

// Base URLs for services
const AUTH_SERVICE_URL = 'http://localhost:8080/api/auth';
const USER_SERVICE_URL = 'http://localhost:8081/api/users';

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
   * Update user profile
   * @param {string} userId - The user ID
   * @param {Object} updateData - { name?, profileInfo?, fitnessLevel?, goals? }
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

export default apiClient;
