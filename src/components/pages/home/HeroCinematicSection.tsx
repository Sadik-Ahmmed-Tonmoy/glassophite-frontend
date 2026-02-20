"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Shield, Sun, Eye, Droplets, Zap } from "lucide-react";
import { useTheme } from "next-themes";


import heroImageDark from "@/assets/images/ChatGPT Image Apr 8, 2025, 12_09_35 PM.png"
import heroImageLight from "@/assets/images/WhatsApp Image 2026-02-19 at 10.18.28 AM.jpeg"
import Image from "next/image";



export default function HeroCinematicSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });


  // Parallax effects
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  // Parallax effects
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const glassOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3], [0.15, 0]);


  
  // Theme-specific styles
  const themeStyles = isDark ? {
    background: "bg-black",
    text: "text-white",
    textMuted: "text-neutral-300",
    textMutedLighter: "text-neutral-400",
    border: "border-white/10",
    borderLight: "border-white/5",
    glassBg: "bg-white/5",
    glassBgDarker: "bg-black/20",
    gradient: "from-white to-neutral-400",
    cardBg: "bg-white/5",
    hoverBg: "hover:bg-white/10",
    primaryButton: "bg-white text-black hover:bg-neutral-200",
    secondaryButton: "border-white/30 text-white hover:bg-white/10",
    scrollIndicator: "border-white/20",
    scrollDot: "bg-white",
    gridLines: "bg-white/5",
  } : {
    background: "bg-neutral-50",
    text: "text-neutral-900",
    textMuted: "text-neutral-600",
    textMutedLighter: "text-neutral-500",
    border: "border-neutral-200/80",
    borderLight: "border-neutral-100",
    glassBg: "bg-white/70",
    glassBgDarker: "bg-white/90",
    gradient: "from-neutral-900 to-neutral-600",
    cardBg: "bg-white/70",
    hoverBg: "hover:bg-white/90",
    primaryButton: "bg-neutral-900 text-white hover:bg-neutral-800",
    secondaryButton: "border-neutral-300 text-neutral-900 hover:bg-neutral-100",
    scrollIndicator: "border-neutral-300",
    scrollDot: "bg-neutral-900",
    gridLines: "bg-neutral-200/50",
  };

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${themeStyles.background} ${themeStyles.text}`}
      aria-label="Glassophite Premium Sunglasses Hero Section"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale: imageScale }}
      >
        {
        isDark ?  <Image
          src={heroImageDark}
          alt="Premium luxury sunglasses by Glassophite"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        /> : <Image
          src={heroImageLight}
          alt="Premium luxury sunglasses by Glassophite"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
        }
        {/* Dynamic overlay based on scroll and theme */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-b transition-colors duration-500 ${
            isDark 
              ? "from-black/80 via-black/70 to-black" 
              : "from-white/60 via-white/50 to-white/40"
          }`}
        />
      </motion.div>
      
      {/* Abstract Geometric Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Base */}
        <div className={`absolute inset-0 bg-gradient-to-br `} />

        {/* Animated Grid Pattern */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: gridOpacity }}
        >
          <div className={`absolute inset-0 bg-[linear-gradient(to_right,${themeStyles.gridLines}_1px,transparent_1px),linear-gradient(to_bottom,${themeStyles.gridLines}_1px,transparent_1px)] bg-[size:4rem_4rem]`} />
        </motion.div>

        {/* Floating Geometric Shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full border ${themeStyles.border} opacity-30`}
        />
        
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full border ${themeStyles.border} opacity-20`}
        />

        {/* Diagonal Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-[200%] h-px ${isDark ? 'bg-white/5' : 'bg-neutral-200'} transform -rotate-45`}
              style={{
                top: `${i * 200}px`,
                left: '-50%',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 15,
                delay: i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 z-20">
        {/* Primary Orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-500 ${
            isDark ? "bg-primary/65" : "bg-primary/10"
          }`}
        />
        
        {/* Secondary Orb */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className={`absolute bottom-20 left-20 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-500 ${
            isDark ? "bg-blue-primary/30" : "bg-blue-primary/10"
          }`}
        />

        {/* Tertiary Orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px] transition-colors duration-500 ${
            isDark ? "bg-green-primary/20" : "bg-green-primary/5"
          }`}
        />
      </div>

      {/* 3D Sunglasses Element - Pure CSS Version */}
      <motion.div
        animate={{
          y: ["-20px", "20px", "-20px"],
          rotate: ["-3deg", "3deg", "-3deg"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-48 top-1/3 z-20 hidden lg:block"
        style={{ opacity: glassOpacity }}
      >
        <div className="relative w-[400px] h-[200px] perspective-1000">
          {/* Main Frame */}
          <div className="relative w-full h-full transform-style-3d animate-float">
            {/* Left Lens */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-36 h-24 backdrop-blur-xl rounded-2xl border overflow-hidden transform -rotate-6 transition-colors duration-500 ${
              isDark 
                ? "bg-white/5 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                : "bg-white/40 border-neutral-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            }`}>
              {/* Lens Reflection */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12`}
              />
              
              {/* Lens Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                isDark 
                  ? "from-primary/20 to-blue-primary/20" 
                  : "from-primary/10 to-blue-primary/5"
              }`} />
            </div>

            {/* Right Lens */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-36 h-24 backdrop-blur-xl rounded-2xl border overflow-hidden transform rotate-6 transition-colors duration-500 ${
              isDark 
                ? "bg-white/5 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                : "bg-white/40 border-neutral-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            }`}>
              {/* Lens Reflection */}
              <motion.div
                animate={{
                  x: ["200%", "-100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
                className={`absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent transform skew-x-12`}
              />
              
              {/* Lens Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-bl ${
                isDark 
                  ? "from-blue-primary/20 to-primary/20" 
                  : "from-blue-primary/10 to-primary/5"
              }`} />
            </div>

            {/* Bridge */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 backdrop-blur-xl rounded-full border transition-colors duration-500 ${
              isDark 
                ? "bg-white/5 border-white/20" 
                : "bg-white/40 border-neutral-300"
            }`}>
              <div className={`absolute inset-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-primary/5"
              }`} />
            </div>

            {/* Left Temple */}
            <div className={`absolute -left-12 top-1/2 -translate-y-1/2 w-16 h-4 backdrop-blur-sm rounded-l-full border-y border-l transition-colors duration-500 ${
              isDark 
                ? "bg-white/5 border-white/20" 
                : "bg-white/40 border-neutral-300"
            }`} />

            {/* Right Temple */}
            <div className={`absolute -right-12 top-1/2 -translate-y-1/2 w-16 h-4 backdrop-blur-sm rounded-r-full border-y border-r transition-colors duration-500 ${
              isDark 
                ? "bg-white/5 border-white/20" 
                : "bg-white/40 border-neutral-300"
            }`} />
          </div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? "bg-white/30" : "bg-primary/30"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-20 container flex flex-col justify-center min-h-screen px-6"
        style={{ y: contentY }}
      >
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border w-fit transition-colors duration-500 ${
            isDark 
              ? "bg-white/5 border-white/10" 
              : "bg-white/80 border-neutral-200 shadow-sm"
          }`}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className={`text-sm ${themeStyles.textMuted}`} data-translate>Luxury Eyewear Since 2024</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* H1 with gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
            <span 
              className={`bg-gradient-to-r ${
                isDark 
                  ? "from-white to-neutral-400" 
                  : "from-neutral-900 to-neutral-600"
              } bg-clip-text text-transparent`} 
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
              {/* Animated underline */}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-transparent"
              />
            </span>
          </h1>

          {/* Subtext with enhanced visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mt-6"
          >
            {/* Decorative element */}
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary via-blue-primary to-green-primary rounded-full" />
            
            <p className={`text-base sm:text-lg ${themeStyles.textMuted} max-w-xl pl-6`} data-translate>
              Experience unmatched clarity, polarized precision, and timeless
              design. Glassophite blends luxury craftsmanship with modern
              innovation — built for confidence.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {[
              { icon: Shield, text: "100% UV Protection" },
              { icon: Sun, text: "Polarized Lenses" },
              { icon: Eye, text: "Crystal Clarity" },
              { icon: Droplets, text: "Hydrophobic Coating" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-colors duration-500 cursor-default ${
                  isDark 
                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                    : "bg-white/80 border-neutral-200 hover:bg-white shadow-sm"
                }`}
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className={`text-xs ${themeStyles.textMuted}`} data-translate>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/shop"
              className={`group relative px-8 py-3 rounded-full transition-all duration-300 text-center overflow-hidden ${
                isDark 
                  ? "bg-white text-black hover:bg-neutral-200" 
                  : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md"
              }`}
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
              href="/collections/limited"
              className={`group px-8 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 text-center relative overflow-hidden ${
                isDark
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-neutral-300 text-neutral-900 hover:bg-neutral-100 bg-white/50"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2" data-translate>
                Limited Edition
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  5 left
                </span>
              </span>
              <motion.div
                className={`absolute inset-0 transition-colors duration-300 ${
                  isDark ? "bg-white/5" : "bg-neutral-200/20"
                }`}
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
            className={`mt-12 flex items-center gap-6 text-sm ${themeStyles.textMutedLighter}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span data-translate>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span data-translate>100-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span data-translate>Authenticity Guaranteed</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`w-6 h-10 border rounded-full flex justify-center relative overflow-hidden transition-colors duration-500 ${
            isDark ? "border-white/20" : "border-neutral-300"
          }`}>
            <motion.div
              className={`w-1 h-3 rounded-full transition-colors duration-500 ${
                isDark ? "bg-white" : "bg-neutral-900"
              }`}
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <span className={`text-xs uppercase tracking-wider transition-colors duration-500 ${
            isDark ? "text-neutral-500" : "text-neutral-400"
          }`} data-translate>
            Scroll
          </span>
        </div>
      </motion.div>

      {/* Video Preview Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className={`absolute bottom-10 right-10 z-20 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 ${
          isDark
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-white/80 border-neutral-200 hover:bg-white shadow-sm"
        }`}
        aria-label="Watch brand story"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Zap className="w-3 h-3 text-primary" />
        </div>
        <span className={`text-sm ${themeStyles.text}`} data-translate>Watch Film</span>
      </motion.button>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}