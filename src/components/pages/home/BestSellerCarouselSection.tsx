/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import ProductCard from "@/components/ui/ProductCard/ProductCard";
import { mockProducts } from "@/lib/productMockData";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Award, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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

export default function BestSellerCarouselSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const isLarge = useLargeScreen();

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Sort products by rating and reviews to get best sellers
  const bestSellers = [...mockProducts]
    .sort((a, b) => {
      const aScore = (a.averageRating || 0) * (a.totalReviews || 0);
      const bScore = (b.averageRating || 0) * (b.totalReviews || 0);
      return bScore - aScore;
    })
    .slice(0, 8);

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
      navButton: "bg-white/70 border-neutral-200 hover:bg-white text-neutral-900",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const goPrev = () => {
    swiperInstance?.slidePrev();
  };

  const goNext = () => {
    swiperInstance?.slideNext();
  };

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

      {/* Floating Orbs - with conditional animation */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py- rounded-full backdrop-blur-sm border border-white/10 mb-4 md:mb-6"
          >
            <Award className="w-3 h-3 md:w-4 md:h-4 text-[#007C74]" />
            <span
              className={`text-xs md:text-sm ${styles.textMuted} tracking-wider`}
              data-translate="bestseller.badge"
            >
              CUSTOMER FAVORITES
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4">
            <span className={styles.text}>Best</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Sellers
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto px-4`}
            data-translate="bestseller.description"
          >
            Join thousands of satisfied customers who trust Glassophite for
            premium quality and timeless style.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons - with enhanced animations on large screens */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: isBeginning ? 0.5 : 1, x: 0 } : {}}
            onClick={goPrev}
            className={`absolute -left-2 md:-left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
              styles.navButton
            } ${"opacity-0 group-hover:opacity-100 cursor-pointer"} hidden sm:block`}
            aria-label="Previous slide"
            whileHover={isLarge ? { scale: 1.1 } : {}}
            whileTap={isLarge ? { scale: 0.9 } : {}}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: isEnd ? 0.5 : 1, x: 0 } : {}}
            onClick={goNext}
            className={`absolute -right-2 md:-right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
              styles.navButton
            } ${"opacity-0 group-hover:opacity-100 cursor-pointer"} hidden sm:block`}
            aria-label="Next slide"
            whileHover={isLarge ? { scale: 1.1 } : {}}
            whileTap={isLarge ? { scale: 0.9 } : {}}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          {/* Autoplay Control - only on large screens */}
          {isLarge && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              onClick={toggleAutoplay}
              className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-20 z-20 p-2 rounded-full backdrop-blur-sm border bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 text-white hidden lg:flex items-center gap-1"
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-xs font-medium">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </motion.button>
          )}

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            loop={true}
            spaceBetween={12}
            slidesPerView={1.2}
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
              480: {
                slidesPerView: 1.5,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
                freeMode: false,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 24,
                freeMode: false,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
                freeMode: false,
              },
            }}
            className="!px-2 md:!px-4"
          >
            {bestSellers.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <motion.div
                  className="h-full"
                  whileHover={isLarge ? { scale: 1.03, y: -5 } : {}}
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
            className="flex sm:hidden items-center justify-center gap-1 mt-4"
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
            <span className={`text-xs ${styles.textMutedLighter} ml-2`}>
              Swipe to explore
            </span>
          </motion.div>

          {/* Progress Dots - Mobile only */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4">
            {bestSellers.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperInstance?.slideTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  swiperInstance?.activeIndex === index
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
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center mt-10"
        >
          <Link href="/shop?sort=rating">
            <motion.button
              whileHover={isLarge ? { scale: 1.05 } : {}}
              whileTap={isLarge ? { scale: 0.95 } : {}}
              className="group px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white font-medium inline-flex items-center gap-2 text-sm md:text-base"
            >
              <span data-translate="bestseller.viewAll">
                See All Best Sellers
              </span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 border-t border-white/10"
        >
          {[
            { number: "10K+", text: "Happy Customers", key: "customers" },
            { number: "95%", text: "Satisfaction Rate", key: "satisfaction" },
            { number: "50K+", text: "Products Sold", key: "sold" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={isLarge ? { y: -3 } : {}}
            >
              <div
                className={`text-base md:text-lg lg:text-xl font-bold ${styles.text}`}
              >
                {item.number}
              </div>
              <div
                className={`text-[10px] md:text-xs ${styles.textMutedLighter}`}
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