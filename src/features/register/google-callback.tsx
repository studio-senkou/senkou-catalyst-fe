import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiOAuth } from "@/api/api-oauth";

export default function GoogleAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const result = await apiOAuth.handleGoogleAuthCallback();
      if (result.success) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        // Redirect ke login kalau gagal
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  );
}
