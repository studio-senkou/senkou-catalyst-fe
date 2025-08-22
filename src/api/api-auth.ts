import api, { tokenManager } from "@/lib/axios";

export const apiAuth = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Save tokens using token manager
        tokenManager.saveTokens(
        response.data.data.access_token,    
        response.data.data.refresh_token
        );

      return response.data;
    } catch (error: any) {
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
};