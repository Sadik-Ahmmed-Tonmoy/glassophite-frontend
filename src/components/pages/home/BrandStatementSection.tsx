"use client";

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Award,
  Diamond,
  Eye,
  Gem,
  Hexagon,
  Infinity as InfinityIcon,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function BrandStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isInView = useInView(textRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Theme-based styles
  const themeStyles = {
    dark: {
      background: "from-black via-gray-900 to-black",
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
      orbPrimary: "bg-[#007C74]/20",
      orbSecondary: "bg-[#3C55A5]/20",
      iconPrimary: "text-[#007C74]/40",
      iconSecondary: "text-[#3C55A5]/40",
    },
    light: {
      background: "from-neutral-50 via-white to-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      borderLight: "border-neutral-100",
      glassBg: "bg-white/70",
      glassBgDarker: "bg-white/90",
      gradient: "from-neutral-900 to-neutral-600",
      cardBg: "bg-white/70",
      hoverBg: "hover:bg-white",
      primaryButton: "bg-neutral-900 text-white hover:bg-neutral-800",
      secondaryButton: "border-neutral-300 text-neutral-900 hover:bg-neutral-100",
      scrollIndicator: "border-neutral-300",
      scrollDot: "bg-neutral-900",
      gridLines: "bg-neutral-200/50",
      orbPrimary: "bg-[#007C74]/10",
      orbSecondary: "bg-[#3C55A5]/10",
      iconPrimary: "text-[#007C74]/30",
      iconSecondary: "text-[#3C55A5]/30",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX - innerWidth / 2) / 50,
        y: (clientY - innerHeight / 2) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth spring animations for mouse follow
  const springX = useSpring(mousePosition.x, { stiffness: 100, damping: 30 });
  const springY = useSpring(mousePosition.y, { stiffness: 100, damping: 30 });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Text reveal animation variants
  const textReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-gradient-to-b ${styles.background} ${styles.text} py-32 sm:py-40 px-6 overflow-hidden transition-colors duration-500`}
      aria-label="Glassophite Brand Story and Philosophy"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          style={{
            y: y1,
            backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(0,124,116,0.1)' : 'rgba(0,124,116,0.05)'} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? 'rgba(60,85,165,0.1)' : 'rgba(60,85,165,0.05)'} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
          className="absolute inset-0"
        />
      </div>

      {/* Dynamic Floating Orbs with Mouse Follow */}
      <motion.div
        style={{
          x: useTransform(springX, (v) => v * 0.5),
          y: useTransform(springY, (v) => v * 0.5),
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-20 left-10 w-96 h-96 ${styles.orbPrimary} rounded-full blur-[120px]`}
      />

      <motion.div
        style={{
          x: useTransform(springX, (v) => -v * 0.3),
          y: useTransform(springY, (v) => -v * 0.3),
        }}
        animate={{
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute bottom-20 right-10 w-[500px] h-[500px] ${styles.orbSecondary} rounded-full blur-[150px]`}
      />

      {/* Animated Geometric Shapes */}
      <motion.div
        style={{
          x: useTransform(springX, (v) => v * 2),
          y: useTransform(springY, (v) => v * 2),
          rotate: rotate,
        }}
        className="absolute top-40 right-20"
      >
        <Hexagon className={`w-16 h-16 ${styles.iconPrimary}`} />
      </motion.div>

      <motion.div
        style={{
          x: useTransform(springX, (v) => -v),
          y: useTransform(springY, (v) => -v),
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-40 left-20"
      >
        <Diamond className={`w-20 h-20 ${styles.iconSecondary}`} />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${isDark ? 'bg-[#007C74]/30' : 'bg-[#007C74]/20'} rounded-full`}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: ["0%", "100%"],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Rotating Rings */}
      <motion.div
        style={{
          rotate: rotate,
          scale: scale,
        }}
        className="absolute top-1/4 left-1/4 w-32 h-32"
      >
        <motion.div
          className={`absolute inset-0 border-2 ${isDark ? 'border-[#007C74]/20' : 'border-[#007C74]/10'} rounded-full`}
          animate={{
            borderWidth: [2, 4, 2],
            opacity: isDark ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute inset-2 border ${isDark ? 'border-[#3C55A5]/20' : 'border-[#3C55A5]/10'} rounded-full`}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <motion.div
        style={{
          rotate: useTransform(scrollYProgress, [0, 1], [360, 0]),
          y: y2,
        }}
        className="absolute bottom-1/3 right-1/4 w-48 h-48"
      >
        <motion.div
          className={`absolute inset-0 border ${isDark ? 'border-[#3C55A5]/20' : 'border-[#3C55A5]/10'} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${isDark ? 'bg-[#007C74]' : 'bg-[#007C74]/70'} rounded-full`}
            style={{
              top: `${Math.sin((i * 45 * Math.PI) / 180) * 50 + 50}%`,
              left: `${Math.cos((i * 45 * Math.PI) / 180) * 50 + 50}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: isDark ? [0.3, 0.8, 0.3] : [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Animated Lines */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-20 right-20 space-y-2"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-px bg-gradient-to-r from-transparent via-[#007C74] to-transparent`}
            style={{
              width: 100 + i * 50,
            }}
            animate={{
              opacity: isDark ? [0.1, 0.5, 0.1] : [0.05, 0.3, 0.05],
              width: [100 + i * 50, 150 + i * 50, 100 + i * 50],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-20 left-20 space-y-2"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-px bg-gradient-to-l from-transparent via-[#3C55A5] to-transparent`}
            style={{
              width: 100 + i * 50,
            }}
            animate={{
              opacity: isDark ? [0.1, 0.5, 0.1] : [0.05, 0.3, 0.05],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Floating Icons with Mouse Follow */}
      <motion.div
        style={{
          x: useTransform(springX, (v) => v * 1.5),
          y: useTransform(springY, (v) => v * 1.5),
        }}
        className="absolute top-1/3 left-10"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Zap className={`w-8 h-8 ${isDark ? 'text-[#007C74]/30' : 'text-[#007C74]/20'}`} />
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          x: useTransform(springX, (v) => -v),
          y: useTransform(springY, (v) => -v),
        }}
        className="absolute bottom-1/3 right-10"
      >
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <InfinityIcon className={`w-10 h-10 ${isDark ? 'text-[#3C55A5]/30' : 'text-[#3C55A5]/20'}`} />
        </motion.div>
      </motion.div>

      {/* Animated Lens Flare */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute top-1/2 left-0 w-1/3 h-40 bg-gradient-to-r from-transparent ${isDark ? 'via-white/5' : 'via-black/5'} to-transparent transform -skew-y-12 blur-3xl`}
      />

      {/* Gradient Orbs with Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: isDark ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#007C74]/5 to-[#3C55A5]/5 blur-[100px]"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#007C74] to-transparent"
          />

          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full ${styles.glassBg} backdrop-blur-sm ${styles.border}`}>
            <Sparkles className="w-4 h-4 text-[#007C74]" />
            <span className={`text-sm ${styles.textMuted} tracking-wider`} data-translate="brand.philosophy">
              THE GLASSOPHITE PHILOSOPHY
            </span>
          </div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[1px] bg-gradient-to-l from-transparent via-[#007C74] to-transparent"
          />
        </motion.div>

        {/* Main Content - Centered Layout */}
        <motion.div
          ref={textRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Main Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight"
          >
            <span className="block overflow-hidden">
              {Array.from("Where Vision Meets").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={textReveal}
                  className="inline-block"
                  data-translate={`brand.title.part1.${i}`}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>

            <span className="block overflow-hidden mt-2 bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {Array.from("Timeless Elegance").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + 10}
                  variants={textReveal}
                  className="inline-block"
                  data-translate={`brand.title.part2.${i}`}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h2>

          {/* Brand Story */}
          <motion.div
            variants={itemVariants}
            className="relative mt-12 max-w-3xl mx-auto"
          >
            <div className={`relative backdrop-blur-sm ${styles.glassBgDarker} p-8 rounded-2xl ${styles.border}`}>
              <p className={`text-lg ${styles.textMuted} leading-relaxed`} data-translate="brand.story">
                At Glassophite, we believe that sunglasses are more than just
                eye protection — they&apos;re an extension of your personality.
                Founded in Bangladesh with a vision to democratize luxury
                eyewear, we&apos;ve combined Swiss precision with Bengali
                artistry.
              </p>
            </div>
          </motion.div>

          {/* Core Values Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              {
                icon: Eye,
                title: "Clarity First",
                desc: "Crystal clear vision",
                translateKey: "clarity"
              },
              {
                icon: Shield,
                title: "Precision Crafted",
                desc: "Meticulously engineered",
                translateKey: "precision"
              },
              {
                icon: Gem,
                title: "Timeless Design",
                desc: "Classic aesthetics",
                translateKey: "timeless"
              },
              {
                icon: Award,
                title: "Uncompromising",
                desc: "Finest materials",
                translateKey: "uncompromising"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`group p-6 rounded-xl bg-gradient-to-b  to-transparent  
                group  from-black/5  dark:from-white/5 border dark:border-white/10`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#007C74]/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[#007C74]" />
                </div>
                <h3 className="text-sm font-semibold mb-1" data-translate={`brand.values.${item.translateKey}.title`}>
                  {item.title}
                </h3>
                <p className={`text-xs ${styles.textMutedLighter}`} data-translate={`brand.values.${item.translateKey}.desc`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-16">
            <Link href="/craftsmanship">
              <button className="group relative px-10 py-4 rounded-full overflow-hidden bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] text-white font-medium flex items-center gap-2 mx-auto">
                <span data-translate="brand.cta">Discover Our Craft</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-neutral-500">
              {[
                { text: "Swiss Precision", key: "swiss" },
                { text: "Bengali Artistry", key: "bengali" },
                { text: "Global Standards", key: "global" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#007C74] rounded-full" />
                  <span data-translate={`brand.badges.${badge.key}`}>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </section>
  );
}