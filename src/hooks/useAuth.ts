import { useState, useEffect } from 'react';
import { apiAuth } from '../api/api-auth';
import { apiUser } from '../api/api-user';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    setIsAuthenticated(apiAuth.isAuthenticated());
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setLoading(true);
      const response = await apiAuth.login(credentials);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      setLoading(true);
      const response = await apiUser.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await apiAuth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await apiAuth.refreshToken();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Additional user-related methods
  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await apiUser.getCurrentUser();
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const response = await apiUser.getUsers();
      return response.data.users;
    } catch (error) {
      throw error;
    }
  };

  return {
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    getUsers,
  };
};