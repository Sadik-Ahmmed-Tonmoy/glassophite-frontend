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
import { useRef, useState } from "react";

export default function WhyChooseGlassophiteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

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
      overlay: "from-black/80 via-black/50 to-transparent",
      iconBg: "bg-white/10",
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
      overlay: "from-white/80 via-white/50 to-transparent",
      iconBg: "bg-neutral-100",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Core features data
  const coreFeatures = [
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
  ];

  // Technology features
  const techFeatures = [
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
  ];

  // Sustainability features
  const sustainabilityFeatures = [
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
  ];

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-20 sm:py-24 lg:py-32 px-4 sm:px-6`}
      aria-label="Why Choose Glassophite"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Animated Background Elements */}
      <motion.div
        style={{ y: y1, rotate }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-[#007C74]/10 rounded-full blur-[120px]"
      />

      <motion.div
        style={{ y: y2, rotate: useTransform(rotate, (r) => -r) }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#3C55A5]/10 rounded-full blur-[150px]"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${isDark ? "bg-[#007C74]/30" : "bg-[#007C74]/20"} rounded-full`}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: ["0%", "100%"],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#007C74]" />
            <span
              className={`text-sm ${styles.textMuted} tracking-wider`}
              data-translate="why.badge"
            >
              WHY GLASSOPHITE
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className={styles.text}>Engineered for</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-sm sm:text-base md:text-lg ${styles.textMuted} max-w-2xl mx-auto`}
            data-translate="why.description"
          >
            Discover what makes Glassophite the preferred choice for discerning
            individuals who demand nothing but the best.
          </p>
        </motion.div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 lg:mb-20">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
              whileHover={{ scale: 1.05 }}
              className="group relative h-full"
            >
              <div
                className={`relative p-6 h-full rounded-2xl backdrop-blur-sm border ${styles.card} transition-all duration-300 overflow-hidden`}
                style={{
                  borderColor:
                    activeFeature === index ? feature.color : undefined,
                }}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  animate={{
                    scale: activeFeature === index ? 1 : 0,
                    opacity: activeFeature === index ? 0.1 : 0,
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                  style={{ filter: "blur(40px)" }}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}
                  style={{ color: feature.color }}
                >
                  <feature.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${styles.textMutedLighter} mb-3`}>
                  {feature.description}
                </p>

                {/* Stat Badge */}
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `${feature.color}20`,
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
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Technology Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`p-6 md:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#007C74]/10">
                <Zap className="w-6 h-6 text-[#007C74]" />
              </div>
              <h3 className={`text-xl font-semibold ${styles.text}`}>
                Advanced Technology
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-[#007C74]/10 shrink-0">
                    <feature.icon className="w-4 h-4 text-[#007C74]" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${styles.text} mb-1`}>
                      {feature.title}
                    </h4>
                    <p className={`text-xs ${styles.textMutedLighter}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sustainability Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className={`p-6 md:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#007C74]/10">
                <Leaf className="w-6 h-6 text-[#007C74]" />
              </div>
              <h3 className={`text-xl font-semibold ${styles.text}`}>
                Sustainability
              </h3>
            </div>

            <div className="space-y-4">
              {sustainabilityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-[#007C74]/10 shrink-0">
                    <feature.icon className="w-4 h-4 text-[#007C74]" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${styles.text} mb-1`}>
                      {feature.title}
                    </h4>
                    <p className={`text-xs ${styles.textMutedLighter}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carbon Neutral Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#007C74]/20 to-[#3C55A5]/20 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-[#007C74]" />
                <div>
                  <p className={`text-sm font-medium ${styles.text}`}>
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-16 lg:mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-3 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white font-medium inline-flex items-center gap-2"
          >
            <span data-translate="why.cta">Experience the Difference</span>
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        style={{ scale }}
        className="absolute bottom-10 left-10 w-32 h-32 border border-[#007C74]/20 rounded-full"
      >
        {[...Array(3)].map((_, i) => (
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
    </motion.section>
  );
}
