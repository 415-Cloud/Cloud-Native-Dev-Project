import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userId: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = async () => {
      try {
        const savedToken = await storage.getToken();
        const savedUserId = await storage.getUserId();
        if (savedToken && savedUserId) {
          setToken(savedToken);
          setUserId(savedUserId);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const setAuth = async (newToken: string, newUserId: string) => {
    await storage.saveToken(newToken);
    await storage.saveUserId(newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  const clearAuth = async () => {
    await storage.clearAuth();
    setToken(null);
    setUserId(null);
  };

  const value: AuthContextType = {
    token,
    userId,
    isAuthenticated: !!token && !!userId,
    setAuth,
    clearAuth,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

