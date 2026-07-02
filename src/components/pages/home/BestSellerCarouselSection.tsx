/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import ProductCard from "@/components/ui/ProductCard/ProductCard";
import { useGetBestSellersQuery } from "@/redux/features/product/productApi";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/free-mode";

// Hook to detect large screen (lg breakpoint 1024px)
function useLargeScreen() {
  const [isLarge, setIsLarge] = useState(false);
  useEffect(() => {
    const check = () => setIsLarge(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isLarge;
}

// Skeleton loader for product cards
function ProductCardSkeleton() {
  return (
    <div className="h-full rounded-2xl bg-white/5 dark:bg-white/5 border border-neutral-200/20 dark:border-neutral-800/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function BestSellerCarouselSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isLarge = useLargeScreen();

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // ✅ FIX: Only pass target when ref is attached to avoid hydration error
  const { scrollYProgress } = useScroll({
    ...(containerRef?.current ? { target: containerRef } : {}),
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const {
    data: bestSellersData,
    isLoading,
    isFetching,
    error,
  } = useGetBestSellersQuery(undefined);

  const bestSellers = Array.isArray(bestSellersData) ? bestSellersData : [];

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
      overlay: "from-black/80 via-black/50 to-transparent",
      navButton: "bg-white/10 border-white/20 hover:bg-white/20 text-white",
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
      overlay: "from-white/80 via-white/50 to-transparent",
      navButton:
        "bg-white/70 border-neutral-200 hover:bg-white text-neutral-900",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Error handling
  if (error) {
    console.error("Error fetching best sellers:", error);
  }

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setActiveIndex(swiper.realIndex);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const goPrev = () => swiperInstance?.slidePrev();
  const goNext = () => swiperInstance?.slideNext();

  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // ---------- Loading state ----------
  if (isLoading || isFetching) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 md:mb-12">
            <div>
              <div className="h-6 w-40 bg-neutral-300 dark:bg-neutral-800 rounded animate-pulse mb-2" />
              <div className="h-10 w-64 bg-neutral-300 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-72 bg-neutral-300 dark:bg-neutral-800 rounded animate-pulse mt-2" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 bg-neutral-300 dark:bg-neutral-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---------- Error state ----------
  if (error) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      >
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="text-red-500 dark:text-red-400 text-lg font-semibold">
            ⚠️ Failed to load best sellers.
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // ---------- Empty state ----------
  if (bestSellers.length === 0) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      >
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2
            className={`text-3xl sm:text-4xl font-extrabold ${styles.text} mb-4`}
          >
            No best sellers available
          </h2>
          <p className={`${styles.textMuted} max-w-lg mx-auto`}>
            Check back soon for our top-selling products.
          </p>
        </div>
      </section>
    );
  }

  // ---------- Main carousel (data loaded) ----------
  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      aria-label="Glassophite Best Sellers"
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
        animate={
          isLarge
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }
            : {}
        }
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-72 h-72 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={
          isLarge
            ? {
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.15, 0.1],
              }
            : {}
        }
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-[#3C55A5]/10 rounded-full blur-[120px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 bg-white/5 mb-4">
              <Award className="w-3.5 h-3.5 text-[#007C74]" />
              <span
                className={`text-[10px] md:text-xs ${styles.textMuted} tracking-wider font-extrabold`}
                data-translate="bestseller.badge"
              >
                CUSTOMER FAVORITES
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              <span className={styles.text}>Best</span>{" "}
              <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
                Sellers
              </span>
            </h2>

            <p
              className={`text-xs sm:text-sm ${styles.textMuted} max-w-xl`}
              data-translate="bestseller.description"
            >
              Join thousands of satisfied customers who trust Glassophite for
              premium quality and timeless style.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={toggleAutoplay}
              className={`p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200`}
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={goPrev}
              className={`p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={goNext}
              className={`p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            loop={true}
            spaceBetween={12}
            slidesPerView={1.1}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 0.5,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            breakpoints={{
              380: { slidesPerView: 1.3, spaceBetween: 12 },
              480: { slidesPerView: 1.6, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 16 },
              768: { slidesPerView: 2.7, spaceBetween: 20, freeMode: false },
              1024: { slidesPerView: 3.3, spaceBetween: 24, freeMode: false },
              1280: { slidesPerView: 4, spaceBetween: 24, freeMode: false },
            }}
            className="!px-1"
          >
            {bestSellers.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto pb-4">
                <motion.div
                  className="h-full"
                  whileHover={isLarge ? { scale: 1.02, y: -4 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile Swipe Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            className="flex sm:hidden items-center justify-center gap-1 mt-2"
          >
            <div className="w-12 h-1 rounded-full bg-[#007C74]/30">
              <motion.div
                animate={{
                  x: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-4 h-full rounded-full bg-[#007C74]"
              />
            </div>
            <span
              className={`text-[10px] ${styles.textMutedLighter} ml-2 font-bold`}
            >
              Swipe to explore
            </span>
          </motion.div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {bestSellers.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperInstance?.slideToLoop(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? "w-6 bg-[#007C74]"
                    : "w-1.5 bg-neutral-500/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link href="/shop?sort=rating">
            <motion.button
              whileHover={isLarge ? { scale: 1.05 } : {}}
              whileTap={isLarge ? { scale: 0.95 } : {}}
              className="group px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white font-semibold inline-flex items-center gap-2 text-sm"
            >
              <span data-translate="bestseller.viewAll">
                See All Best Sellers
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50"
        >
          {[
            { number: "10K+", text: "Happy Customers", key: "customers" },
            { number: "95%", text: "Satisfaction Rate", key: "satisfaction" },
            { number: "50K+", text: "Products Sold", key: "sold" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={isLarge ? { y: -2 } : {}}
            >
              <div className={`text-base md:text-lg font-black ${styles.text}`}>
                {item.number}
              </div>
              <div
                className={`text-[9px] md:text-xs ${styles.textMutedLighter} font-bold`}
                data-translate={`bestseller.stats.${item.key}`}
              >
                {item.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}