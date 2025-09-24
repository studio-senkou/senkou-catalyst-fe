import React, { useState } from "react";
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
import { apiProduct } from "./api/api-product";
import { apiCategory} from "../categories/api/api-category";
import { apiAuth } from "@/api/api-auth";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onOpenChange,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New category states
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const merchantID = apiAuth.getCurrentMerchantId() || "";

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

    // Validate files
    const validationErrors = apiProduct.validateImages(fileArray);
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    setSelectedFiles(fileArray);

    // Create previews
    const previews: string[] = [];
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          previews.push(event.target.result as string);
          if (previews.length === fileArray.length) {
            setImagePreviews([...previews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number): void => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);

    // Clear file input if no files left
    if (newFiles.length === 0) {
      const fileInput = document.getElementById("photos") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const validateForm = (): boolean => {
    // Check if merchant ID exists
    if (!merchantID) {
      toast.error("Merchant ID not found. Please login again.");
      return false;
    }

    // Use API validation for product data
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

    if (selectedFiles.length === 0) {
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
        toast.error("Please select a category or create a new one");
        return false;
      }
    }

    return true;
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

      // Step 2: Create product with the category (existing or newly created)
      toast.info("Creating product...");

      const productData: CreateProductRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        price: formData.price,
        affiliate_url: formData.affiliate_url.trim(),
        category_id: parseInt(categoryId),
      };

      await apiProduct.createProduct(productData, selectedFiles);

      toast.success("Product added successfully!");
      resetForm();
      onOpenChange(false);
      onSubmit();
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      title: "",
      description: "",
      price: "",
      affiliate_url: "",
      category_id: "",
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setIsCreatingNewCategory(false);
    setNewCategoryName("");

    // Clear file input
    const fileInput = document.getElementById("photos") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCancel = (): void => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Photos */}
          <div className="space-y-2">
            <Label htmlFor="photos">Product Photos (Max 5) *</Label>
            <div className="flex flex-col gap-4">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload product photos
                    <br />
                    <span className="text-xs">JPEG, PNG, WebP • Max 5MB each • Max 5 files</span>
                  </p>
                </div>
                <Input
                  id="photos"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleFilesChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Product Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
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
            <Label htmlFor="price">Price (IDR) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              min="0"
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("price", e.target.value)
              }
              required
              disabled={isLoading}
            />
          </div>

          {/* Category Selection */}
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
                  A new category will be created when you submit the form
                </p>
              </div>
            )}
          </div>

          {/* Affiliate URL */}
          <div className="space-y-2">
            <Label htmlFor="affiliate_url">Affiliate URL *</Label>
            <Input
              id="affiliate_url"
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
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isCreatingNewCategory ? "Creating category & product..." : "Adding product..."}
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
