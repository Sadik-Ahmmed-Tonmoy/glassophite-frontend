"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Shield, Sun } from "lucide-react";
import heroImage from "@/assets/images/ChatGPT Image Apr 8, 2025, 12_09_35 PM.png"


export default function HeroCinematicSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const glassOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Floating animation for sunglasses
  const floatingAnimation = {
    y: ["-10px", "10px", "-10px"],
    rotate: ["-2deg", "2deg", "-2deg"],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
      aria-label="Glassophite Premium Sunglasses Hero Section"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale: imageScale }}
      >
        <Image
          src={heroImage}
          alt="Premium luxury sunglasses by Glassophite"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
        {/* Dynamic overlay based on scroll */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"
          style={{ opacity: imageOpacity }}
        />
      </motion.div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 z-10">
        {/* Primary Orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
        />
        
        {/* Secondary Orb */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-blue-primary/20 rounded-full blur-[150px]"
        />
      </div>

      {/* Floating 3D Sunglasses Element */}
      <motion.div
        animate={floatingAnimation}
        className="absolute right-10 top-1/3 z-20 hidden lg:block"
        style={{ opacity: glassOpacity }}
      >
        <div className="relative w-[300px] h-[150px]">
          {/* Glass morphism frame */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
            {/* Lens reflections */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-24 h-16 bg-gradient-to-br from-white/30 to-transparent rounded-full transform -rotate-12" />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-16 bg-gradient-to-br from-white/30 to-transparent rounded-full transform rotate-12" />
            
            {/* Bridge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-white/10 rounded-full" />
          </div>
          
          {/* Animated lens flare */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
            className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
          />
        </div>
      </motion.div>

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
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 w-fit"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-neutral-300">Luxury Eyewear Since 2024</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* H1 with gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Redefining Vision
            </span>
            <br />
            <span className="text-neutral-400 relative">
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

          {/* Subtext with glass morphism */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg text-neutral-300 max-w-xl backdrop-blur-sm bg-black/20 p-4 rounded-lg border border-white/5"
          >
            Experience unmatched clarity, polarized precision, and timeless
            design. Glassophite blends luxury craftsmanship with modern
            innovation — built for confidence.
          </motion.p>

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
              { icon: Sparkles, text: "Premium Materials" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-neutral-300">{feature.text}</span>
              </div>
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
              className="group relative px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-all duration-300 text-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
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
              className="group px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-center relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Limited Edition
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                  5 left
                </span>
              </span>
              <motion.div
                className="absolute inset-0 bg-white/5"
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
            className="mt-12 flex items-center gap-6 text-sm text-neutral-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>100-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span>Authenticity Guaranteed</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator with progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center relative overflow-hidden">
            <motion.div
              className="w-1 h-3 bg-white rounded-full"
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
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            Scroll
          </span>
        </div>
      </motion.div>

      {/* Video Preview Button (Optional) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 right-10 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
        aria-label="Watch brand story"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>
        <span className="text-sm text-white">Watch Film</span>
      </motion.button>
    </section>
  );
}