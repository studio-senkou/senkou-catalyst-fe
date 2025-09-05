// api-auth.ts
import api, { tokenManager } from "@/lib/axios";
import { apiUser } from "./api-user";

export const apiAuth = {
  async login(credentials: LoginRequest): Promise<{
    loginResponse: LoginResponse;
    userResponse: GetUserDetailResponse;
    merchantId?: string; 
  }> {
    try {
      const loginResponse = await api.post<LoginResponse>('/auth/login', credentials);
      
      tokenManager.saveTokens(
        loginResponse.data.data.access_token,    
        loginResponse.data.data.refresh_token
      );

      const userResponse = await apiUser.getCurrentUser();
      
      const user = userResponse.data.user;
      let merchantId: string | undefined;
      
      if (user.role === 'admin') {
        tokenManager.saveUserData({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          merchants: user.merchants || []
        });
        
        merchantId = undefined;
      } else {
        if (user.merchants && user.merchants.length > 0) {
          merchantId = user.merchants[0].id;
          
          tokenManager.saveMerchantId(merchantId);
          
          tokenManager.saveUserData({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            merchants: user.merchants
          });
        } else {
          throw new Error('User has no associated merchants');
        }
      }

      return {
        loginResponse: loginResponse.data,
        userResponse: userResponse,
        merchantId: merchantId
      };
    } catch (error: any) {
      // Clear tokens if login fails
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Refresh token
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.put<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      });

      // Save new tokens
      tokenManager.saveTokens(
        response.data.data.access_token,    
        response.data.data.refresh_token
      );

      return response.data;
    } catch (error: any) {
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  // Logout user
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.delete<LogoutResponse>('/auth/logout');
      tokenManager.clearTokens();
      return response.data;
    } catch (error: any) {
      // Clear tokens even if logout request fails
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },

  // Get current access token
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  // Get current merchant ID (will return null for admin users)
  getCurrentMerchantId(): string | null {
    const userData = tokenManager.getUserData();
    // Return null for admin users since they don't need merchant ID
    if (userData?.role === 'admin') {
      return null;
    }
    return tokenManager.getMerchantId();
  },

  // Get current user data
  getCurrentUserData(): any {
    return tokenManager.getUserData();
  },

  // Check if current user is admin
  isCurrentUserAdmin(): boolean {
    const userData = tokenManager.getUserData();
    return userData?.role === 'admin';
  },
};