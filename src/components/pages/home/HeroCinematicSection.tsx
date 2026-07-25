"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { ArrowRight, Sparkles, Shield, Sun, Eye, Droplets, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import heroImageDark from "@/assets/images/ChatGPT Image Apr 8, 2025, 12_09_35 PM.png";
import heroImageLight from "@/assets/images/Gemini_Generated_Image_mmpwnvmmpwnvmmpw.png";
import Image from "next/image";

// ── Stable particle data (no Math.random in render) ──────────────────────────
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top: `${((i * 37 + 11) % 97)}%`,
  left: `${((i * 53 + 7) % 97)}%`,
  dx: ((i % 5) - 2) * 6,
  duration: 3 + (i % 3),
  delay: (i * 0.3) % 2,
}));

const FEATURES = [
  { icon: Shield, text: "100% UV Protection" },
  { icon: Sun, text: "Polarized Lenses" },
  { icon: Eye, text: "Crystal Clarity" },
  { icon: Droplets, text: "Hydrophobic Coating" },
] as const;

const TRUST = ["Free Shipping", "100-Day Returns", "Authenticity Guaranteed"] as const;

export default function HeroCinematicSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale   = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY     = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glassOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const gridOpacity  = useTransform(scrollYProgress, [0, 0.3], [0.15, 0]);

  // Memoised so theme switch doesn't re-create object on every keystroke
  const ts = useMemo(() => isDark ? {
    background: "bg-black",
    text: "text-white",
    textMuted: "text-neutral-300",
    textMutedLighter: "text-neutral-400",
    border: "border-white/10",
    glassBg: "bg-white/5",
    gridLines: "bg-white/5",
    primaryBtn: "bg-white text-black hover:bg-neutral-200",
    secondaryBtn: "border-white/30 text-white hover:bg-white/10",
    pill: "bg-white/5 border-white/10 hover:bg-white/10",
    scrollBorder: "border-white/20",
    scrollDot: "bg-white",
    filmBtn: "bg-white/5 border-white/10 hover:bg-white/10",
  } : {
    background: "bg-neutral-50",
    text: "text-neutral-900",
    textMuted: "text-neutral-600",
    textMutedLighter: "text-neutral-500",
    border: "border-neutral-200/80",
    glassBg: "bg-white/70",
    gridLines: "bg-neutral-200/50",
    primaryBtn: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md",
    secondaryBtn: "border-neutral-300 text-neutral-900 hover:bg-neutral-100 bg-white/50",
    pill: "bg-white/80 border-neutral-200 hover:bg-white shadow-sm",
    scrollBorder: "border-neutral-300",
    scrollDot: "bg-neutral-900",
    filmBtn: "bg-white/80 border-neutral-200 hover:bg-white shadow-sm",
  }, [isDark]);

  return (
    <section
      ref={containerRef}
      className={`relative min-h-[100svh] w-full overflow-hidden transition-colors duration-500 ${ts.background} ${ts.text}`}
      aria-label="Glassophite Premium Sunglasses Hero Section"
    >
      {/* ── Hero Background Image ─────────────────────────────────────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: imageScale }}>
        <Image
          src={isDark ? heroImageDark : heroImageLight}
          alt="Premium luxury sunglasses by Glassophite"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? "bg-gradient-to-b from-black/80 via-black/70 to-black"
              : "bg-gradient-to-r from-white/80 via-white/70 to-white/10"
          }`}
        />
      </motion.div>

      {/* ── Abstract Geometry ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid */}
        <motion.div className="absolute inset-0" style={{ opacity: gridOpacity }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px),
                                linear-gradient(to bottom, ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px)`,
              backgroundSize: "4rem 4rem",
            }}
          />
        </motion.div>

        {/* Rotating rings — capped at viewport-safe sizes */}
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-1/4 -right-1/4 w-[min(800px,130vw)] h-[min(800px,130vw)] rounded-full border ${ts.border} opacity-30`}
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className={`absolute -bottom-1/4 -left-1/4 w-[min(1000px,150vw)] h-[min(1000px,150vw)] rounded-full border ${ts.border} opacity-20`}
        />

        {/* Diagonal shimmer lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={`absolute w-[200%] h-px ${isDark ? "bg-white/5" : "bg-neutral-200"} -rotate-45`}
              style={{ top: `${i * 200}px`, left: "-50%" }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 15, delay: i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      </div>

      {/* ── Gradient Orbs (responsive sizes) ─────────────────────────────── */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-10 right-4 sm:top-20 sm:right-10 w-[clamp(200px,40vw,500px)] h-[clamp(200px,40vw,500px)] rounded-full blur-[80px] sm:blur-[120px] transition-colors duration-500 ${
            isDark ? "bg-primary/60" : "bg-primary/10"
          }`}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15], x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute bottom-10 left-4 sm:bottom-20 sm:left-10 w-[clamp(240px,45vw,600px)] h-[clamp(240px,45vw,600px)] rounded-full blur-[100px] sm:blur-[150px] transition-colors duration-500 ${
            isDark ? "bg-blue-primary/30" : "bg-blue-primary/10"
          }`}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(300px,60vw,800px)] h-[clamp(300px,60vw,800px)] rounded-full blur-[120px] sm:blur-[180px] transition-colors duration-500 ${
            isDark ? "bg-green-primary/20" : "bg-green-primary/5"
          }`}
        />
      </div>

      {/* ── CSS Sunglasses (desktop only) ────────────────────────────────── */}
      <motion.div
        animate={{ y: ["-16px", "16px", "-16px"], rotate: ["-3deg", "3deg", "-3deg"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10%] xl:right-48 top-1/3 z-[3] hidden lg:block"
        style={{ opacity: glassOpacity }}
      >
        <div className="relative w-[clamp(260px,28vw,400px)] h-[clamp(130px,14vw,200px)]">
          {/* Left Lens */}
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[36%] h-[60%] backdrop-blur-xl rounded-2xl border overflow-hidden -rotate-6 transition-colors duration-500 ${
              isDark
                ? "bg-white/5 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                : "bg-white/40 border-neutral-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            }`}
          >
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-primary/20 to-blue-primary/20" : "from-primary/10 to-blue-primary/5"}`} />
          </div>

          {/* Right Lens */}
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-[36%] h-[60%] backdrop-blur-xl rounded-2xl border overflow-hidden rotate-6 transition-colors duration-500 ${
              isDark
                ? "bg-white/5 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                : "bg-white/40 border-neutral-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            }`}
          >
            <motion.div
              animate={{ x: ["200%", "-100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent skew-x-12"
            />
            <div className={`absolute inset-0 bg-gradient-to-bl ${isDark ? "from-blue-primary/20 to-primary/20" : "from-blue-primary/10 to-primary/5"}`} />
          </div>

          {/* Bridge */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[14%] h-[20%] backdrop-blur-xl rounded-full border transition-colors duration-500 ${
              isDark ? "bg-white/5 border-white/20" : "bg-white/40 border-neutral-300"
            }`}
          >
            <div className={`absolute inset-1 rounded-full ${isDark ? "bg-white/10" : "bg-primary/5"}`} />
          </div>

          {/* Temples */}
          <div className={`absolute -left-[13%] top-1/2 -translate-y-1/2 w-[14%] h-[12%] backdrop-blur-sm rounded-l-full border-y border-l transition-colors duration-500 ${isDark ? "bg-white/5 border-white/20" : "bg-white/40 border-neutral-300"}`} />
          <div className={`absolute -right-[13%] top-1/2 -translate-y-1/2 w-[14%] h-[12%] backdrop-blur-sm rounded-r-full border-y border-r transition-colors duration-500 ${isDark ? "bg-white/5 border-white/20" : "bg-white/40 border-neutral-300"}`} />
        </div>
      </motion.div>

      {/* ── Floating Particles ────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white/30" : "bg-primary/30"}`}
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -28, 0], x: [0, p.dx, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-[4] flex flex-col justify-center min-h-[100svh] px-5 py-4 max-w-screen-xl mx-auto"
        style={{ y: contentY }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`hidden  mb-5 sm:mb-6 md:inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border w-fit transition-colors duration-500 ${ts.pill}`}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className={`text-xs sm:text-sm ${ts.textMuted}`} data-translate>
            Luxury Eyewear Since 2024
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl lg:max-w-3xl"
        >
          <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-tight tracking-tight">
            <span
              className={`bg-gradient-to-r ${isDark ? "from-white to-neutral-400" : "from-neutral-900 to-neutral-600"} bg-clip-text text-transparent`}
              data-translate
            >
              Redefining Vision
            </span>
            <br />
            <span
              className="relative"
              style={{
                background: "linear-gradient(to right, #007C74, #3C55A5, #00A693)",
                backgroundClip: "text",
                color: "transparent",
              }}
              data-translate
            >
              Premium Sunglasses in Bangladesh
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-transparent"
              />
            </span>
          </h1>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mt-5 sm:mt-6"
          >
            <div className="absolute -left-3 sm:-left-4 top-0 w-1 h-full bg-gradient-to-b from-primary via-blue-primary to-green-primary rounded-full" />
            <p className={`text-sm sm:text-base lg:text-lg ${ts.textMuted} max-w-xl pl-5 sm:pl-6`} data-translate>
              Experience unmatched clarity, polarized precision, and timeless design.
              Glassophite blends luxury craftsmanship with modern innovation — built for confidence.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3"
          >
            {FEATURES.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-colors duration-500 cursor-default text-xs sm:text-sm ${ts.pill}`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span className={ts.textMuted} data-translate>{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 sm:mt-10 flex flex-col xs:flex-row gap-3 sm:gap-4"
          >
            <Link
              href="/shop"
              className={`group relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 text-center overflow-hidden text-sm sm:text-base font-medium ${ts.primaryBtn}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2" data-translate>
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-green-secondary"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            <Link
              href="/product-filter?category=best+sellers"
              className={`group px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border backdrop-blur-sm transition-all duration-300 text-center relative overflow-hidden text-sm sm:text-base font-medium ${ts.secondaryBtn}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2" data-translate>
                Limited Edition
              </span>
              <motion.div
                className={`absolute inset-0 transition-colors duration-300 ${isDark ? "bg-white/5" : "bg-neutral-200/20"}`}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`mt-8 sm:mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm ${ts.textMutedLighter}`}
          >
            {TRUST.map((label) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full shrink-0" />
                <span data-translate>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator (hidden on screens smaller than md) ─────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-[4]"
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-6 h-10 border rounded-full flex justify-center pt-1.5 overflow-hidden transition-colors duration-500 ${ts.scrollBorder}`}
          >
            <motion.div
              className={`w-1 h-3 rounded-full transition-colors duration-500 ${ts.scrollDot}`}
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className={`text-xs uppercase tracking-wider transition-colors duration-500 ${ts.textMutedLighter}`} data-translate>
            Scroll
          </span>
        </div>
      </motion.div>

      {/* ── Watch Film Button (hidden on screens smaller than md) ────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className={`hidden md:flex absolute bottom-10 right-10 z-[4] items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 ${ts.filmBtn}`}
        aria-label="Watch brand story"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Zap className="w-3 h-3 text-primary" />
        </div>
        <span className={`text-sm ${ts.text}`} data-translate>Watch Film</span>
      </motion.button>
    </section>
  );
}