import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Menu, X, Search, User, Heart, ShoppingBag } from "lucide-react";
import { apiAuth } from "@/api/api-auth";

export default function Navbar() {
  const searchInputRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { merchantUsername } = useParams();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSearchPopupOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    e.preventDefault();
    setSearchPopupOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setUserDropdownOpen(false);

    try {
      await apiAuth.logout();
      // Redirect to home page or login page after successful logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, tokens are cleared, so redirect anyway
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getMerchantDashboardUrl = () => {
    const merchantUsername = apiAuth.getCurrentMerchantUsername();
    return merchantUsername ? `/admin/${merchantUsername}/dashboard` : "/login";
  };

  // Check if user button should be visible
  const shouldShowUserButton = () => {
    const cookieMerchantUsername = apiAuth.getCurrentMerchantUsername();

    // If no merchant ID in cookies, don't show user button
    if (!cookieMerchantUsername) {
      return false;
    }
    return true;
  };

  // Function to generate URLs with merchant username
  const generateUrl = (path: string) => {
    // If we're on a merchant page, use merchant username in URL
    if (merchantUsername) {
      return path === "/" ? `/${merchantUsername}` : `/${merchantUsername}/${path}`;
    }
    // Otherwise use regular URLs
    return path === "/" ? "/" : `/${path}`;
  };

  const navItems = [
    { label: "Home", url: "/" },
    { label: "Collections", url: "collections" },
    { label: "About", url: "about" },
  ];

  const userDropdownItems = [
    {
      label: "Dashboard",
      url: getMerchantDashboardUrl(),
      isAction: false,
    },
    { label: "Logout", action: handleLogout, isAction: true },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? "shadow-md py-2" : "py-5"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href={generateUrl("/")} className="flex items-center gap-3">
            <div className="text-xl md:text-2xl font-black text-black uppercase tracking-widest relative">
              <span className="relative z-10">LEATHER STUDIO</span>
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-yellow-600"></span>
            </div>
          </a>

          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={generateUrl(item.url)}
                className="text-sm uppercase font-medium hover:text-yellow-600 transition group relative py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative" ref={searchInputRef}>
              <button
                className="p-2 hover:text-yellow-600 transition group relative"
                onClick={() => setSearchPopupOpen(!searchPopupOpen)}
              >
                <span className="absolute inset-0 rounded-full bg-gray-50 scale-0 transition-transform duration-200 group-hover:scale-100"></span>
                <Search className="relative" size={20} />
              </button>

              {searchPopupOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-4 w-72 animate-fadeIn">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow-600 text-sm"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSearchSubmit(e as any);
                          }
                        }}
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <button
                        className="absolute right-2 top-2 text-sm font-medium text-yellow-600 hover:text-yellow-700"
                        onClick={() => setSearchPopupOpen(false)}
                      >
                        Search
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Popular Searches:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Wallets", "Bags", "Belts", "Accessories"].map((term) => (
                          <button
                            key={term}
                            type="button"
                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs"
                            onClick={() => setSearchPopupOpen(false)}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 md:gap-4">
              {/* User dropdown - only show if conditions are met */}
              {shouldShowUserButton() && (
                <div
                  className="relative"
                  ref={userDropdownRef}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <button className="hover:text-yellow-600 transition relative p-2 group">
                    <span className="absolute inset-0 rounded-full bg-gray-50 scale-0 transition-transform duration-200 group-hover:scale-100"></span>
                    <User className="relative" size={20} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full pt-1">
                      <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2 min-w-[120px] animate-fadeIn">
                        {userDropdownItems.map((item, index) =>
                          item.isAction ? (
                            <button
                              key={index}
                              onClick={item.action}
                              disabled={isLoggingOut}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoggingOut ? "Logging out..." : item.label}
                            </button>
                          ) : (
                            <a
                              key={index}
                              href={item.url}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              {item.label}
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist */}
              <a
                href={generateUrl("wishlist")}
                className="hover:text-yellow-600 transition relative p-2 group"
              >
                <span className="absolute inset-0 rounded-full bg-gray-50 scale-0 transition-transform duration-200 group-hover:scale-100"></span>
                <span className="relative">
                  <Heart size={20} />
                </span>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center">
                  3
                </span>
              </a>
            </div>

            <button
              className="lg:hidden p-2 bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 mt-4 animate-fadeIn">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={generateUrl(item.url)}
                  className="text-sm uppercase font-medium hover:text-yellow-600 transition py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="py-2 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow-600 text-sm"
                />
                <Search className="absolute left-3 top-4 text-gray-400" size={18} />
              </div>

              <div className="sm:hidden flex justify-between py-2">
                {[
                  ...(shouldShowUserButton()
                    ? [{ icon: <User size={20} />, label: "Account", badge: null, url: "/account" }]
                    : []),
                  {
                    icon: <Heart size={20} />,
                    label: "Wishlist",
                    badge: 3,
                    url: generateUrl("wishlist"),
                  },
                  {
                    icon: <ShoppingBag size={20} />,
                    label: "Cart",
                    badge: 2,
                    url: generateUrl("cart"),
                  },
                ].map((item, index) => (
                  <a key={index} href={item.url} className="flex flex-col items-center gap-1">
                    <span className="relative">
                      {item.icon}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-xs">{item.label}</span>
                  </a>
                ))}
              </div>

              {/* Mobile logout button - only show if user button should be visible */}
              {shouldShowUserButton() && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-2 py-2 text-sm uppercase font-medium text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}
