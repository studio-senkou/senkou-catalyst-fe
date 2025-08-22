import { Routes, Route } from "react-router-dom";
import CatalystLanding from "../features/catalyst-landing/catalyst-landing";
import Home from "../features/store-landing/home";
import Collections from "../features/store-landing/collections";
import ProductDetails from "../features/store-landing/details";
import Whislist from "../features/store-landing/whislist";
import About from "../features/store-landing/about";
import Login from "../features/login/login";
import Register from "../features/register/Register";
import Dashboard from "../features/store-admin/dashboard/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalystLanding />} />
      <Route path="/store/:id" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/details/:id" element={<ProductDetails />} />
      <Route path="/store/dashboard/" element={<Dashboard />} />
      <Route path="/details" element={<ProductDetails />} />
      <Route path="/wishlist" element={<Whislist />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
