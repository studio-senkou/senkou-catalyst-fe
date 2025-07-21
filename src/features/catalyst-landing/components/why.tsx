import React, { useState } from "react";
import {
  Check,
  X,
  TrendingDown,
  TrendingUp,
  Eye,
  BarChart3,
  MousePointer,
  Zap,
} from "lucide-react";

interface ComparisonPoint {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  positive: boolean;
}

interface ComparisonCardProps {
  title: string;
  subtitle: string;
  isPositive: boolean;
  points: ComparisonPoint[];
  visual: React.ReactNode | null;
  index: number;
}

const WhyCatalyst: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const oldWayPoints: ComparisonPoint[] = [
    { icon: Eye, text: "Tidak menarik secara visual", positive: false },
    { icon: MousePointer, text: "Sulit membedakan produk", positive: false },
    { icon: TrendingDown, text: "Konversi rendah", positive: false },
    { icon: BarChart3, text: "Tidak ada analytics", positive: false },
  ];

  const newWayPoints: ComparisonPoint[] = [
    { icon: Eye, text: "Tampilan visual menarik", positive: true },
    { icon: MousePointer, text: "Mudah browse produk", positive: true },
    { icon: TrendingUp, text: "Konversi 3x lebih tinggi", positive: true },
    { icon: BarChart3, text: "Analytics lengkap", positive: true },
  ];

  // Floating particles effect
  const FloatingParticles: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            background:
              i % 2 === 0
                ? "linear-gradient(135deg, #8B5CF6, #3B82F6)"
                : "linear-gradient(135deg, #EF4444, #F97316)",
            opacity: 0.1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );

  const OldWayVisual: React.FC<{ isHovered: boolean }> = ({ isHovered }) => (
    <div
      className={`space-y-3 transition-all duration-1000 ease-out ${isHovered ? "scale-[1.03]" : ""}`}
    >
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 to-orange-50/30"></div>
        <div className="relative space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-gray-600 font-mono">bit.ly/produk1</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-gray-600 font-mono">bit.ly/produk2</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-gray-600 font-mono">bit.ly/produk3</span>
          </div>
        </div>
      </div>

      {/* Animated confusion lines */}
      <div className="relative h-12">
        <svg viewBox="0 0 200 48" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="confusion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M20 24 Q60 10 100 24 Q140 38 180 24"
            stroke="url(#confusion-gradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.3;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M30 30 Q70 16 110 30 Q150 44 190 30"
            stroke="url(#confusion-gradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          >
            <animate
              attributeName="opacity"
              values="0.4;0.2;0.4"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );

  const NewWayVisual: React.FC<{ isHovered: boolean }> = ({ isHovered }) => (
    <div
      className={`space-y-4 transition-all duration-1000 ease-out ${isHovered ? "scale-[1.03]" : ""}`}
    >
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-blue-100/20"></div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-white/60 shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-500 ease-out">
              <div className="w-full h-8 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 rounded mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-300/50 to-blue-300/50 animate-pulse"></div>
              </div>
              <p className="text-xs font-medium text-gray-700">Produk A</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                <span className="text-xs text-green-600">Terjual 120</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-white/60 shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-500 ease-out">
              <div className="w-full h-8 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 rounded mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/50 to-teal-300/50 animate-pulse"></div>
              </div>
              <p className="text-xs font-medium text-gray-700">Produk B</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                <span className="text-xs text-green-600">Terjual 89</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success metrics animation */}
      <div className="relative h-8">
        <div className="absolute left-0 top-0 flex items-center space-x-2 animate-pulse">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">+300% konversi</span>
        </div>
        <div className="absolute right-0 top-0 flex items-center space-x-2 animate-pulse">
          <BarChart3 className="h-4 w-4 text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">Real-time data</span>
        </div>
      </div>
    </div>
  );

  const ComparisonCard: React.FC<ComparisonCardProps> = ({
    title,
    subtitle,
    isPositive,
    points,
    visual,
    index,
  }) => {
    const isHovered = hoveredCard === index;
    const isActive = activeCard === index;

    return (
      <div
        className="relative h-full group cursor-pointer"
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => setActiveCard(index)}
      >
        {/* Glow effect - improved with smoother transition */}
        <div
          className={`absolute inset-0 rounded-3xl transition-all duration-1200 ease-out ${
            isHovered
              ? isPositive
                ? "bg-gradient-to-br from-purple-50 to-blue-50 opacity-70 scale-[1.04]"
                : "bg-gradient-to-br from-red-50 to-orange-50 opacity-70 scale-[1.04]"
              : "bg-gradient-to-br from-gray-50/50 to-white/50 opacity-0 scale-100"
          }`}
        />

        {/* Card background - improved with smoother scaling */}
        <div
          className={`relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 h-full transition-all duration-1000 ease-out ${
            isHovered
              ? "shadow-2xl -translate-y-3 scale-[1.05]"
              : "shadow-lg translate-y-0 scale-100"
          } ${
            isPositive
              ? "border-2 border-purple-200/50 hover:border-purple-300/80"
              : "border border-gray-200/50 hover:border-red-200/80"
          }`}
        >
          {/* Header with improved icon animation */}
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-1000 ease-out ${
                isPositive
                  ? "bg-gradient-to-br from-purple-500 to-blue-500"
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              } ${isHovered ? "scale-[1.15] rotate-3 shadow-2xl" : "scale-100 rotate-0 shadow-lg"}`}
            >
              {isPositive ? (
                <Check className="h-10 w-10 text-white" />
              ) : (
                <X className="h-10 w-10 text-white" />
              )}
            </div>

            {/* Animated rings around icon with smoother animation */}
            {isHovered && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20">
                {[...Array(3)].map((_, ringIndex) => (
                  <div
                    key={ringIndex}
                    className="absolute inset-0 rounded-2xl border-2 opacity-20 animate-ping"
                    style={{
                      animationDelay: `${ringIndex * 0.3}s`,
                      animationDuration: "2s",
                      borderColor: isPositive ? "#8B5CF6" : "#EF4444",
                    }}
                  />
                ))}
              </div>
            )}

            <h3 className="text-3xl font-bold mb-2 text-gray-900 transition-all duration-700 ease-out">
              {title}
            </h3>
            <p
              className={`text-lg transition-all duration-700 ease-out ${isPositive ? "text-purple-600" : "text-gray-600"}`}
            >
              {subtitle}
            </p>
          </div>

          {/* Visual representation with hover effect */}
          <div className="mb-8">
            {isPositive ? (
              <NewWayVisual isHovered={isHovered} />
            ) : (
              <OldWayVisual isHovered={isHovered} />
            )}
          </div>

          {/* Comparison points with staggered animation - smoother transitions */}
          <div className="space-y-4">
            {points.map((point, pointIndex) => (
              <div
                key={pointIndex}
                className={`flex items-center space-x-3 transition-all duration-800 ease-out ${
                  isHovered ? "translate-x-2" : "translate-x-0"
                }`}
                style={{ transitionDelay: `${pointIndex * 0.1}s` }}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-800 ease-out ${
                    point.positive
                      ? "bg-gradient-to-r from-purple-100 to-blue-100"
                      : "bg-gradient-to-r from-red-100 to-orange-100"
                  } ${isHovered ? "scale-[1.08]" : "scale-100"}`}
                >
                  <point.icon
                    className={`h-4 w-4 transition-colors duration-500 ${point.positive ? "text-purple-600" : "text-red-500"}`}
                  />
                </div>
                <span
                  className={`text-sm font-medium transition-all duration-600 ease-out ${
                    point.positive ? "text-gray-800" : "text-gray-600"
                  } ${isHovered ? "text-gray-900 font-semibold" : ""}`}
                >
                  {point.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(236,72,153,0.02),transparent_50%)]"></div>
      </div>

      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Kenapa{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Catalyst
            </span>
            ?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bandingkan cara lama dengan cara baru dalam{" "}
            <span className="font-semibold text-purple-600">mengelola link afiliasi</span>
          </p>
        </div>

        {/* Enhanced Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <ComparisonCard
            title="Cara Lama"
            subtitle="Daftar link biasa"
            isPositive={false}
            points={oldWayPoints}
            visual={null}
            index={0}
          />

          <ComparisonCard
            title="Dengan Catalyst"
            subtitle="Toko online profesional"
            isPositive={true}
            points={newWayPoints}
            visual={null}
            index={1}
          />
        </div>

        {/* Enhanced Call to Action with smoother button animation */}
        <div className="text-center">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-out group hover:scale-[1.08] hover:-translate-y-1">
            <Zap className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-500 ease-out" />
            <span className="font-semibold text-lg">Upgrade ke Catalyst Sekarang</span>
          </button>
          <p className="mt-4 text-gray-500 text-sm">
            Mulai gratis • Tidak perlu kartu kredit • Setup 5 menit
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyCatalyst;
