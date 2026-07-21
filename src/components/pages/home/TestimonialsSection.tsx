/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Quote,
  Sparkles,
  Star,
  Verified,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef, useState, useMemo } from "react";
import type { Swiper as SwiperType } from "swiper";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";

// Swiper styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/effect-coverflow";

// Demo avatar images
const AVATAR_IMAGES = [
  "https://images.unsplash.com/photo-1494790108777-28675f72b7b7?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531427186111-516fd60ff1bc?w=200&auto=format&fit=crop",
] as const;

const LOCATIONS = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi"] as const;

// Deterministic particles
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top: `${((i * 43 + 17) % 95)}%`,
  left: `${((i * 53 + 9) % 95)}%`,
  dx: ((i % 5) - 2) * 6,
  duration: 20 + (i % 6) * 3,
  delay: (i * 0.3) % 3,
}));

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { data: reviewsData } = useGetAllReviewsQuery(undefined);
  const rawReviews = useMemo(
    () => (Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || []),
    [reviewsData]
  );

  // Deterministic enhanced reviews to prevent SSR/CSR hydration errors
  const enhancedReviews = useMemo(
    () =>
      rawReviews.map((review: any, index: number) => ({
        ...review,
        location: LOCATIONS[index % LOCATIONS.length],
        avatar: review.profileImage || AVATAR_IMAGES[index % AVATAR_IMAGES.length],
        helpful: review.helpful || ((index * 7 + 12) % 40) + 10,
        unhelpful: review.unhelpful || (index % 3),
        date:
          review.date ||
          `Jan ${1 + (index % 28)}, 2024`,
      })),
    [rawReviews]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Memoized Stats
  const { averageRating, totalReviews, verifiedReviews, fiveStarReviews } = useMemo(() => {
    if (enhancedReviews.length === 0) {
      return { averageRating: "5.0", totalReviews: 0, verifiedReviews: 0, fiveStarReviews: 0 };
    }
    const avg = (
      enhancedReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / enhancedReviews.length
    ).toFixed(1);
    const verified = enhancedReviews.filter((r) => r.verified).length;
    const fiveStar = enhancedReviews.filter((r) => r.rating === 5).length;
    return {
      averageRating: avg,
      totalReviews: enhancedReviews.length,
      verifiedReviews: verified,
      fiveStarReviews: fiveStar,
    };
  }, [enhancedReviews]);

  const styles = useMemo(
    () =>
      isDark
        ? {
            bg: "from-black via-gray-900 to-black",
            card: "bg-white/5 border-white/10",
            text: "text-white",
            textMuted: "text-neutral-300",
            textMutedLighter: "text-neutral-400",
            border: "border-white/10",
            star: "text-yellow-400",
            verified: "text-[#00A693]",
            quote: "text-white/5",
            swiperPagination: "bg-white/20",
            swiperPaginationActive: "bg-[#007C74]",
          }
        : {
            bg: "from-neutral-50 via-white to-neutral-50",
            card: "bg-white/80 border-neutral-200/80 shadow-sm",
            text: "text-neutral-900",
            textMuted: "text-neutral-600",
            textMutedLighter: "text-neutral-500",
            border: "border-neutral-200",
            star: "text-amber-500",
            verified: "text-[#007C74]",
            quote: "text-neutral-200",
            swiperPagination: "bg-neutral-300",
            swiperPaginationActive: "bg-[#007C74]",
          },
    [isDark]
  );

  const toggleAutoplay = () => {
    if (swiper) {
      if (isPlaying) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20`}
      aria-label="Glassophite Customer Testimonials"
    >
      {/* Dot Grid Background */}
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
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-5 sm:top-20 sm:left-20 w-[clamp(180px,25vw,384px)] h-[clamp(180px,25vw,384px)] bg-[#007C74]/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-[clamp(220px,30vw,500px)] h-[clamp(220px,30vw,500px)] bg-[#3C55A5]/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none"
      />

      {/* Floating Quote Marks */}
      <motion.div
        style={{ rotate }}
        className="absolute top-20 right-20 opacity-10 hidden lg:block pointer-events-none"
      >
        <Quote className="w-24 h-24 sm:w-32 sm:h-32 text-[#007C74]" />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-[#007C74]/20"}`}
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [0, -28, 0],
              x: [0, p.dx, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
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
              data-translate="testimonials.badge"
            >
              Customer Stories
            </span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3C55A5]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            <span className={styles.text}>What Our</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto px-2 leading-relaxed`}
            data-translate="testimonials.description"
          >
            Real reviews from real customers who have experienced the Glassophite difference.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-5 sm:mt-6">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ${styles.star}`}
                  />
                ))}
              </div>
              <span className={`text-sm sm:text-base font-bold ${styles.text}`}>
                {averageRating}
              </span>
              <span className={`text-xs ${styles.textMutedLighter}`}>
                ({totalReviews} reviews)
              </span>
            </div>
            <div className="w-px h-4 bg-neutral-300 dark:bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Verified className={`w-4 h-4 ${styles.verified}`} />
              <span className={`text-xs sm:text-sm ${styles.textMuted}`}>
                {verifiedReviews} Verified
              </span>
            </div>
            <div className="w-px h-4 bg-neutral-300 dark:bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#007C74]" />
              <span className={`text-xs sm:text-sm ${styles.textMuted}`}>
                {fiveStarReviews} Five-Star
              </span>
            </div>
          </div>
        </motion.div>

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 80,
              modifier: 1,
              slideShadows: false,
            }}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass: `swiper-pagination-bullet ${styles.swiperPagination}`,
              bulletActiveClass: `swiper-pagination-bullet-active ${styles.swiperPaginationActive}`,
            }}
            navigation={false}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              640: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="testimonials-swiper"
          >
            {enhancedReviews.map((review) => (
              <SwiperSlide key={review.id || review.name}>
                <div
                  className={`relative p-5 sm:p-6 rounded-2xl backdrop-blur-sm border ${styles.card} h-full transition-all duration-300 flex flex-col justify-between`}
                >
                  <Quote className={`absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 ${styles.quote}`} />

                  <div>
                    {/* Rating */}
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (review.rating || 5)
                              ? `fill-current ${styles.star}`
                              : "text-gray-300 dark:text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Content */}
                    <p className={`text-xs sm:text-sm ${styles.textMuted} mb-4 leading-relaxed line-clamp-4`}>
                      &quot;{review.comment}&quot;
                    </p>
                  </div>

                  <div>
                    {/* Customer Info */}
                    <div className="flex items-center gap-3 mb-3 pt-3 border-t border-neutral-200/40 dark:border-white/10">
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-[#007C74]/20">
                        <Image
                          src={review.avatar ?? "/placeholder.svg"}
                          alt={review.name || "Customer"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-bold ${styles.text} truncate`}>
                          {review.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#007C74] shrink-0" />
                          <p className={`text-[10px] sm:text-xs ${styles.textMutedLighter} truncate`}>
                            {review.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{review.date}</span>
                      </div>
                      {review.verified && (
                        <div className="flex items-center gap-1 font-semibold">
                          <Verified className={`w-3 h-3 ${styles.verified}`} />
                          <span data-translate="testimonials.verified">Verified Order</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6 sm:mt-8">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => swiper?.slidePrev()}
                className={`p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200 active:scale-95`}
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={toggleAutoplay}
                className={`p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200 active:scale-95`}
                aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>

            <div className="swiper-pagination !relative !w-auto !bottom-0" />

            <button
              onClick={() => swiper?.slideNext()}
              className={`p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer bg-white/70 dark:bg-black/50 text-neutral-800 dark:text-neutral-200 active:scale-95`}
              aria-label="Next slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}