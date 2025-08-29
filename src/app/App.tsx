import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { apiAuth } from "@/api/api-auth";
import CatalystLanding from "../features/catalyst-landing/catalyst-landing";
import Home from "../features/store-landing/home";
import Collections from "../features/store-landing/collections";
import ProductDetails from "../features/store-landing/details";
import Whislist from "../features/store-landing/whislist";
import About from "../features/store-landing/about";
import Login from "../features/login/Login";
import Register from "../features/register/Register";
import Dashboard from "../features/store-admin/dashboard/dashboard";
import Products from "../features/store-admin/products/products";
import Categories from "../features/store-admin/categories/categories";
import Profile from "../features/store-admin/profile/profile";
import NotFound from "../features/not-found";

// Simplified Protected Route Component for Admin Routes - Single Condition Check
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const isAuthenticated = apiAuth.isAuthenticated();
  const currentMerchantId = apiAuth.getCurrentMerchantId();

  // Single comprehensive condition check
  if (!isAuthenticated || !merchantId || currentMerchantId !== merchantId) {
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

      {/* Protected Admin Routes */}
      <Route
        path="/admin/:merchantId/dashboard"
        element={
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/:merchantId/products"
        element={
          <ProtectedAdminRoute>
            <Products />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/:merchantId/categories"
        element={
          <ProtectedAdminRoute>
            <Categories />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/:merchantId/profile"
        element={
          <ProtectedAdminRoute>
            <Profile />
          </ProtectedAdminRoute>
        }
      />

      {/* Not Found route for unknown paths - MUST BE LAST */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
