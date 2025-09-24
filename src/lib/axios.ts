// axios.ts

import axios, { AxiosError } from "axios";
import { CookieManager } from "./cookie-utils";

class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null; 
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  // Cookie names
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly MERCHANT_USERNAME_KEY = 'merchantUsername';
  private readonly MERCHANT_ID_KEY = 'merchantID';
  private readonly USER_DATA_KEY = 'userData';

  // Cookie options
  private readonly cookieOptions = {
    path: '/',
    secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
    sameSite: 'lax' as const,
  };

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  constructor() {
    this.loadTokensFromCookies();
  }

  private loadTokensFromCookies(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = CookieManager.getCookie(this.ACCESS_TOKEN_KEY);
      this.refreshToken = CookieManager.getCookie(this.REFRESH_TOKEN_KEY);
    }
  }

  // Convert timestamp to seconds for maxAge
  private timestampToMaxAge(timestampStr: string): number {
    const expiryTime = parseInt(timestampStr);
    const currentTime = Math.floor(Date.now() / 1000);
    const maxAge = expiryTime - currentTime;
    return maxAge > 0 ? maxAge : 0;
  }

  saveTokens(
    accessToken: string, 
    refreshToken: string, 
    accessTokenExpiry?: string, 
    refreshTokenExpiry?: string
  ): void {
    if (typeof window !== 'undefined') {
      // Calculate maxAge from expiry timestamps or use defaults
      const accessMaxAge = accessTokenExpiry 
        ? this.timestampToMaxAge(accessTokenExpiry)
        : 60 * 60; // Default 1 hour

      const refreshMaxAge = refreshTokenExpiry 
        ? this.timestampToMaxAge(refreshTokenExpiry)
        : 7 * 24 * 60 * 60; // Default 7 days

      // Set access token with calculated expiry
      CookieManager.setCookie(this.ACCESS_TOKEN_KEY, accessToken, {
        ...this.cookieOptions,
        maxAge: accessMaxAge,
      });

      // Set refresh token with calculated expiry
      CookieManager.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, {
        ...this.cookieOptions,
        maxAge: refreshMaxAge,
      });
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Save merchant data
  saveMerchantUsername(merchantUsername: string): void {
    if (typeof window !== 'undefined') {
      CookieManager.setCookie(this.MERCHANT_USERNAME_KEY, merchantUsername, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
  }
  
  saveMerchantID(merchantID: string): void {
    if (typeof window !== 'undefined') {
      CookieManager.setCookie(this.MERCHANT_ID_KEY, merchantID, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
  }
  // Save user data
  saveUserData(userData: any): void {
    if (typeof window !== 'undefined') {
      CookieManager.setCookie(this.USER_DATA_KEY, JSON.stringify(userData), {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
  }

  // Get merchant ID
  getMerchantUsername(): string | null {
    if (typeof window !== 'undefined') {
      return CookieManager.getCookie(this.MERCHANT_USERNAME_KEY);
    }
    return null;
  }
  
  getMerchantID(): string | null {
    if (typeof window !== 'undefined') {
      return CookieManager.getCookie(this.MERCHANT_ID_KEY);
    }
    return null;
  }
  // Get user data
  getUserData(): any {
    if (typeof window !== 'undefined') {
      const userData = CookieManager.getCookie(this.USER_DATA_KEY);
      try {
        return userData ? JSON.parse(userData) : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      CookieManager.removeCookie(this.ACCESS_TOKEN_KEY, {
        path: this.cookieOptions.path,
      });
      CookieManager.removeCookie(this.REFRESH_TOKEN_KEY, {
        path: this.cookieOptions.path,
      });
      CookieManager.removeCookie(this.MERCHANT_USERNAME_KEY, {
        path: this.cookieOptions.path,
      });
      CookieManager.removeCookie(this.USER_DATA_KEY, {
        path: this.cookieOptions.path,
      });
    }
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.refreshPromise = null; // Reset refresh promise
  }

  getAccessToken(): string | null {
    // Always get fresh token from cookie to handle external changes
    if (typeof window !== 'undefined') {
      this.accessToken = CookieManager.getCookie(this.ACCESS_TOKEN_KEY);
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    // Always get fresh token from cookie to handle external changes
    if (typeof window !== 'undefined') {
      this.refreshToken = CookieManager.getCookie(this.REFRESH_TOKEN_KEY);
    }
    return this.refreshToken;
  }

  setRefreshing(status: boolean): void {
    this.isRefreshing = status;
    if (!status) {
      this.refreshPromise = null; // Clear promise when done refreshing
    }
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  // New method to handle single refresh promise
  async refreshTokens(): Promise<string> {
    // If already refreshing, return existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Create new refresh promise
    this.refreshPromise = this.performRefresh();
    return this.refreshPromise;
  }

  private async performRefresh(): Promise<string> {
    try {
      this.setRefreshing(true);

      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.put(`${api.defaults.baseURL}/auth/refresh`, {
        refresh_token: refreshToken, // Fixed: use refresh_token
      });

      // Use correct field names from API response
      const { 
        access_token, 
        refresh_token, 
        access_token_expiry, 
        refresh_token_expiry 
      } = response.data.data;

      this.saveTokens(
        access_token, 
        refresh_token, 
        access_token_expiry, 
        refresh_token_expiry
      );

      this.processQueue(null, access_token);
      return access_token;
    } catch (error) {
      this.processQueue(error, null);
      this.clearTokens();
      throw error;
    } finally {
      this.setRefreshing(false);
    }
  }

  addToFailedQueue(resolve: (value?: any) => void, reject: (error?: any) => void): void {
    this.failedQueue.push({ resolve, reject });
  }

  processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Check if cookies are available
  areCookiesEnabled(): boolean {
    return CookieManager.areCookiesEnabled();
  }
}

const tokenManager = TokenManager.getInstance();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - SIMPLIFIED to prevent race condition
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use the single refresh promise to prevent race condition
        const newAccessToken = await tokenManager.refreshTokens();
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { tokenManager };