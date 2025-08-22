import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  TrendingUp,
  UserPlus,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Loader2,
  Phone,
} from "lucide-react";
import { apiUser } from "@/api/api-user";

// Using global types - no need to redefine interfaces

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const features = [
    { icon: Sparkles, text: "Gratis Selamanya", color: "from-purple-500 to-purple-600" },
    { icon: Shield, text: "Setup 5 Menit", color: "from-blue-500 to-blue-600" },
    { icon: TrendingUp, text: "Boost Penjualan", color: "from-green-500 to-green-600" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check password match whenever either password changes
  useEffect(() => {
    if (formData.password_confirmation.length > 0) {
      setPasswordsMatch(formData.password === formData.password_confirmation);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.password_confirmation]);

  // Handle input changes
  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear general error when user makes changes
    if (error) {
      setError("");
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nama lengkap wajib diisi";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Nama harus minimal 2 karakter";
    }

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Nomor telepon wajib diisi";
    } else if (!/^[0-9+\-\s()]{8,}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Format nomor telepon tidak valid";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      errors.password = "Password harus minimal 8 karakter";
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "Konfirmasi password tidak cocok";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiUser.register(formData);

      setSuccess(response.message || "Registrasi berhasil! Selamat datang di platform kami.");

      // Optional: Redirect after successful registration
      setTimeout(() => {
        // You can redirect to login page or dashboard here
        window.location.href = "/login";
        console.log("Registration successful:", response.data);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.name.trim().length >= 2 &&
      formData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phone.trim().length >= 8 && // Validasi phone
      formData.password.length >= 8 &&
      formData.password_confirmation &&
      passwordsMatch === true &&
      !isLoading
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400 to-purple-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [-90, 0, -90],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 13,
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
          {/* Left Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <CardContent className="relative p-8">
                <form onSubmit={handleRegister}>
                  <div className="space-y-6">
                    <motion.div
                      className="text-center space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Mulai Sekarang
                      </h2>
                      <p className="text-gray-600">
                        Buat akun dan wujudkan toko afiliasi impian Anda
                      </p>
                    </motion.div>

                    {/* Success/Error Messages */}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="border-green-200 bg-green-50">
                          <Check className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">{success}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Nama Lengkap
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Nama Anda"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={isLoading}
                          className={cn(
                            "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400",
                            fieldErrors.name &&
                              "border-red-400 focus:border-red-400 focus:ring-red-400",
                          )}
                        />
                        {fieldErrors.name && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <X className="h-4 w-4" />
                            <span>{fieldErrors.name}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@contoh.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={isLoading}
                          className={cn(
                            "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400",
                            fieldErrors.email &&
                              "border-red-400 focus:border-red-400 focus:ring-red-400",
                          )}
                        />
                        {fieldErrors.email && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <X className="h-4 w-4" />
                            <span>{fieldErrors.email}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Nomor Telepon
                        </Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="08xxxxxxxxxx atau +62xxxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={isLoading}
                            className="h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pl-12"
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimal 8 karakter"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            disabled={isLoading}
                            className={cn(
                              "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pr-12",
                              fieldErrors.password &&
                                "border-red-400 focus:border-red-400 focus:ring-red-400",
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {fieldErrors.password && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <X className="h-4 w-4" />
                            <span>{fieldErrors.password}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password_confirmation"
                          className="text-gray-700 font-medium"
                        >
                          Konfirmasi Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Ulangi password Anda"
                            value={formData.password_confirmation}
                            onChange={(e) =>
                              handleInputChange("password_confirmation", e.target.value)
                            }
                            disabled={isLoading}
                            className={cn(
                              "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pr-20",
                              (passwordsMatch === false || fieldErrors.password_confirmation) &&
                                "border-red-400 focus:border-red-400 focus:ring-red-400",
                              passwordsMatch === true &&
                                "border-green-400 focus:border-green-400 focus:ring-green-400",
                            )}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            {/* Password match indicator */}
                            {passwordsMatch !== null && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                {passwordsMatch ? (
                                  <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                  <X className="h-5 w-5 text-red-500" />
                                )}
                              </motion.div>
                            )}
                            {/* Eye toggle button */}
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              disabled={isLoading}
                              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        {/* Password match message */}
                        {passwordsMatch !== null && !fieldErrors.password_confirmation && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "text-sm flex items-center space-x-1",
                              passwordsMatch ? "text-green-600" : "text-red-600",
                            )}
                          >
                            {passwordsMatch ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span>Password cocok!</span>
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4" />
                                <span>Password tidak cocok</span>
                              </>
                            )}
                          </motion.div>
                        )}
                        {fieldErrors.password_confirmation && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <X className="h-4 w-4" />
                            <span>{fieldErrors.password_confirmation}</span>
                          </p>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={!isFormValid()}
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Mendaftar...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-5 w-5" />
                              Buat Akun Gratis
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500">Atau daftar dengan</span>
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          type="button"
                          disabled={isLoading}
                          className="w-full h-12 bg-white/50 border-gray-200 hover:bg-white/80 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="mr-2 h-5 w-5"
                          >
                            <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="currentColor"
                            />
                          </svg>
                          Daftar dengan Google
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="text-center text-sm text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      Sudah punya akun?{" "}
                      <a
                        href="/login"
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                      >
                        Masuk di sini
                      </a>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <motion.div
              className="mt-6 text-center text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Dengan mendaftar, Anda menyetujui{" "}
              <a href="#" className="text-green-600 hover:underline">
                Syarat Layanan
              </a>{" "}
              dan{" "}
              <a href="#" className="text-green-600 hover:underline">
                Kebijakan Privasi
              </a>{" "}
              kami.
            </motion.div>
          </motion.div>

          {/* Right Side - Hero Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <motion.h1
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Wujudkan{" "}
                <span className="bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                  Toko Afiliasi
                </span>{" "}
                Impian Anda
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Bergabung dengan ribuan affiliate marketer yang sudah sukses menggunakan platform
                kami
              </motion.p>
            </div>

            {/* Animated Features */}
            <motion.div
              className="flex justify-center lg:justify-start space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    currentFeature === index
                      ? "bg-white/80 backdrop-blur-sm shadow-lg"
                      : "opacity-60"
                  }`}
                  animate={{
                    scale: currentFeature === index ? 1.05 : 1,
                    opacity: currentFeature === index ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`p-2 rounded-full bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Success Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {[
                { number: "10K+", label: "Pengguna Aktif" },
                { number: "50M+", label: "Komisi Generated" },
                { number: "99%", label: "Kepuasan User" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Floating SVG Animation */}
            <motion.div
              className="relative h-48 hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <defs>
                  <linearGradient id="register-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Success indicators */}
                <motion.circle
                  cx="80"
                  cy="60"
                  r="15"
                  fill="url(#register-gradient)"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.rect
                  x="200"
                  y="80"
                  width="50"
                  height="30"
                  rx="8"
                  fill="url(#register-gradient)"
                  animate={{ y: [80, 70, 80], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                <motion.polygon
                  points="320,100 340,70 360,100 340,130"
                  fill="url(#success-gradient)"
                  animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Floating particles */}
                <motion.circle cx="120" cy="40" r="4" fill="#10B981" opacity="0.7">
                  <animate
                    attributeName="cy"
                    values="40;30;40"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </motion.circle>
                <motion.circle cx="280" cy="50" r="3" fill="#8B5CF6" opacity="0.6">
                  <animate attributeName="cy" values="50;40;50" dur="3s" repeatCount="indefinite" />
                </motion.circle>
                <motion.circle cx="160" cy="140" r="5" fill="#3B82F6" opacity="0.5">
                  <animate
                    attributeName="cy"
                    values="140;130;140"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />
                </motion.circle>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
