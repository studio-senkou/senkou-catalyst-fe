import React, { useState, useMemo, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";

import { AppSidebar } from "../components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Loader2,
} from "lucide-react";
import AddProductModal from "./add-product";
import EditProductModal from "./edit-product";
import { apiProduct, type Product } from "./api/api-product";
import { apiCategory, type Category } from "../categories/api/api-category";
import { apiAuth } from "@/api/api-auth";

// Column helper for type safety
const columnHelper = createColumnHelper<Product>();

export default function Products(): React.ReactElement {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Products data and loading states
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string>("");

  // Categories data and loading state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Get merchantID from auth
  const merchantID = apiAuth.getCurrentMerchantId() || "";

  // Load data on component mount
  useEffect(() => {
    if (merchantID) {
      loadProducts();
      loadCategories();
    } else {
      toast.error("Merchant ID not found. Please login again.");
      setIsLoading(false);
    }
  }, [merchantID]);

  const loadProducts = async (): Promise<void> => {
    if (!merchantID) return;

    try {
      setIsLoading(true);
      const response = await apiProduct.getProductsByMerchant(merchantID);
      setProducts(response.data.products);
    } catch (error: any) {
      toast.error(error.message || "Failed to load products");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async (): Promise<void> => {
    if (!merchantID) return;

    try {
      setIsLoadingCategories(true);
      const response = await apiCategory.getCategories(merchantID);
      setCategories(response.data.categories);
    } catch (error: any) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleCategoriesUpdate = async (): Promise<void> => {
    await loadCategories();
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return "No Category";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  const formatPrice = (price: string): string => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return "Invalid price";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const handleAddProduct = async (): Promise<void> => {
    await loadProducts();
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (): Promise<void> => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    await loadProducts();
  };

  const handleDeleteProduct = async (product: Product): Promise<void> => {
    if (!merchantID) {
      toast.error("Merchant ID not found");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        setIsDeleting(product.id);
        await apiProduct.deleteProduct(merchantID, product.id);
        toast.success("Product deleted successfully");
        await loadProducts();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      } finally {
        setIsDeleting("");
      }
    }
  };

  const handleViewProduct = (product: Product): void => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDeleteSelected = async (): Promise<void> => {
    if (!merchantID) {
      toast.error("Merchant ID not found");
      return;
    }

    const selectedProducts = Object.keys(rowSelection)
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

    if (selectedProducts.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} selected products?`,
      )
    ) {
      try {
        setIsLoading(true);

        // Delete all selected products
        const deletePromises = selectedProducts.map((product) =>
          apiProduct.deleteProduct(merchantID, product.id),
        );

        await Promise.all(deletePromises);

        toast.success(`${selectedProducts.length} products deleted successfully`);
        setRowSelection({});
        await loadProducts();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete selected products");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Define columns
  const columns = useMemo(
    () => [
      // Selection column
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      }),

      // Image column
      columnHelper.accessor("photos", {
        header: "Image",
        cell: ({ getValue }) => {
          const photos = getValue();
          const firstPhoto = photos && photos.length > 0 ? photos[0] : null;

          return firstPhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/files/${firstPhoto}`}
              alt="Product"
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">No img</span>
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        size: 80,
      }),

      // Title column
      columnHelper.accessor("title", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-medium"
            >
              Title
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
        size: 200,
      }),

      // Category column - Updated to show category name
      columnHelper.accessor("category_id", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-medium"
            >
              Category
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          const categoryId = getValue();
          return getCategoryName(categoryId);
        },
        filterFn: "equals",
        size: 120,
      }),

      // Price column
      columnHelper.accessor("price", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-medium"
            >
              Price
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ getValue }) => formatPrice(getValue()),
        size: 150,
      }),

      // Description column
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ getValue }) => {
          const description = getValue();
          return description ? (
            <div className="max-w-[200px] truncate" title={description}>
              {description}
            </div>
          ) : (
            <span className="text-gray-500">No description</span>
          );
        },
        enableSorting: false,
        size: 200,
      }),

      // Actions column
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewProduct(row.original)}
              title="View product"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditProduct(row.original)}
              title="Edit product"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteProduct(row.original)}
              className="text-red-600 hover:text-red-700"
              disabled={isDeleting === row.original.id}
              title="Delete product"
            >
              {isDeleting === row.original.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 150,
      }),
    ],
    [isDeleting, categories], // Add categories as dependency
  );

  // Create table instance
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getRowId: (row) => row.id,
  });

  // Get unique category IDs for filter
  const availableCategoryIds = useMemo(() => {
    const uniqueCategoryIds = Array.from(
      new Set(products.map((p) => p.category_id).filter(Boolean)),
    );
    return uniqueCategoryIds;
  }, [products]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">Admin Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">
                Manage your product inventory and details.{" "}
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {Object.keys(rowSelection).length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  size="sm"
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({Object.keys(rowSelection).length})
                </Button>
              )}
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            {availableCategoryIds.length > 0 && (
              <Select
                value={(table.getColumn("category_id")?.getFilterValue() as string) ?? ""}
                onValueChange={(value) =>
                  table
                    .getColumn("category_id")
                    ?.setFilterValue(value === "all" ? "" : Number(value))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategoryIds.map((categoryId) => (
                    <SelectItem key={categoryId} value={categoryId.toString()}>
                      {getCategoryName(categoryId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings2 className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading products...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No products found. Click "Add Product" to create your first product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddProductModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSubmit={handleAddProduct}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          onCategoriesUpdate={handleCategoriesUpdate}
        />

        {editingProduct && (
          <EditProductModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            product={editingProduct}
            onSubmit={handleUpdateProduct}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            onCategoriesUpdate={handleCategoriesUpdate}
          />
        )}

        {viewingProduct && (
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{viewingProduct.title}</DialogTitle>
                <DialogDescription>Product Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {viewingProduct.photos && viewingProduct.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProduct.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_API_URL}/files/${photo}`}
                        alt={`${viewingProduct.title} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Price</h4>
                    <p>{formatPrice(viewingProduct.price)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Category</h4>
                    <p>{getCategoryName(viewingProduct.category_id)}</p>
                  </div>
                </div>
                {viewingProduct.description && (
                  <div>
                    <h4 className="font-semibold">Description</h4>
                    <p>{viewingProduct.description}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">Affiliate URL</h4>
                  <a
                    href={viewingProduct.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {viewingProduct.affiliate_url}
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
