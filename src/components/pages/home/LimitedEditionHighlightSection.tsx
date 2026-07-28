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
import { useEffect, useRef, useState, useMemo } from "react";

// Demo images
const DEMO_IMAGES = {
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
} as const;

// Demo limited edition products
const LIMITED_EDITION_PRODUCTS = [
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
      image: DEMO_IMAGES.gold,
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
      image: DEMO_IMAGES.black,
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
      image: DEMO_IMAGES.tortoise,
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
      image: DEMO_IMAGES.aviator,
    },
  },
] as const;

// Deterministic particles
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top: `${(i * 47 + 11) % 90}%`,
  left: `${(i * 37 + 19) % 90}%`,
  duration: 18 + (i % 5) * 4,
}));

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

  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Auto-rotate featured product
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % LIMITED_EDITION_PRODUCTS.length);
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

  const styles = useMemo(
    () =>
      isDark
        ? {
            bg: "from-black via-gray-900 to-black",
            card: "bg-white/5 border-white/10",
            cardHover: "hover:bg-white/10",
            text: "text-white",
            textMuted: "text-neutral-300",
            textMutedLighter: "text-neutral-400",
            border: "border-white/10",
            borderGlow: "border-[#007C74]/30",
          }
        : {
            bg: "from-neutral-50 via-white to-neutral-50",
            card: "bg-white/80 border-neutral-200/80 shadow-xs",
            cardHover: "hover:bg-white",
            text: "text-neutral-900",
            textMuted: "text-neutral-600",
            textMutedLighter: "text-neutral-500",
            border: "border-neutral-200",
            borderGlow: "border-[#007C74]/40",
          },
    [isDark],
  );

  const currentProduct = LIMITED_EDITION_PRODUCTS[activeProduct];

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20`}
      aria-label="Glassophite Limited Edition Collection"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${
              isDark ? "#007C74" : "#007C74"
            } 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Responsive Glow Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-5 sm:top-20 sm:left-20 w-[clamp(180px,25vw,384px)] h-[clamp(180px,25vw,384px)] bg-[#007C74]/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-[clamp(220px,30vw,500px)] h-[clamp(220px,30vw,500px)] bg-[#3C55A5]/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none"
      />

      {/* Rotating Elements */}
      <motion.div
        style={{ rotate, scale }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block pointer-events-none"
      >
        <Gem className="w-24 h-24 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ rotate: useTransform(rotate, (v) => -v) }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block pointer-events-none"
      >
        <Diamond className="w-32 h-32 text-[#3C55A5]" />
      </motion.div>

      {/* Floating Particles */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-[#007C74]/20"}`}
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 mb-4 sm:mb-6 mx-auto w-fit shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm font-semibold ${styles.textMuted} tracking-wider uppercase`}
              data-translate="limited.badge"
            >
              Exclusive Release
            </span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3C55A5]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            <span className={styles.text}>Limited</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Edition
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto px-2 leading-relaxed`}
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
            className="flex items-center justify-center gap-3 mt-5 sm:mt-6 font-semibold"
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
            <div className="w-px h-3 bg-neutral-300 dark:bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#007C74]" />
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
          className="max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <div
            className={`p-4 sm:p-6 rounded-3xl backdrop-blur-md ${styles.card} border-2 ${styles.borderGlow}`}
          >
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-[#007C74]" />
              <span
                className={`text-xs sm:text-sm font-bold ${styles.textMuted}`}
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
              ].map((unit) => (
                <div key={unit.key} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-[#007C74] to-[#3C55A5] bg-clip-text text-transparent">
                    {unit.value.toString().padStart(2, "0")}
                  </div>
                  <div
                    className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider ${styles.textMutedLighter}`}
                    data-translate={`limited.time.${unit.key}`}
                  >
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Product */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Product Image Carousel */}
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden group shadow-md"
            >
              <Image
                src={currentProduct.variant.image}
                alt={currentProduct.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Exclusive Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3.5 h-3.5" />
                  <span data-translate="limited.exclusive">
                    Exclusive Edition
                  </span>
                </span>
              </div>

              {/* Limited Number Badge */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                <span
                  className={`px-3 py-1 rounded-full backdrop-blur-md ${styles.card} text-xs font-extrabold shadow-sm`}
                >
                  #{activeProduct + 1}/100
                </span>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {LIMITED_EDITION_PRODUCTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveProduct(index)}
                    className={`transition-all duration-300 cursor-pointer ${
                      activeProduct === index
                        ? "w-6 h-1.5 bg-[#007C74] rounded-full"
                        : "w-1.5 h-1.5 bg-white/50 rounded-full"
                    }`}
                    aria-label={`View product ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              key={`details-${activeProduct}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <h3
                  className={`text-xl sm:text-2xl lg:text-3xl font-extrabold ${styles.text} mb-2`}
                >
                  {currentProduct.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm md:text-base ${styles.textMuted} leading-relaxed`}
                >
                  {currentProduct.longDescription}
                </p>
              </div>

              {/* Premium Features */}
              <div className="grid grid-cols-2 gap-2.5">
                {currentProduct.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#007C74]/10 text-[#007C74] shrink-0">
                      <Gift className="w-3 h-3" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${styles.textMuted}`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stock Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span
                    className={styles.textMutedLighter}
                    data-translate="limited.remaining"
                  >
                    Remaining Pieces
                  </span>
                  <span className={styles.text}>
                    {currentProduct.quantity}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentProduct.quantity / 100) * 100}%`,
                    }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
                  />
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <div>
                  <span
                    className={`text-xs sm:text-sm ${styles.textMutedLighter} line-through`}
                  >
                    ৳{currentProduct.mainPrice}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold ${styles.text}`}
                    >
                      ৳{currentProduct.priceAfterDiscount}
                    </span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs font-bold rounded-full">
                      -{currentProduct.discountPercent}%
                    </span>
                  </div>
                </div>

                <Link href={`/product/${currentProduct.id}`}>
                  <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer">
                    <span data-translate="limited.claim">Secure Yours Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Authenticity Badge */}
              <div
                className={`flex items-center gap-2 text-xs font-semibold ${styles.textMutedLighter}`}
              >
                <Shield className="w-4 h-4 text-[#007C74] shrink-0" />
                <span data-translate="limited.authenticity">
                  Certificate of Authenticity included
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* More Limited Editions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {LIMITED_EDITION_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
              // onHoverStart={() => setHoveredProduct(product.id)}
              // onHoverEnd={() => setHoveredProduct(null)}
              className={`relative rounded-2xl overflow-hidden backdrop-blur-sm border ${styles.card} group flex flex-col justify-between shadow-xs`}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.variant.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                />

                {/* Limited Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-[10px] font-extrabold rounded-full">
                    Limited
                  </span>
                </div>

                {/* Stock Level Indicator */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-white mb-1">
                    <span data-translate="limited.left">Left</span>
                    <span>{product.quantity}/100</span>
                  </div>
                  <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(product.quantity / 100) * 100}%` }}
                      className="h-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 space-y-2">
                <h4
                  className={`text-xs sm:text-sm font-bold ${styles.text} line-clamp-1`}
                >
                  {product.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className={`text-[10px] sm:text-xs ${styles.textMutedLighter} line-through`}
                    >
                      ৳{product.mainPrice}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-extrabold ${styles.text} ml-1.5`}
                    >
                      ৳{product.priceAfterDiscount}
                    </span>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <button className="p-1.5 rounded-full bg-[#007C74]/10 text-[#007C74] hover:bg-[#007C74]/20 transition-colors cursor-pointer">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
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
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link href="/product-filter?category=best+sellers">
            <button
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold ${styles.textMuted} hover:text-[#007C74] transition-colors cursor-pointer group`}
            >
              <span data-translate="limited.viewAll">
                View All Limited Editions
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
