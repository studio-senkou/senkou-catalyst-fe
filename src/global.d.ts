// global.d.ts
export {};

declare global {
  interface Product {
    id: number;
    name: string;
    price: string;
    rating: string;
    isNew?: boolean;
    image: string;
    category?: string;
    brand?: string;
    bgColor?: string;
    originalPrice?: string;
    discount?: string;
  }

  interface Testimonial {
    name: string;
    role: string;
    text: string;
    rating: number;
  }

  interface LoginRequest {
    email: string;
    password: string;
  }

  interface RefreshTokenRequest {
    refreshToken: string;
  }

  interface LoginResponse {
    message: string;
    data: {
      access_token: string;        
      access_token_expiry: string;
      refresh_token: string;
      refresh_token_expiry: string;
    };
  }

  interface RefreshTokenResponse {
    message: string;
    data: {
      access_token: string;        
      access_token_expiry: string;
      refresh_token: string;
      refresh_token_expiry: string;
    };
  }

  interface LogoutResponse {
    message: string;
  }

  interface ApiError {
    message: string;
    error?: string | Record<string, any>;
  }

  interface User {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
}
