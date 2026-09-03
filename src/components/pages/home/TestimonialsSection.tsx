/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Glasses,
  Heart,
  MapPin,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Verified,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useGetApprovedReviewsQuery } from "@/redux/features/review/reviewApi";

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

const LOCATIONS = [
  "Dhaka, Gulshan",
  "Chittagong, Nasirabad",
  "Sylhet, Zindabazar",
  "Dhaka, Banani",
  "Dhaka, Dhanmondi",
  "Khulna, Sonadanga",
  "Rajshahi, Shaheb Bazar",
] as const;

const PRODUCT_TAGS = [
  "Matrix Polarized Titanium",
  "Stellar Cat-Eye 24K Gold",
  "Nomad Aviator Carbon",
  "Horizon Rimless Swiss HD",
  "Apex Wayfarer Acetate",
  "Eclipse Polarized Black",
  "Vanguard Sport UV400",
] as const;

// Deterministic particles
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top: `${(i * 43 + 17) % 95}%`,
  left: `${(i * 53 + 9) % 95}%`,
  dx: ((i % 5) - 2) * 6,
  duration: 20 + (i % 6) * 3,
  delay: (i * 0.3) % 3,
}));

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "5star" | "verified">("all");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);

  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { data: reviewsData } = useGetApprovedReviewsQuery(undefined);
  const rawReviews = useMemo(
    () => (Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || []),
    [reviewsData],
  );

  // Deterministic enhanced reviews to prevent SSR/CSR hydration errors
  const allEnhancedReviews = useMemo(
    () =>
      rawReviews.map((review: any, index: number) => {
        const userName = review.name || review.user?.fullName || "Verified Customer";
        const userAvatar =
          review.profileImage ||
          review.user?.profileImage ||
          (typeof review.avatar === "string" && review.avatar.startsWith("http") ? review.avatar : null) ||
          AVATAR_IMAGES[index % AVATAR_IMAGES.length];
        const reviewId = review.id || `review-${index}`;

        return {
          ...review,
          id: reviewId,
          name: userName,
          location: review.location || LOCATIONS[index % LOCATIONS.length],
          avatar: userAvatar,
          productName: review.product?.title || review.productTitle || PRODUCT_TAGS[index % PRODUCT_TAGS.length],
          helpful: (review.helpful || ((index * 7 + 12) % 40) + 10) + (likedReviews[reviewId] ? 1 : 0),
          unhelpful: review.unhelpful || index % 3,
          date: review.date || `Jan ${1 + (index % 28)}, 2024`,
          verified: review.verified !== false,
          rating: review.rating || 5,
        };
      }),
    [rawReviews, likedReviews],
  );

  const enhancedReviews = useMemo(() => {
    if (activeFilter === "5star") {
      return allEnhancedReviews.filter((r) => r.rating === 5);
    }
    if (activeFilter === "verified") {
      return allEnhancedReviews.filter((r) => r.verified);
    }
    return allEnhancedReviews;
  }, [allEnhancedReviews, activeFilter]);

  const total = enhancedReviews.length;

  // Safe navigation handlers
  const handleNext = useCallback(() => {
    if (total > 0) {
      setActiveIndex((prev) => (prev + 1) % total);
    }
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total > 0) {
      setActiveIndex((prev) => (prev - 1 + total) % total);
    }
  }, [total]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying || isHovered || total <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, total, handleNext]);

  const toggleLike = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Memoized Stats
  const { averageRating, totalReviews, verifiedReviews, fiveStarReviews } =
    useMemo(() => {
      if (allEnhancedReviews.length === 0) {
        return {
          averageRating: "5.0",
          totalReviews: 0,
          verifiedReviews: 0,
          fiveStarReviews: 0,
        };
      }
      const avg = (
        allEnhancedReviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
        allEnhancedReviews.length
      ).toFixed(1);
      const verified = allEnhancedReviews.filter((r) => r.verified).length;
      const fiveStar = allEnhancedReviews.filter((r) => r.rating === 5).length;
      return {
        averageRating: avg,
        totalReviews: allEnhancedReviews.length,
        verifiedReviews: verified,
        fiveStarReviews: fiveStar,
      };
    }, [allEnhancedReviews]);

  const styles = useMemo(
    () =>
      isDark
        ? {
            bg: "from-black via-gray-900 to-black",
            cardBg: "bg-neutral-900/90 border-neutral-800",
            activeCardBg: "bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-[#007C74]/50 shadow-[0_20px_50px_rgba(0,124,116,0.25)]",
            text: "text-white",
            textMuted: "text-neutral-300",
            textMutedLighter: "text-neutral-400",
            border: "border-white/10",
            star: "text-amber-400",
            verified: "text-[#00A693]",
            quote: "text-white/5",
          }
        : {
            bg: "from-neutral-50 via-white to-neutral-50",
            cardBg: "bg-white/95 border-neutral-200/80 shadow-md",
            activeCardBg: "bg-[#111827] text-white border-neutral-900 shadow-[0_24px_50px_rgba(0,0,0,0.35)]",
            text: "text-neutral-900",
            textMuted: "text-neutral-600",
            textMutedLighter: "text-neutral-500",
            border: "border-neutral-200",
            star: "text-amber-400",
            verified: "text-[#007C74]",
            quote: "text-neutral-200",
          },
    [isDark],
  );

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-3 sm:px-6 md:px-10 lg:px-14 xl:px-20`}
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
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
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

      <div className="relative z-10 container mx-auto">
        {/* Section Header & Telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border border-[#007C74]/30 bg-white/5 dark:bg-white/5 mb-3 sm:mb-4 mx-auto w-fit shadow-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007C74] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007C74]" />
            </span>
            <span
              className="text-xs font-bold bg-gradient-to-r from-[#007C74] to-[#00A693] bg-clip-text text-transparent tracking-wider uppercase"
              data-translate="testimonials.badge"
            >
              Verified Customer Stories
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#007C74]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
            <span className={styles.text}>What Our</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base ${styles.textMuted} max-w-2xl mx-auto px-2 leading-relaxed`}
            data-translate="testimonials.description"
          >
            Real reviews from real trendsetters who experience the Glassophite standard in handcrafted luxury eyewear.
          </p>

          {/* Aggregate Trust Dock */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 p-3 rounded-2xl max-w-lg mx-auto border border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/30 backdrop-blur-xl shadow-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ${styles.star}`}
                  />
                ))}
              </div>
              <span className={`text-sm sm:text-base font-black ${styles.text}`}>
                {averageRating}
              </span>
              <span className={`text-xs ${styles.textMutedLighter}`}>
                ({totalReviews} reviews)
              </span>
            </div>
            <div className="w-px h-4 bg-neutral-300 dark:bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${styles.verified}`} />
              <span className={`text-xs sm:text-sm font-semibold ${styles.textMuted}`}>
                {verifiedReviews} Verified
              </span>
            </div>
            <div className="w-px h-4 bg-neutral-300 dark:bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#007C74]" />
              <span className={`text-xs sm:text-sm font-semibold ${styles.textMuted}`}>
                {fiveStarReviews} Five-Star
              </span>
            </div>
          </div>

          {/* Interactive Story Filter Pills */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => {
                setActiveFilter("all");
                setActiveIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#007C74] text-white shadow-md scale-105"
                  : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              All Stories ({allEnhancedReviews.length})
            </button>
            <button
              onClick={() => {
                setActiveFilter("5star");
                setActiveIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === "5star"
                  ? "bg-[#007C74] text-white shadow-md scale-105"
                  : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <Star className="w-3 h-3 fill-current text-amber-400" />
              5-Star Loved ({fiveStarReviews})
            </button>
            <button
              onClick={() => {
                setActiveFilter("verified");
                setActiveIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === "verified"
                  ? "bg-[#007C74] text-white shadow-md scale-105"
                  : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-[#00A693]" />
              Verified Buyers ({verifiedReviews})
            </button>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            ── 3D ARCHED / CURVED CARD DECK CAROUSEL ────────────────────
            ════════════════════════════════════════════════════════════════ */}
        <div
          className="relative w-full py-6 sm:py-10 flex flex-col items-center justify-center min-h-[440px] sm:min-h-[480px] overflow-hidden select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card Stack Deck Container */}
          <div className="relative w-full max-w-5xl h-[360px] sm:h-[400px] flex items-center justify-center">
            {enhancedReviews.map((review, idx) => {
              // Calculate circular offset distance from active index
              let offset = idx - activeIndex;
              if (total > 0) {
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;
              }

              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);

              // Hide cards that are far away from viewport
              const isVisible = absOffset <= 3;
              if (!isVisible) return null;

              // Arc physics formula
              // Rotation tilts inward/outward along the arch
              const rotateZ = offset * 4.5;
              // Translate Y pushes edge cards downwards to create the parabolic arc
              const translateY = Math.pow(offset, 2) * 12 + absOffset * 6;
              // Translate X spreads cards with smooth overlapping spacing
              const translateX = offset * (typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 210);
              // Scale center card up, outer cards down
              const scale = isCenter ? 1.08 : Math.max(0.82, 1 - absOffset * 0.08);
              // Z-Index ensures center card is always on top
              const zIndex = 40 - absOffset * 5;
              // Opacity fades out edge cards smoothly
              const opacity = isCenter ? 1 : Math.max(0.45, 1 - absOffset * 0.22);

              return (
                <motion.div
                  key={review.id || idx}
                  layout
                  animate={{
                    x: translateX,
                    y: translateY,
                    rotate: rotateZ,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                    mass: 0.8,
                  }}
                  onClick={() => setActiveIndex(idx)}
                  className={`absolute top-4 w-[280px] xs:w-[310px] sm:w-[350px] h-[310px] sm:h-[340px] rounded-2xl cursor-pointer transition-shadow duration-300 ${
                    isCenter
                      ? isDark
                        ? styles.activeCardBg
                        : "bg-[#111827] text-white border border-neutral-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-[#007C74]/50"
                      : isDark
                        ? `${styles.cardBg} border backdrop-blur-xl hover:border-neutral-700`
                        : "bg-white border border-neutral-200/90 shadow-lg hover:shadow-xl"
                  }`}
                  style={{
                    // Distinct geometric corner notch on active card
                    clipPath: isCenter
                      ? "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)"
                      : "none",
                  }}
                >
                  {/* Glowing Top Corner Notch Fold Accent for Active Card */}
                  {isCenter && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-[#007C74]/20 border-b border-l border-[#007C74]/40 pointer-events-none" />
                  )}

                  <div className="p-5 sm:p-6 h-full flex flex-col justify-between">
                    {/* Top Row: Avatar & Rating */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ${
                              isCenter ? "ring-[#007C74] shadow-md shadow-[#007C74]/20" : "ring-neutral-200 dark:ring-neutral-700"
                            } bg-gradient-to-tr from-[#007C74] to-[#3C55A5] flex items-center justify-center text-white font-bold text-sm`}
                          >
                            {review.avatar ? (
                              <Image
                                src={review.avatar}
                                alt={review.name || "Customer"}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <span>{(review.name || "C").charAt(0).toUpperCase()}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-bold truncate ${
                                isCenter
                                  ? "text-white"
                                  : isDark
                                    ? "text-white"
                                    : "text-neutral-900"
                              }`}
                            >
                              {review.name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#007C74] shrink-0" />
                              <p className="text-[10px] text-neutral-400 dark:text-neutral-400 truncate">
                                {review.location}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Top Quote Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isCenter
                              ? "bg-[#007C74]/30 text-[#00A693]"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          <Quote className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Eyewear Model Badge & Stars */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (review.rating || 5)
                                  ? "fill-current text-amber-400"
                                  : "text-neutral-500"
                              }`}
                            />
                          ))}
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isCenter
                              ? "bg-[#007C74]/25 text-[#00A693] border border-[#007C74]/30"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          <Glasses className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[120px]">{review.productName}</span>
                        </span>
                      </div>

                      {/* Review Comment */}
                      <p
                        className={`text-xs sm:text-sm leading-relaxed line-clamp-4 font-normal ${
                          isCenter
                            ? "text-neutral-200"
                            : isDark
                              ? "text-neutral-300"
                              : "text-neutral-600"
                        }`}
                      >
                        &quot;{review.comment}&quot;
                      </p>
                    </div>

                    {/* Card Footer: Helpful reaction & Verified status */}
                    <div className="pt-3 border-t border-neutral-700/40 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                      {review.verified ? (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#00A693]">
                          <Verified className="w-3.5 h-3.5" />
                          <span data-translate="testimonials.verified">Verified Order</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400">{review.date}</span>
                      )}

                      {/* Helpful Button */}
                      <button
                        onClick={(e) => toggleLike(review.id, e)}
                        className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer active:scale-90 ${
                          likedReviews[review.id]
                            ? "bg-[#007C74] text-white border-[#007C74]"
                            : isCenter
                              ? "border-neutral-700 bg-neutral-800/80 text-neutral-300 hover:border-[#007C74]/60"
                              : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-[#007C74]/60"
                        }`}
                        aria-label="Helpful review"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedReviews[review.id] ? "fill-current text-rose-400" : ""}`} />
                        <span>{review.helpful}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Symmetrical Control Bar & Slide Counter */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8 z-20">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-center cursor-pointer bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-800 dark:text-neutral-200 active:scale-90 shadow-sm"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Slide Index Pill */}
            <div className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold shadow-xs">
              <span className="text-[#007C74] font-black">
                {String((activeIndex % (total || 1)) + 1).padStart(2, "0")}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-500">{String(total || 1).padStart(2, "0")}</span>
            </div>

            {/* Autoplay Pause/Play */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-center cursor-pointer bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-800 dark:text-neutral-200 active:scale-90 shadow-sm"
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-center cursor-pointer bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-800 dark:text-neutral-200 active:scale-90 shadow-sm"
              aria-label="Next review"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}


