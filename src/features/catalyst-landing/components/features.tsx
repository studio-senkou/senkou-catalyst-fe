import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Smartphone, Share2, TrendingUp, Zap, Globe } from "lucide-react";

interface Feature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  size: "large" | "wide" | "tall" | "medium" | "small";
  svg: React.ReactNode;
}

interface BentoBoxProps {
  feature: Feature;
  index: number;
}

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      icon: ShoppingBag,
      title: "Toko Online dari Link Afiliasi",
      description:
        "Transformasi otomatis link afiliasi menjadi tampilan toko online yang profesional dan menarik.",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      size: "large",
      svg: (
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="purple-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="purple-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Shopping bag */}
          <path
            d="M70 80 L130 80 L125 140 L75 140 Z"
            fill="url(#purple-gradient-1)"
            stroke="#8B5CF6"
            strokeWidth="2"
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </path>

          {/* Bag handles */}
          <path
            d="M85 80 L85 70 Q85 65 90 65 L110 65 Q115 65 115 70 L115 80"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Product boxes inside bag */}
          <rect
            x="80"
            y="95"
            width="15"
            height="15"
            rx="2"
            fill="url(#purple-gradient-2)"
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
            x="100"
            y="95"
            width="15"
            height="15"
            rx="2"
            fill="url(#purple-gradient-2)"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.5;0.7;0.5"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="90"
            y="115"
            width="15"
            height="15"
            rx="2"
            fill="url(#purple-gradient-2)"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Floating link symbols */}
          <circle cx="60" cy="60" r="3" fill="#8B5CF6" opacity="0.5">
            <animate attributeName="cy" values="60;50;60" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="70" r="2" fill="#A855F7" opacity="0.6">
            <animate attributeName="cy" values="70;60;70" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      ),
    },
    {
      icon: Smartphone,
      title: "Desain Responsif",
      description: "Toko afiliasi Anda tampil sempurna di desktop, tablet, dan mobile.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      size: "medium",
      svg: (
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="blue-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Desktop */}
          <rect
            x="50"
            y="60"
            width="60"
            height="40"
            rx="4"
            fill="url(#blue-gradient-1)"
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="50" y="100" width="60" height="4" rx="2" fill="#3B82F6" opacity="0.6" />
          <rect x="85" y="104" width="10" height="8" rx="1" fill="#3B82F6" opacity="0.5" />

          {/* Tablet */}
          <rect
            x="120"
            y="70"
            width="30"
            height="40"
            rx="4"
            fill="url(#blue-gradient-1)"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Mobile */}
          <rect
            x="160"
            y="80"
            width="20"
            height="35"
            rx="4"
            fill="url(#blue-gradient-1)"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.8;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Content lines */}
          <line x1="55" y1="70" x2="90" y2="70" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
          <line x1="55" y1="75" x2="105" y2="75" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
          <line x1="55" y1="80" x2="80" y2="80" stroke="#2563EB" strokeWidth="2" opacity="0.4" />

          <line x1="125" y1="80" x2="140" y2="80" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
          <line x1="125" y1="85" x2="145" y2="85" stroke="#2563EB" strokeWidth="1" opacity="0.4" />

          <line x1="165" y1="90" x2="175" y2="90" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
          <line x1="165" y1="95" x2="175" y2="95" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
        </svg>
      ),
    },
    {
      icon: Globe,
      title: "Setup Instant",
      description: "Hanya butuh 5 menit untuk membuat toko afiliasi pertama Anda.",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      size: "small",
      svg: (
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="emerald-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Clock face */}
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="url(#emerald-gradient-1)"
            strokeWidth="3"
            opacity="0.8"
          >
            <animate attributeName="r" values="40;45;40" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Clock hands */}
          <line x1="100" y1="100" x2="100" y2="75" stroke="#10B981" strokeWidth="3" opacity="0.8">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 100 100;360 100 100"
              dur="6s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="100" y1="100" x2="120" y2="100" stroke="#059669" strokeWidth="2" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 100 100;360 100 100"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </line>

          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="#10B981" opacity="0.9" />

          {/* Speed indicators */}
          <circle cx="70" cy="70" r="2" fill="#10B981" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="70" r="2" fill="#10B981" opacity="0.5">
            <animate
              attributeName="opacity"
              values="0.5;0.9;0.5"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="130" cy="130" r="2" fill="#10B981" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* "5 min" text */}
          <text x="100" y="150" textAnchor="middle" fontSize="12" fill="#059669" opacity="0.8">
            5 min
          </text>
        </svg>
      ),
    },
    {
      icon: Share2,
      title: "Mudah Dibagikan",
      description:
        "Satu link untuk semua produk afiliasi. Bagikan di bio Instagram, WhatsApp, atau media sosial lainnya.",
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100",
      size: "wide",
      svg: (
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="pink-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#DB2777" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Central hub */}
          <circle cx="100" cy="100" r="15" fill="url(#pink-gradient-1)" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Social media nodes */}
          <circle cx="60" cy="60" r="8" fill="#EC4899" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="140" cy="60" r="8" fill="#DB2777" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.6;0.8;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="140" cy="140" r="8" fill="#EC4899" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="140" r="8" fill="#DB2777" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Connection lines */}
          <line x1="100" y1="100" x2="60" y2="60" stroke="#EC4899" strokeWidth="2" opacity="0.5">
            <animate
              attributeName="opacity"
              values="0.5;0.8;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="100" y1="100" x2="140" y2="60" stroke="#DB2777" strokeWidth="2" opacity="0.4">
            <animate
              attributeName="opacity"
              values="0.4;0.7;0.4"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="100" y1="100" x2="140" y2="140" stroke="#EC4899" strokeWidth="2" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="100" y1="100" x2="60" y2="140" stroke="#DB2777" strokeWidth="2" opacity="0.5">
            <animate
              attributeName="opacity"
              values="0.5;0.8;0.5"
              dur="3.2s"
              repeatCount="indefinite"
            />
          </line>

          {/* Pulse effect */}
          <circle
            cx="100"
            cy="100"
            r="20"
            fill="none"
            stroke="#EC4899"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate attributeName="r" values="20;35;20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      ),
    },
  ];

  const BentoBox: React.FC<BentoBoxProps> = ({ feature, index }) => {
    const getSizeClass = (): string => {
      switch (feature.size) {
        case "large":
          return "col-span-2 row-span-2";
        case "wide":
          return "col-span-2 row-span-1";
        case "tall":
          return "col-span-1 row-span-2";
        case "medium":
          return "col-span-1 row-span-1";
        case "small":
          return "col-span-1 row-span-1";
        default:
          return "col-span-1 row-span-1";
      }
    };

    const getContentLayout = (): React.ReactNode => {
      if (feature.size === "large") {
        return (
          <div className="flex flex-col lg:flex-row items-center h-full">
            <div className="flex-1 lg:pr-8">
              <div className="mb-6">
                <feature.icon
                  className={`h-16 w-16 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
              <h3 className="font-bold text-2xl lg:text-3xl mb-4 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
            <div className="flex-1 w-full lg:w-auto mt-6 lg:mt-0">
              <div
                className={`w-full h-48 lg:h-64 bg-gradient-to-br ${feature.bgGradient} rounded-2xl relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 opacity-80">{feature.svg}</div>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-2xl`}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </div>
        );
      } else if (feature.size === "wide") {
        return (
          <div className="flex items-center h-full">
            <div className="flex-1 pr-6">
              <div className="mb-4">
                <feature.icon
                  className={`h-12 w-12 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-pink-700 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
            <div className="w-24 h-24 flex-shrink-0">
              <div
                className={`w-full h-full bg-gradient-to-br ${feature.bgGradient} rounded-2xl relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 opacity-80">{feature.svg}</div>
              </div>
            </div>
          </div>
        );
      } else if (feature.size === "tall") {
        return (
          <div className="flex flex-col h-full">
            <div
              className={`w-full h-32 bg-gradient-to-br ${feature.bgGradient} rounded-2xl mb-6 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
              <div className="absolute inset-0 opacity-80">{feature.svg}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <feature.icon
                  className={`h-12 w-12 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-4 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col h-full">
            <div
              className={`w-full h-24 bg-gradient-to-br ${feature.bgGradient} rounded-2xl mb-4 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
              <div className="absolute inset-0 opacity-80">{feature.svg}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <feature.icon
                  className={`h-8 w-8 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-3 text-gray-800 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          </div>
        );
      }
    };

    return (
      <motion.div
        className={`${getSizeClass()} group cursor-pointer`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div className="relative h-full">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          ></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 h-full border border-white/40 group-hover:shadow-xl transition-all duration-500 hover:bg-white/90">
            {getContentLayout()}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,119,198,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(120,200,255,0.03),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 1000,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Fitur Unggulan{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Catalyst
            </span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Semua yang Anda butuhkan untuk mengubah link afiliasi menjadi{" "}
            <span className="font-semibold text-purple-600">toko online</span> yang menguntungkan
          </motion.p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
          {features.map((feature, index) => (
            <BentoBox key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold text-lg">Mulai Sekarang Gratis</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
