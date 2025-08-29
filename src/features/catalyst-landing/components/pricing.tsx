import React, { useState } from "react";
import {
  Check,
  Star,
  Zap,
  Crown,
  Rocket,
  Sparkles,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period?: string;
  icon: LucideIcon;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  buttonStyle: string;
}

interface PlanVisualProps {
  plan: Plan;
  index: number;
  isHovered: boolean;
}

const Pricing: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number>(1); // Pro card active by default

  const plans: Plan[] = [
    {
      name: "Starter",
      price: "Gratis",
      icon: Sparkles,
      description: "Untuk yang baru memulai",
      features: ["Hingga 10 produk", "1 halaman toko", "Analytics dasar", "Branding Catalyst"],
      cta: "Mulai Gratis",
      popular: false,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      borderColor: "emerald-200",
      buttonStyle:
        "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white",
    },
    {
      name: "Pro",
      price: "Rp 49.000",
      period: "/bulan",
      icon: Rocket,
      description: "Untuk affiliate marketer serius",
      features: [
        "Unlimited produk",
        "Custom domain",
        "Analytics lengkap",
        "Tanpa branding",
        "Integrasi WhatsApp",
        "Template premium",
      ],
      cta: "Pilih Pro",
      popular: true,
      gradient: "from-purple-500 to-blue-500",
      bgGradient: "from-purple-50 to-blue-50",
      borderColor: "purple-300",
      buttonStyle:
        "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white",
    },
    {
      name: "Business",
      price: "Rp 99.000",
      period: "/bulan",
      icon: Crown,
      description: "Untuk tim dan agency",
      features: [
        "Semua fitur Pro",
        "Multi-store",
        "Team collaboration",
        "API access",
        "Priority support",
        "Custom integrations",
      ],
      cta: "Pilih Business",
      popular: false,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      borderColor: "orange-200",
      buttonStyle:
        "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white",
    },
  ];

  // Floating particles effect
  const FloatingParticles: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-pulse"
          style={{
            background:
              i % 3 === 0
                ? "linear-gradient(135deg, #8B5CF6, #3B82F6)"
                : i % 3 === 1
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : "linear-gradient(135deg, #F59E0B, #DC2626)",
            opacity: 0.4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  // Interactive visual for each plan
  const PlanVisual: React.FC<PlanVisualProps> = ({ plan, isHovered }) => {
    const IconComponent = plan.icon;

    return (
      <div className={`relative mb-8 transition-all duration-500 ${isHovered ? "scale-110" : ""}`}>
        <div
          className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg transition-all duration-300 ${isHovered ? "rotate-6 shadow-2xl" : ""}`}
        >
          <IconComponent className="h-12 w-12 text-white" />
        </div>

        {/* Animated rings */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24">
          {[...Array(3)].map((_, ringIndex) => (
            <div
              key={ringIndex}
              className={`absolute inset-0 rounded-3xl border-2 opacity-20 ${isHovered ? "animate-ping" : ""}`}
              style={{
                animationDelay: `${ringIndex * 0.2}s`,
                borderColor: plan.gradient.includes("purple")
                  ? "#8B5CF6"
                  : plan.gradient.includes("emerald")
                    ? "#10B981"
                    : "#F59E0B",
              }}
            />
          ))}
        </div>

        {/* Success metrics for popular plan */}
        {plan.popular && (
          <div className="absolute -top-2 -right-2">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              <Star className="h-3 w-3" />
              <span>Terpopuler</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_50%)]"></div>
      </div>

      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
            <Zap className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-semibold text-purple-600">Pricing Plans</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Pilih Paket yang{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Tepat
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mulai gratis, upgrade kapan saja. Semua paket include{" "}
            <span className="font-semibold text-purple-600">hosting dan SSL gratis</span>
          </p>

          {/* Value proposition icons */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">SSL Gratis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Hosting Included</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Enhanced Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isHovered = hoveredCard === index;
            const isActive = activeCard === index;

            return (
              <div
                key={index}
                className="relative h-full group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActiveCard(index)}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                    plan.popular || isHovered
                      ? `bg-gradient-to-br ${plan.bgGradient} opacity-20 scale-105`
                      : "bg-gradient-to-br from-gray-50/50 to-white/50 opacity-0"
                  }`}
                />

                {/* Main card */}
                <div
                  className={`relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 h-full transition-all duration-500 ${
                    isHovered ? "shadow-2xl -translate-y-4 scale-105" : ""
                  } ${plan.popular ? `border-2 border-purple-300` : "border border-gray-200/50"}`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`flex items-center space-x-2 bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 rounded-full shadow-lg`}
                      >
                        <Crown className="h-4 w-4" />
                        <span className="font-bold text-sm">Terpopuler</span>
                      </div>
                    </div>
                  )}

                  {/* Plan visual */}
                  <PlanVisual plan={plan} index={index} isHovered={isHovered} />

                  {/* Plan details */}
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-8">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && <span className="text-xl text-gray-600">{plan.period}</span>}
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform ${
                        plan.popular || isActive
                          ? `${plan.buttonStyle} hover:scale-105 shadow-lg hover:shadow-xl`
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-105"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>

                  {/* Features list */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className={`flex items-center transition-all duration-300 ${
                          isHovered ? "translate-x-2" : ""
                        }`}
                        style={{ transitionDelay: `${featureIndex * 0.1}s` }}
                      >
                        <div className={`p-2 rounded-xl mr-3 bg-gradient-to-r ${plan.bgGradient}`}>
                          <Check className={`h-4 w-4 text-gray-700`} />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
