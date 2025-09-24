import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail, Shield, ArrowRight, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { apiUser } from "@/api/api-user";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔑 untuk cegah double-call di StrictMode
  const didRun = useRef(false);

  useEffect(() => {
    if (token && !didRun.current) {
      didRun.current = true;
      handleActivation(token);
    } else if (!token) {
      setIsLoading(false);
      setSuccess("");
      setError("");
    }
  }, [token]);

  const handleActivation = async (activationToken: string) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      await apiUser.activateAccount(activationToken);

      setIsVerified(true);
      setSuccess("Akun Anda berhasil diaktifkan! Anda akan diarahkan ke halaman login...");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Token aktivasi tidak valid atau telah kedaluwarsa.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (token) {
      handleActivation(token);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-purple-400 rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-8 items-center"
        >
          {/* Left Side - Hero Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <motion.h1
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Verifikasi{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Email
                </span>{" "}
                Anda
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Langkah terakhir untuk mengaktifkan akun toko afiliasi Anda
              </motion.p>
            </div>

            {/* Security Features */}
            <motion.div
              className="flex justify-center lg:justify-start space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.div
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Keamanan Terjamin</span>
              </motion.div>
            </motion.div>

            {/* Floating Verification Animation */}
            <motion.div
              className="relative h-64 hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <linearGradient id="verification-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Email Icon */}
                <motion.rect
                  x="160"
                  y="100"
                  width="80"
                  height="60"
                  rx="8"
                  fill="url(#verification-gradient)"
                  animate={{ y: [0, -10, 0], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Checkmark */}
                <motion.circle
                  cx="280"
                  cy="80"
                  r="25"
                  fill="url(#verification-gradient)"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                
                {/* Security Shield */}
                <motion.polygon
                  points="120,180 140,160 140,200 120,220 100,200 100,160"
                  fill="url(#verification-gradient)"
                  animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Right Side - Verification Status */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <CardContent className="relative p-8">
                <div className="text-center space-y-6">
                  {/* Loading State */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-6"
                    >
                      <motion.div
                        className="relative mx-auto w-24 h-24 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-20"></div>
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                      </motion.div>
                      
                      <div className="space-y-3">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Memverifikasi Email
                        </h2>
                        <p className="text-gray-600">Sedang memproses verifikasi akun Anda...</p>
                        
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Success State */}
                  {!isLoading && isVerified && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="space-y-6"
                    >
                      <motion.div
                        className="relative mx-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6, type: "spring", bounce: 0.5 }}
                      >
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-500 opacity-20 blur-xl"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-12 w-12 text-white" />
                        </div>
                      </motion.div>

                      <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-green-600">Email Berhasil Diverifikasi!</h2>
                        <p className="text-gray-600">{success}</p>
                        
                        <motion.div
                          className="pt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1, duration: 0.6 }}
                        >
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </motion.div>
                            <span>Mengarahkan ke halaman login...</span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Error State */}
                  {!isLoading && error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="space-y-6"
                    >
                      <motion.div
                        className="relative mx-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6, type: "spring", bounce: 0.5 }}
                      >
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-red-400 to-red-500 opacity-20 blur-xl"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
                          <XCircle className="h-12 w-12 text-white" />
                        </div>
                      </motion.div>

                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-red-600">Verifikasi Gagal</h2>
                        <Alert className="border-red-200 bg-red-50 text-left">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-800">
                            {error}
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                          {token && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                onClick={handleRetry} 
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Coba Lagi
                              </Button>
                            </motion.div>
                          )}
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              onClick={handleGoToRegister} 
                              variant="outline" 
                              className="w-full h-12 bg-white/50 border-gray-200 hover:bg-white/80 transition-all duration-300"
                            >
                              <UserPlus className="mr-2 h-5 w-5" />
                              Daftar Ulang
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Info State (No Token) */}
                  {!token && !isVerified && !error && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="space-y-6"
                    >
                      <motion.div
                        className="relative mx-auto"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 blur-xl"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Mail className="h-12 w-12 text-white" />
                        </div>
                      </motion.div>

                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Cek Email Anda
                        </h2>
                        
                        <Alert className="border-blue-200 bg-blue-50 text-left">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            Silakan cek email Anda dan klik link aktivasi yang kami kirim untuk mengaktifkan akun.
                          </AlertDescription>
                        </Alert>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            onClick={handleGoToLogin} 
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Ke Halaman Login
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="mt-6 text-center text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Tidak menerima email?{" "}
              <a href="/register" className="text-purple-600 hover:underline">
                Kirim ulang verifikasi
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}