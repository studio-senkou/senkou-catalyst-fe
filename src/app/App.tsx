import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiAuth } from "@/api/api-auth";
import CatalystLanding from "../features/catalyst-landing/catalyst-landing";
import Home from "../features/store-landing/home";
import Collections from "../features/store-landing/collections";
import ProductDetails from "../features/store-landing/details";
import Whislist from "../features/store-landing/whislist";
import About from "../features/store-landing/about";
import Login from "../features/login/login";
import Register from "../features/register/Register";
import Dashboard from "../features/store-admin/dashboard/dashboard";
import Products from "../features/store-admin/products/products";
import Categories from "../features/store-admin/categories/categories";
import Profile from "../features/store-admin/profile/profile";
import NotFound from "../features/not-found";

// Hook for handling authentication with token refresh
const useAuthWithRefresh = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    setIsChecking(true);
    
    // First check if already authenticated
    if (apiAuth.isAuthenticated()) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return true;
    }

    // If not authenticated, try to refresh token
    try {
      await apiAuth.refreshToken();
      setIsAuthenticated(true);
      setIsChecking(false);
      return true;
    } catch (error) {
      // If refresh fails, user needs to login
      setIsAuthenticated(false);
      setIsChecking(false);
      return false;
    }
  };

  return { isChecking, isAuthenticated, checkAuth };
};

// Loading component
const AuthLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

// Protected Route Component for Merchant Admin Routes (with merchantId)
const ProtectedMerchantAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const { isChecking, isAuthenticated, checkAuth } = useAuthWithRefresh();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      if (!hasChecked) {
        await checkAuth();
        setHasChecked(true);
      }
    };
    performAuthCheck();
  }, [checkAuth, hasChecked]);

  // Show loading while checking authentication
  if (isChecking || !hasChecked) {
    return <AuthLoadingComponent />;
  }

  // Check authentication after refresh attempt
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentMerchantId = apiAuth.getCurrentMerchantId();
  const userData = apiAuth.getCurrentUserData();

  if (userData?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!merchantId || currentMerchantId !== merchantId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected Route Component for Super Admin Routes (without merchantId)
const ProtectedSuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isChecking, isAuthenticated, checkAuth } = useAuthWithRefresh();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      if (!hasChecked) {
        await checkAuth();
        setHasChecked(true);
      }
    };
    performAuthCheck();
  }, [checkAuth, hasChecked]);

  // Show loading while checking authentication
  if (isChecking || !hasChecked) {
    return <AuthLoadingComponent />;
  }

  // Check authentication after refresh attempt
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userData = apiAuth.getCurrentUserData();

  // Check if user is admin
  if (userData?.role !== "admin") {
    // If user is not admin but has merchantId, redirect to their merchant dashboard
    const merchantId = apiAuth.getCurrentMerchantId();
    if (merchantId) {
      return <Navigate to={`/admin/${merchantId}/dashboard`} replace />;
    }
    // Otherwise redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CatalystLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Merchant Routes */}
      <Route path="/merchant/:id/home" element={<Home />} />
      <Route path="/merchant/:id/collections" element={<Collections />} />
      <Route path="/merchant/:id/details/:id" element={<ProductDetails />} />
      <Route path="/merchant/:id/wishlist" element={<Whislist />} />
      <Route path="/merchant/:id/about" element={<About />} />

      {/* Protected Super Admin Routes (for role: admin) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedSuperAdminRoute>
            <Dashboard />
          </ProtectedSuperAdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedSuperAdminRoute>
            <Products />
          </ProtectedSuperAdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedSuperAdminRoute>
            <Categories />
          </ProtectedSuperAdminRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedSuperAdminRoute>
            <Profile />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* Protected Merchant Admin Routes (for non-admin users with merchantId) */}
      <Route
        path="/admin/:merchantId/dashboard"
        element={
          <ProtectedMerchantAdminRoute>
            <Dashboard />
          </ProtectedMerchantAdminRoute>
        }
      />
      <Route
        path="/admin/:merchantId/products"
        element={
          <ProtectedMerchantAdminRoute>
            <Products />
          </ProtectedMerchantAdminRoute>
        }
      />
      <Route
        path="/admin/:merchantId/categories"
        element={
          <ProtectedMerchantAdminRoute>
            <Categories />
          </ProtectedMerchantAdminRoute>
        }
      />
      <Route
        path="/admin/:merchantId/profile"
        element={
          <ProtectedMerchantAdminRoute>
            <Profile />
          </ProtectedMerchantAdminRoute>
        }
      />

      {/* Not Found route for unknown paths - MUST BE LAST */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}