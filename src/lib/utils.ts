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

// Save tokens to cookies
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  
  const cookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax' as const,
  };

  // Access token - shorter expiry (1 hour)
  CookieManager.setCookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60, // 1 hour
  });

  // Refresh token - longer expiry (7 days)
  CookieManager.setCookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
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