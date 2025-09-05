import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Navbar from "./components/sections/navbar";
import Footer from "./components/sections/footer";
import Announcement from "./components/sections/announcement";
import { apiProduct, type Product } from "../store-admin/products/api/api-product";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load product data from API
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiProduct.getProductById(id);
        setProduct(response.data.product);
        setActiveImageIndex(0);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Reset states when product ID changes
  useEffect(() => {
    setQuantity(1);
    setIsFavorite(false);
    setActiveImageIndex(0);
  }, [id]);

  const handlePrevImage = () => {
    if (product && product.photos.length > 1) {
      setActiveImageIndex((prev) => (prev === 0 ? product.photos.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product && product.photos.length > 1) {
      setActiveImageIndex((prev) => (prev === product.photos.length - 1 ? 0 : prev + 1));
    }
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleBackToStore = () => {
    navigate("/store");
  };

  const handleBackToCollections = () => {
    navigate("/collections");
  };

  // Format price to Indonesian Rupiah
  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // Get full image URL (assuming you have a base URL for images)
  const getImageUrl = (imagePath: string) => {
    // Adjust this base URL according to your API setup
    const baseImageUrl = `${import.meta.env.VITE_API_URL}/files/`;
    return `${baseImageUrl}${imagePath}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Announcement />
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Announcement />
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Produk Tidak Ditemukan</h2>
            <p className="text-gray-600">{error}</p>
            <div className="flex space-x-4">
              <button
                onClick={handleBackToStore}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Kembali ke Store
              </button>
              <button
                onClick={handleBackToCollections}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Lihat Collections
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Announcement />
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <button onClick={handleBackToStore} className="hover:text-yellow-600 transition-colors">
            Store
          </button>
          <span>/</span>
          <button
            onClick={handleBackToCollections}
            className="hover:text-yellow-600 transition-colors"
          >
            Collections
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 pb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
              {product.photos && product.photos.length > 0 ? (
                <img
                  src={getImageUrl(product.photos[activeImageIndex])}
                  alt={`${product.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {/* Navigation Arrows - Only show if more than 1 image */}
              {product.photos && product.photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
              >
                <Heart
                  size={20}
                  className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"}
                />
              </button>

              {/* Image Indicators - Only show if more than 1 image */}
              {product.photos && product.photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {product.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails - Only show if more than 1 image */}
            {product.photos && product.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.photos.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:border-yellow-600 ${
                      index === activeImageIndex ? "border-yellow-600" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <span className="text-sm text-yellow-600 font-semibold uppercase tracking-wider">
                Produk
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">{product.title}</h1>
            </div>

            {/* Rating - Static for now since API doesn't provide rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">4.0 (0 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Jumlah</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm font-medium text-green-600">Tersedia</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-colors"
                onClick={() => {
                  console.log("Add to cart:", {
                    productId: product.id,
                    quantity,
                  });
                }}
              >
                <ShoppingCart size={20} className="mr-2" />
                Tambah ke Keranjang
              </button>
              <button
                className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                onClick={() => {
                  // Open affiliate URL in new tab
                  window.open(product.affiliate_url, "_blank");
                }}
              >
                Beli Sekarang
              </button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Detail Produk</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span className="text-gray-600">Product ID: {product.id}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span className="text-gray-600">Merchant ID: {product.merchant_id}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span className="text-gray-600">Category ID: {product.category_id}</span>
                </li>
                {product.created_at && (
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600">
                      Dibuat: {new Date(product.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </li>
                )}
                {product.updated_at && product.updated_at !== product.created_at && (
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600">
                      Diupdate: {new Date(product.updated_at).toLocaleDateString("id-ID")}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
