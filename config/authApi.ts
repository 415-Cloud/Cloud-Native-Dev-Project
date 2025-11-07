// Auth API Configuration
// For development, use your computer's IP address
// For production, use your actual backend URL

const getAuthApiBaseUrl = (): string => {
  // @ts-ignore - __DEV__ is a global variable in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // Auth service runs on port 8080
    // Update this with your computer's IP address
    return 'http://10.252.191.93:8080';
  }
  // Production URL (update this when deploying)
  return 'https://your-auth-api-domain.com';
};

const getUserApiBaseUrl = (): string => {
  // @ts-ignore - __DEV__ is a global variable in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // User service runs on port 8081
    // Update this with your computer's IP address
    return 'http://10.252.191.93:8081';
  }
  // Production URL (update this when deploying)
  return 'https://your-user-api-domain.com';
};

export const AUTH_API_BASE_URL = getAuthApiBaseUrl();
export const USER_API_BASE_URL = getUserApiBaseUrl();

// API Endpoints
export const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
};

export const USER_ENDPOINTS = {
  getProfile: (userId: string) => `/api/users/${userId}`,
  updateProfile: (userId: string) => `/api/users/${userId}`,
};

