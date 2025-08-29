// axios.ts

import axios, { AxiosError } from "axios";
import { CookieManager } from "./cookie-utils";

// Token management with cookie storage
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  // Cookie names
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly MERCHANT_ID_KEY = 'merchantId';
  private readonly USER_DATA_KEY = 'userData';

  // Cookie options
  private readonly cookieOptions = {
    path: '/',
    secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
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

  saveTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      // Set access token with shorter expiry (typically 15 minutes to 1 hour)
      CookieManager.setCookie(this.ACCESS_TOKEN_KEY, accessToken, {
        ...this.cookieOptions,
        maxAge: 60 * 60, // 1 hour
      });

      // Set refresh token with longer expiry (typically 7-30 days)
      CookieManager.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Save merchant data
  saveMerchantId(merchantId: string): void {
    if (typeof window !== 'undefined') {
      CookieManager.setCookie(this.MERCHANT_ID_KEY, merchantId, {
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
  getMerchantId(): string | null {
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
      CookieManager.removeCookie(this.MERCHANT_ID_KEY, {
        path: this.cookieOptions.path,
      });
      CookieManager.removeCookie(this.USER_DATA_KEY, {
        path: this.cookieOptions.path,
      });
    }
    this.accessToken = null;
    this.refreshToken = null;
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
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
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
  // Remove withCredentials for now since we're managing tokens manually
  // withCredentials: true,
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (tokenManager.isCurrentlyRefreshing()) {
        return new Promise((resolve, reject) => {
          tokenManager.addToFailedQueue(resolve, reject);
        }).then(() => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      tokenManager.setRefreshing(true);

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.put(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenManager.saveTokens(accessToken, newRefreshToken);
        tokenManager.processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        tokenManager.processQueue(refreshError, null);
        tokenManager.clearTokens();
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        tokenManager.setRefreshing(false);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { tokenManager };