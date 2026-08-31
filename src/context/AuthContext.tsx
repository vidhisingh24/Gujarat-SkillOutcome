import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { getToken, removeToken } from '../api/client';
import type { User } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const restoreAuth = async () => {
    const savedToken = getToken();
    if (savedToken) {
      setTokenState(savedToken);
      try {
        const currentUser = await authApi.getMe();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        removeToken();
        setTokenState(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    restoreAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setTokenState(response.token);
      setLoading(false);
      return response.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setTokenState(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUser,
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
