import api, { tokenManager } from "@/lib/axios";

export const apiUser = {
  // Register user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/users', userData);
      return response.data;
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Activate account
  async activateAccount(token: string): Promise<ActivateAccountResponse> {
    try {
      const response = await api.post<ActivateAccountResponse>('/users/activate', { token });
      return response.data;
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(error.response?.data?.message || 'Account activation failed');
    }
  },

  // Get all users (requires authentication)
  async getUsers(params?: UserQueryParams): Promise<GetUsersResponse> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : '';
      const url = queryString ? `/users?${queryString}` : '/users';
      const response = await api.get<GetUsersResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get current user detail (requires authentication)
  async getCurrentUser(): Promise<GetUserDetailResponse> {
    try {
      const response = await api.get<GetUserDetailResponse>('/users/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to access this resource');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },

  // Get current access token
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },
};