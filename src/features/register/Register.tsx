import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  UserPlus,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

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
                <form>
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
                          required
                          className="h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@contoh.com"
                          required
                          className="h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                        />
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
                            required
                            className="h-12 bg-white/50 border-gray-200 focus:border-green-400 focus:ring-green-400 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
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
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: handle register logic
                          }}
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          Buat Akun Gratis
                          <ArrowRight className="ml-2 h-5 w-5" />
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
                          className="w-full h-12 bg-white/50 border-gray-200 hover:bg-white/80 transition-all duration-300"
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
