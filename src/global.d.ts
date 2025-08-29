// global.d.ts
export {};

declare global {
  // Updated Product interface for admin panel
  interface Product {
    id: string;
    name: string;
    category: string;
    price: number | string; // Changed to number for admin calculations
    stock?: number;
    status?: string;
    image: string;
    description?: string;
    brand?: string;
    // Keep existing fields for compatibility
    rating?: string;
    isNew?: boolean;
    bgColor?: string;
    originalPrice?: string;
    discount?: string;
  }

  // New interface for adding products
  interface NewProduct {
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    image: string;
  }

  // Modal props interface
  interface AddProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (product: NewProduct) => void;
  }

  // Form data interface for the modal
  interface ProductFormData {
    name: string;
    description: string;
    category: string;
    price: string;
    stock: string;
    image: string;
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
    merchantId: LoginResponse;
    message: string;
    data: {
      access_token: string;        
      access_token_expiry: string;
      refresh_token: string;
      refresh_token_expiry: string;
      user: User;
      merchantId: string;
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