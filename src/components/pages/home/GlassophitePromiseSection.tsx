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
import { useEffect, useRef, useState } from "react";

export default function GlassophitePromiseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activePromise, setActivePromise] = useState(0);

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Auto-rotate promises
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromise((prev) => (prev + 1) % promises.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Promise categories
  const promiseCategories = [
    { id: "quality", name: "Quality", icon: Medal },
    // { id: "service", name: "Service", icon: Headphones },
    { id: "sustainability", name: "Sustainability", icon: Leaf },
    { id: "innovation", name: "Innovation", icon: Microscope },
  ];

  // Main promises data
  const promises = [
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
  ];

  // Service guarantees
  const guarantees = [
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
  ];

  // Quality standards
  const standards = [
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
  ];

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
      categoryActive: "bg-[#007C74] text-white",
      categoryInactive: "bg-white/5 text-neutral-400 hover:bg-white/10",
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
      categoryActive: "bg-[#007C74] text-white",
      categoryInactive: "bg-white text-neutral-600 hover:bg-neutral-100",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      aria-label="Glassophite Brand Promise"
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
        className="absolute top-20 left-20 w-72 h-72 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-[#3C55A5]/10 rounded-full blur-[120px]"
      />

      {/* Floating Icons */}
      <motion.div
        style={{ rotate, scale }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block"
      >
        <Shield className="w-24 h-24 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ rotate: useTransform(rotate, (v) => -v) }}
        animate={{
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block"
      >
        <Award className="w-32 h-32 text-[#3C55A5]" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 mb-6 mx-auto w-fit"
          >
            <Heart className="w-4 h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm ${styles.textMuted} tracking-wider uppercase`}
              data-translate="promise.badge"
            >
              The Glassophite Promise
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className={styles.text}>More Than</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Just Eyewear
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-sm sm:text-base md:text-lg ${styles.textMuted} max-w-2xl mx-auto px-4`}
            data-translate="promise.description"
          >
            Every pair of Glassophite sunglasses comes with our unwavering
            commitment to quality, service, and your satisfaction
          </p>
        </motion.div>

        {/* Promise Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 lg:mb-12"
        >
          {promiseCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 transition-all ${
                promises[activePromise].category === category.id
                  ? styles.categoryActive
                  : styles.categoryInactive
              }`}
              onClick={() => {
                const index = promises.findIndex(
                  (p) => p.category === category.id,
                );
                if (index !== -1) setActivePromise(index);
              }}
            >
              <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span data-translate={`promise.categories.${category.id}`}>
                {category.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Promise - Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <div
            className={`relative rounded-2xl overflow-hidden backdrop-blur-sm border-2 ${styles.borderGlow}`}
          >
            <div className="grid lg:grid-cols-2">
              {/* Promise Image */}
              <motion.div
                key={`promise-${activePromise}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden group"
              >
                <Image
                  src={promises[activePromise].bgImage}
                  alt={promises[activePromise].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Icon Overlay */}
                <div className="absolute top-4 left-4">
                  <div className="p-3 rounded-full bg-black/50 backdrop-blur-sm">
                    {/* <promises[activePromise].icon className="w-6 h-6 text-white" /> */}
                  </div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {promises[activePromise].stats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-center"
                    >
                      <stat.icon className="w-3 h-3 text-[#007C74] mx-auto mb-1" />
                      <div className="text-xs font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-[8px] text-white/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Promise Details */}
              <motion.div
                key={`details-${activePromise}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 sm:p-8 lg:p-10 ${styles.card}`}
              >
                <div className="h-full flex flex-col">
                  {/* Title */}
                  <h3
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold ${styles.text} mb-3`}
                  >
                    {promises[activePromise].title}
                  </h3>

                  {/* Short Description */}
                  <p
                    className={`text-sm sm:text-base ${styles.textMuted} mb-4`}
                  >
                    {promises[activePromise].description}
                  </p>

                  {/* Long Description */}
                  <p
                    className={`text-xs sm:text-sm ${styles.textMutedLighter} mb-6`}
                  >
                    {promises[activePromise].longDescription}
                  </p>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4
                      className={`text-xs sm:text-sm font-semibold ${styles.text} mb-3 uppercase tracking-wider`}
                      data-translate="promise.features"
                    >
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {promises[activePromise].features.map(
                        (feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-[#007C74]" />
                            <span className={`text-xs ${styles.textMuted}`}>
                              {feature}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Learn More Link */}
                  <Link href={`/promise/${promises[activePromise].id}`}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className={`text-xs sm:text-sm ${styles.textMuted} hover:text-[#007C74] transition-colors flex items-center gap-1 mt-auto`}
                    >
                      <span data-translate="promise.learnMore">
                        Learn more about our commitment
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Carousel Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
              {promises.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePromise(index)}
                  className={`transition-all duration-300 ${
                    activePromise === index
                      ? "w-6 h-1.5 bg-[#007C74] rounded-full"
                      : "w-1.5 h-1.5 bg-white/50 rounded-full"
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
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <h3
            className={`text-lg sm:text-xl font-semibold ${styles.text} mb-6 text-center`}
            data-translate="promise.guarantees"
          >
            Our Guarantees to You
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={guarantee.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                whileHover={{ y: -5 }}
                className={`p-4 rounded-xl text-center backdrop-blur-sm border ${styles.card} ${styles.cardHover}`}
              >
                <guarantee.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#007C74] mx-auto mb-2" />
                <h4
                  className={`text-xs sm:text-sm font-semibold ${styles.text} mb-1`}
                  data-translate={`promise.guarantees.${guarantee.key}.title`}
                >
                  {guarantee.title}
                </h4>
                <p
                  className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}
                  data-translate={`promise.guarantees.${guarantee.key}.desc`}
                >
                  {guarantee.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Standards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left side - Standards */}
            <div
              className={`p-6 rounded-xl backdrop-blur-sm border ${styles.card}`}
            >
              <h3
                className={`text-base sm:text-lg font-semibold ${styles.text} mb-4 flex items-center gap-2`}
              >
                <Medal className="w-5 h-5 text-[#007C74]" />
                <span data-translate="promise.standards">
                  Quality Standards
                </span>
              </h3>

              <div className="space-y-4">
                {standards.map((standard, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#007C74]/10">
                      <standard.icon className="w-4 h-4 text-[#007C74]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs sm:text-sm font-medium ${styles.text}`}
                        >
                          {standard.title}
                        </h4>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold text-[#007C74]`}
                        >
                          {standard.value}
                        </span>
                      </div>
                      <p
                        className={`text-[10px] sm:text-xs ${styles.textMutedLighter} mt-1`}
                      >
                        {standard.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side - Certifications */}
            <div
              className={`p-6 rounded-xl backdrop-blur-sm border ${styles.card}`}
            >
              <h3
                className={`text-base sm:text-lg font-semibold ${styles.text} mb-4 flex items-center gap-2`}
              >
                <Award className="w-5 h-5 text-[#007C74]" />
                <span data-translate="promise.certifications">
                  Certifications
                </span>
              </h3>

              <div className="space-y-4">
                {[
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
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <cert.icon className="w-4 h-4 text-[#007C74]" />
                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-medium ${styles.text}`}
                      >
                        {cert.name}
                      </h4>
                      <p
                        className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}
                      >
                        {cert.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-8 border-t border-white/10"
        >
          {[
            { icon: Shield, text: "Lifetime Warranty", key: "warranty" },
            { icon: Truck, text: "Free Shipping", key: "shipping" },
            { icon: RefreshCw, text: "30-Day Returns", key: "returns" },
            { icon: Lock, text: "Secure Checkout", key: "secure" },
          ].map((badge) => (
            <motion.div
              key={badge.key}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              <badge.icon className="w-4 h-4 text-[#007C74]" />
              <span
                className={`text-xs ${styles.textMutedLighter}`}
                data-translate={`promise.badges.${badge.key}`}
              >
                {badge.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
