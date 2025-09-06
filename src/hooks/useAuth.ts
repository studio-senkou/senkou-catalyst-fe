// useAuth.ts
import { useState, useEffect } from 'react';
import { apiAuth } from '../api/api-auth';
import { apiUser } from '../api/api-user';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = apiAuth.isAuthenticated();
      const currentMerchantId = apiAuth.getCurrentMerchantId();
      const currentUserData = apiAuth.getCurrentUserData();
      
      setIsAuthenticated(authenticated);
      setMerchantId(currentMerchantId);
      setUserData(currentUserData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<{
    loginResponse: LoginResponse;
    userResponse: GetUserDetailResponse;
    merchantId?: string;
  } | null> => {
    try {
      setLoading(true);
      const result = await apiAuth.login(credentials);
      
      // Update state with the results
      setIsAuthenticated(true);
      setMerchantId(result.merchantId || null);
      setUserData(result.userResponse.data.user);
      
      return result;
    } catch (error) {
      setIsAuthenticated(false);
      setMerchantId(null);
      setUserData(null);
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
      setMerchantId(null);
      setUserData(null);
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await apiAuth.refreshToken();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setMerchantId(null);
      setUserData(null);
      throw error;
    }
  };

  // Additional user-related methods
  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await apiUser.getCurrentUser();
      const user = response.data.user;
      setUserData(user);
      return user;
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

  // Helper to get current merchant data
  const getCurrentMerchant = () => {
    if (!userData || !userData.merchants || !merchantId) return null;
    return userData.merchants.find((merchant: any) => merchant.id === merchantId);
  };

  return {
    isAuthenticated,
    loading,
    merchantId,
    userData,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    getUsers,
    getCurrentMerchant,
  };
};