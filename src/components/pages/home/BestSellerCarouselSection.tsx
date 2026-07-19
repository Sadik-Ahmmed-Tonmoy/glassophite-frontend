/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ProductCard from "@/components/ui/ProductCard/ProductCard";
import { useGetBestSellersQuery } from "@/redux/features/product/productApi";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/free-mode";

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

// ─── Animation variants ──────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const controlsVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
};

const viewAllVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.6, staggerChildren: 0.1 },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function BestSellerCarouselSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isLarge = useLargeScreen();

  // ── This ref is now attached to a section that ALWAYS mounts,
  // regardless of loading/error/empty/data state, so useScroll
  // never loses track of the DOM node between renders. ──
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end start"],
  });

  const leftX = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-180, 0, 0, -180]),
    { stiffness: 120, damping: 18, mass: 0.8 }
  );

  const rightX = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [180, 0, 0, 180]),
    { stiffness: 120, damping: 18, mass: 0.8 }
  );

  const leafOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
    { stiffness: 120, damping: 20 }
  );

  const {
    data: bestSellersData,
    isLoading,
    isFetching,
    error,
  } = useGetBestSellersQuery(undefined);

  const bestSellers = (bestSellersData as any)?.data || [];

  const themeStyles = {
    dark: {
      bg: "from-black via-gray-900 to-black",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
    },
    light: {
      bg: "from-white via-white to-neutral-100",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

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

  const isLoadingState = isLoading || (isFetching && bestSellers.length === 0);
  const isErrorState = !!error;
  const isEmptyState = !isLoadingState && !isErrorState && bestSellers.length === 0;

  // ─── Single persistent section, ref always attached ──────────────
  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      aria-label="Glassophite Best Sellers"
    >
      {/* Leaf Left */}
      {!isDark && (
        <motion.div
          style={{ x: leftX, opacity: leafOpacity }}
          className="absolute left-0 top-20 w-[200px] h-[300px] md:w-[320px] md:h-[440px] z-0 pointer-events-none select-none hidden sm:block"
        >
          <Image
            src="/left-leaf.png"
            alt=""
            fill
            priority
            className="object-contain"
          />
        </motion.div>
      )}

      {/* Leaf Right */}
      {!isDark && (
        <motion.div
          style={{ x: rightX, opacity: leafOpacity, scale: 1.2 }}
          className="fixed right-0 top-20 w-[200px] h-[300px] md:w-[320px] md:h-[440px] z-0 pointer-events-none select-none hidden sm:block"
        >
          <Image
            src="/right-leaf1.png"
            alt=""
            fill
            priority
            className="object-contain"
          />
        </motion.div>
      )}

      {/* Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ opacity: isDark ? 0.12 : 0.18 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#ffffff" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Soft glow orbs */}
      <div className="absolute top-16 left-1/4 w-8 h-8 bg-[#007C74]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-9 h-96 bg-[#00A693]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ─── Loading state ─── */}
        {isLoadingState && (
          <>
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
          </>
        )}

        {/* ─── Error state ─── */}
        {isErrorState && (
          <div className="text-center">
            <div className="text-red-500 dark:text-red-400 text-lg font-semibold">
              ⚠️ Failed to load best sellers.
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Please try again later.
            </p>
          </div>
        )}

        {/* ─── Empty state ─── */}
        {isEmptyState && (
          <div className="text-center">
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${styles.text} mb-4`}>
              No best sellers available
            </h2>
            <p className={`${styles.textMuted} max-w-lg mx-auto`}>
              Check back soon for our top-selling products.
            </p>
          </div>
        )}

        {/* ─── Main content ─── */}
        {!isLoadingState && !isErrorState && !isEmptyState && (
          <>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 md:mb-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={headerVariants}
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={controlsVariants}
                className="flex items-center gap-2"
              >
                <button
                  onClick={toggleAutoplay}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200"
                  aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={goPrev}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={goNext}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200"
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
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex sm:hidden items-center justify-center gap-1 mt-2"
              >
                <div className="w-12 h-1 rounded-full bg-[#007C74]/30">
                  <motion.div
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-full rounded-full bg-[#007C74]"
                  />
                </div>
                <span className={`text-[10px] ${styles.textMutedLighter} ml-2 font-bold`}>
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={viewAllVariants}
              className="text-center mt-8"
            >
              <Link href="/shop?sort=rating">
                <motion.button
                  whileHover={isLarge ? { scale: 1.05 } : {}}
                  whileTap={isLarge ? { scale: 0.95 } : {}}
                  className="group px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white font-semibold inline-flex items-center gap-2 text-sm"
                >
                  <span data-translate="bestseller.viewAll">See All Best Sellers</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={statsVariants}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50"
            >
              {[
                { number: "10K+", text: "Happy Customers", key: "customers" },
                { number: "95%", text: "Satisfaction Rate", key: "satisfaction" },
                { number: "50K+", text: "Products Sold", key: "sold" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={statItemVariants}
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
          </>
        )}
      </div>
    </section>
  );
}