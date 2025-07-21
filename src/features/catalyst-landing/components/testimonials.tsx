import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Star,
  Quote,
  TrendingUp,
  Heart,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  income: string;
  followers: string;
  gradient: string;
  bgGradient: string;
  accent: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  displayIndex: number;
  isCenter: boolean;
}

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Wijaya",
      role: "Fashion Influencer",
      avatar: "S",
      content:
        "Sejak pakai Catalyst, income afiliasi saya naik 300%! Followers jadi lebih tertarik karena tampilan toko yang profesional.",
      rating: 5,
      income: "+300%",
      followers: "45K",
      gradient: "from-pink-500 to-purple-600",
      bgGradient: "from-pink-50 to-purple-50",
      accent: "pink",
    },
    {
      name: "Ahmad Rizki",
      role: "Tech Reviewer",
      avatar: "A",
      content:
        "Setup-nya cuma 5 menit, tapi hasilnya luar biasa. Sekarang semua gadget review saya ada di satu tempat yang rapi.",
      rating: 5,
      income: "+250%",
      followers: "32K",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      accent: "blue",
    },
    {
      name: "Maya Sari",
      role: "Beauty Blogger",
      avatar: "M",
      content:
        "Catalyst mengubah cara saya berbagi produk skincare. Sekarang audience bisa langsung lihat foto dan review dalam satu halaman.",
      rating: 5,
      income: "+180%",
      followers: "28K",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      accent: "emerald",
    },
    {
      name: "Andi Pratama",
      role: "Food Vlogger",
      avatar: "A",
      content:
        "Dulu susah track performa link afiliasi. Sekarang dengan Catalyst, semua data real-time dan mudah dianalisis.",
      rating: 5,
      income: "+220%",
      followers: "52K",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      accent: "orange",
    },
    {
      name: "Lisa Maharani",
      role: "Lifestyle Blogger",
      avatar: "L",
      content:
        "Catalyst bikin saya terlihat lebih profesional di mata brand. Sekarang banyak yang approach untuk kolaborasi.",
      rating: 5,
      income: "+350%",
      followers: "67K",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      accent: "violet",
    },
    {
      name: "Budi Santoso",
      role: "Fitness Influencer",
      avatar: "B",
      content:
        "Hasil yang incredible! Conversion rate supplement yang saya promote naik drastis sejak pakai Catalyst.",
      rating: 5,
      income: "+280%",
      followers: "41K",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      accent: "green",
    },
  ];

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push({ ...testimonials[index], displayIndex: i });
    }
    return result;
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Fixed animation variants with proper typing
  const cardVariants: Variants = {
    left: {
      x: -200,
      scale: 0.85,
      opacity: 0.5,
      zIndex: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      zIndex: 20,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    right: {
      x: 200,
      scale: 0.85,
      opacity: 0.5,
      zIndex: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const getPositionKey = (index: number): "left" | "center" | "right" => {
    if (index === 0) return "left";
    if (index === 1) return "center";
    return "right";
  };

  const TestimonialCard: React.FC<TestimonialCardProps> = ({
    testimonial,
    displayIndex,
    isCenter,
  }) => {
    const getAccentColor = (accent: string) => {
      const colors = {
        pink: "text-pink-200",
        blue: "text-blue-200",
        emerald: "text-emerald-200",
        orange: "text-orange-200",
        violet: "text-violet-200",
        green: "text-green-200",
      };
      return colors[accent as keyof typeof colors] || "text-gray-200";
    };

    const positionKey = getPositionKey(displayIndex);

    return (
      <motion.div
        key={testimonial.name}
        variants={cardVariants}
        animate={positionKey}
        className="relative"
        whileHover={isCenter ? { scale: 1.05, y: -5 } : {}}
      >
        <div className="relative group">
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
              isCenter ? `bg-gradient-to-br ${testimonial.bgGradient}` : ""
            }`}
            animate={{
              opacity: isCenter ? 0.2 : 0,
            }}
            whileHover={isCenter ? { opacity: 0.3 } : {}}
          />

          {/* Main card */}
          <motion.div
            className={`relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 h-full transition-all duration-500 ${
              isCenter
                ? "border-2 border-purple-200/50 group-hover:border-purple-300/80"
                : "border border-gray-200/50"
            }`}
            whileHover={
              isCenter
                ? {
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                  }
                : {}
            }
          >
            {/* Header */}
            <div className="flex items-center mb-4">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold mr-3 bg-gradient-to-br ${testimonial.gradient}`}
                whileHover={isCenter ? { scale: 1.1, rotate: 6 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {testimonial.avatar}
              </motion.div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                <p className="text-xs text-gray-600 mb-1">{testimonial.role}</p>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{testimonial.followers} followers</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <div className="relative mb-4">
              <Quote
                className={`absolute -top-1 -left-1 h-6 w-6 ${getAccentColor(testimonial.accent)}`}
              />
              <motion.p
                className="text-gray-700 italic pl-5 leading-relaxed text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {testimonial.content}
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              className="flex justify-between items-center pt-3 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs font-semibold text-green-600">
                  Income {testimonial.income}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Heart className="h-3 w-3 text-red-500" />
                </motion.div>
                <span className="text-xs text-gray-600">Verified</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(236,72,153,0.02),transparent_50%)]"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background:
                i % 3 === 0
                  ? "linear-gradient(135deg, #8B5CF6, #3B82F6)"
                  : i % 3 === 1
                    ? "linear-gradient(135deg, #EC4899, #8B5CF6)"
                    : "linear-gradient(135deg, #10B981, #06B6D4)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Award className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-sm font-semibold text-purple-700">Testimonial</span>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Apa Kata{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Pengguna
            </span>{" "}
            Catalyst?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Ribuan affiliate marketer sudah merasakan{" "}
            <span className="font-semibold text-purple-600">peningkatan income</span> dengan
            Catalyst
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <motion.button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-200/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          <motion.button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-200/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </motion.button>

          {/* Cards container */}
          <div className="relative h-[380px] overflow-hidden">
            <div className="flex justify-center items-center h-full">
              <div className="relative w-full max-w-xs h-full">
                {getVisibleTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    className="absolute w-full top-1/2 -translate-y-1/2"
                    variants={cardVariants}
                    animate={getPositionKey(index)}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      displayIndex={index}
                      isCenter={index === 1}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: index === currentIndex ? 1.25 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
