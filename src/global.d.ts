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

  interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }

  interface RefreshTokenRequest {
    refreshToken: string;
  }

  interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
    merchants?: Merchant[];
  }

  interface Merchant {
    id: string;
    name: string;
    owner_id: number;
  }

  interface LoginResponse {
    message: string;
    data: {
      access_token: string;        
      access_token_expiry: string;
      refresh_token: string;
      refresh_token_expiry: string;
      user: User;
    };
  }

  interface RegisterResponse {
    message: string;
    data: {
      user: User;
    };
  }

  interface GetUsersResponse {
    message: string;
    data: {
      users: User[];
    };
  }

  interface GetUserDetailResponse {
    message: string;
    data: {
      user: User;
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
}