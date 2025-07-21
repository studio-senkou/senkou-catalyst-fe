import { Heart, Star, PlusCircle } from "lucide-react";

export type ProductCardProps = Product;

export default function ProductCard({ id, name, price, rating, isNew, image }: ProductCardProps) {
  return (
    <div
      key={id}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative h-40 sm:h-56 md:h-72 overflow-hidden mb-2 sm:mb-4 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-110 transition duration-500"
        />
        <button
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-yellow-600 hover:text-white"
          aria-label="Add to favorites"
        >
          <Heart size={16} className="sm:hidden" />
          <Heart size={18} className="hidden sm:block" />
        </button>
        {isNew && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-yellow-600 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full transform origin-left hover:scale-105 transition-transform duration-300">
            NEW
          </div>
        )}
      </div>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm sm:text-base font-semibold relative inline-block truncate max-w-[75%]">
            {name}
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-600 group-hover:w-full transition-all duration-300"></span>
          </h3>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <Star size={12} className="sm:hidden text-yellow-500 fill-yellow-500" />
            <Star size={14} className="hidden sm:block text-yellow-500 fill-yellow-500" />
            <span>{rating}</span>
          </div>
        </div>

        {/* For mobile: stacked layout with button below price */}
        <div className="sm:hidden mt-2">
          <div className="font-bold text-sm text-yellow-600 mb-2">{price}</div>
          <button
            className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-black flex items-center justify-center transition-all duration-300 hover:shadow-md hover:bg-black hover:text-white"
            aria-label="Add to cart"
          >
            <span className="mr-1">Add to Cart</span>
            <PlusCircle size={14} />
          </button>
        </div>

        {/* For tablet/desktop: side-by-side layout */}
        <div className="hidden sm:flex justify-between items-center mt-3">
          <div className="font-bold text-base text-yellow-600">{price}</div>
          <button
            className="text-sm font-semibold px-3 py-1 rounded-lg border border-black flex items-center transition-all duration-300 hover:shadow-md hover:bg-black hover:text-white"
            aria-label="Add to cart"
          >
            <span className="mr-1">Add</span>
            <PlusCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
