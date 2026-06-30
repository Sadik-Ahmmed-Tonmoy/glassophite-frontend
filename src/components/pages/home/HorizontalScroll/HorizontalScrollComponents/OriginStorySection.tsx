"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Clock,
  Compass,
  Gem,
  Globe,
  MapPin,
  Package,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// Authentic data for import/resell business
const originData = {
  id: "origin",
  title: "Our Story",
  subtitle: "Bringing Global Eyewear to Bangladesh",
  description:
    "Glassophite was founded to bring premium international eyewear to Bangladesh. We partner with manufacturers in Italy, Japan, and China to offer quality frames at fair prices.",
  longDescription:
    "Founded in 2025 in Dhaka, Glassophite started with a simple idea: why should Bangladeshis pay premium prices for imported eyewear? Today, we partner directly with family-owned manufacturers in Italy, Japan, and China - cutting out middlemen and passing the savings to you. Every frame is selected by us, imported by us, and quality-checked in Dhaka before it reaches you.",
  icon: Compass,
  color: "#007C74",
  image: "/images/story/origin-dhaka.jpg",

  stats: [
    {
      label: "Founded",
      value: "2025",
      icon: Clock,
      description: "March 2025 in Dhaka",
    },
    {
      label: "Headquarters",
      value: "Dhaka",
      icon: MapPin,
      description: "Gulshan-2, Dhaka",
    },
    {
      label: "Partner Factories",
      value: "4",
      icon: Globe,
      description: "Italy, Japan, China",
    },
    {
      label: "Imported",
      value: "50+",
      icon: Package,
      description: "Styles available in stock",
    },
  ],

  timeline: [
    {
      year: "Jan 2025",
      title: "Founder Returns",
      description:
        "Rahman Ahmed returns to Bangladesh after 12 years in Swiss eyewear industry.",
      location: "Dhaka",
      significance: "Brought supplier connections from Europe & Asia",
    },
    {
      year: "Feb 2025",
      title: "First Supplier Visit",
      description:
        "Visited 8 factories in China and Italy, selected 3 partners for initial orders.",
      location: "China & Italy",
      significance: "Direct partnerships, no middlemen",
    },
    {
      year: "Mar 2025",
      title: "First Shipment",
      description: "First container of 500 frames arrives at Chittagong Port.",
      location: "Chittagong",
      significance: "Cleared customs in 5 days",
    },
    {
      year: "Apr 2025",
      title: "Soft Launch",
      description: "Launched with 15 designs. Sold out in 2 weeks.",
      location: "Dhaka",
      significance: "200+ customers in first month",
    },
  ],

  craftsmanship: [
    {
      step: 1,
      title: "Partner Selection",
      description:
        "We work with established manufacturers in Italy (acetate specialists since 1985), Japan (titanium experts), and China (ISO-certified lens makers).",
      duration: "Ongoing",
      artisan: "Sourcing Team: Rahman & Tasnim",
    },
    {
      step: 2,
      title: "Design Curation",
      description:
        "We visit factories twice a year to select designs that work for Bangladesh - styles that suit local tastes, weather, and price expectations.",
      duration: "2 weeks per trip",
      artisan: "Selected from 100+ designs",
    },
    {
      step: 3,
      title: "Import & QC",
      description:
        "Frames are shipped to Dhaka, then inspected by our team. We reject about 5% of units and return them to suppliers.",
      duration: "4-6 weeks shipping + 2 days QC",
      artisan: "QC Team in Dhaka",
    },
  ],

  team: [
    {
      name: "Rahman Ahmed",
      role: "Founder",
      expertise: "12 years in Swiss eyewear",
      experience: "Former Design Lead at Meyer Optik Switzerland",
      image: "/images/team/rahman.jpg",
    },
    {
      name: "Tasnim Khan",
      role: "Sourcing Manager",
      expertise: "5 years import/export",
      experience: "Travels to factories 3-4 times yearly",
      image: "/images/team/tasnim.jpg",
    },
    {
      name: "QC Team",
      role: "2 Inspectors",
      expertise: "Every frame inspected",
      experience: "5% rejection rate ensures quality",
      image: "/images/team/qc.jpg",
    },
  ],
};

export default function OriginStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [activeCraft, setActiveCraft] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start end", "end start"],
  // });

  const { scrollYProgress } = useScroll({
  target: mounted ? containerRef : undefined,
  offset: ["start end", "end start"],
});

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
    springConfig,
  );
  const y = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    springConfig,
  );

  // Auto-rotate craftsmanship
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCraft((prev) => (prev + 1) % originData.craftsmanship.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTheme = mounted ? resolvedTheme || theme : "light";
  const isDark = currentTheme === "dark";

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
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  if (!mounted) {
    return null;
  }

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className={`relative w-full min-h-screen py-16 lg:py-20 overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500`}
      aria-label="Glassophite Origin Story"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
 {/* Animated Scan Line */}
      <motion.div
        animate={{
          y: ['-100%', '200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00A693] to-transparent blur-sm"
      />
      {/* Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-96 h-96 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#3C55A5]/10 rounded-full blur-[120px]"
      />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-12 lg:pt-32">
          {/* Left Column - Main Story */}
          <motion.div style={{ y, scale }} className="space-y-6 lg:space-y-8">
            {/* Title */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className={styles.text}>{originData.title}</span>
              <br />
              <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
                Glassophite
              </span>
            </h2>

            {/* Description */}
            <p
              className={`text-base sm:text-lg ${styles.textMuted} leading-relaxed max-w-xl`}
            >
              {originData.longDescription}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              {originData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`p-3 sm:p-4 rounded-xl ${styles.card} backdrop-blur-sm border dark:border-none`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-[#007C74]/10">
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#007C74]" />
                    </div>
                    <span
                      className={`text-xl sm:text-2xl font-bold ${styles.text}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm ${styles.textMutedLighter}`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-xs ${styles.textMutedLighter} mt-0.5 sm:mt-1`}
                  >
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Process Spotlight */}
          <motion.div
            // style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
            className="space-y-4 lg:space-y-6"
          >
            {/* Process Spotlight */}
            <div
              className={`p-5 sm:p-6 rounded-2xl ${styles.card} backdrop-blur-md`}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#007C74]" />
                <span>How We Work</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {originData.craftsmanship.map((item, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      opacity: activeCraft === index ? 1 : 0.5,
                      scale: activeCraft === index ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setActiveCraft(index)}
                    className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all ${
                      activeCraft === index
                        ? `${styles.card} border-[#007C74]/50 ${styles.accentGlow}`
                        : styles.card
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#007C74]/10 flex items-center justify-center text-xs font-bold text-[#007C74]">
                        {item.step}
                      </span>
                      <h4
                        className={`text-sm sm:text-base font-medium ${styles.text}`}
                      >
                        {item.title}
                      </h4>
                    </div>
                    <p
                      className={`text-xs sm:text-sm ${styles.textMutedLighter} line-clamp-2`}
                    >
                      {item.description}
                    </p>
                    {activeCraft === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/10"
                      >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#007C74]" />
                            {item.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#007C74]" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">
                              {item.artisan}
                            </span>
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Timeline */}
            <div className={`p-4 rounded-xl ${styles.card} backdrop-blur-sm`}>
              <p className={`text-xs ${styles.textMuted} mb-2`}>
                First shipment arrived April 2025
              </p>
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] origin-left"
      />
    </motion.section>
  );
}
