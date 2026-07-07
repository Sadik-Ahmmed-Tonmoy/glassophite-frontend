"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  Diamond,
  Eye,
  Gem,
  Gift,
  Shield,
  Sparkles,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Demo images using Unsplash (free to use)
const demoImages = {
  gold: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
  black:
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
  tortoise:
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop",
  aviator:
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop",
  wayfarer:
    "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=800&auto=format&fit=crop",
  sport:
    "https://images.unsplash.com/photo-1620577439399-3cfbeb6eb3f7?w=800&auto=format&fit=crop",
};

// Demo limited edition products
const limitedEditionProducts = [
  {
    id: "le1",
    title: "Royal Gold Edition",
    brand: "Glassophite",
    discountPercent: "30",
    priceAfterDiscount: 2450,
    mainPrice: 3500,
    shortDescription:
      "24K Gold-plated limited edition with premium crystal lenses.",
    longDescription:
      "The Royal Gold Edition represents the pinnacle of luxury eyewear. Each piece is meticulously handcrafted with 24K gold plating and features precision-cut crystal lenses that offer unparalleled clarity and UV protection. Limited to only 100 pieces worldwide.",
    quantity: 5,
    totalEdition: 100,
    inStock: true,
    features: [
      "24K Gold Plated",
      "Crystal Lenses",
      "Handcrafted",
      "Certificate of Authenticity",
    ],
    variant: {
      title: "Royal Gold Edition",
      color: "#d4af37",
      image: demoImages.gold,
    },
  },
  {
    id: "le2",
    title: "Onyx Black Diamond",
    brand: "Glassophite",
    discountPercent: "25",
    priceAfterDiscount: 2150,
    mainPrice: 2850,
    shortDescription: "Black diamond dust finish with polarized lenses.",
    longDescription:
      "The Onyx Black Diamond edition features a unique black diamond dust finish that catches light beautifully. The polarized lenses provide exceptional clarity while reducing glare, making these perfect for both luxury and performance.",
    quantity: 8,
    totalEdition: 100,
    inStock: true,
    features: [
      "Diamond Dust Finish",
      "Polarized Lenses",
      "Titanium Frame",
      "Limited Numbered",
    ],
    variant: {
      title: "Onyx Black Diamond",
      color: "#1a1a1a",
      image: demoImages.black,
    },
  },
  {
    id: "le3",
    title: "Tortoise Shell Legacy",
    brand: "Glassophite",
    discountPercent: "20",
    priceAfterDiscount: 1850,
    mainPrice: 2300,
    shortDescription: "Handcrafted acetate with vintage tortoise pattern.",
    longDescription:
      "Inspired by vintage designs, the Tortoise Shell Legacy edition combines traditional craftsmanship with modern precision. Each frame features unique hand-layered acetate patterns, ensuring no two pieces are exactly alike.",
    quantity: 12,
    totalEdition: 100,
    inStock: true,
    features: [
      "Hand-layered Acetate",
      "Unique Pattern",
      "Gold Hinges",
      "Wooden Case",
    ],
    variant: {
      title: "Tortoise Shell Legacy",
      color: "#8B4513",
      image: demoImages.tortoise,
    },
  },
  {
    id: "le4",
    title: "Aviator Platinum",
    brand: "Glassophite",
    discountPercent: "35",
    priceAfterDiscount: 3200,
    mainPrice: 4900,
    shortDescription: "Platinum-plated aviator with gradient lenses.",
    longDescription:
      "The Aviator Platinum edition reimagines the classic aviator silhouette with premium materials. The platinum plating offers exceptional durability while the gradient lenses provide sophisticated style and superior eye protection.",
    quantity: 3,
    totalEdition: 100,
    inStock: true,
    features: [
      "Platinum Plated",
      "Gradient Lenses",
      "Double Bridge",
      "Leather Case",
    ],
    variant: {
      title: "Aviator Platinum",
      color: "#E5E4E2",
      image: demoImages.aviator,
    },
  },
];

export default function LimitedEditionHighlightSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 45,
    seconds: 30,
  });
  const [activeProduct, setActiveProduct] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Auto-rotate featured product
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % limitedEditionProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const themeStyles = {
    dark: {
      bg: "from-black via-gray-900 to-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      accent: "bg-[#007C74]",
      accentGlow: "shadow-[0_0_30px_rgba(0,124,116,0.3)]",
      gradient: "from-[#007C74] to-[#3C55A5]",
      overlay: "from-black/90 via-black/70 to-transparent",
      highlight: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      border: "border-white/10",
      borderGlow: "border-[#007C74]/30",
    },
    light: {
      bg: "from-neutral-50 via-white to-neutral-50",
      card: "bg-white/70 border-neutral-200",
      cardHover: "hover:bg-white",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      accent: "bg-[#007C74]",
      accentGlow: "shadow-[0_0_30px_rgba(0,124,116,0.15)]",
      gradient: "from-[#007C74] to-[#3C55A5]",
      overlay: "from-white/90 via-white/70 to-transparent",
      highlight: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      border: "border-neutral-200",
      borderGlow: "border-[#007C74]/50",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      aria-label="Glassophite Limited Edition Collection"
    >
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-80 h-80 md:w-[500px] md:h-[500px] bg-[#3C55A5]/10 rounded-full blur-[120px]"
      />

      {/* Rotating Elements */}
      <motion.div
        style={{ rotate, scale }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block"
      >
        <Gem className="w-24 h-24 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ rotate: useTransform(rotate, (v) => -v) }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block"
      >
        <Diamond className="w-32 h-32 text-[#3C55A5]" />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-[#007C74]/20"}`}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: ["0%", "100%"],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Exclusive Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 mb-6 mx-auto w-fit"
          >
            <Sparkles className="w-4 h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm ${styles.textMuted} tracking-wider uppercase`}
              data-translate="limited.badge"
            >
              Exclusive Release
            </span>
            <Award className="w-4 h-4 text-[#3C55A5]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className={styles.text}>Limited</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Edition
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-sm sm:text-base md:text-lg ${styles.textMuted} max-w-2xl mx-auto px-4`}
            data-translate="limited.description"
          >
            Handcrafted masterpieces with exclusive designs. Only 100 pieces of
            each design worldwide.
          </p>

          {/* Live Viewing Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span
                className={`text-xs ${styles.textMutedLighter}`}
                data-translate="limited.live"
              >
                247 people viewing
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-[#007C74]" />
              <span
                className={`text-xs ${styles.textMutedLighter}`}
                data-translate="limited.sold"
              >
                342 sold today
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div
            className={`p-4 sm:p-6 rounded-2xl backdrop-blur-md ${styles.card} border-2 ${styles.borderGlow}`}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-[#007C74]" />
              <span
                className={`text-xs sm:text-sm font-medium ${styles.textMuted}`}
                data-translate="limited.endsIn"
              >
                Exclusive Offer Ends In
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { value: timeLeft.days, label: "Days", key: "days" },
                { value: timeLeft.hours, label: "Hours", key: "hours" },
                { value: timeLeft.minutes, label: "Minutes", key: "minutes" },
                { value: timeLeft.seconds, label: "Seconds", key: "seconds" },
              ].map((unit, index) => (
                <motion.div
                  key={unit.key}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#007C74] to-[#3C55A5] bg-clip-text text-transparent">
                    {unit.value.toString().padStart(2, "0")}
                  </div>
                  <div
                    className={`text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider ${styles.textMutedLighter}`}
                    data-translate={`limited.time.${unit.key}`}
                  >
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Product Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Product Image with Carousel */}
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden group"
            >
              <Image
                src={limitedEditionProducts[activeProduct].variant.image}
                alt={limitedEditionProducts[activeProduct].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Exclusive Overlay */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs sm:text-sm font-bold rounded-full flex items-center gap-1 sm:gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span data-translate="limited.exclusive">
                    Exclusive Edition
                  </span>
                </span>
              </div>

              {/* Limited Number Badge */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                <span
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-md ${styles.card} text-xs sm:text-sm font-bold`}
                >
                  #{activeProduct + 1}/100
                </span>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {limitedEditionProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveProduct(index)}
                    className={`transition-all duration-300 ${
                      activeProduct === index
                        ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#007C74] rounded-full"
                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 rounded-full hover:bg-white/80"
                    }`}
                    aria-label={`View product ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              key={`details-${activeProduct}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <h3
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold ${styles.text} mb-2`}
                >
                  {limitedEditionProducts[activeProduct].title}
                </h3>
                <p className={`text-sm sm:text-base ${styles.textMuted}`}>
                  {limitedEditionProducts[activeProduct].longDescription}
                </p>
              </div>

              {/* Premium Features */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {limitedEditionProducts[activeProduct].features.map(
                  (feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-1 sm:gap-2"
                    >
                      <div className="p-1 rounded-lg bg-[#007C74]/10">
                        <Gift className="w-2 h-2 sm:w-3 sm:h-3 text-[#007C74]" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs ${styles.textMuted}`}
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ),
                )}
              </div>

              {/* Stock Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span
                    className={styles.textMutedLighter}
                    data-translate="limited.remaining"
                  >
                    Remaining Pieces
                  </span>
                  <span className={`font-bold ${styles.text}`}>
                    {limitedEditionProducts[activeProduct].quantity}/100
                  </span>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(limitedEditionProducts[activeProduct].quantity / 100) * 100}%`,
                    }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
                  />
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 sm:pt-4">
                <div>
                  <span
                    className={`text-xs sm:text-sm ${styles.textMutedLighter} line-through`}
                  >
                    ৳{limitedEditionProducts[activeProduct].mainPrice}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold ${styles.text}`}
                    >
                      ৳
                      {limitedEditionProducts[activeProduct].priceAfterDiscount}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full">
                      -{limitedEditionProducts[activeProduct].discountPercent}%
                    </span>
                  </div>
                </div>

                <Link
                  href={`/product/${limitedEditionProducts[activeProduct].id}`}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                  >
                    <span data-translate="limited.claim">Secure Yours Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </Link>
              </div>

              {/* Authenticity Badge */}
              <div
                className={`flex items-center gap-2 pt-2 text-xs ${styles.textMutedLighter}`}
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
                <span data-translate="limited.authenticity">
                  Certificate of Authenticity included
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* More Limited Editions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {limitedEditionProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className={`relative rounded-xl overflow-hidden backdrop-blur-sm border ${styles.card} group`}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.variant.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Limited Badge */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-[8px] sm:text-xs font-bold rounded-full">
                    Limited
                  </span>
                </div>

                {/* Quick View Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 sm:p-2 rounded-full bg-white text-black"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </motion.div>

                {/* Stock Level Indicator */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                  <div className="flex items-center justify-between text-[8px] sm:text-xs text-white mb-1">
                    <span data-translate="limited.left">Left</span>
                    <span>{product.quantity}/100</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={
                        isInView
                          ? { width: `${(product.quantity / 100) * 100}%` }
                          : {}
                      }
                      transition={{ duration: 1, delay: 1 + index * 0.2 }}
                      className="h-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-2 sm:p-3 md:p-4">
                <h4
                  className={`text-xs sm:text-sm font-semibold ${styles.text} mb-1 line-clamp-1`}
                >
                  {product.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className={`text-[8px] sm:text-xs ${styles.textMutedLighter} line-through`}
                    >
                      ৳{product.mainPrice}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold ${styles.text} ml-1 sm:ml-2`}
                    >
                      ৳{product.priceAfterDiscount}
                    </span>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 sm:p-1.5 rounded-full bg-[#007C74]/10 text-[#007C74] hover:bg-[#007C74]/20 transition-colors"
                    >
                      <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link href="/product-filter?category=best+sellers">
            <motion.button
              whileHover={{ x: 5 }}
              className={`inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${styles.textMuted} hover:text-[#007C74] transition-colors`}
            >
              <span data-translate="limited.viewAll">
                View All Limited Editions
              </span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
