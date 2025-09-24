// api-auth.ts
import api, { tokenManager } from "@/lib/axios";
import { apiUser } from "./api-user";

export const apiAuth = {
  async login(credentials: LoginRequest): Promise<{
    loginResponse: LoginResponse;
    userResponse: GetUserDetailResponse;
    merchantUsername?: string; 
    merchantID?: string; 
  }> {
    try {
      const loginResponse = await api.post<LoginResponse>('/auth/login', credentials);
      
      const { 
        access_token, 
        refresh_token, 
        access_token_expiry, 
        refresh_token_expiry 
      } = loginResponse.data.data;

      tokenManager.saveTokens(
        access_token,
        refresh_token,
        access_token_expiry,
        refresh_token_expiry
      );

      const userResponse = await apiUser.getCurrentUser();
      const user = userResponse.data.user;

      let merchantUsername: string | undefined;
      let merchantID: string | undefined;

      if (user.role === 'admin') {
        tokenManager.saveUserData({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          merchants: user.merchants || []
        });

      } else {
        if (user.merchants && user.merchants.length > 0) {
          const merchant = user.merchants[0];
          if (!merchant.username) {
            throw new Error('Merchant has no username');
          }

          merchantUsername = merchant.username;
          merchantID = merchant.id; // <-- isi merchantID dari objek merchant

          tokenManager.saveMerchantUsername(merchantUsername); 
          tokenManager.saveMerchantID(merchantID); 

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
        merchantUsername,
        merchantID
      };
    } catch (error: any) {
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },


  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      await tokenManager.refreshTokens();

      try {
        const userResponse = await apiUser.getCurrentUser();
        const user = userResponse.data.user;
        
        if (user.role !== 'admin' && user.merchants && user.merchants.length > 0) {
          const merchant = user.merchants[0];
          if (!merchant.username) {
            throw new Error('Merchant has no username');
          }

          const merchantUsername = merchant.username;
          const merchantID = merchant.id;

          tokenManager.saveMerchantUsername(merchantUsername);
          tokenManager.saveMerchantID(merchantID);
        }
        
        tokenManager.saveUserData({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          merchants: user.merchants || []
        });
      } catch (userError) {
        console.warn('Failed to refresh user data after token refresh:', userError);
      }

      return {
        message: 'Token refreshed successfully',
        data: {
          access_token: tokenManager.getAccessToken()!,
          refresh_token: tokenManager.getRefreshToken()!,
          access_token_expiry: '',
          refresh_token_expiry: ''
        }
      };
    } catch (error: any) {
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
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },

  async checkAuthWithRefresh(): Promise<boolean> {
    try {
      if (this.isAuthenticated()) {
        return true;
      }

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      await tokenManager.refreshTokens();
      return true;
    } catch (error) {
      return false;
    }
  },

  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  getCurrentMerchantUsername(): string | null {
    const userData = tokenManager.getUserData();
    if (userData?.role === 'admin') {
      return null;
    }
    return tokenManager.getMerchantUsername();
  },

  getCurrentMerchantId(): string | null {
    const userData = tokenManager.getUserData();
    if (userData?.role === 'admin') {
      return null;
    }
    return tokenManager.getMerchantID();
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

  // Check if refresh token exists
  hasRefreshToken(): boolean {
    return !!tokenManager.getRefreshToken();
  },
};