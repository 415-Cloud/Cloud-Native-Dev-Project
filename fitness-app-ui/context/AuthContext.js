import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApiClient } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt_token');
        const storedUserId = await SecureStore.getItemAsync('user_id');
        
        // Check if token and userId exist
        if (token && storedUserId) {
          setAuthenticated(true);
          setUserId(storedUserId);
        }
      } catch (e) {
        console.error('Failed to load auth status', e);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await authApiClient.post('/login', { email, password });
    const { accessToken, userId } = response.data;
    await SecureStore.setItemAsync('jwt_token', accessToken);
    await SecureStore.setItemAsync('user_id', userId);
    setAuthenticated(true);
    setUserId(userId);
  };

  const register = async (email, password, name) => {
    // The register endpoint in auth-service likely also logs the user in
    const response = await authApiClient.post('/register', { email, password, name });
    const { accessToken, userId } = response.data;
    await SecureStore.setItemAsync('jwt_token', accessToken);
    await SecureStore.setItemAsync('user_id', userId);
    setAuthenticated(true);
    setUserId(userId);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    await SecureStore.deleteItemAsync('user_id');
    setAuthenticated(false);
    setUserId(null);
  };

  const value = {
    authenticated,
    userId,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};