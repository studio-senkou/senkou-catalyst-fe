import { useEffect, useState } from "react";

import Navbar from "./components/sections/navbar";
import Footer from "./components/sections/footer";
import Announcement from "./components/sections/announcement";
import ProductCard from "./components/productCard";
import { Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { apiProduct, type Product } from "../store-admin/products/api/api-product";
import { apiAuth } from "@/api/api-auth";

// Utility functions
const getNumericPrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
};

// Define filter types
type SortOption = "newest" | "price-low" | "price-high" | "title";
type FilterState = {
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
  searchTerm: string;
};

// Transform API product to match ProductCard props
interface ProductCardData {
  id: string;
  name: string;
  price: string;
  rating: string;
  isNew: boolean;
  image: string;
}

const transformProduct = (apiProduct: Product): ProductCardData => {
  // Check if product is new (created within last 7 days)
  const isNew = apiProduct.created_at
    ? new Date().getTime() - new Date(apiProduct.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;

  // Get first photo or use placeholder
  const image =
    apiProduct.photos && apiProduct.photos.length > 0
      ? `${import.meta.env.VITE_API_URL}/files/${apiProduct.photos[0]}` // Update with your actual API domain
      : `https://picsum.photos/seed/${apiProduct.id}/500/600`;

  // Format price - handle both string and number types safely
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numericPrice) ? "$0" : `${numericPrice.toLocaleString()}`;
  };

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    price: formatPrice(apiProduct.price),
    rating: "4.5", // Default rating since API doesn't provide it
    isNew,
    image,
  };
};

export default function Collection() {
  const merchantID = apiAuth.getCurrentMerchantId() || "";

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
    sort: "newest",
    searchTerm: "",
  });

  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const clearAllFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: Number.MAX_SAFE_INTEGER,
      sort: "newest",
      searchTerm: "",
    });
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!merchantID) {
        setError("Merchant ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiProduct.getProductsByMerchant(merchantID);
        setProducts(response.data.products);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [merchantID]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (filters.searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(filters.searchTerm.toLowerCase())),
      );
    }

    // Apply price filter
    result = result.filter((product) => {
      const numPrice = getNumericPrice(product.price);
      return numPrice >= filters.minPrice && numPrice <= filters.maxPrice;
    });

    // Apply sorting
    switch (filters.sort) {
      case "newest":
        result = [...result].sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
      case "price-low":
        result = [...result].sort((a, b) => {
          const priceA = getNumericPrice(a.price);
          const priceB = getNumericPrice(b.price);
          return priceA - priceB;
        });
        break;
      case "price-high":
        result = [...result].sort((a, b) => {
          const priceA = getNumericPrice(a.price);
          const priceB = getNumericPrice(b.price);
          return priceB - priceA;
        });
        break;
      case "title":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    // Transform products to match ProductCard interface
    const transformedProducts = result.map(transformProduct);
    setFilteredProducts(transformedProducts);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, products]);

  // Handle filter changes
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Handle page change
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Announcement Bar*/}
      <Announcement />

      {/*Navbar */}
      <Navbar />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <div className="text-sm text-yellow-600 font-semibold mb-2 tracking-wider">
                PRODUCTS
              </div>
              <h2 className="text-3xl font-bold relative before:content-[''] before:absolute before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-yellow-600">
                My Collection
              </h2>
            </div>

            {/* Sort dropdown and filter toggle */}
            <div className="flex items-center mt-8 md:mt-0 space-x-4">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-600 text-sm"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value as SortOption)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Name: A to Z</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center bg-white border border-gray-200 rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-600"
              >
                <Filter size={16} className="mr-2" />
                Filters
                {isFilterOpen ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>
            </div>
          </div>

          {/* Filter section */}
          {isFilterOpen && (
            <div className="mb-8 p-6 bg-white rounded-md shadow-sm border border-gray-100 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search filter */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Search Products</h3>
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                    className="form-input rounded-md border-gray-200 w-full text-sm focus:border-yellow-600 focus:ring focus:ring-yellow-200"
                  />
                </div>

                {/* Price range filter */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">$</span>
                      <input
                        type="number"
                        min="0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
                        className="form-input rounded-md border-gray-200 w-full text-sm focus:border-yellow-600 focus:ring focus:ring-yellow-200"
                      />
                      <span className="mx-2 text-gray-400">to</span>
                      <span className="text-sm text-gray-500 mr-2">$</span>
                      <input
                        type="number"
                        min={filters.minPrice}
                        value={filters.maxPrice === Number.MAX_SAFE_INTEGER ? "" : filters.maxPrice}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? Number.MAX_SAFE_INTEGER
                              : Number(e.target.value);
                          handleFilterChange("maxPrice", value);
                        }}
                        className="form-input rounded-md border-gray-200 w-full text-sm focus:border-yellow-600 focus:ring focus:ring-yellow-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear filters button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-yellow-600 transition-colors focus:outline-none"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              <p className="mt-2 text-gray-500">Loading products...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="py-12 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-yellow-600 underline hover:text-yellow-700 transition-colors focus:outline-none"
              >
                Try again
              </button>
            </div>
          )}

          {/* Product count and results */}
          {!loading && !error && (
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {Math.min(filteredProducts.length, startIndex + 1)}-
                {Math.min(filteredProducts.length, startIndex + productsPerPage)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>
          )}

          {/* Products grid */}
          {!loading && !error && (
            <>
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No products match your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-yellow-600 underline hover:text-yellow-700 transition-colors focus:outline-none"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md focus:outline-none ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => (typeof page === "number" ? changePage(page) : null)}
                    disabled={page === "..."}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm focus:outline-none ${
                      page === currentPage
                        ? "bg-yellow-600 text-white"
                        : page === "..."
                          ? "text-gray-500 cursor-default"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md focus:outline-none ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
