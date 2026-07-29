"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Award,
  BatteryCharging,
  Eye,
  Feather,
  Gem,
  Globe2,
  Heart,
  Leaf,
  Microscope,
  Sparkles,
  Sun,
  Thermometer,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";

// Deterministic floating particles to avoid SSR/CSR hydration mismatches
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top: `${(i * 41 + 13) % 95}%`,
  left: `${(i * 59 + 7) % 95}%`,
  dx: ((i % 5) - 2) * 8,
  duration: 22 + (i % 8) * 3,
  delay: (i * 0.4) % 4,
}));

// Core features data
const CORE_FEATURES = [
  {
    icon: Eye,
    title: "Crystal Clarity",
    description:
      "Premium polarized lenses with 99.9% UV protection for unmatched visual experience.",
    stats: "99.9% UV",
    color: "#007C74",
    gradient: "from-[#007C74] to-[#00A693]",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    description:
      "Handcrafted using titanium, acetate, and gold-plated metals for lasting durability.",
    stats: "100% Premium",
    color: "#3C55A5",
    gradient: "from-[#3C55A5] to-[#5B7FD9]",
  },
  {
    icon: Award,
    title: "Swiss Precision",
    description:
      "Engineered with Swiss optical technology for perfect lens curvature and clarity.",
    stats: "Swiss Tech",
    color: "#00A693",
    gradient: "from-[#00A693] to-[#007C74]",
  },
  {
    icon: Feather,
    title: "Lightweight Comfort",
    description:
      "Ultra-light frames designed for all-day comfort without pressure points.",
    stats: "< 20g",
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#6D28D9]",
  },
] as const;

// Technology features
const TECH_FEATURES = [
  {
    icon: Sun,
    title: "UV400 Protection",
    description:
      "Blocks 100% of harmful UVA and UVB rays up to 400 nanometers.",
  },
  {
    icon: Microscope,
    title: "Anti-Reflective",
    description:
      "Multi-layer coating eliminates glare for crystal clear vision.",
  },
  {
    icon: Thermometer,
    title: "Thermal Resistant",
    description: "Withstands extreme temperatures without frame deformation.",
  },
  {
    icon: BatteryCharging,
    title: "Anti-Scratch",
    description: "Diamond-hard coating protects against daily wear and tear.",
  },
] as const;

// Sustainability features
const SUSTAINABILITY_FEATURES = [
  {
    icon: Leaf,
    title: "Eco-Friendly Materials",
    description:
      "Sustainable acetate and recycled metals in our premium frames.",
  },
  {
    icon: Heart,
    title: "Ethical Manufacturing",
    description:
      "Fair trade practices and artisan craftsmanship in Bangladesh.",
  },
  {
    icon: Globe2,
    title: "Carbon Neutral",
    description: "Offsetting our carbon footprint through reforestation.",
  },
] as const;

export default function WhyChooseGlassophiteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  const styles = useMemo(
    () =>
      isDark
        ? {
            bg: "from-black via-gray-900 to-black",
            card: "bg-white/5 border-white/10",
            text: "text-white",
            textMuted: "text-neutral-300",
            textMutedLighter: "text-neutral-400",
            iconBg: "bg-white/10",
            badgeBg: "border-white/10 bg-white/5",
          }
        : {
            bg: "from-neutral-50 via-white to-neutral-50",
            card: "bg-white/80 border-neutral-200/80 shadow-sm",
            text: "text-neutral-900",
            textMuted: "text-neutral-600",
            textMutedLighter: "text-neutral-500",
            iconBg: "bg-neutral-100 dark:bg-neutral-800",
            badgeBg: "border-neutral-200 bg-white/80 shadow-xs",
          },
    [isDark],
  );

  return (
    <section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20`}
      aria-label="Why Choose Glassophite"
    >
      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${
              isDark ? "#007C74" : "#007C74"
            } 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Responsive Background Orbs */}
      <motion.div
        style={{ y: y1, rotate }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-10 left-5 sm:top-20 sm:left-20 w-[clamp(200px,30vw,384px)] h-[clamp(200px,30vw,384px)] bg-[#007C74]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"
      />

      <motion.div
        style={{ y: y2, rotate: useTransform(rotate, (r) => -r) }}
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-[clamp(250px,35vw,500px)] h-[clamp(250px,35vw,500px)] bg-[#3C55A5]/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none"
      />

      {/* Floating Particles */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute w-1 h-1 ${
              isDark ? "bg-[#007C74]/30" : "bg-[#007C74]/25"
            } rounded-full`}
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [0, -30, 0],
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

      <div className="relative z-10 container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border mb-4 sm:mb-6 ${styles.badgeBg}`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm font-semibold ${styles.textMuted} tracking-wider uppercase`}
              data-translate="why.badge"
            >
              WHY GLASSOPHITE
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            <span className={styles.text}>Engineered for</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto leading-relaxed px-2`}
            data-translate="why.description"
          >
            Discover what makes Glassophite the preferred choice for discerning
            individuals who demand nothing but the best.
          </p>
        </motion.div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16 lg:mb-20">
          {CORE_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
              whileHover={{ y: -4 }}
              className="group relative h-full"
            >
              <div
                className={`relative p-5 sm:p-6 h-full rounded-2xl backdrop-blur-sm border ${styles.card} transition-all duration-300 overflow-hidden flex flex-col justify-between`}
                style={{
                  borderColor:
                    activeFeature === index ? feature.color : undefined,
                }}
              >
                {/* Background Glow */}
                <motion.div
                  animate={{
                    scale: activeFeature === index ? 1 : 0,
                    opacity: activeFeature === index ? 0.12 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                  style={{ filter: "blur(30px)" }}
                />

                <div>
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0`}
                    style={{ color: feature.color }}
                  >
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-base sm:text-lg font-bold ${styles.text} mb-2`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${styles.textMutedLighter} mb-4 leading-relaxed`}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Stat Badge */}
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold w-fit"
                  style={{
                    background: `${feature.color}18`,
                    color: feature.color,
                  }}
                >
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology & Sustainability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Technology Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#007C74]/10 text-[#007C74] shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${styles.text}`}>
                Advanced Technology
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {TECH_FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-[#007C74]/10 shrink-0 text-[#007C74] mt-0.5">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold ${styles.text} mb-0.5`}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className={`text-xs ${styles.textMutedLighter} leading-relaxed`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sustainability Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#007C74]/10 text-[#007C74] shrink-0">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${styles.text}`}>
                Sustainability
              </h3>
            </div>

            <div className="space-y-4">
              {SUSTAINABILITY_FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-[#007C74]/10 shrink-0 text-[#007C74] mt-0.5">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold ${styles.text} mb-0.5`}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className={`text-xs ${styles.textMutedLighter} leading-relaxed`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carbon Neutral Badge */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#007C74]/15 to-[#3C55A5]/15 border border-[#007C74]/20"
            >
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-[#007C74] shrink-0" />
                <div>
                  <p className={`text-xs sm:text-sm font-bold ${styles.text}`}>
                    Carbon Neutral Certified
                  </p>
                  <p className={`text-xs ${styles.textMutedLighter}`}>
                    Offsetting 100% of our carbon footprint
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <Link href={"/product-filter"}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white font-bold inline-flex items-center gap-2.5 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
            <span data-translate="why.cta">Experience the Difference</span>
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </motion.button>
            </Link>
        </motion.div>
      </div>

      {/* Bottom Decorative Circle */}
      <motion.div
        style={{ scale }}
        className="absolute bottom-10 left-10 w-24 h-24 sm:w-32 sm:h-32 border border-[#007C74]/20 rounded-full pointer-events-none hidden sm:block"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-[#007C74]/10 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              delay: i * 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}
