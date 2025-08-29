import { motion } from "framer-motion";
import {
  ChevronUp,
  Heart,
  Zap,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:text-blue-500" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-500" },
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-sky-500" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-600" },
    { icon: Youtube, label: "YouTube", href: "#", color: "hover:text-red-500" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(236,72,153,0.05),transparent_50%)]"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand section - spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25"></div>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Catalyst
                  </span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Platform terdepan untuk mengubah link afiliasi menjadi toko online yang
                  menguntungkan.
                  <span className="text-purple-400 font-medium">
                    {" "}
                    Tingkatkan konversi Anda hingga 300%
                  </span>
                  .
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">10K+</div>
                    <div className="text-sm text-gray-400">Pengguna Aktif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">50M+</div>
                    <div className="text-sm text-gray-400">Link Dikonversi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation sections */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white relative">
                Produk
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </h4>
              <ul className="space-y-3">
                {["Fitur", "Harga", "Template", "Integrations", "API"].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href="#"
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                    >
                      <ChevronUp className="h-3 w-3 mr-2 transform rotate-90 group-hover:rotate-45 transition-transform duration-300" />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white relative">
                Perusahaan
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </h4>
              <ul className="space-y-3">
                {["Tentang", "Blog", "Karir", "Kontak", "Press Kit"].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <ChevronUp className="h-3 w-3 mr-2 transform rotate-90 group-hover:rotate-45 transition-transform duration-300" />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-lg text-white relative">
                Bantuan
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </h4>
              <ul className="space-y-3">
                {["Dokumentasi", "Tutorial", "FAQ", "Support", "Status"].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href="#"
                      className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center group"
                    >
                      <ChevronUp className="h-3 w-3 mr-2 transform rotate-90 group-hover:rotate-45 transition-transform duration-300" />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* Contact info */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <Mail className="h-4 w-4 mr-2 text-purple-400" />
                  hello@catalyst.id
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Phone className="h-4 w-4 mr-2 text-blue-400" />
                  +62 21 1234 5678
                </div>
                <div className="flex items-start text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                  Jakarta, Indonesia
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className={`w-10 h-10 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:border-current hover:shadow-lg hover:shadow-current/25`}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex items-center text-gray-400 text-sm">
              <span>© 2025 Catalyst. Dibuat dengan</span>
              <Heart className="h-4 w-4 mx-2 text-red-400 animate-pulse" />
              <span>di Indonesia</span>
            </div>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <ChevronUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
