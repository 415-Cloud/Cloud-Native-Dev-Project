import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Note: Replace with your computer's local IP address. 'localhost' won't work from the mobile app/emulator.
const API_BASE_URL = 'http://192.31.112.138';

const authApiClient = axios.create({
  baseURL: `${API_BASE_URL}:8080/api/auth`,
});

const userApiClient = axios.create({
  baseURL: `${API_BASE_URL}:8081/api/users`,
});

// Add a request interceptor to the user service client to include the JWT
userApiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { authApiClient, userApiClient };