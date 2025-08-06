import { useState, useEffect } from 'react';
import { loginApi } from '../features/login/login-api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    setIsAuthenticated(loginApi.isAuthenticated());
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setLoading(true);
      const response = await loginApi.login(credentials);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await loginApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await loginApi.refreshToken();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken,
  };
};
