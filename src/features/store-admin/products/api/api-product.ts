import api, { tokenManager } from "@/lib/axios";

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: string[];
  error?: string;
  details?: any;
}

export const apiProduct = {
  // Create a new product with photos
  async createProduct(
    productData: CreateProductRequest,
    photos: FileList | File[]
  ): Promise<CreateProductResponse> {
    try {
      if (!photos || photos.length === 0) {
        throw new Error("At least one product photo is required");
      }

      const formData = new FormData();
      
      // Append product data to FormData
      Object.keys(productData).forEach(key => {
        const value = productData[key as keyof CreateProductRequest];
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Append photos to FormData
      Array.from(photos).forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await api.post<CreateProductResponse>(
        '/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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

      // Handle bad request errors
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Invalid product data or missing photos");
      }

      throw new Error(error.response?.data?.message || "Failed to create product");
    }
  },

  // Upload additional photo to existing product
  async uploadProductPhoto(productID: string, photo: File): Promise<UploadPhotoResponse> {
    try {
      if (!productID) {
        throw new Error("Product ID is required");
      }

      const formData = new FormData();
      formData.append('photo', photo);

      const response = await api.post<UploadPhotoResponse>(
        `/products/${productID}/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }

      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Invalid image format or maximum photos reached");
      }

      throw new Error(error.response?.data?.message || "Failed to upload product photo");
    }
  },

  // Delete product photo
  async deleteProductPhoto(productID: string, filePath: string): Promise<UploadPhotoResponse> {
    try {
      if (!productID || !filePath) {
        throw new Error("Product ID and file path are required");
      }

      const response = await api.delete<UploadPhotoResponse>(
        `/products/${productID}/photos/${filePath}`
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product or photo not found");
      }

      throw new Error(error.response?.data?.message || "Failed to delete product photo");
    }
  },

  // Get all products (Admin only)
  async getAllProducts(params: QueryParams = {}): Promise<GetProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        const value = params[key as keyof QueryParams];
        if (value !== null && value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get<GetProductsResponse>(
        `/products?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("You must be logged in to access all products");
      }

      if (error.response?.status === 403) {
        throw new Error("Admin access required to view all products");
      }

      throw new Error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  // Get product by ID
  async getProductById(productID: string): Promise<GetProductResponse> {
    try {
      if (!productID) {
        throw new Error("Product ID is required");
      }

      const response = await api.get<GetProductResponse>(`/products/${productID}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }

      throw new Error(error.response?.data?.message || "Failed to fetch product");
    }
  },

  // Get products by merchant ID
  async getProductsByMerchant(merchantUsername: string): Promise<GetProductsResponse> {
    try {
      if (!merchantUsername) {
        throw new Error("Merchant ID is required");
      }

      const response = await api.get<GetProductsResponse>(
        `/merchants/${merchantUsername}/products`
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("No products found for this merchant");
      }

      throw new Error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  // Update product
  async updateProduct(
    merchantID: string,
    productID: string,
    productData: UpdateProductRequest
  ): Promise<UpdateProductResponse> {
    try {
      if (!merchantID || !productID) {
        throw new Error("Merchant ID and Product ID are required");
      }

      const response = await api.put<UpdateProductResponse>(
        `/merchants/${merchantID}/products/${productID}`,
        productData
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

      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }

      if (error.response?.status === 403) {
        throw new Error("You don't have permission to update this product");
      }

      throw new Error(error.response?.data?.message || "Failed to update product");
    }
  },

  // Delete product
  async deleteProduct(merchantID: string, productID: string): Promise<DeleteProductResponse> {
    try {
      if (!merchantID || !productID) {
        throw new Error("Merchant ID and Product ID are required");
      }

      const response = await api.delete<DeleteProductResponse>(
        `/merchants/${merchantID}/products/${productID}`
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }

      if (error.response?.status === 403) {
        throw new Error("You don't have permission to delete this product");
      }

      throw new Error(error.response?.data?.message || "Failed to delete product");
    }
  },

  // Send product interaction log
  async sendProductInteraction(
    productID: string,
    interactionData: ProductInteractionRequest
  ): Promise<ProductInteractionResponse> {
    try {
      if (!productID) {
        throw new Error("Product ID is required");
      }

      const response = await api.post<ProductInteractionResponse>(
        `/products/${productID}/interactions`,
        interactionData
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }

      throw new Error(error.response?.data?.message || "Failed to send product interaction");
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

  // Utility function to validate product data
  validateProductData(productData: CreateProductRequest): string[] {
    const errors: string[] = [];

    if (!productData.title || productData.title.trim().length === 0) {
      errors.push("Title is required");
    } else if (productData.title.length > 150) {
      errors.push("Title must be at most 150 characters long");
    }

    if (productData.description && productData.description.length > 500) {
      errors.push("Description must be at most 500 characters long");
    }

    if (!productData.price && productData.price !== "0") {
        errors.push("Price is required");
    } else {
        const priceNumber = parseFloat(productData.price);
        if (isNaN(priceNumber) || priceNumber < 0) {
                errors.push("Price must be a valid number greater than or equal to 0");
        }
    }

    if (!productData.affiliate_url || productData.affiliate_url.trim().length === 0) {
      errors.push("Affiliate URL is required");
    } else {
      try {
        new URL(productData.affiliate_url);
      } catch {
        errors.push("Affiliate URL must be a valid URL");
      }
    }

    if (productData.category_id && (isNaN(productData.category_id) || productData.category_id < 0)) {
      errors.push("Category ID must be a valid number");
    }

    return errors;
  },

  // Utility function to validate image files
  validateImages(files: FileList | File[]): string[] {
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!files || files.length === 0) {
      errors.push("At least one product photo is required");
      return errors;
    }

    if (files.length > 5) {
      errors.push("Maximum 5 photos allowed per product");
    }

    Array.from(files).forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${index + 1}: Only JPEG, PNG, and WebP images are allowed`);
      }

      if (file.size > maxSize) {
        errors.push(`File ${index + 1}: File size must be less than 5MB`);
      }
    });

    return errors;
  },

  // Format product data for API submission
  formatProductData(productData: any): CreateProductRequest | UpdateProductRequest {
    const formatted: any = {};

    if (productData.title !== undefined) {
      formatted.title = productData.title?.trim();
    }

    if (productData.description !== undefined) {
      formatted.description = productData.description?.trim() || '';
    }

    if (productData.price !== undefined) {
      formatted.price = parseFloat(productData.price);
    }

    if (productData.affiliate_url !== undefined) {
      formatted.affiliate_url = productData.affiliate_url?.trim();
    }

    if (productData.category_id !== undefined && productData.category_id !== null) {
      formatted.category_id = parseInt(productData.category_id);
    }

    return formatted;
  }
};