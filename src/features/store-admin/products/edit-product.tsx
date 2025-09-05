import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { apiProduct, type Product, type UpdateProductRequest } from "./api/api-product";
import { apiAuth } from "@/api/api-auth";
import { apiCategory, type Category } from "../categories/api/api-category";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSubmit: () => void;
  categories: Category[];
  isLoadingCategories: boolean;
  onCategoriesUpdate: () => void;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  affiliate_url: string;
  category_id: string;
}

interface PhotoUpdateData {
  newPhotos: File[];
  deletedPhotos: string[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onOpenChange,
  product,
  onSubmit,
  categories,
  isLoadingCategories,
  onCategoriesUpdate,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    affiliate_url: "",
    category_id: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New category states
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // Get merchantID from auth
  const merchantID = apiAuth.getCurrentMerchantId() || "";

  // Initialize form data when product changes OR when modal opens
  useEffect(() => {
    if (product && open) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        affiliate_url: product.affiliate_url || "",
        category_id: product.category_id?.toString() || "",
      });
      setExistingPhotos(product.photos || []);
      setDeletedPhotos([]);
      setSelectedFiles([]);
      setImagePreviews([]);

      // Reset new category states
      setIsCreatingNewCategory(false);
      setNewCategoryName("");

      // Clear file input
      const fileInput = document.getElementById("edit-photos") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [product, open]); // Add 'open' to dependency array

  const handleInputChange = (field: keyof ProductFormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (value: string): void => {
    if (value === "add-new-category") {
      setIsCreatingNewCategory(true);
      setFormData((prev) => ({
        ...prev,
        category_id: "",
      }));
      return;
    }

    // If switching back to existing category, reset new category state
    if (isCreatingNewCategory) {
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    }

    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleNewCategoryNameChange = (value: string): void => {
    setNewCategoryName(value);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Check total photos limit (existing + new)
    const totalPhotos =
      existingPhotos.length - deletedPhotos.length + selectedFiles.length + fileArray.length;
    if (totalPhotos > 5) {
      toast.error("Maximum 5 photos allowed per product");
      return;
    }

    // Validate files
    const validationErrors = apiProduct.validateImages(fileArray);
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    const newFiles = [...selectedFiles, ...fileArray];
    setSelectedFiles(newFiles);

    // Create previews for new files
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (photo: string): void => {
    setExistingPhotos((prev) => prev.filter((p) => p !== photo));
    setDeletedPhotos((prev) => [...prev, photo]);
  };

  const removeNewImage = (index: number): void => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);

    // Clear file input if no files left
    if (newFiles.length === 0) {
      const fileInput = document.getElementById("edit-photos") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const restoreDeletedImage = (photo: string): void => {
    setDeletedPhotos((prev) => prev.filter((p) => p !== photo));
    setExistingPhotos((prev) => [...prev, photo]);
  };

  const validateForm = (): boolean => {
    // Check if merchant ID exists
    if (!merchantID) {
      toast.error("Merchant ID not found. Please login again.");
      return false;
    }

    // Use API validation
    const validationErrors = apiProduct.validateProductData({
      title: formData.title,
      description: formData.description || undefined,
      price: formData.price,
      affiliate_url: formData.affiliate_url,
    });

    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return false;
    }

    // Check if at least one photo remains
    const remainingPhotos = existingPhotos.length - deletedPhotos.length + selectedFiles.length;
    if (remainingPhotos === 0) {
      toast.error("At least one product photo is required");
      return false;
    }

    // Validate category selection
    if (isCreatingNewCategory) {
      // Validate new category name
      if (!newCategoryName.trim()) {
        toast.error("Category name is required");
        return false;
      }

      const categoryValidationErrors = apiCategory.validateCategoryName(newCategoryName.trim());
      if (categoryValidationErrors.length > 0) {
        toast.error(categoryValidationErrors.join(", "));
        return false;
      }

      // Check if category already exists (case-insensitive)
      const existingCategory = categories.find(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase(),
      );
      if (existingCategory) {
        toast.error("Category already exists");
        return false;
      }
    } else {
      // Validate existing category selection
      if (!formData.category_id) {
        toast.error("Please select a category");
        return false;
      }
    }

    return true;
  };

  // Updated API function to handle photo updates separately
  const updateProductWithPhotos = async (
    merchantID: string,
    productID: string,
    productData: UpdateProductRequest,
    photoData: PhotoUpdateData,
  ): Promise<void> => {
    // First update the basic product data
    await apiProduct.updateProduct(merchantID, productID, productData);

    // Then handle photo updates if needed
    if (photoData.newPhotos.length > 0 || photoData.deletedPhotos.length > 0) {
      // You'll need to implement these methods in your API
      if (photoData.deletedPhotos.length > 0) {
        // await apiProduct.deleteProductPhotos(merchantID, productID, photoData.deletedPhotos)
        console.log("Photos to delete:", photoData.deletedPhotos);
      }

      if (photoData.newPhotos.length > 0) {
        // await apiProduct.uploadProductPhotos(merchantID, productID, photoData.newPhotos)
        console.log("Photos to upload:", photoData.newPhotos);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let categoryId = formData.category_id;

      // Step 1: Create new category if needed
      if (isCreatingNewCategory && newCategoryName.trim()) {
        toast.info("Creating new category...");

        const categoryResponse = await apiCategory.createCategory(merchantID, {
          name: newCategoryName.trim(),
        });

        categoryId = categoryResponse.data.category.id.toString();
        toast.success("Category created successfully!");

        // Update categories list in parent component
        onCategoriesUpdate();
      }

      // Step 2: Update product with the category (existing or newly created)
      toast.info("Updating product...");

      const updateData: UpdateProductRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        price: formData.price,
        affiliate_url: formData.affiliate_url.trim(),
        category_id: categoryId ? parseInt(categoryId) : undefined,
      };

      // Use the updated function that handles photos separately
      await updateProductWithPhotos(merchantID, product.id, updateData, {
        newPhotos: selectedFiles,
        deletedPhotos: deletedPhotos,
      });

      toast.success("Product updated successfully!");
      onOpenChange(false); // Close modal without calling resetForm
      onSubmit(); // Refresh product list
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function for explicit cancel action
  const handleCancel = (): void => {
    onOpenChange(false);
  };

  // Handle dialog close (including ESC key or overlay click)
  const handleDialogChange = (isOpen: boolean): void => {
    onOpenChange(isOpen);
  };

  const totalPhotos = existingPhotos.length + selectedFiles.length;
  const canAddMore = totalPhotos < 5;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update the product details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Photos */}
          <div className="space-y-2">
            <Label htmlFor="edit-photos">Product Photos (Max 5) *</Label>
            <div className="flex flex-col gap-4">
              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Photos:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingPhotos.map((photo, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/files/${photo}`}
                          alt={`Product photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeExistingImage(photo)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deleted Photos (can be restored) */}
              {deletedPhotos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-600">
                    Deleted Photos (click to restore):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {deletedPhotos.map((photo, index) => (
                      <div
                        key={`deleted-${index}`}
                        className="relative cursor-pointer opacity-50 hover:opacity-75 transition-opacity"
                        onClick={() => restoreDeletedImage(photo)}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}/files/${photo}`}
                          alt={`Deleted photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border border-red-300"
                        />
                        <div className="absolute inset-0 bg-red-500/20 rounded-md flex items-center justify-center">
                          <span className="text-xs text-red-700 font-medium">Click to restore</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Photos */}
              {imagePreviews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-600">New Photos:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={preview}
                          alt={`New photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border border-green-300"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeNewImage(index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Photos */}
              {canAddMore && (
                <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      Click to add more photos ({totalPhotos}/5 used)
                      <br />
                      <span className="text-xs">JPEG, PNG, WebP • Max 5MB each</span>
                    </p>
                  </div>
                  <Input
                    id="edit-photos"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFilesChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Product Title *</Label>
            <Input
              id="edit-title"
              placeholder="Enter product title (max 150 characters)"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("title", e.target.value)
              }
              maxLength={150}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">{formData.title.length}/150 characters</p>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Enter product description (max 500 characters)"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("description", e.target.value)
              }
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="edit-price">Price (IDR) *</Label>
            <Input
              id="edit-price"
              type="number"
              placeholder="0"
              min="0"
              step="1000"
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("price", e.target.value)
              }
              required
              disabled={isLoading}
            />
          </div>

          {/* Category Selection - Enhanced like AddProductModal */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>

            <Select
              value={isCreatingNewCategory ? "add-new-category" : formData.category_id}
              onValueChange={handleCategoryChange}
              disabled={isLoading || isLoadingCategories}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : categories.length === 0
                        ? "No categories available - Create new category"
                        : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCategories ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading categories...
                    </div>
                  </SelectItem>
                ) : (
                  <>
                    {/* Add new category option */}
                    <SelectItem value="add-new-category">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create new category
                      </div>
                    </SelectItem>

                    {/* Existing categories */}
                    {categories.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No existing categories
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </>
                )}
              </SelectContent>
            </Select>

            {/* New Category Name Input - shows when "Create new category" is selected */}
            {isCreatingNewCategory && (
              <div className="space-y-2">
                <Input
                  placeholder="Enter new category name"
                  value={newCategoryName}
                  onChange={(e) => handleNewCategoryNameChange(e.target.value)}
                  maxLength={100}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {newCategoryName.length}/100 characters
                </p>
                <p className="text-xs text-blue-600">
                  A new category will be created when you update the product
                </p>
              </div>
            )}
          </div>

          {/* Affiliate URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-affiliate_url">Affiliate URL *</Label>
            <Input
              id="edit-affiliate_url"
              type="url"
              placeholder="https://example.com/product"
              value={formData.affiliate_url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("affiliate_url", e.target.value)
              }
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingCategories}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreatingNewCategory ? "Creating category & updating..." : "Updating..."}
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
