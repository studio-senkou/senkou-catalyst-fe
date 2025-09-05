import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiAuth } from "@/api/api-auth";

// Updated interface to match the transformed product data
export interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  rating: string;
  isNew: boolean;
  image: string;
}

export default function ProductCard({ id, name, price, rating, isNew, image }: ProductCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const merchantID = apiAuth.getCurrentMerchantId() || "";

  useEffect(() => {
    // Check if localStorage is available (for browser compatibility)
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = localStorage.getItem("favoriteProducts");
        const favorites = stored ? JSON.parse(stored) : [];
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error("Error reading favorites from localStorage:", error);
        setIsFavorite(false);
      }
    }
  }, [id]);

  const handleProductClick = () => {
    // Navigate to product detail page
    navigate(`/merchant/${merchantID}/details/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if localStorage is available
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return;
    }

    try {
      const stored = localStorage.getItem("favoriteProducts");
      const currentFavorites = stored ? JSON.parse(stored) : [];

      let updatedFavorites;
      if (isFavorite) {
        // Remove from favorites
        updatedFavorites = currentFavorites.filter((favId: string) => favId !== id);
        console.log(`Removed from favorites: Product ID ${id}`);
      } else {
        // Add to favorites
        updatedFavorites = [...currentFavorites, id];
        console.log(`Added to favorites: Product ID ${id}`);
      }

      localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites in localStorage:", error);
    }
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://picsum.photos/seed/${id}/500/600`;
  };

  // Format rating display
  const formatRating = (rating: string): string => {
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "0.0" : numRating.toFixed(1);
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
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <Star size={12} className="sm:hidden text-yellow-500 fill-yellow-500" />
            <Star size={14} className="hidden sm:block text-yellow-500 fill-yellow-500" />
            <span>{formatRating(rating)}</span>
          </div>
        </div>

        {/* For mobile: stacked layout with favorite button below price */}
        <div className="sm:hidden mt-2">
          <div className="font-bold text-sm text-yellow-600 mb-2">{price}</div>
          <button
            onClick={handleFavoriteClick}
            className={`w-full text-xs font-semibold px-2 py-1.5 rounded-lg border flex items-center justify-center transition-all duration-300 hover:shadow-md ${
              isFavorite
                ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={14} className={`mr-1 ${isFavorite ? "fill-white" : ""}`} />
            <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
          </button>
        </div>

        {/* For tablet/desktop: side-by-side layout */}
        <div className="hidden sm:flex justify-between items-center mt-3">
          <div className="font-bold text-base text-yellow-600" title={`Price: ${price}`}>
            {price}
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`text-sm font-semibold px-3 py-1 rounded-lg border flex items-center transition-all duration-300 hover:shadow-md ${
              isFavorite
                ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} className={`mr-1 ${isFavorite ? "fill-white" : ""}`} />
            <span>{isFavorite ? "Remove" : "Favorite"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
