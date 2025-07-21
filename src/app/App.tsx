import { Routes, Route } from "react-router-dom";
import CatalystLanding from "../features/catalyst-landing/catalyst-landing";
import Home from "../features/store-landing/home";
import Collections from "../features/store-landing/collections";
import About from "../features/store-landing/about";
import Login from "../features/login/Login";
import Register from "../features/register/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalystLanding />} />
      <Route path="/store" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
