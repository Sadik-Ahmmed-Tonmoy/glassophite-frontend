"use client";

import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    Camera,
    Coffee,
    Eye,
    Feather,
    Heart,
    Moon,
    Mountain,
    Palette,
    PartyPopper,
    Share2,
    Sparkles,
    Sun,
    TrendingUp,
    Umbrella,
    Users
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function StyleInspirationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLook, setActiveLook] = useState(0);
  const [likedLooks, setLikedLooks] = useState<string[]>([]);

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { data: allProductsData } = useGetAllProductsQuery(undefined);
  const products = (Array.isArray(allProductsData) ? allProductsData : allProductsData?.data || []).slice(0, 9);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Style categories
  const categories = [
    { id: "all", name: "All Styles", icon: Sparkles },
    { id: "casual", name: "Casual Chic", icon: Coffee },
    // { id: "beach", name: "Beach Ready", icon: Beach },
    // { id: "urban", name: "Urban Street", icon: City },
    { id: "adventure", name: "Adventure", icon: Mountain },
    { id: "evening", name: "Evening Glam", icon: PartyPopper },
  ];

  // Style looks data
  const styleLooks = [
    {
      id: "look1",
      title: "Urban Explorer",
      description: "Perfect for city adventures with a touch of edge",
      category: "urban",
      time: "Day",
      season: "All Year",
      likes: 234,
      saves: 89,
      products: [products[0], products[2], products[4]],
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop",
      modelImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
      colors: ["#232323", "#1d81c8", "#d4af37"],
    },
    {
      id: "look2",
      title: "Beachside Breeze",
      description: "Effortless style for coastal getaways",
      category: "beach",
      time: "Day",
      season: "Summer",
      likes: 567,
      saves: 123,
      products: [products[1], products[3], products[5]],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
      modelImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop",
      colors: ["#c0c0c0", "#b0b0b0", "#000000"],
    },
    {
      id: "look3",
      title: "Evening Elegance",
      description: "Sophisticated looks for special occasions",
      category: "evening",
      time: "Night",
      season: "All Year",
      likes: 892,
      saves: 345,
      products: [products[4], products[0], products[7]],
      image: "https://images.unsplash.com/photo-1509630777415-8f002921b7c3?w=800&auto=format&fit=crop",
      modelImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
      colors: ["#d4af37", "#232323", "#c0c0c0"],
    },
    {
      id: "look4",
      title: "Mountain Explorer",
      description: "Durable style for outdoor adventures",
      category: "adventure",
      time: "Day",
      season: "All Year",
      likes: 445,
      saves: 167,
      products: [products[5], products[2], products[8]],
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
      modelImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop",
      colors: ["#000000", "#e0241b", "#232323"],
    },
    {
      id: "look5",
      title: "Casual Weekend",
      description: "Relaxed styles for your days off",
      category: "casual",
      time: "Day",
      season: "All Year",
      likes: 678,
      saves: 234,
      products: [products[6], products[1], products[3]],
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
      modelImage: "https://images.unsplash.com/photo-1494790108777-466fd103a773?w=400&auto=format&fit=crop",
      colors: ["#f4f4f4", "#c0c0c0", "#b0b0b0"],
    },
  ];

  // Auto-rotate looks
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLook((prev) => (prev + 1) % styleLooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [styleLooks.length]);

  // Filter looks based on category
  const filteredLooks = activeCategory === "all" 
    ? styleLooks 
    : styleLooks.filter(look => look.category === activeCategory);

  const toggleLike = (lookId: string) => {
    setLikedLooks(prev => 
      prev.includes(lookId) 
        ? prev.filter(id => id !== lookId)
        : [...prev, lookId]
    );
  };

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
      aria-label="Glassophite Style Inspiration"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-72 h-72 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-[#3C55A5]/10 rounded-full blur-[120px]"
      />

      {/* Rotating Style Icons */}
      <motion.div
        style={{ rotate }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block"
      >
        <Feather className="w-24 h-24 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ rotate: useTransform(rotate, (v) => -v) }}
        animate={{
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block"
      >
        <Palette className="w-32 h-32 text-[#3C55A5]" />
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
            <Camera className="w-4 h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm ${styles.textMuted} tracking-wider uppercase`}
              data-translate="inspiration.badge"
            >
              Style Inspiration
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className={styles.text}>Find Your</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Perfect Style
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-sm sm:text-base md:text-lg ${styles.textMuted} max-w-2xl mx-auto px-4`}
            data-translate="inspiration.description"
          >
            Discover curated looks and get inspired by how others style their Glassophite sunglasses
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 lg:mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 transition-all ${
                activeCategory === category.id
                  ? styles.categoryActive
                  : styles.categoryInactive
              }`}
            >
              <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span data-translate={`inspiration.categories.${category.id}`}>
                {category.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Look - Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <div className={`relative rounded-2xl overflow-hidden backdrop-blur-sm border-2 ${styles.borderGlow}`}>
            <div className="grid lg:grid-cols-2">
              {/* Look Image */}
              <motion.div
                key={`look-${activeLook}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] lg:aspect-auto lg:h-[500px] overflow-hidden group"
              >
                <Image
                  src={styleLooks[activeLook].image}
                  alt={styleLooks[activeLook].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                
                {/* Overlay with tags */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Time of day indicator */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                    {styleLooks[activeLook].time === "Day" ? (
                      <Sun className="w-3 h-3" />
                    ) : (
                      <Moon className="w-3 h-3" />
                    )}
                    {styleLooks[activeLook].time}
                  </span>
                </div>

                {/* Season indicator */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                    <Umbrella className="w-3 h-3" />
                    {styleLooks[activeLook].season}
                  </span>
                </div>

                {/* Color palette */}
                <div className="absolute bottom-4 left-4 flex gap-1">
                  {styleLooks[activeLook].colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: color }}
                      title={`Color ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Like button */}
                <button
                  onClick={() => toggleLike(styleLooks[activeLook].id)}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedLooks.includes(styleLooks[activeLook].id)
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }`}
                  />
                </button>
              </motion.div>

              {/* Look Details */}
              <motion.div
                key={`details-${activeLook}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 sm:p-8 lg:p-10 ${styles.card}`}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${styles.text} mb-2`}>
                        {styleLooks[activeLook].title}
                      </h3>
                      <p className={`text-sm sm:text-base ${styles.textMuted}`}>
                        {styleLooks[activeLook].description}
                      </p>
                    </div>
                  </div>

                  {/* Model info */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                      <Image
                        src={styleLooks[activeLook].modelImage}
                        alt="Model"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-medium ${styles.text}`}>
                        Sarah Johnson
                      </p>
                      <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}>
                        Style Influencer
                      </p>
                    </div>
                  </div>

                  {/* Featured products in this look */}
                  <div className="mb-6">
                    <h4 className={`text-xs sm:text-sm font-semibold ${styles.text} mb-3 uppercase tracking-wider`} data-translate="inspiration.featured">
                      Featured in this look
                    </h4>
                    <div className="space-y-3">
                      {styleLooks[activeLook].products.map((product, index) => (
                        <Link href={`/product/${product.id}`} key={index}>
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 group"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={product.variants[0].imgList[0]?.image || ""}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs sm:text-sm font-medium ${styles.text} group-hover:text-[#007C74] transition-colors`}>
                                {product.variants[0].title}
                              </p>
                              <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}>
                                ৳{product.variants[0].priceAfterDiscount}
                              </p>
                            </div>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Engagement stats */}
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-[#007C74]" />
                      <span className={`text-xs sm:text-sm ${styles.text}`}>
                        {styleLooks[activeLook].likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#007C74]" />
                      <span className={`text-xs sm:text-sm ${styles.text}`}>
                        {styleLooks[activeLook].saves}
                      </span>
                    </div>
                    <button className="ml-auto p-2 rounded-full hover:bg-white/10 transition-colors">
                      <Share2 className="w-4 h-4 text-[#007C74]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Carousel Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
              {filteredLooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveLook(index)}
                  className={`transition-all duration-300 ${
                    activeLook === index
                      ? "w-6 h-1.5 bg-[#007C74] rounded-full"
                      : "w-1.5 h-1.5 bg-white/50 rounded-full"
                  }`}
                  aria-label={`Go to look ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* More Inspiration Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg sm:text-xl font-semibold ${styles.text}`} data-translate="inspiration.more">
              More Style Inspiration
            </h3>
            <Link href="/style-inspiration">
              <motion.button
                whileHover={{ x: 5 }}
                className={`text-xs sm:text-sm ${styles.textMuted} hover:text-[#007C74] transition-colors flex items-center gap-1`}
              >
                <span data-translate="inspiration.viewAll">View All</span>
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredLooks.slice(1, 5).map((look, index) => (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Quick view button */}
                  <button className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Quick View
                  </button>

                  {/* Category tag */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[8px] sm:text-xs">
                      {look.category}
                    </span>
                  </div>
                </div>

                <h4 className={`text-xs sm:text-sm font-medium ${styles.text} line-clamp-1`}>
                  {look.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="w-3 h-3 text-[#007C74]" />
                  <span className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}>
                    {look.likes}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trending Hashtags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#007C74]" />
            <span className={`text-sm ${styles.textMuted}`} data-translate="inspiration.trending">
              Trending Now
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "#GlassophiteStyle",
              "#SummerVibes",
              "#UrbanChic",
              "#BeachReady",
              "#LuxuryEye wear",
              "#StyleInspo",
            ].map((hashtag, index) => (
              <motion.button
                key={hashtag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className={`px-3 py-1.5 rounded-full text-xs ${styles.card} ${styles.cardHover} transition-colors`}
              >
                {hashtag}
              </motion.button>
            ))}
          </div>

          {/* Upload your style CTA */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-sm font-medium inline-flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span data-translate="inspiration.upload">Share Your Style</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
