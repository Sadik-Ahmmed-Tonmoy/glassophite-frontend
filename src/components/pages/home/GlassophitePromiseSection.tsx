"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Diamond,
  Droplets,
  Eye,
  Factory,
  Gem,
  Globe,
  Headphones,
  Heart,
  Leaf,
  Lock,
  Medal,
  Microscope,
  Recycle,
  RefreshCw,
  Ruler,
  Shield,
  Sun,
  ThumbsUp,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";

// Promise categories
const PROMISE_CATEGORIES = [
  { id: "quality", name: "Quality", icon: Medal },
  { id: "sustainability", name: "Sustainability", icon: Leaf },
  { id: "innovation", name: "Innovation", icon: Microscope },
] as const;

// Main promises data
const PROMISES = [
  {
    id: "lifetime",
    title: "Warranty",
    description:
      "Every pair of Glassophite sunglasses comes with our comprehensive lifetime warranty against manufacturing defects.",
    longDescription:
      "We stand behind every pair we make. If your Glassophite sunglasses have any manufacturing defect, we'll repair or replace them—for life. No questions asked.",
    icon: Shield,
    category: "quality",
    stats: [
      { label: "Years Covered", value: "Lifetime", icon: Clock },
      { label: "Claims Honored", value: "99.7%", icon: ThumbsUp },
      { label: "Avg Response", value: "24h", icon: Zap },
    ],
    features: [
      "Frame defects",
      "Lens imperfections",
      "Hinge mechanism",
      "Original craftsmanship",
    ],
    color: "#007C74",
    bgImage:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&auto=format&fit=crop",
  },
  {
    id: "uv",
    title: "100% UV Protection",
    description:
      "All our lenses provide complete protection against UVA, UVB, and UVC rays, ensuring your eyes stay safe in any condition.",
    longDescription:
      "Your eye health is our priority. Every Glassophite lens is engineered to block 100% of harmful UV radiation, exceeding international safety standards.",
    icon: Sun,
    category: "innovation",
    stats: [
      { label: "UV Protection", value: "100%", icon: Eye },
      { label: "Layers", value: "9", icon: Diamond },
      { label: "Certified", value: "ISO 12312", icon: Award },
    ],
    features: [
      "UVA protection",
      "UVB protection",
      "UVC protection",
      "Blue light filter",
    ],
    color: "#3C55A5",
    bgImage:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
  },
  {
    id: "materials",
    title: "Premium Materials",
    description:
      "We source only the finest materials—from Japanese titanium to Italian acetate—for unparalleled quality and comfort.",
    longDescription:
      "Our commitment to quality starts with materials. We partner with the world's best suppliers to bring you eyewear that feels as good as it looks.",
    icon: Gem,
    category: "quality",
    stats: [
      { label: "Material Sources", value: "8", icon: Globe },
      { label: "Quality Checks", value: "47", icon: CheckCircle },
      { label: "Durability", value: "10+ yrs", icon: Clock },
    ],
    features: [
      "Japanese titanium",
      "Italian acetate",
      "German hinges",
      "Swiss lenses",
    ],
    color: "#00A693",
    bgImage:
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop",
  },
  {
    id: "sustainable",
    title: "Sustainable Craft",
    description:
      "We're committed to reducing our environmental footprint through eco-friendly packaging and responsible manufacturing.",
    longDescription:
      "Luxury shouldn't cost the earth. We're pioneering sustainable practices in eyewear manufacturing, from recycled materials to carbon-neutral shipping.",
    icon: Leaf,
    category: "sustainability",
    stats: [
      { label: "Recycled Materials", value: "65%", icon: Recycle },
      { label: "Carbon Neutral", value: "2024", icon: Factory },
      { label: "Trees Planted", value: "10k+", icon: Leaf },
    ],
    features: [
      "Eco packaging",
      "Recycled acetate",
      "Solar powered",
      "Carbon offset",
    ],
    color: "#007C74",
    bgImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
  },
] as const;

// Service guarantees
const GUARANTEES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over ৳2000",
    key: "shipping",
  },
  {
    icon: RefreshCw,
    title: "30-Day Returns",
    description: "Hassle-free exchanges",
    key: "returns",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    description: "128-bit SSL encryption",
    key: "secure",
  },
  {
    icon: Wallet,
    title: "Price Match",
    description: "Best price guaranteed",
    key: "price",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    key: "support",
  },
  {
    icon: Award,
    title: "Authentic",
    description: "100% genuine products",
    key: "authentic",
  },
] as const;

// Quality standards
const STANDARDS = [
  {
    icon: Ruler,
    title: "Precision Fit",
    description: "Ergonomically designed",
    value: "0.1mm tolerance",
  },
  {
    icon: Eye,
    title: "Optical Clarity",
    description: "Distortion-free vision",
    value: "99.9% clarity",
  },
  {
    icon: Droplets,
    title: "Hydrophobic",
    description: "Water & oil resistant",
    value: "Advanced coating",
  },
  {
    icon: Zap,
    title: "Impact Resistant",
    description: "Military-grade durability",
    value: "Tested to MIL-SPEC",
  },
] as const;

// Certifications
const CERTIFICATIONS = [
  {
    name: "ISO 12312-1",
    description: "Eye and face protection standards",
    icon: Shield,
  },
  {
    name: "CE Certified",
    description: "European safety standards",
    icon: CheckCircle,
  },
  {
    name: "ANSI Z80.3",
    description: "American national standard",
    icon: Award,
  },
  {
    name: "UV400 Certified",
    description: "Complete UV protection",
    icon: Sun,
  },
] as const;

export default function GlassophitePromiseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activePromise, setActivePromise] = useState(0);

  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Auto-rotate promises
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromise((prev) => (prev + 1) % PROMISES.length);
    }, 4500);
    return () => clearInterval(interval);
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
            categoryActive: "bg-[#007C74] text-white shadow-sm",
            categoryInactive: "bg-white/5 text-neutral-400 hover:bg-white/10",
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
            categoryActive: "bg-[#007C74] text-white shadow-sm",
            categoryInactive: "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60",
          },
    [isDark]
  );

  const currentPromise = PROMISES[activePromise];

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20`}
      aria-label="Glassophite Brand Promise"
    >
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Responsive Glow Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-5 sm:top-20 sm:left-20 w-[clamp(200px,30vw,384px)] h-[clamp(200px,30vw,384px)] bg-[#007C74]/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-[clamp(240px,35vw,480px)] h-[clamp(240px,35vw,480px)] bg-[#3C55A5]/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none"
      />

      {/* Floating Decorative Icons */}
      <motion.div
        style={{ rotate, scale }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block pointer-events-none"
      >
        <Shield className="w-24 h-24 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ rotate: useTransform(rotate, (v) => -v) }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block pointer-events-none"
      >
        <Award className="w-32 h-32 text-[#3C55A5]" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm font-semibold ${styles.textMuted} tracking-wider uppercase`}
              data-translate="promise.badge"
            >
              The Glassophite Promise
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            <span className={styles.text}>More Than</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Just Eyewear
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto px-2 leading-relaxed`}
            data-translate="promise.description"
          >
            Every pair of Glassophite sunglasses comes with our unwavering
            commitment to quality, service, and your satisfaction
          </p>
        </motion.div>

        {/* Promise Categories */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10 lg:mb-12"
        >
          {PROMISE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                currentPromise.category === category.id
                  ? styles.categoryActive
                  : styles.categoryInactive
              }`}
              onClick={() => {
                const idx = PROMISES.findIndex((p) => p.category === category.id);
                if (idx !== -1) setActivePromise(idx);
              }}
            >
              <category.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span data-translate={`promise.categories.${category.id}`}>
                {category.name}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Featured Promise Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 lg:mb-16"
        >
          <div className={`relative rounded-3xl overflow-hidden backdrop-blur-sm border-2 ${styles.borderGlow}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Promise Image */}
              <motion.div
                key={`promise-${activePromise}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[480px] overflow-hidden group"
              >
                <Image
                  src={currentPromise.bgImage}
                  alt={currentPromise.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {currentPromise.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-2 sm:p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-center border border-white/10"
                    >
                      <stat.icon className="w-3.5 h-3.5 text-[#007C74] mx-auto mb-1" />
                      <div className="text-xs sm:text-sm font-extrabold text-white">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-neutral-300 font-medium truncate">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Promise Details */}
              <motion.div
                key={`details-${activePromise}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`p-6 sm:p-8 lg:p-10 ${styles.card} flex flex-col justify-between`}
              >
                <div>
                  <h3 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold ${styles.text} mb-3`}>
                    {currentPromise.title}
                  </h3>

                  <p className={`text-xs sm:text-sm md:text-base ${styles.textMuted} mb-3 leading-relaxed`}>
                    {currentPromise.description}
                  </p>

                  <p className={`text-xs sm:text-sm ${styles.textMutedLighter} mb-6 leading-relaxed`}>
                    {currentPromise.longDescription}
                  </p>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4
                      className={`text-xs sm:text-sm font-extrabold ${styles.text} mb-3 uppercase tracking-wider`}
                      data-translate="promise.features"
                    >
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentPromise.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#007C74] shrink-0" />
                          <span className={`text-xs font-semibold ${styles.textMuted}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href={`/promise/${currentPromise.id}`}>
                  <button
                    className={`text-xs sm:text-sm font-bold text-[#007C74] hover:text-[#00A693] transition-colors flex items-center gap-1.5 mt-2 cursor-pointer group`}
                  >
                    <span data-translate="promise.learnMore">
                      Learn more about our commitment
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center gap-2 p-3 bg-black/20 backdrop-blur-sm lg:hidden">
              {PROMISES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePromise(index)}
                  className={`transition-all duration-300 cursor-pointer ${
                    activePromise === index
                      ? "w-6 h-1.5 bg-[#007C74] rounded-full"
                      : "w-1.5 h-1.5 bg-white/40 rounded-full"
                  }`}
                  aria-label={`View promise ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Service Guarantees Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <h3
            className={`text-lg sm:text-xl font-extrabold ${styles.text} mb-6 text-center`}
            data-translate="promise.guarantees"
          >
            Our Guarantees to You
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {GUARANTEES.map((guarantee) => (
              <motion.div
                key={guarantee.key}
                whileHover={{ y: -4 }}
                className={`p-4 rounded-2xl text-center backdrop-blur-sm border ${styles.card} ${styles.cardHover} transition-all duration-300`}
              >
                <guarantee.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#007C74] mx-auto mb-2" />
                <h4
                  className={`text-xs sm:text-sm font-bold ${styles.text} mb-1`}
                  data-translate={`promise.guarantees.${guarantee.key}.title`}
                >
                  {guarantee.title}
                </h4>
                <p
                  className={`text-[10px] sm:text-xs ${styles.textMutedLighter} leading-relaxed`}
                  data-translate={`promise.guarantees.${guarantee.key}.desc`}
                >
                  {guarantee.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Standards & Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standards */}
            <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}>
              <h3 className={`text-base sm:text-lg font-bold ${styles.text} mb-4 flex items-center gap-2`}>
                <Medal className="w-5 h-5 text-[#007C74]" />
                <span data-translate="promise.standards">Quality Standards</span>
              </h3>

              <div className="space-y-4">
                {STANDARDS.map((standard, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#007C74]/10 text-[#007C74] shrink-0">
                      <standard.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs sm:text-sm font-bold ${styles.text} truncate`}>
                          {standard.title}
                        </h4>
                        <span className="text-[10px] sm:text-xs font-extrabold text-[#007C74] shrink-0">
                          {standard.value}
                        </span>
                      </div>
                      <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter} mt-0.5`}>
                        {standard.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}>
              <h3 className={`text-base sm:text-lg font-bold ${styles.text} mb-4 flex items-center gap-2`}>
                <Award className="w-5 h-5 text-[#007C74]" />
                <span data-translate="promise.certifications">Certifications</span>
              </h3>

              <div className="space-y-3.5">
                {CERTIFICATIONS.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-neutral-200/30 dark:border-white/5"
                  >
                    <cert.icon className="w-4 h-4 text-[#007C74] shrink-0" />
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${styles.text}`}>
                        {cert.name}
                      </h4>
                      <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}>
                        {cert.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 border-t border-neutral-200/40 dark:border-white/10"
        >
          {[
            { icon: Shield, text: "Lifetime Warranty", key: "warranty" },
            { icon: Truck, text: "Free Shipping", key: "shipping" },
            { icon: RefreshCw, text: "30-Day Returns", key: "returns" },
            { icon: Lock, text: "Secure Checkout", key: "secure" },
          ].map((badge) => (
            <div key={badge.key} className="flex items-center gap-2">
              <badge.icon className="w-4 h-4 text-[#007C74] shrink-0" />
              <span
                className={`text-xs font-semibold ${styles.textMutedLighter}`}
                data-translate={`promise.badges.${badge.key}`}
              >
                {badge.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
