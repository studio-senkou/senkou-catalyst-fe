import { Routes, Route } from "react-router-dom";
import Home from "../features/Home";
import Login from "../features/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
