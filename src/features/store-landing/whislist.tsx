import { useEffect, useState } from "react";

import Navbar from "./components/sections/navbar";
import Footer from "./components/sections/footer";
import Announcement from "./components/sections/announcement";
import { popularProducts } from "./constants/products";
import ProductCard from "./components/productCard";
import { Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

// Define filter types
type SortOption = "newest" | "price-low" | "price-high" | "rating";
type FilterState = {
  category: string;
  minPrice: number;
  maxPrice: number;
  showNew: boolean;
  sort: SortOption;
};

// Define a local product type that matches the expected data structure
type LocalProduct = {
  id: string;
  name: string;
  price: number | string;
  rating: string;
  isNew?: boolean;
  category?: string;
  image?: string;
  brand?: string;
  bgColor?: string;
  originalPrice?: string;
  discount?: string;
};

export default function Wishlist() {
  // Image generator
  const [getRandomImage, setRandomImage] = useState<((w: number, h: number) => string) | null>(
    null,
  );

  // Products state
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<LocalProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<LocalProduct[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    minPrice: 0,
    maxPrice: 1000,
    showNew: false,
    sort: "newest",
  });

  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Categories derived from products
  const [categories, setCategories] = useState<string[]>([]);

  // Helper function to get numeric price
  const getNumericPrice = (price: number | string): number => {
    if (typeof price === "number") return price;
    return parseFloat(price.toString().replace(/[^0-9.]/g, "")) || 0;
  };

  // Helper function to format price for display
  const formatPrice = (price: number | string): string => {
    const numPrice = getNumericPrice(price);
    return `$${numPrice.toFixed(2)}`;
  };

  useEffect(() => {
    // Set the random image generator
    setRandomImage(() => (width: number, height: number) => {
      const randomSeed = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/seed/${randomSeed}/${width}/${height}`;
    });

    // Initialize products and extract categories
    const productCategories = ["clothing", "accessories", "footwear", "jewelry"];
    const allProducts: LocalProduct[] = [...popularProducts].map((product) => ({
      ...product,
      // Assign category since popularProducts doesn't have it
      category: productCategories[Math.floor(Math.random() * productCategories.length)],
      // Ensure price is a number
      price: getNumericPrice(product.price),
      // Generate image for each product if they don't have one
      image: (product as any).image || (getRandomImage ? getRandomImage(500, 600) : ""),
    }));

    setProducts(allProducts);
  }, [getRandomImage]);

  // Filter products based on wishlist (localStorage)
  useEffect(() => {
    if (products.length === 0) return;

    // Get favorite IDs from localStorage
    const stored = localStorage.getItem("favoriteProducts");
    const favoriteIds = stored ? JSON.parse(stored) : [];

    // Filter products to only show those in wishlist
    const wishlistItems = products.filter((product) => favoriteIds.includes(product.id));
    setWishlistProducts(wishlistItems);

    // Extract unique categories from wishlist products only
    const uniqueCategories = Array.from(
      new Set(wishlistItems.map((product) => product.category || "uncategorized")),
    );
    setCategories(["all", ...uniqueCategories]);
  }, [products]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...wishlistProducts];

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category);
    }

    // Apply price filter - use numeric price comparison
    result = result.filter((product) => {
      const numPrice = getNumericPrice(product.price);
      return numPrice >= filters.minPrice && numPrice <= filters.maxPrice;
    });

    // Apply new items filter
    if (filters.showNew) {
      result = result.filter((product) => product.isNew);
    }

    // Apply sorting
    switch (filters.sort) {
      case "newest":
        // Assuming newer items have higher IDs
        result = [...result].sort((a, b) => Number(b.id) - Number(a.id));
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
      case "rating":
        result = [...result].sort((a, b) => {
          const ratingA = parseFloat(a.rating || "0");
          const ratingB = parseFloat(b.rating || "0");
          return ratingB - ratingA;
        });
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, wishlistProducts]);

  // Listen for localStorage changes to update wishlist in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-filter products when localStorage changes
      const stored = localStorage.getItem("favoriteProducts");
      const favoriteIds = stored ? JSON.parse(stored) : [];
      const wishlistItems = products.filter((product) => favoriteIds.includes(product.id));
      setWishlistProducts(wishlistItems);

      // Update categories based on new wishlist
      const uniqueCategories = Array.from(
        new Set(wishlistItems.map((product) => product.category || "uncategorized")),
      );
      setCategories(["all", ...uniqueCategories]);
    };

    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (when localStorage changes in same tab)
    window.addEventListener("wishlistUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlistUpdated", handleStorageChange);
    };
  }, [products]);

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
      // If total pages is less than max to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at start or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (!getRandomImage) return null;

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
                WISHLIST
              </div>
              <h2 className="text-3xl font-bold relative before:content-[''] before:absolute before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-yellow-600">
                My Wishlist
              </h2>
            </div>

            {/* Sort dropdown and filter toggle */}
            {wishlistProducts.length > 0 && (
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
                    <option value="rating">Top Rated</option>
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
            )}
          </div>

          {/* Filter section */}
          {isFilterOpen && wishlistProducts.length > 0 && (
            <div className="mb-8 p-6 bg-white rounded-md shadow-sm border border-gray-100 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category filter */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === category}
                          onChange={() => handleFilterChange("category", category)}
                          className="form-radio text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
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
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                        className="form-input rounded-md border-gray-200 w-full text-sm focus:border-yellow-600 focus:ring focus:ring-yellow-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Other filters */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Other Filters</h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showNew}
                      onChange={(e) => handleFilterChange("showNew", e.target.checked)}
                      className="form-checkbox text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm">New arrivals only</span>
                  </label>
                </div>
              </div>

              {/* Clear filters button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    setFilters({
                      category: "all",
                      minPrice: 0,
                      maxPrice: 1000,
                      showNew: false,
                      sort: "newest",
                    })
                  }
                  className="text-sm text-gray-600 hover:text-yellow-600 transition-colors focus:outline-none"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Product count and results */}
          {wishlistProducts.length > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {Math.min(filteredProducts.length, startIndex + 1)}-
                {Math.min(filteredProducts.length, startIndex + productsPerPage)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>
          )}

          {/* Products grid or empty state */}
          {wishlistProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">
                Start adding products to your wishlist by clicking the heart icon on products you
                love!
              </p>
              <a
                href="/"
                className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Continue Shopping
              </a>
            </div>
          ) : currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={formatPrice(product.price)} // Format price for display
                  rating={product.rating || "0"}
                  isNew={product.isNew || false}
                  image={product.image || getRandomImage(500, 600)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products match your filters.</p>
              <button
                onClick={() =>
                  setFilters({
                    category: "all",
                    minPrice: 0,
                    maxPrice: 1000,
                    showNew: false,
                    sort: "newest",
                  })
                }
                className="mt-4 text-yellow-600 underline hover:text-yellow-700 transition-colors focus:outline-none"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
