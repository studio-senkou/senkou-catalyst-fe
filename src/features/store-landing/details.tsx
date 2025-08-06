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
import { productDetails } from "./constants/product-details";

// Type definitions
interface ProductDetail {
  id: number;
  name: string;
  category: string;
  brand?: string;
  price: string;
  originalPrice?: string | null;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  description: string;
  images: string[];
  details: string[];
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  discount?: number;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); // Ambil ID dari URL parameter
  const navigate = useNavigate();

  // Convert ID dari string ke number, default ke 1 jika tidak ada
  const productId = id ? parseInt(id, 10) : 1;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load product data berdasarkan ID dari URL parameter
  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      setError(null);

      // Validasi ID
      if (isNaN(productId)) {
        setError("ID produk tidak valid");
        setProduct(null);
        setLoading(false);
        return;
      }

      // Cari produk berdasarkan ID
      const foundProduct = productDetails.find((p) => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors?.[0] || "");
        setSelectedSize(foundProduct.sizes?.[0] || "");
        setActiveImageIndex(0);
      } else {
        setError(`Produk dengan ID ${productId} tidak ditemukan`);
        setProduct(null);
      }

      setLoading(false);
    };

    loadProduct();
  }, [productId]); // Re-run effect ketika productId berubah

  // Reset states when productId changes
  useEffect(() => {
    setQuantity(1);
    setIsFavorite(false);
    setActiveImageIndex(0);
  }, [productId]);

  const handlePrevImage = () => {
    if (product) {
      setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product) {
      setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
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
      {/* Breadcrumb */}
      <Announcement />

      {/*Navbar */}
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
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 pb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
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
              <img
                src={product.images[activeImageIndex]}
                alt={`${product.name} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Navigation Arrows */}
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

              {/* Discount Badge */}
              {product.discount && product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-yellow-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}

              {/* New Badge */}
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  NEW
                </div>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:border-yellow-600 ${
                    index === activeImageIndex ? "border-yellow-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <span className="text-sm text-yellow-600 font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              {product.brand && <div className="text-sm text-gray-500 mt-1">{product.brand}</div>}
              <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              {product.isNew && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  NEW
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Warna</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedColor === color
                          ? "border-yellow-600 bg-yellow-50 text-yellow-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Ukuran</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-yellow-600 bg-yellow-50 text-yellow-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                <span
                  className={`text-sm font-medium ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock ? "Tersedia" : "Stok Habis"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                disabled={!product.inStock}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => {
                  console.log("Add to cart:", {
                    productId: product.id,
                    quantity,
                    selectedColor,
                    selectedSize,
                  });
                }}
              >
                <ShoppingCart size={20} className="mr-2" />
                Tambah ke Keranjang
              </button>
              <button
                disabled={!product.inStock}
                className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => {
                  console.log("Buy now:", {
                    productId: product.id,
                    quantity,
                    selectedColor,
                    selectedSize,
                  });
                }}
              >
                Beli Sekarang
              </button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Detail Produk</h3>
              <ul className="space-y-2">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-600 mr-2 mt-1">•</span>
                    <span className="text-gray-600">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
