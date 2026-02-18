// src/components/sections/hero/HeroSection.tsx
"use client";

import AnimatedBeam from "@/components/ui/AnimatedBeam";
import GlowingText from "@/components/ui/GlowingText";
import MagneticButton from "@/components/ui/MagneticButton";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowRight, ChevronDown, Eye, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glassesRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const lenis = useLenis();

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
   const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const glassY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  
  // Parallax effect for floating glasses
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glassesRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch UV Index (mock for now - replace with actual API)
  useEffect(() => {
    // Simulate UV API call
    const mockUVIndex = Math.floor(Math.random() * 11) + 1; // 1-11 scale
    setUvIndex(mockUVIndex);
  }, []);

  // Get UV protection message
  const getUVMessage = (index: number | null) => {
    if (!index) return "UV Protection Level";
    if (index <= 2) return "Low UV - Basic Protection";
    if (index <= 5) return "Moderate UV - Good Protection";
    if (index <= 7) return "High UV - Strong Protection";
    if (index <= 10) return "Very High UV - Maximum Protection";
    return "Extreme UV - Premium Protection";
  };

  const handleScrollToCollection = () => {
    lenis?.scrollTo("#featured-collection", {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section
        ref={containerRef}
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#1A1F32] dark:from-[#0A0F1E] dark:to-[#1A1F32] light:from-[#F0F4FF] light:to-[#E8F0FF]"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <motion.div
          style={{ opacity, y }}
          className="relative container h-screen flex flex-col justify-center items-center z-10"
        >
          {/* UV Index Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-8 left-8 md:top-12 md:left-12"
          >
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {getUVMessage(uvIndex)}
              </span>
              {uvIndex && (
                <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                  UV {uvIndex}
                </span>
              )}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-8 right-8 md:top-12 md:right-12 flex gap-2"
          >
            {["Premium", "Authentic", "UV400"].map((badge) => (
              <div
                key={badge}
                className="glass-panel px-3 py-1.5 rounded-full text-xs font-medium"
              >
                {badge}
              </div>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="text-center max-w-6xl mx-auto px-4">
            {/* Glowing Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm">Limited Edition Collection 2025</span>
              </div>
            </motion.div>

            {/* Main Heading with Glowing Effect */}
            <motion.div
              ref={textRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <GlowingText>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  See the World
                  <br />
                  <span className="bg-gradient-to-r from-primary via-blue-primary to-green-secondary bg-clip-text text-transparent">
                    Through Glassophite
                  </span>
                </h1>
              </GlowingText>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-lg md:text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-3xl mx-auto"
            >
              Experience unparalleled clarity and protection with our premium
              sunglasses. Crafted for those who demand excellence in every
              detail.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton>
                <Link
                  href="/collection"
                  className="group relative px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={() => lenis?.scrollTo("#virtual-tryon")}
                  className="group relative px-8 py-4 glass-panel hover:bg-white/10 text-white dark:text-white light:text-gray-900 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Virtual Try-On
                </button>
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
            >
              {[
                { value: "15+", label: "Years Excellence" },
                { value: "50k+", label: "Happy Customers" },
                { value: "100%", label: "UV Protection" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={handleScrollToCollection}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Floating 3D Glasses */}
        <motion.div
          ref={glassesRef}
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
            // y: glassY,
          }}
          className="absolute bottom-0 right-0 md:right-10 lg:right-20 w-64 md:w-96 h-64 md:h-96"
        >
          <div className="relative w-full h-full">
            {/* Main glasses image with 3D effect */}
            <motion.div
              animate={{
                rotateX: mousePosition.y * 0.5,
                rotateY: mousePosition.x * 0.5,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="relative w-full h-full"
            >
              <Image
                src="/images/hero-glasses.png"
                alt="Glassophite Premium Sunglasses"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                quality={100}
              />

              {/* Lens reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer" />
            </motion.div>

            {/* Floating particles */}
            <AnimatedBeam />
          </div>
        </motion.div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
    </>
  );
}
