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
  ThumbsDown,
  ThumbsUp,
  Verified,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// ... other imports

// Import Swiper styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/effect-coverflow";



import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";

// Demo avatar images (in production, these would come from your data)
const avatarImages = [
  "https://images.unsplash.com/photo-1494790108777-28675f72b7b7?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531427186111-516fd60ff1bc?w=200&auto=format&fit=crop",
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewLikes, setReviewLikes] = useState<{
    [key: string]: {
      helpful: number;
      unhelpful: number;
      userHelpful: boolean;
      userUnhelpful: boolean;
    };
  }>({});

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { data: reviewsData } = useGetAllReviewsQuery(undefined);
  const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || [];

  // Enhanced reviews with additional data
  const enhancedReviews = reviews.map((review: any, index: number) => ({
    ...review,
    location: ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi"][index % 5],
    avatar: review.profileImage || avatarImages[index % avatarImages.length],
    helpful: review.helpful || Math.floor(Math.random() * 50) + 10,
    unhelpful: review.unhelpful || Math.floor(Math.random() * 5),
    date:
      review.date ||
      new Date(2024, index, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
  }));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Calculate stats
  const averageRating = (
    enhancedReviews.reduce((acc, review) => acc + review.rating, 0) /
    enhancedReviews.length
  ).toFixed(1);

  const totalReviews = enhancedReviews.length;
  const verifiedReviews = enhancedReviews.filter((r) => r.verified).length;
  const fiveStarReviews = enhancedReviews.filter((r) => r.rating === 5).length;

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
      star: "text-yellow-400",
      verified: "text-blue-400",
      quote: "text-white/5",
      swiperPagination: "bg-white/20",
      swiperPaginationActive: "bg-[#007C74]",
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
      star: "text-yellow-500",
      verified: "text-blue-600",
      quote: "text-neutral-200",
      swiperPagination: "bg-neutral-300",
      swiperPaginationActive: "bg-[#007C74]",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Handle autoplay toggle
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

  // Handle helpful click
  const handleHelpful = (reviewId: string, currentHelpful: number) => {
    setReviewLikes((prev) => {
      const current = prev[reviewId] || {
        helpful: currentHelpful,
        unhelpful: 0,
        userHelpful: false,
        userUnhelpful: false,
      };

      // If already marked as helpful, remove the like
      if (current.userHelpful) {
        return {
          ...prev,
          [reviewId]: {
            ...current,
            helpful: current.helpful - 1,
            userHelpful: false,
          },
        };
      }

      // If marked as unhelpful before, remove that first
      if (current.userUnhelpful) {
        return {
          ...prev,
          [reviewId]: {
            helpful: current.helpful + 1,
            unhelpful: current.unhelpful - 1,
            userHelpful: true,
            userUnhelpful: false,
          },
        };
      }

      // New like
      return {
        ...prev,
        [reviewId]: {
          ...current,
          helpful: current.helpful + 1,
          userHelpful: true,
        },
      };
    });
  };

  // Handle unhelpful click
  const handleUnhelpful = (reviewId: string, currentUnhelpful: number) => {
    setReviewLikes((prev) => {
      const current = prev[reviewId] || {
        helpful: 0,
        unhelpful: currentUnhelpful,
        userHelpful: false,
        userUnhelpful: false,
      };

      // If already marked as unhelpful, remove the dislike
      if (current.userUnhelpful) {
        return {
          ...prev,
          [reviewId]: {
            ...current,
            unhelpful: current.unhelpful - 1,
            userUnhelpful: false,
          },
        };
      }

      // If marked as helpful before, remove that first
      if (current.userHelpful) {
        return {
          ...prev,
          [reviewId]: {
            helpful: current.helpful - 1,
            unhelpful: current.unhelpful + 1,
            userHelpful: false,
            userUnhelpful: true,
          },
        };
      }

      // New dislike
      return {
        ...prev,
        [reviewId]: {
          ...current,
          unhelpful: current.unhelpful + 1,
          userUnhelpful: true,
        },
      };
    });
  };

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      aria-label="Glassophite Customer Testimonials"
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

      {/* Animated Gradient Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-80 h-80 md:w-[500px] md:h-[500px] bg-[#3C55A5]/10 rounded-full blur-[120px]"
      />

      {/* Floating Quote Marks */}
      <motion.div
        style={{ rotate }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block"
      >
        <Quote className="w-32 h-32 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ rotate: useTransform(rotate, (v) => -v) }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block"
      >
        <Quote className="w-40 h-40 text-[#3C55A5]" />
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 mb-6 mx-auto w-fit"
          >
            <Sparkles className="w-4 h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm ${styles.textMuted} tracking-wider uppercase`}
              data-translate="testimonials.badge"
            >
              Customer Stories
            </span>
            <Award className="w-4 h-4 text-[#3C55A5]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className={styles.text}>What Our</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-sm sm:text-base md:text-lg ${styles.textMuted} max-w-2xl mx-auto px-4`}
            data-translate="testimonials.description"
          >
            Real reviews from real customers who have experienced the
            Glassophite difference.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 fill-current ${styles.star}`}
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
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Verified className={`w-4 h-4 ${styles.verified}`} />
              <span className={`text-xs sm:text-sm ${styles.textMuted}`}>
                {verifiedReviews} Verified
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#007C74]" />
              <span className={`text-xs sm:text-sm ${styles.textMuted}`}>
                {fiveStarReviews} Five-Star
              </span>
            </div>
          </div>
        </motion.div>

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass: `swiper-pagination-bullet ${styles.swiperPagination}`,
              bulletActiveClass: `swiper-pagination-bullet-active ${styles.swiperPaginationActive}`,
            }}
            navigation={false} // Disable default Swiper navigation to use custom buttons
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="testimonials-swiper"
          >
            {enhancedReviews.map((review) => {
              const likeState = reviewLikes[review.id || ""] || {
                helpful: review.helpful || 0,
                unhelpful: review.unhelpful || 0,
                userHelpful: false,
                userUnhelpful: false,
              };

              return (
                <SwiperSlide key={review.id}>
                  <motion.div
                    className={`relative p-6 rounded-xl backdrop-blur-sm border ${styles.card} h-full transition-all duration-300 hover:scale-105`}
                  >
                    {/* Quote Icon */}
                    <Quote
                      className={`absolute top-4 right-4 w-8 h-8 ${styles.quote}`}
                    />

                    {/* Rating */}
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating
                              ? `fill-current ${styles.star}`
                              : "text-gray-400"
                            }`}
                        />
                      ))}
                    </div>

                    {/* Review Content */}
                    <p
                      className={`text-xs sm:text-sm ${styles.textMuted} mb-4 line-clamp-4`}
                    >
                      &quot;{review.comment}&quot;
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#007C74]/20">
                        <Image
                          src={review.avatar ?? review.profileImage ?? "/placeholder.svg"}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-medium ${styles.text} truncate`}
                        >
                          {review.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#007C74]" />
                          <p
                            className={`text-[10px] sm:text-xs ${styles.textMutedLighter} truncate`}
                          >
                            {review.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs ${styles.textMutedLighter}">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{review.date}</span>
                      </div>
                      {review.verified && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Verified
                              className={`w-2.5 h-2.5 ${styles.verified}`}
                            />
                            <span data-translate="testimonials.verified">
                              Verified
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Helpful/Unhelpful */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            review.id &&
                            handleHelpful(review.id, review.helpful || 0)
                          }
                          className={`flex items-center gap-1 transition-all duration-200 rounded-full px-2 py-1 ${likeState.userHelpful
                              ? "text-[#007C74] bg-[#007C74]/10"
                              : "hover:bg-[#007C74]/10 hover:text-[#007C74]"
                            }`}
                        >
                          <ThumbsUp
                            className={`w-3 h-3 transition-transform group-active:scale-90 ${likeState.userHelpful ? "fill-current" : ""
                              }`}
                          />
                          <span className="text-[10px] sm:text-xs font-medium">
                            {likeState.helpful}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            review.id &&
                            handleUnhelpful(review.id, review.unhelpful || 0)
                          }
                          className={`flex items-center gap-1 transition-all duration-200 rounded-full px-2 py-1 ${likeState.userUnhelpful
                              ? "text-[#007C74] bg-[#007C74]/10"
                              : "hover:bg-[#007C74]/10 hover:text-[#007C74]"
                            }`}
                        >
                          <ThumbsDown
                            className={`w-3 h-3 transition-transform group-active:scale-90 ${likeState.userUnhelpful ? "fill-current" : ""
                              }`}
                          />
                          <span className="text-[10px] sm:text-xs font-medium">
                            {likeState.unhelpful}
                          </span>
                        </button>
                      </div>

                      {/* Review Images Indicator */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-[#007C74]" />
                          <span className="text-[10px] sm:text-xs">
                            {review.images.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Improved Controls Container */}
          <div className="flex items-center justify-between mt-8">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => swiper?.slidePrev()}
                className={`group relative p-2.5 rounded-full border-2 transition-all duration-200 ${styles.border} hover:border-[#007C74] hover:bg-[#007C74]/10 focus:outline-none focus:ring-2 focus:ring-[#007C74]/50`}
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Autoplay Control */}
              <button
                onClick={toggleAutoplay}
                className={`group relative p-2.5 rounded-full border-2 transition-all duration-200 ${styles.border} hover:border-[#007C74] hover:bg-[#007C74]/10 focus:outline-none focus:ring-2 focus:ring-[#007C74]/50`}
                aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 transition-transform group-hover:scale-105" />
                ) : (
                  <Play className="w-4 h-4 transition-transform group-hover:scale-105 ml-0.5" />
                )}
              </button>
            </div>

            {/* Pagination Container */}
            <div className="swiper-pagination !relative !w-auto !bottom-0" />

            {/* Right Control */}
            <button
              onClick={() => swiper?.slideNext()}
              className={`group relative p-2.5 rounded-full border-2 transition-all duration-200 ${styles.border} hover:border-[#007C74] hover:bg-[#007C74]/10 focus:outline-none focus:ring-2 focus:ring-[#007C74]/50`}
              aria-label="Next slide"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Optimized Custom Styles for Swiper */}
      <style jsx global>{`
        .testimonials-swiper {
          padding: 20px 0 40px 0;
          will-change: transform;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          margin: 0 4px;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          opacity: 0.5;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          opacity: 1;
        }

        .testimonials-swiper .swiper-slide {
          transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.3s ease;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .testimonials-swiper .swiper-slide-active {
          transform: scale(1.02);
          z-index: 10;
        }

        .testimonials-swiper .swiper-slide-next,
        .testimonials-swiper .swiper-slide-prev {
          opacity: 0.75;
        }

        @media (max-width: 768px) {
          .testimonials-swiper .swiper-slide-active {
            transform: scale(1);
          }
        }

        /* Improve button tap highlight on mobile */
        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </motion.section>
  );
}