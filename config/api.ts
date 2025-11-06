// API Configuration
// For development, you can use your computer's IP address
// For production, use your actual backend URL

const getApiBaseUrl = (): string => {
  // In development, use your computer's IP address
  // Replace with your actual backend URL when deployed
  // @ts-ignore - __DEV__ is a global variable in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // Use your computer's local IP address (found via ifconfig)
    // Example: 'http://10.252.191.93:3001'
    // Update this with your computer's IP address
    return 'http://10.252.191.93:3001';
  }
  // Production URL (update this when deploying)
  return 'https://your-api-domain.com';
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  health: '/health',
  workouts: '/workouts',
  userWorkouts: (userId: string) => `/users/${userId}/workouts`,
  workoutById: (id: number) => `/workouts/${id}`,
};

