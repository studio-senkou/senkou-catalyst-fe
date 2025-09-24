// global.d.ts
export {};

declare global {

  interface Product {
    id: string;
    merchant_id: string;
    category_id: number;
    title: string;
    price: string;
    description: string;
    affiliate_url: string;
    photos: string[];
    created_at?: string;
    updated_at?: string;
  }

  interface CreateProductRequest {
    title: string;
    description?: string;
    price: string;
    affiliate_url: string;
    category_id?: number;
  }
  
  interface UpdateProductRequest {
    title?: string;
    description?: string;
    price?: string;
    affiliate_url?: string;
    category_id?: number;
  }
  
  interface ProductInteractionRequest {
    // Define based on your SendProductInteractionDTO
    interaction_type: string;
    [key: string]: any;
  }
  
  interface CreateProductResponse {
    message: string;
    data: {
      product: Product;
    };
  }
  
  interface GetProductResponse {
    message: string;
    data: {
      product: Product;
    };
  }
  
  interface GetProductsResponse {
    message: string;
    data: {
      products: Product[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
    };
  }
  
  interface UpdateProductResponse {
    message: string;
    data: {
      product: Product;
    };
  }
  
  interface DeleteProductResponse {
    message: string;
  }
  
  interface UploadPhotoResponse {
    message: string;
  }
  
  interface ProductInteractionResponse {
    message: string;
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

  // Updated RegisterRequest to match backend DTO
  interface RegisterRequest {
    name: string;
    merchant_username: string; 
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }

  // New interface for account activation
  interface ActivateAccountRequest {
    token: string;
  }

  // Query parameters for users endpoint
  interface UserQueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
  }

  interface RefreshTokenRequest {
    refreshToken: string;
  }

  interface UpdateUserRequest {
    name: string;
    email: string;
    phone: string;
  }

  interface Merchant {
    id: string;
    name: string;
    username?: string; // Added username field
    owner_id: number;
    created_at: string;
    updated_at: string;
  }

  // Updated User interface to match backend model
  interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role?: string; 
    email_verified_at?: string; 
    created_at: string;
    updated_at: string;
    merchants?: Merchant[];
  }

  // Pagination response structure
  interface PaginationResponse {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
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

  // Updated RegisterResponse to match backend response
  interface RegisterResponse {
    message: string;
    data: {
      user: User;
    };
  }

  // New interface for account activation response
  interface ActivateAccountResponse {
    message: string;
  }

  // Updated GetUsersResponse to include pagination
  interface GetUsersResponse {
    message: string;
    data: {
      users: User[];
      pagination: PaginationResponse;
    };
  }

  interface GetUserDetailResponse {
    message: string;
    data: {
      user: User;
    };
  }

  interface UpdateUserResponse {
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

  // category
  interface Category {
    id: number;
    name: string;
    merchant_id: string;
    created_at?: string;
    updated_at?: string;
  }
  
  interface CreateCategoryRequest {
    name: string;
  }
  
  interface UpdateCategoryRequest {
    name: string;
  }
  
  interface CreateCategoryResponse {
    message: string;
    data: {
      category: Category;
    };
  }
  
  interface GetCategoriesResponse {
    message: string;
    data: {
      categories: Category[];
    };
  }
  
  interface UpdateCategoryResponse {
    message: string;
    data: {
      category: Category;
    };
  }
  
  interface DeleteCategoryResponse {
    message: string;
  }



  interface ErrorResponse {
    message: string;
    error?: string;
    errors?: { [key: string]: string }; 
  }
}