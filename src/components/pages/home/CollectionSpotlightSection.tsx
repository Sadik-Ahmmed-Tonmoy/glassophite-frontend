/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, Award, Compass, ShieldCheck, Gem, Star } from "lucide-react";
import { useTheme } from "next-themes";

const getThemeStyles = (isDark: boolean) => ({
  background: isDark 
    ? "from-black via-gray-900 to-black" 
    : "from-neutral-50 via-white to-neutral-50",
  text: isDark ? "text-white" : "text-neutral-900",
  textMuted: isDark ? "text-neutral-400" : "text-neutral-600",
  border: isDark ? "border-white/10" : "border-neutral-200",
  glassBg: isDark ? "bg-white/5 backdrop-blur-md" : "bg-white/70 backdrop-blur-md",
  orbPrimary: isDark ? "bg-[#007C74]/20" : "bg-[#007C74]/10",
  orbSecondary: isDark ? "bg-[#3C55A5]/25" : "bg-[#3C55A5]/10",
});

export default function CollectionSpotlightSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = getThemeStyles(isDark);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const [isLarge, setIsLarge] = useState(false);
  useEffect(() => {
    const check = () => setIsLarge(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const spotlights = [
    {
      title: "New Arrivals",
      subtitle: "Unveil The Future",
      description: "Discover fresh releases, limited drops, and handcrafted styles of the season.",
      badge: "JUST RELEASED",
      badgeIcon: Sparkles,
      link: "/product-filter?category=New Arrivals",
      glowColor: "bg-[#007C74]/20",
      glowHover: "group-hover:bg-[#007C74]/35",
      borderTheme: "border-[#007C74]/20",
      buttonBg: "from-[#007C74] to-[#00A693]",
      editorialGradient: isDark 
        ? "from-[#007C74]/20 via-black/40 to-neutral-900/10"
        : "from-[#007C74]/5 via-white/50 to-neutral-100/10",
      features: [
        { icon: Gem, label: "Italian Acetate" },
        { icon: ShieldCheck, label: "100% UV Protect" },
      ],
      buttonText: "Unveil Latest",
    },
    {
      title: "Trending Now",
      subtitle: "Set The Standard",
      description: "Explore the eye-catching frames setting the trend for creators and designers.",
      badge: "POPULAR DEMAND",
      badgeIcon: Flame,
      link: "/product-filter?category=Trending",
      glowColor: "bg-[#3C55A5]/20",
      glowHover: "group-hover:bg-[#3C55A5]/35",
      borderTheme: "border-[#3C55A5]/20",
      buttonBg: "from-[#3C55A5] to-[#6366F1]",
      editorialGradient: isDark 
        ? "from-[#3C55A5]/20 via-black/40 to-neutral-900/10"
        : "from-[#3C55A5]/5 via-white/50 to-neutral-100/10",
      features: [
        { icon: Compass, label: "Designed to Impress" },
        { icon: Sparkles, label: "Premium Polarized" },
      ],
      buttonText: "Explore Trends",
    },
    {
      title: "Best Sellers",
      subtitle: "Time-Tested Iconics",
      description: "Classics loved by thousands. Handpicked silhouettes that never fade out of style.",
      badge: "CUSTOMER CHOICE",
      badgeIcon: Award,
      link: "/product-filter?category=Best Sellers",
      glowColor: "bg-[#D97706]/20",
      glowHover: "group-hover:bg-[#D97706]/35",
      borderTheme: "border-[#D97706]/20",
      buttonBg: "from-[#D97706] to-[#F59E0B]",
      editorialGradient: isDark 
        ? "from-[#D97706]/20 via-black/40 to-neutral-900/10"
        : "from-[#D97706]/5 via-white/50 to-neutral-100/10",
      features: [
        { icon: Star, label: "Top-Rated (4.9+)" },
        { icon: ShieldCheck, label: "Lifetime Guarantee" },
      ],
      buttonText: "Shop Favorites",
    },
    {
      title: "Featured Picks",
      subtitle: "Curated Excellence",
      description: "Exclusive items handpicked by design consultants for premium fashion highlights.",
      badge: "EXPERT PICK",
      badgeIcon: Star,
      link: "/product-filter?category=Featured",
      glowColor: "bg-[#E11D48]/20",
      glowHover: "group-hover:bg-[#E11D48]/35",
      borderTheme: "border-[#E11D48]/20",
      buttonBg: "from-[#E11D48] to-[#F43F5E]",
      editorialGradient: isDark 
        ? "from-[#E11D48]/20 via-black/40 to-neutral-900/10"
        : "from-[#E11D48]/5 via-white/50 to-neutral-100/10",
      features: [
        { icon: Compass, label: "Artisan Curation" },
        { icon: Gem, label: "Limited Collection" },
      ],
      buttonText: "View Highlights",
    },
  ];

  return (
    <motion.section
      id="collection-spotlight-section"
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t ${styles.border}`}
      aria-labelledby="spotlight-section-title"
    >
      {/* Background Glows */}
      <div className={`absolute top-1/3 left-[-15%] w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none ${styles.orbPrimary}`} />
      <div className={`absolute bottom-1/3 right-[-15%] w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none ${styles.orbSecondary}`} />

      {/* Decorative Grid Accent */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${isDark ? "#fff" : "#000"} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? "#fff" : "#000"} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${styles.border} ${styles.glassBg} mb-4 shadow-sm`}>
            <Sparkles className="w-3.5 h-3.5 text-[#007C74] animate-pulse" />
            <span className={`text-[10px] md:text-xs font-black tracking-widest uppercase ${styles.text}`}>
              Curated Catalog
            </span>
          </div>
          <h2 
            id="spotlight-section-title" 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${styles.text} mb-4`}
          >
            Explore Our <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">Collections</span>
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${styles.textMuted}`}>
            Choose from our specialized categories crafted for style seekers, visionaries, and trend setters.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              }
            }
          }}
        >
          {spotlights.map((spotlight, index) => {
            const BadgeIcon = spotlight.badgeIcon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { type: "spring", stiffness: 100, damping: 15 } 
                  }
                }}
                whileHover={isLarge ? { scale: 1.02, y: -4 } : {}}
                className={`p-6 md:p-8 rounded-3xl border ${spotlight.borderTheme} bg-gradient-to-br ${spotlight.editorialGradient} backdrop-blur-xl relative overflow-hidden group flex flex-col justify-between h-full min-h-[460px] shadow-md`}
              >
                {/* Background Highlight Flare */}
                <div className={`absolute -top-20 -left-20 w-44 h-44 ${spotlight.glowColor} rounded-full blur-3xl ${spotlight.glowHover} transition-colors duration-500`} />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-current opacity-80 ${styles.glassBg} mb-5`}>
                      <BadgeIcon className="w-3 h-3 text-[#007C74]" />
                      <span className={`text-[9px] font-black tracking-wider uppercase ${styles.text}`}>
                        {spotlight.badge}
                      </span>
                    </div>

                    {/* Subtitle */}
                    <p className={`text-[10px] tracking-widest font-black uppercase text-[#007C74] mb-1`}>
                      {spotlight.subtitle}
                    </p>

                    {/* Title */}
                    <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${styles.text} mb-3`}>
                      {spotlight.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-xs md:text-sm leading-relaxed ${styles.textMuted} mb-6`}>
                      {spotlight.description}
                    </p>
                  </div>

                  <div>
                    {/* Features List */}
                    <div className="space-y-3 mb-6 border-t border-neutral-200/20 dark:border-white/10 pt-4">
                      {spotlight.features.map((feat, fIdx) => {
                        const FeatIcon = feat.icon;
                        return (
                          <div key={fIdx} className="flex items-center gap-2">
                            <FeatIcon className="w-3.5 h-3.5 text-[#007C74]" />
                            <span className={`text-[10px] md:text-xs font-semibold ${styles.textMuted}`}>
                              {feat.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Call to Action Button */}
                    <Link href={spotlight.link}>
                      <motion.button
                        whileHover={isLarge ? { scale: 1.02 } : {}}
                        whileTap={isLarge ? { scale: 0.98 } : {}}
                        className={`w-full group py-3 px-5 rounded-2xl bg-gradient-to-r ${spotlight.buttonBg} text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer`}
                        aria-label={`Explore ${spotlight.title}`}
                      >
                        <span className="text-xs">{spotlight.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
