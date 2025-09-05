// utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CookieManager } from "./cookie-utils"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Auth utilities
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!CookieManager.getCookie('accessToken');
};

export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    CookieManager.removeCookie('accessToken', { path: '/' });
    CookieManager.removeCookie('refreshToken', { path: '/' });
    CookieManager.removeCookie('merchantId', { path: '/' });
    CookieManager.removeCookie('userData', { path: '/' });
  }
};

// Get tokens from cookies
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return CookieManager.getCookie('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return CookieManager.getCookie('refreshToken');
};

// Convert timestamp to seconds for maxAge
const timestampToMaxAge = (timestampStr: string): number => {
  const expiryTime = parseInt(timestampStr);
  const currentTime = Math.floor(Date.now() / 1000);
  const maxAge = expiryTime - currentTime;
  return maxAge > 0 ? maxAge : 0;
};

// Save tokens to cookies with proper expiry
export const saveTokens = (
  accessToken: string, 
  refreshToken: string, 
  accessTokenExpiry?: string, 
  refreshTokenExpiry?: string
): void => {
  if (typeof window === 'undefined') return;
  
  const cookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax' as const,
  };

  // Calculate maxAge from expiry timestamps or use defaults
  const accessMaxAge = accessTokenExpiry 
    ? timestampToMaxAge(accessTokenExpiry)
    : 60 * 60; // Default 1 hour

  const refreshMaxAge = refreshTokenExpiry 
    ? timestampToMaxAge(refreshTokenExpiry)
    : 7 * 24 * 60 * 60; // Default 7 days

  // Access token with calculated expiry
  CookieManager.setCookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: accessMaxAge,
  });

  // Refresh token with calculated expiry
  CookieManager.setCookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: refreshMaxAge,
  });
};

// Check if cookies are enabled
export const areCookiesEnabled = (): boolean => {
  return CookieManager.areCookiesEnabled();
};

// Error handling utility
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};