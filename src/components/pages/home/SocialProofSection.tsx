"use client";

import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  MessageCircle,
  Quote,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  Users,
  Verified,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SocialProofSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeReview, setActiveReview] = useState(0);
  const { data: allProductsData } = useGetAllProductsQuery(undefined);

  const { data: reviewsData } = useGetAllReviewsQuery(undefined);
  const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || [];
  const allProducts = Array.isArray(allProductsData) ? allProductsData : allProductsData?.data || [];

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Calculate average ratings
  const averageRating = (
    reviews.reduce((acc, review) => acc + review.rating, 0) /
    reviews.length
  ).toFixed(1);

  const totalReviews = reviews.length;
  const verifiedReviews = reviews.filter((r) => r.verified).length;

  // Get customer images from products
  const customerImages = allProducts
    .flatMap((p) =>
      p.variants.flatMap((v) => v.imgList.map((img) => img.image)),
    )
    .filter((_, index) => index < 8);

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
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6`}
      aria-label="Glassophite Customer Reviews and Social Proof"
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

      {/* Floating Quote Marks */}
      <motion.div
        style={{ scale }}
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-40 right-40 opacity-10 hidden lg:block"
      >
        <Quote className="w-24 h-24 text-[#007C74]" />
      </motion.div>

      <motion.div
        style={{ scale }}
        animate={{
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-40 left-40 opacity-10 hidden lg:block"
      >
        <Quote className="w-32 h-32 text-[#3C55A5]" />
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
            <Users className="w-4 h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm ${styles.textMuted} tracking-wider uppercase`}
              data-translate="social.badge"
            >
              Trusted by Thousands
            </span>
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
            data-translate="social.description"
          >
            Join thousands of satisfied customers who trust Glassophite for
            premium eyewear.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 lg:mb-16"
        >
          {[
            {
              icon: Star,
              value: averageRating,
              label: "Average Rating",
              suffix: "/5",
              key: "rating",
            },
            {
              icon: MessageCircle,
              value: totalReviews,
              label: "Verified Reviews",
              suffix: "+",
              key: "reviews",
            },
            {
              icon: Users,
              value: "10k+",
              label: "Happy Customers",
              suffix: "",
              key: "customers",
            },
            {
              icon: Globe,
              value: "15+",
              label: "Countries",
              suffix: "",
              key: "countries",
            },
          ].map((stat) => (
            <motion.div
              key={stat.key}
              whileHover={{ y: -5 }}
              className={`p-4 sm:p-6 rounded-xl backdrop-blur-sm border ${styles.card} text-center`}
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#007C74] mx-auto mb-2" />
              <div className="flex items-center justify-center gap-1">
                <span
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold ${styles.text}`}
                >
                  {stat.value}
                </span>
                <span
                  className={`text-xs sm:text-sm ${styles.textMutedLighter}`}
                >
                  {stat.suffix}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm ${styles.textMutedLighter}`}
                data-translate={`social.stats.${stat.key}`}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Review Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 lg:mb-16"
        >
          <div
            className={`relative p-6 sm:p-8 lg:p-10 rounded-2xl backdrop-blur-md border-2 ${styles.borderGlow} ${styles.card}`}
          >
            {/* Quote Icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-10 text-[#007C74]" />

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-center">
              {/* Reviewer Info */}
              <motion.div
                key={`reviewer-${activeReview}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  {/* Avatar Placeholder with Initials */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] flex items-center justify-center mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {(reviews[activeReview].name ?? "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>

                  <h3
                    className={`text-lg sm:text-xl font-semibold ${styles.text} mb-1`}
                  >
                    {reviews[activeReview].name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < reviews[activeReview].rating
                              ? `fill-current ${styles.star}`
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    {reviews[activeReview].verified && (
                      <div className="flex items-center gap-1">
                        <Verified
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${styles.verified}`}
                        />
                        <span
                          className={`text-[10px] sm:text-xs ${styles.textMutedLighter}`}
                          data-translate="social.verified"
                        >
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  <p className={`text-xs ${styles.textMutedLighter} mb-2`}>
                    {reviews[activeReview].date}
                  </p>

                  {/* Helpful Count */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
                      <span className={`text-xs ${styles.textMutedLighter}`}>
                        {reviews[activeReview].helpful}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() =>
                  setActiveReview(
                    (prev) =>
                      (prev - 1 + reviews.length) % reviews.length,
                  )
                }
                className={`p-2 rounded-full border ${styles.border} hover:bg-[#007C74]/10 transition-colors`}
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveReview(index)}
                    className={`transition-all duration-300 ${
                      activeReview === index
                        ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#007C74] rounded-full"
                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20 rounded-full hover:bg-white/40"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setActiveReview((prev) => (prev + 1) % reviews.length)
                }
                className={`p-2 rounded-full border ${styles.border} hover:bg-[#007C74]/10 transition-colors`}
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Customer Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <h3
            className={`text-lg sm:text-xl font-semibold ${styles.text} mb-4 text-center`}
            data-translate="social.gallery"
          >
            Our Community in Glassophite
          </h3>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {customerImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
                  src={image}
                  alt={`Customer ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 25vw, 12.5vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rating Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Rating Bars */}
          <div
            className={`p-6 rounded-xl backdrop-blur-sm border ${styles.card}`}
          >
            <h4
              className={`text-base sm:text-lg font-semibold ${styles.text} mb-4`}
              data-translate="social.breakdown"
            >
              Rating Breakdown
            </h4>

            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(
                (r) => r.rating === rating,
              ).length;
              const percentage = (count / totalReviews) * 100;

              return (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs sm:text-sm ${styles.textMuted} w-8`}
                  >
                    {rating}★
                  </span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${percentage}%` } : {}}
                      transition={{ duration: 1, delay: 0.7 + rating * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
                    />
                  </div>
                  <span className={`text-xs ${styles.textMutedLighter} w-8`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div
            className={`p-6 rounded-xl backdrop-blur-sm border ${styles.card}`}
          >
            <h4
              className={`text-base sm:text-lg font-semibold ${styles.text} mb-4`}
              data-translate="social.trust"
            >
              Trust & Safety
            </h4>

            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  text: "100% Authentic Products",
                  value: "Verified",
                  key: "authentic",
                },
                {
                  icon: Verified,
                  text: "Verified Reviews",
                  value: `${verifiedReviews}/${totalReviews}`,
                  key: "verified",
                },
                {
                  icon: Award,
                  text: "Award Winning Service",
                  value: "2024",
                  key: "award",
                },
                {
                  icon: Clock,
                  text: "Member Since",
                  value: "2024",
                  key: "member",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-[#007C74]" />
                    <span
                      className={`text-xs sm:text-sm ${styles.textMuted}`}
                      data-translate={`social.trustItems.${item.key}`}
                    >
                      {item.text}
                    </span>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${styles.text}`}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* All Reviews Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center"
        >
          <Link href="/reviews">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-sm sm:text-base font-medium inline-flex items-center gap-2"
            >
              <span data-translate="social.viewAll">View All Reviews</span>
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </Link>

          {/* Write Review Link */}
          <Link href="/write-review">
            <motion.button
              whileHover={{ x: 5 }}
              className={`inline-flex items-center gap-1 text-xs sm:text-sm ${styles.textMutedLighter} hover:text-[#007C74] transition-colors mt-4`}
            >
              <span data-translate="social.writeReview">Write a Review</span>
              <Share2 className="w-3 h-3" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
