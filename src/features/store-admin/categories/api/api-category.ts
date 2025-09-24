import api, { tokenManager } from "@/lib/axios";

export interface ApiErrorResponse {
  message: string;
  errors?: string[];
  error?: string;
}

export const apiCategory = {
  // Create a new category
  async createCategory(
    merchantID: string,
    categoryData: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    try {
      if (!merchantID) {
        throw new Error("Merchant ID is required");
      }

      const response = await api.post<CreateCategoryResponse>(
        `/merchants/${merchantID}/categories`,
        categoryData,
      );
      return response.data;
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Array.isArray(validationErrors)
          ? validationErrors.join(", ")
          : Object.values(validationErrors).join(", ");
        throw new Error(errorMessages);
      }

      // Handle conflict errors (category already exists)
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Category already exists or invalid data");
      }

      throw new Error(error.response?.data?.message || "Failed to create category");
    }
  },

  // Get all categories for a merchant
  async getCategories(merchantUsername: string): Promise<GetCategoriesResponse> {
    try {
      if (!merchantUsername) {
        throw new Error("Merchant ID is required");
      }

      const response = await api.get<GetCategoriesResponse>(`/merchants/${merchantUsername}/categories`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("You must be logged in to access categories");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
  },

  // Update an existing category
  async updateCategory(
    merchantID: string,
    categoryID: string,
    categoryData: UpdateCategoryRequest,
  ): Promise<UpdateCategoryResponse> {
    try {
      if (!merchantID || !categoryID) {
        throw new Error("Merchant ID and Category ID are required");
      }

      const response = await api.put<UpdateCategoryResponse>(
        `/merchants/${merchantID}/categories/${categoryID}`,
        categoryData,
      );
      return response.data;
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Array.isArray(validationErrors)
          ? validationErrors.join(", ")
          : Object.values(validationErrors).join(", ");
        throw new Error(errorMessages);
      }

      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error("Category not found");
      }

      // Handle bad request errors
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Invalid data provided");
      }

      throw new Error(error.response?.data?.message || "Failed to update category");
    }
  },

  // Delete a category
  async deleteCategory(merchantID: string, categoryID: string): Promise<DeleteCategoryResponse> {
    try {
      if (!merchantID || !categoryID) {
        throw new Error("Merchant ID and Category ID are required");
      }

      const response = await api.delete<DeleteCategoryResponse>(
        `/merchants/${merchantID}/categories/${categoryID}`,
      );
      return response.data;
    } catch (error: any) {
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error("Category not found");
      }

      // Handle bad request errors
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Invalid category ID");
      }

      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
  },

  // Get a specific category by ID (if needed)
  async getCategoryById(merchantID: string, categoryID: string): Promise<Category> {
    try {
      // Note: This endpoint doesn't exist in your backend,
      // but you might want to add it for completeness
      const response = await api.get<{ data: { category: Category } }>(
        `/merchants/${merchantID}/categories/${categoryID}`,
      );
      return response.data.data.category;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Category not found");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch category");
    }
  },

  // Check if user is authenticated (inherited from your original code)
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  },

  // Get current access token (inherited from your original code)
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  // Utility function to validate category name
  validateCategoryName(name: string): string[] {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push("Name is required");
    } else if (name.length < 3) {
      errors.push("Name must be at least 3 characters long");
    } else if (name.length > 100) {
      errors.push("Name must not exceed 100 characters");
    }

    return errors;
  },
};
