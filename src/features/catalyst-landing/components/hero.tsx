import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Check,
  Zap,
  ArrowRight,
  Play,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Affiliate Products", "Digital Store", "Online Catalog", "Sales Hub"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
        <div className="text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight pt-16">
              Linktree, but for{" "}
              <span className="relative">
                <motion.span
                  className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {words[currentWord]}
                </motion.span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Ubah daftar link afiliasi menjadi{" "}
              <span className="font-semibold text-purple-600">katalog visual</span> seperti toko
              online. Profesional. Visual.{" "}
              <span className="font-semibold text-blue-600">Siap jual</span>.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Buat Toko Afiliasi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 rounded-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Lihat Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20 transform rotate-1"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: ShoppingBag,
                      title: "Produk Unggulan",
                      desc: "Tampilkan produk terbaik Anda",
                      gradient: "from-purple-500 to-purple-600",
                      bgGradient: "from-purple-50 to-purple-100",
                      svg: (
                        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
                          <defs>
                            <linearGradient
                              id="purple-gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.6" />
                            </linearGradient>
                            <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
                            </linearGradient>
                          </defs>

                          {/* Shopping bags */}
                          <rect
                            x="60"
                            y="70"
                            width="30"
                            height="35"
                            rx="3"
                            fill="url(#purple-gradient)"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.7;0.9;0.7"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <rect
                            x="110"
                            y="80"
                            width="25"
                            height="30"
                            rx="3"
                            fill="url(#purple-gradient)"
                            opacity="0.6"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.6;0.8;0.6"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <rect
                            x="40"
                            y="110"
                            width="20"
                            height="25"
                            rx="2"
                            fill="url(#purple-gradient)"
                            opacity="0.5"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.5;0.7;0.5"
                              dur="2.2s"
                              repeatCount="indefinite"
                            />
                          </rect>

                          {/* Bag handles */}
                          <path
                            d="M65,70 Q67,65 69,70"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.7"
                          />
                          <path
                            d="M80,70 Q82,65 84,70"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.7"
                          />
                          <path
                            d="M115,80 Q117,75 119,80"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.6"
                          />
                          <path
                            d="M125,80 Q127,75 129,80"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.6"
                          />

                          {/* Stars for premium/featured products */}
                          <polygon
                            points="50,45 52,50 58,50 53,54 55,60 50,56 45,60 47,54 42,50 48,50"
                            fill="url(#star-gradient)"
                            opacity="0.8"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.8;1;0.8"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              values="0 50 50;360 50 50"
                              dur="8s"
                              repeatCount="indefinite"
                            />
                          </polygon>
                          <polygon
                            points="160,50 161,53 165,53 162,55 163,59 160,57 157,59 158,55 155,53 159,53"
                            fill="url(#star-gradient)"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.7;0.9;0.7"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              values="0 160 55;360 160 55"
                              dur="6s"
                              repeatCount="indefinite"
                            />
                          </polygon>
                          <polygon
                            points="140,140 141,142 144,142 142,144 143,147 140,145 137,147 138,144 136,142 139,142"
                            fill="url(#star-gradient)"
                            opacity="0.6"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.6;0.8;0.6"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              values="0 140 143;360 140 143"
                              dur="10s"
                              repeatCount="indefinite"
                            />
                          </polygon>

                          {/* Price tags */}
                          <rect
                            x="100"
                            y="45"
                            width="18"
                            height="12"
                            rx="2"
                            fill="#DC2626"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.7;0.9;0.7"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <rect
                            x="150"
                            y="100"
                            width="15"
                            height="10"
                            rx="2"
                            fill="#DC2626"
                            opacity="0.6"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.6;0.8;0.6"
                              dur="2.8s"
                              repeatCount="indefinite"
                            />
                          </rect>

                          {/* Floating particles */}
                          <circle cx="70" cy="40" r="3" fill="#8B5CF6" opacity="0.6">
                            <animate
                              attributeName="cy"
                              values="40;35;40"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.6;0.8;0.6"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="120" cy="55" r="2" fill="#A855F7" opacity="0.5">
                            <animate
                              attributeName="cy"
                              values="55;50;55"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.5;0.7;0.5"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="170" cy="80" r="2.5" fill="#8B5CF6" opacity="0.4">
                            <animate
                              attributeName="cy"
                              values="80;75;80"
                              dur="3.5s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.4;0.6;0.4"
                              dur="3.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      ),
                    },
                    {
                      icon: Smartphone,
                      title: "Responsif Mobile",
                      desc: "Sempurna di semua perangkat",
                      gradient: "from-blue-500 to-blue-600",
                      bgGradient: "from-blue-50 to-blue-100",
                      svg: (
                        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
                          <defs>
                            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.7" />
                            </linearGradient>
                          </defs>
                          <rect
                            x="60"
                            y="40"
                            width="80"
                            height="120"
                            rx="10"
                            fill="url(#blue-gradient)"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.7;0.9;0.7"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <rect
                            x="70"
                            y="50"
                            width="60"
                            height="80"
                            rx="5"
                            fill="url(#blue-gradient)"
                            opacity="0.5"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.5;0.8;0.5"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <circle cx="100" cy="145" r="8" fill="#1D4ED8" opacity="0.8">
                            <animate
                              attributeName="r"
                              values="8;12;8"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <path d="M40,100 L160,100" stroke="#2563EB" strokeWidth="4" opacity="0.6">
                            <animate
                              attributeName="stroke-dasharray"
                              values="0,120;60,60;120,0"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </path>
                        </svg>
                      ),
                    },
                    {
                      icon: TrendingUp,
                      title: "Analytics Pro",
                      desc: "Lacak performa afiliasi Anda",
                      gradient: "from-green-500 to-green-600",
                      bgGradient: "from-green-50 to-green-100",
                      svg: (
                        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
                          <defs>
                            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                            </linearGradient>
                          </defs>
                          <polygon
                            points="40,140 80,100 120,120 160,60"
                            fill="url(#green-gradient)"
                            opacity="0.7"
                          >
                            <animate
                              attributeName="opacity"
                              values="0.7;0.9;0.7"
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </polygon>
                          <polyline
                            points="40,140 80,100 120,120 160,60"
                            stroke="#059669"
                            strokeWidth="4"
                            fill="none"
                            opacity="0.8"
                          >
                            <animate
                              attributeName="stroke-dasharray"
                              values="0,300;150,150;300,0"
                              dur="4s"
                              repeatCount="indefinite"
                            />
                          </polyline>
                          <circle cx="40" cy="140" r="6" fill="#047857" opacity="0.9">
                            <animate
                              attributeName="r"
                              values="6;9;6"
                              dur="1.8s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="80" cy="100" r="6" fill="#047857" opacity="0.9">
                            <animate
                              attributeName="r"
                              values="6;9;6"
                              dur="2.2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="120" cy="120" r="6" fill="#047857" opacity="0.9">
                            <animate
                              attributeName="r"
                              values="6;9;6"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx="160" cy="60" r="6" fill="#047857" opacity="0.9">
                            <animate
                              attributeName="r"
                              values="6;9;6"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      ),
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="group cursor-pointer"
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div
                        className={`bg-gradient-to-br ${item.bgGradient} rounded-2xl p-6 h-full border border-white/50 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="relative">
                          <div
                            className={`w-full h-48 bg-gradient-to-br ${item.bgGradient} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

                            {/* SVG Background Animation */}
                            <div className="absolute inset-0 opacity-80">{item.svg}</div>

                            <item.icon
                              className={`h-20 w-20 text-transparent bg-gradient-to-br ${item.gradient} bg-clip-text relative z-10`}
                            />
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 rounded-xl`}
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.1, 0.2, 0.1],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          </div>
                          <h3 className="font-bold text-xl mb-3 text-gray-800">{item.title}</h3>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-8 w-8 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
