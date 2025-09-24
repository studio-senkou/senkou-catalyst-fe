import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiAuth } from "@/api/api-auth";

// Updated interface to match the transformed product data
export interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  isNew: boolean;
  image: string;
}

export default function ProductCard({ id, name, price, isNew, image }: ProductCardProps) {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const merchantUsername = apiAuth.getCurrentMerchantUsername() || "";

  useEffect(() => {
    // Check if localStorage is available (for browser compatibility)
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = localStorage.getItem("wishlistProducts");
        const wishlist = stored ? JSON.parse(stored) : [];
        setIsInWishlist(wishlist.includes(id));
      } catch (error) {
        console.error("Error reading wishlist from localStorage:", error);
        setIsInWishlist(false);
      }
    }
  }, [id]);

  const handleProductClick = () => {
    // Navigate to product detail page
    navigate(`/${merchantUsername}/details/${id}`);
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://picsum.photos/seed/${id}/500/600`;
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative h-40 sm:h-56 md:h-72 overflow-hidden mb-2 sm:mb-4 bg-gray-100">
        <img
          src={image}
          alt={name}
          onError={handleImageError}
          className="object-cover w-full h-full group-hover:scale-110 transition duration-500"
          loading="lazy"
        />

        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform -skew-x-45 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out blur-2xl"></div>
        </div>

        {isNew && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-yellow-600 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full transform origin-left hover:scale-105 transition-transform duration-300 z-10">
            NEW
          </div>
        )}
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex justify-between items-center mb-1">
          <h3
            className="text-sm sm:text-base font-semibold relative inline-block truncate max-w-[75%]"
            title={name}
          >
            {name}
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-600 group-hover:w-full transition-all duration-300"></span>
          </h3>
        </div>

        {/* For mobile: price only */}
        <div className="sm:hidden mt-2">
          <div className="font-bold text-sm text-yellow-600">{price}</div>
        </div>

        {/* For tablet/desktop: price only */}
        <div className="hidden sm:flex justify-between items-center mt-3">
          <div className="font-bold text-base text-yellow-600" title={`Price: ${price}`}>
            {price}
          </div>
        </div>
      </div>
    </div>
  );
}
