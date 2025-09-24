import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
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
  ArrowLeft,
  Shield,
  TrendingUp,
  UserPlus,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Loader2,
  Phone,
  User,
  Mail,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { apiUser } from "@/api/api-user";
import { useOAuthHandler } from "@/hooks/useOAuthHandler";

// Zod Schemas for each step
const usernameSchema = z.object({
  merchant_username: z
    .string()
    .min(1, "Username merchant wajib diisi")
    .min(3, "Username merchant harus minimal 3 karakter")
    .max(100, "Username merchant tidak boleh lebih dari 100 karakter")
    .trim(),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama harus minimal 3 karakter")
      .max(100, "Nama tidak boleh lebih dari 100 karakter")
      .trim(),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid").trim(),
    phone: z
      .string()
      .min(1, "Nomor telepon wajib diisi")
      .refine((phone) => phone.replace(/\s/g, "").length >= 10, {
        message: "Nomor telepon harus minimal 10 digit",
      })
      .refine((phone) => phone.replace(/\s/g, "").length <= 20, {
        message: "Nomor telepon tidak boleh lebih dari 20 digit",
      })
      .trim(),
    merchant_username: z
      .string()
      .min(1, "Username merchant wajib diisi")
      .min(3, "Username merchant harus minimal 3 karakter")
      .max(100, "Username merchant tidak boleh lebih dari 100 karakter")
      .trim(),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password harus minimal 8 karakter")
      .max(100, "Password tidak boleh lebih dari 100 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterRequest {
  name: string;
  merchant_username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

const STEPS = [
  { id: 1, title: "Username", description: "Pilih username untuk toko Anda" },
  { id: 2, title: "Data Diri", description: "Lengkapi informasi pribadi" },
  { id: 3, title: "Verifikasi", description: "Konfirmasi email Anda" },
];

export default function StepperRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // OAuth handler
  const { 
    isProcessing: isOAuthProcessing, 
    error: oauthError, 
    success: oauthSuccess, 
    handleGoogleAuth 
  } = useOAuthHandler();

  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    merchant_username: "",
    password: "",
    password_confirmation: "",
  });

  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

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

  // Handle OAuth results
  useEffect(() => {
    if (oauthError) {
      setError(oauthError);
    }
    if (oauthSuccess) {
      setSuccess(oauthSuccess);
    }
  }, [oauthError, oauthSuccess]);

  // Check password match whenever either password changes
  useEffect(() => {
    if (formData.password_confirmation.length > 0) {
      setPasswordsMatch(formData.password === formData.password_confirmation);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.password_confirmation]);

  // Handle input changes
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear general error when user makes changes
    if (error) {
      setError("");
    }

    // Real-time validation for the changed field
    if (currentStep === 1) {
      validateUsernameField(field, value);
    } else if (currentStep === 2) {
      validateField(field, value);
    }
  };

  // Real-time username validation
  const validateUsernameField = (field: keyof RegisterFormData, value: string) => {
    if (field !== "merchant_username") return;

    try {
      usernameSchema.shape.merchant_username.parse(value);
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues.find((e) => e.path.includes(field));
        if (fieldError) {
          setFieldErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
    }
  };

  // Real-time field validation using Zod
  const validateField = (field: keyof RegisterFormData, value: string) => {
    try {
      const dataToValidate = { ...formData, [field]: value };

      // Validate the specific field
      registerSchema.shape[field].parse(value);

      // For password confirmation, also check if passwords match
      if (field === "password_confirmation" || field === "password") {
        registerSchema.parse(dataToValidate);
      }

      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues.find((e) => e.path.includes(field));
        if (fieldError) {
          setFieldErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
    }
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      try {
        usernameSchema.parse({ merchant_username: formData.merchant_username });
        setFieldErrors((prev) => ({ ...prev, merchant_username: "" }));
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
          setFieldErrors(errors);
        }
        return false;
      }
    } else if (currentStep === 2) {
      try {
        registerSchema.parse(formData);
        setFieldErrors({});
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
          setFieldErrors(errors);
        }
        return false;
      }
    }
    return true;
  };

  // Handle next step
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === 2) {
      // Submit registration
      await handleRegister();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle Google OAuth Register
  const handleGoogleRegister = () => {
    setError("");
    setSuccess("");
    handleGoogleAuth();
  };

  // Handle registration
  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const registrationData: RegisterRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        merchant_username: formData.merchant_username.trim(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const response = await apiUser.register(registrationData);
      setRegisteredEmail(formData.email);
      setSuccess(
        response.message || "Registrasi berhasil! Silakan cek email Anda untuk mengaktifkan akun.",
      );
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (!registeredEmail) return;

    setIsLoading(true);
    try {
      // Assuming there's an API endpoint to resend verification email
      // await apiUser.resendVerificationEmail(registeredEmail);
      setSuccess("Email verifikasi telah dikirim ulang!");
    } catch (err: any) {
      setError("Gagal mengirim ulang email verifikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      try {
        usernameSchema.parse({ merchant_username: formData.merchant_username });
        return !isLoading && !isOAuthProcessing;
      } catch {
        return false;
      }
    } else if (currentStep === 2) {
      try {
        registerSchema.parse(formData);
        return !isLoading && !isOAuthProcessing;
      } catch {
        return false;
      }
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pilih Username Toko
              </h2>
              <p className="text-gray-600">
                Username ini akan menjadi identitas unik toko afiliasi Anda
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchant_username" className="text-gray-700 font-medium">
                  Username Merchant *
                </Label>
                <Input
                  id="merchant_username"
                  type="text"
                  placeholder="username-toko-anda"
                  value={formData.merchant_username}
                  onChange={(e) => handleInputChange("merchant_username", e.target.value)}
                  disabled={isLoading || isOAuthProcessing}
                  className={cn(
                    "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400",
                    fieldErrors.merchant_username &&
                      "border-red-400 focus:border-red-400 focus:ring-red-400",
                  )}
                />
                {fieldErrors.merchant_username && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>{fieldErrors.merchant_username}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Username akan digunakan sebagai URL toko: catalyst.com/username-toko-anda
                </p>
              </div>

              {/* Google Register Button */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">Atau daftar cepat dengan</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={handleGoogleRegister}
                    disabled={isLoading || isOAuthProcessing}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {isLoading || isOAuthProcessing ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Mengarahkan ke Google...</span>
                        </span>
                      ) : (
                        <span className="font-medium">Daftar dengan Google</span>
                      )}
                    </div>
                  </Button>
                  <p className="text-xs text-gray-500">
                    Dengan Google, Anda akan langsung login setelah registrasi
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Lengkapi Data Diri
              </h2>
              <p className="text-gray-600">Isi informasi pribadi untuk menyelesaikan pendaftaran</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Nama Lengkap *
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pl-12",
                      fieldErrors.name && "border-red-400 focus:border-red-400 focus:ring-red-400",
                    )}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@contoh.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pl-12",
                      fieldErrors.email && "border-red-400 focus:border-red-400 focus:ring-red-400",
                    )}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Nomor Telepon *
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx atau +62xxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pl-12",
                      fieldErrors.phone && "border-red-400 focus:border-red-400 focus:ring-red-400",
                    )}
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {fieldErrors.phone && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password *
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
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                <Label htmlFor="password_confirmation" className="text-gray-700 font-medium">
                  Konfirmasi Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password Anda"
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pr-20",
                      (passwordsMatch === false || fieldErrors.password_confirmation) &&
                        "border-red-400 focus:border-red-400 focus:ring-red-400",
                      passwordsMatch === true &&
                        !fieldErrors.password_confirmation &&
                        "border-green-400 focus:border-green-400 focus:ring-green-400",
                    )}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {passwordsMatch !== null && !fieldErrors.password_confirmation && (
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
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Cek Email Anda
              </h2>
              <p className="text-gray-600">
                Kami telah mengirim link aktivasi ke email Anda. Silakan cek inbox atau folder spam.
              </p>
              {registeredEmail && (
                <p className="text-sm text-gray-500">
                  Email dikirim ke: <strong>{registeredEmail}</strong>
                </p>
              )}
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Link aktivasi berlaku selama 24 jam. Pastikan untuk mengaktifkan akun Anda sebelum
                waktu habis.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">Tidak menerima email?</p>
              <Button
                onClick={handleResendEmail}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim ulang...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Kirim Ulang Email
                  </>
                )}
              </Button>
              <Button
                onClick={() => (window.location.href = "/login")}
                variant="ghost"
                className="w-full"
              >
                Kembali ke Login
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
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
          {/* Left Side - Stepper Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <CardContent className="relative p-8">
                {/* Stepper Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                            currentStep >= step.id
                              ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                        </div>
                        {index < STEPS.length - 1 && (
                          <div
                            className={cn(
                              "w-12 h-0.5 mx-2 transition-all",
                              currentStep > step.id
                                ? "bg-gradient-to-r from-green-500 to-blue-500"
                                : "bg-gray-200",
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-medium text-gray-900">{STEPS[currentStep - 1]?.title}</h3>
                    <p className="text-sm text-gray-500">{STEPS[currentStep - 1]?.description}</p>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
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
                    className="mb-6"
                  >
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Step Content */}
                <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                  <motion.div
                    className="flex justify-between mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isLoading}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                      </Button>
                    ) : (
                      <div />
                    )}

                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!isCurrentStepValid()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentStep === 2 ? "Mendaftar..." : "Memproses..."}
                        </>
                      ) : (
                        <>
                          {currentStep === 2 ? (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Buat Akun
                            </>
                          ) : (
                            <>
                              Lanjutkan
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Login Link */}
                {currentStep < 3 && (
                  <motion.div
                    className="text-center text-sm text-gray-600 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    Sudah punya akun?{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Masuk di sini
                    </a>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Privacy */}
            {currentStep < 3 && (
              <motion.div
                className="mt-6 text-center text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
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
            )}
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
            <div className="flex justify-center lg:justify-start space-x-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    currentFeature === index
                      ? "bg-white/80 backdrop-blur-sm shadow-lg"
                      : "opacity-60"
                  }`}
                >
                  <div className={`p-2 rounded-full bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

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

            {/* Progress Indicator for Current Step */}
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/20">
                <div className="flex items-center space-x-1">
                  {STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentStep >= step.id
                          ? "bg-gradient-to-r from-green-500 to-blue-500"
                          : "bg-gray-300",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-600 ml-2">
                  Langkah {currentStep} dari {STEPS.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
