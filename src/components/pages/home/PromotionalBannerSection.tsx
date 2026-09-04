/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Tag,
  Glasses,
  Flame,
} from "lucide-react";
import { useGetActiveBannersQuery, IBanner } from "@/redux/features/banner/bannerApi";

// Default fallback luxury banners using the generated 4 dark/light assets
const DEFAULT_FALLBACK_BANNERS: IBanner[] = [
  {
    id: "banner-dark-titanium",
    title: "Visionary Elegance - Titanium Dark Series",
    subtitle: "Handcrafted Swiss HD Optics & Japanese Featherweight Titanium",
    badge: "EXCLUSIVE DROP",
    description:
      "Experience uncompromising clarity with polarized cyan gradient optics, ultra-durable corrosion-resistant black frames, and timeless silhouette.",
    imageUrl: "/assets/banners/banner_desktop_dark.jpg",
    mobileImageUrl: "/assets/banners/banner_mobile_dark.jpg",
    linkUrl: "/product-filter?category=sunglasses",
    buttonText: "Explore Dark Edition",
    discountTag: "UP TO 40% OFF",
    status: "ACTIVE",
    order: 1,
  },
  {
    id: "banner-light-gold",
    title: "Handcrafted Luxury - 24K Gold Crystal Series",
    subtitle: "Minimalist Scandinavian Aesthetic with Gold Titanium Trim",
    badge: "NEW ARRIVAL",
    description:
      "Bright champagne crystal acetate frames with dual-bridge titanium architecture and signature Glassophite UV400 lenses.",
    imageUrl: "/assets/banners/banner_desktop_light.jpg",
    mobileImageUrl: "/assets/banners/banner_mobile_light.jpg",
    linkUrl: "/product-filter?category=optical-glasses",
    buttonText: "Discover Gold Series",
    discountTag: "LIMITED RUN",
    status: "ACTIVE",
    order: 2,
  },
];

export default function PromotionalBannerSection() {
  const { data: activeBanners, isLoading } = useGetActiveBannersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayBanners = useMemo(() => {
    if (activeBanners && activeBanners.length > 0) {
      return activeBanners;
    }
    return DEFAULT_FALLBACK_BANNERS;
  }, [activeBanners]);

  const total = displayBanners.length;

  // Primary active banner to spotlight
  const currentBanner = displayBanners[currentIndex % (total || 1)] || displayBanners[0];

  // Carousel auto-advance if multiple banners exist
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(interval);
  }, [total]);

  // Optional countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!currentBanner?.expiryDate) {
      setTimeLeft(null);
      return;
    }

    const targetDate = new Date(currentBanner.expiryDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentBanner?.expiryDate]);

  if (!currentBanner) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="w-full mx-auto ">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative  overflow-hidden border border-neutral-200/80 dark:border-white/10 shadow-2xl bg-neutral-950 group"
        >
          {/* Background Media Container with Dual Desktop/Mobile Image */}
          <div className="relative w-full min-h-[460px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[580px] flex items-center">
            {/* Desktop Background Image */}
            <div className="hidden sm:block absolute inset-0">
              <Image
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-90"
              />
            </div>

            {/* Mobile Background Image (falls back to desktop) */}
            <div className="block sm:hidden absolute inset-0">
              <Image
                src={currentBanner.mobileImageUrl || currentBanner.imageUrl}
                alt={currentBanner.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-90"
              />
            </div>

            {/* Cinematic Gradient Overlays for Extreme Contrast & Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/75 sm:to-transparent" />

            {/* Ambient Lighting Glow Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#007C74]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#3C55A5]/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Banner Foreground Content */}
          <div className="container">
  <div className=" relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl w-full flex flex-col justify-center">
              {/* Badge & Discount Tags */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {currentBanner.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007C74]/25 border border-[#007C74]/40 backdrop-blur-md text-[#00A693] text-xs font-black uppercase tracking-wider shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentBanner.badge}</span>
                  </div>
                )}

                {currentBanner.discountTag && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentBanner.discountTag}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4 drop-shadow-md">
                {currentBanner.title}
              </h2>

              {/* Subtitle */}
              {currentBanner.subtitle && (
                <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-300 mb-4 leading-snug">
                  {currentBanner.subtitle}
                </p>
              )}

              {/* Description */}
              {currentBanner.description && (
                <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mb-6 leading-relaxed line-clamp-3">
                  {currentBanner.description}
                </p>
              )}

              {/* Optional Expiry Countdown Widget */}
              {timeLeft && (
                <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl max-w-md">
                  <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-[#00A693] uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Limited Time Offer Closes In</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="block text-base sm:text-lg font-black text-white font-mono">
                        {String(timeLeft.days).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-neutral-400">Days</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="block text-base sm:text-lg font-black text-white font-mono">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-neutral-400">Hours</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="block text-base sm:text-lg font-black text-white font-mono">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-neutral-400">Mins</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="block text-base sm:text-lg font-black text-amber-400 font-mono">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-neutral-400">Secs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons & Guarantee Pill */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={currentBanner.linkUrl}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#007C74] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_10px_25px_rgba(0,124,116,0.35)] hover:shadow-[0_15px_30px_rgba(0,124,116,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer group/btn"
                >
                  <span>{currentBanner.buttonText || "Explore Collection"}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-semibold px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-[#00A693]" />
                  <span>100% Authentic Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

            {/* Carousel Pagination Dots */}
            {total > 1 && (
              <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {displayBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === i
                        ? "w-6 bg-[#00A693]"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
