// hooks/useOAuthHandler.ts
import { useState, useEffect } from 'react';
import { apiOAuth } from '@/api/api-oauth';
import { apiUser } from '@/api/api-user';
import { tokenManager } from '@/lib/axios';

interface UseOAuthHandlerReturn {
  isProcessing: boolean;
  error: string | null;
  success: string | null;
  handleGoogleAuth: () => void;
}

export const useOAuthHandler = (): UseOAuthHandlerReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for OAuth callback saat component mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check jika ada token atau error di URL
      const urlParams = new URLSearchParams(window.location.search);
      const hasToken = urlParams.get('token');
      const hasError = urlParams.get('error');

      if (!hasToken && !hasError) {
        return; // Bukan callback dari OAuth
      }

      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await apiOAuth.handleGoogleAuthCallback();
        
        if (!result.success) {
          setError(result.error || 'Authentication failed');
          return;
        }

        // Fetch user data setelah token disimpan
        try {
          const userResponse = await apiUser.getCurrentUser();
          const user = userResponse.data.user;

          // Handle redirect berdasarkan role
          let redirectUrl = '/dashboard'; // default
          
          if (user.role !== 'admin' && user.merchants && user.merchants.length > 0) {
            const merchant = user.merchants[0];
            if (merchant.username) {
              tokenManager.saveMerchantUsername(merchant.username);
              tokenManager.saveMerchantID(merchant.id);
              redirectUrl = `/${merchant.username}`; // Redirect ke merchant username
            }
          }

          // Save user data
          tokenManager.saveUserData({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            merchants: user.merchants || []
          });

          setSuccess('Berhasil login dengan Google! Selamat datang.');
          
          // Redirect ke merchant page atau dashboard
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);

        } catch (userError: any) {
          // Jika gagal get user data, tetap anggap login berhasil
          // karena token sudah disimpan, redirect ke default route
          console.warn('Failed to fetch user data after OAuth:', userError);
          setSuccess('Login berhasil! Mengarahkan...');
          setTimeout(() => {
            window.location.href = '/dashboard'; // Default redirect
          }, 1500);
        }

      } catch (error: any) {
        setError(error.message || 'Failed to process OAuth callback');
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, []);

  const handleGoogleAuth = () => {
    setError(null);
    setSuccess(null);
    setIsProcessing(true);
    
    try {
      apiOAuth.initiateGoogleAuth();
    } catch (error: any) {
      setError(error.message || 'Failed to start Google authentication');
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    success,
    handleGoogleAuth
  };
};