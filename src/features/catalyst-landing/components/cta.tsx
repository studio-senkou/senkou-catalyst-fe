import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRight,
  Play,
  Sparkles,
  Rocket,
  Crown,
  MousePointer,
} from "lucide-react";

const CTA: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Floating elements animation
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated shapes - smaller */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background:
              i % 2 === 0
                ? "linear-gradient(135deg, #FFD700, #FFA500)"
                : "linear-gradient(135deg, #FF6B6B, #FF8E53)",
            left: `${10 + i * 12}%`,
            top: `${20 + i * 8}%`,
          }}
          animate={{
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Glowing orbs - smaller */}
      <motion.div
        className="absolute w-20 h-20 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6, transparent)",
          right: "10%",
          top: "20%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );

  // Statistics counter animation
  const StatCounter = ({ value, label }: { value: string; label: string }) => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-purple-200 text-xs">{label}</div>
    </motion.div>
  );

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5A45FF] via-[#4A37E0] to-[#3B2BCC]" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20" />

        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Grid pattern - smaller */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <FloatingElements />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Content */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Badge - smaller */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Crown className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-white font-semibold text-sm">
              Join 10,000+ affiliate marketers
            </span>
          </motion.div>

          {/* Main headline - smaller */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Siap{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Meledakkan
            </span>
            <br />
            Konversi Anda?
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Bergabunglah dengan ribuan affiliate marketer yang telah{" "}
            <span className="text-yellow-300 font-semibold">
              meningkatkan penjualan hingga 300%
            </span>{" "}
            dengan platform kami
          </motion.p>

          {/* Statistics row - smaller */}
          <motion.div
            className="flex justify-center items-center space-x-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <StatCounter value="10K+" label="Active Users" />
            <StatCounter value="300%" label="Avg. Conversion" />
            <StatCounter value="24/7" label="Support" />
            <StatCounter value="5 Min" label="Quick Setup" />
          </motion.div>
        </motion.div>

        {/* CTA Buttons Section */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Primary CTA Button - smaller */}
            <motion.button
              className="group relative inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl shadow-xl font-bold text-base overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px -12px rgba(255, 193, 7, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={isHovered ? { x: "200%" } : { x: "-100%" }}
                transition={{ duration: 0.8 }}
              />

              <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              <span>Mulai Trial Gratis Sekarang</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Secondary CTA Button - smaller */}
            <motion.button
              className="inline-flex items-center px-8 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 font-semibold text-base hover:bg-white/20 transition-all duration-300"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="mr-2 h-5 w-5" />
              <span>Lihat Demo Live</span>
            </motion.button>
          </div>

          {/* Bottom disclaimer - smaller */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-purple-200 text-xs">Setup instan</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MousePointer className="h-3.5 w-3.5 text-green-400" />
                <span className="text-purple-200 text-xs">Tanpa kartu kredit</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Users className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-purple-200 text-xs">Support 24/7</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
