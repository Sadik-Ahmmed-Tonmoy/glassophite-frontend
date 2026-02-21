/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Beaker,
  Check,
  Droplets,
  Eye,
  Microscope,
  Scan,
  Shield,
  Sun,
  Thermometer,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { BsSunglasses } from "react-icons/bs";

const innovationData = {
  id: "innovation",
  title: "Lens Technology",
  subtitle: "Crystal Clarity, Tropical Optimized",
  description:
    "Our proprietary lens technology is specifically engineered for the unique light conditions of the subcontinent - from bright tropical sun to monsoon haze.",
  longDescription:
    "After 18 months of research in partnership with BUET's Optical Engineering department, we developed lens technology that addresses the specific visual needs of Bangladesh and similar tropical regions. Our lenses filter out the intense UV rays while enhancing contrast for hazy conditions, and repel water during monsoon - all while maintaining perfect optical clarity.",
  icon: Eye,
  color: "#00A693",
  image: "/images/story/lens-lab.jpg",

  stats: [
    {
      label: "UV Protection",
      value: "100%",
      icon: Sun,
      description: "Blocks UVA/UVB up to 400nm",
    },
    {
      label: "Polarization",
      value: "99.9%",
      icon: Waves,
      description: "Eliminates glare effectively",
    },
    {
      label: "Scratch Resistance",
      value: "10H",
      icon: Shield,
      description: "Hardness rating (pencil hardness)",
    },
    {
      label: "Water Repellency",
      value: "180°",
      icon: Droplets,
      description: "Contact angle for hydrophobic coating",
    },
    {
      label: "Impact Resistance",
      value: "FDA",
      icon: Zap,
      description: "Passes FDA impact testing",
    },
    {
      label: "Research Hours",
      value: "2,500+",
      icon: Microscope,
      description: "In optical engineering",
    },
  ],

  lensTypes: [
    {
      name: "Polarized Pro",
      benefits: [
        "Glare reduction 99.9%",
        "Contrast enhancement",
        "Driving optimized",
      ],
      tech: ["Multi-layer polarization", "Anti-reflective coating"],
      最适合: "Outdoor activities, Driving",
    },
    // {
    //   name: "Blue Shield",
    //   benefits: ["Digital eye strain reduction", "Blue light filtration", "Sleep quality"],
    //   tech: ["Blue light filter", "Anti-glare"],
    //   最适合: "Screen users, Indoor",
    // },
    {
      name: "Photochromic Elite",
      benefits: ["Auto darkening", "UV protection", "Versatile use"],
      tech: ["Light-adaptive molecules", "UV activation"],
      最适合: "Variable light conditions",
    },
    // {
    //   name: "Monsoon Guard",
    //   benefits: ["Hydrophobic coating", "Anti-fog", "Dust resistant"],
    //   tech: ["Nano-coating", "Ventilation channels"],
    //   最适合: "Rainy season, Humid climates",
    // },
  ],

  testResults: [
    { name: "UV Protection", standard: "UV400", result: "100%", pass: true },
    {
      name: "Polarization Efficiency",
      standard: ">99%",
      result: "99.9%",
      pass: true,
    },
    { name: "Scratch Resistance", standard: "8H", result: "10H", pass: true },
    // { name: "Impact Resistance", standard: "FDA", result: "Passed", pass: true },
    // { name: "Optical Distortion", standard: "<0.01D", result: "0.005D", pass: true },
    { name: "Blue Light Block", standard: "20%", result: "35%", pass: true },
  ],

  labEquipment: [
    {
      name: "UV Spectrophotometer",
      purpose: "UV protection measurement",
      accuracy: "±0.1nm",
    },
    {
      name: "Lensometer",
      purpose: "Optical power verification",
      accuracy: "±0.01D",
    },
    {
      name: "Polarization Tester",
      purpose: "Polarization efficiency",
      accuracy: "99.9%",
    },
    { name: "Impact Tester", purpose: "Ball drop test", force: "16g at 50cm" },
    // { name: "Abrasion Tester", purpose: "Scratch resistance", cycles: "5000" },
  ],

  team: [
    {
      name: "Dr. Farhana Islam",
      role: "Chief Optical Scientist",
      expertise: "PhD in Optical Engineering",
      focus: "Lens coating technology",
    },
    {
      name: "Prof. Kamal Hossain",
      role: "Research Advisor",
      expertise: "Professor of Optics, BUET",
      focus: "Light transmission studies",
    },
    {
      name: "Engineer Shahriar Khan",
      role: "Lens Coating Specialist",
      expertise: "MSc in Materials Science",
      focus: "Hydrophobic coatings",
    },
  ],
};

export default function InnovationLabsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeLens, setActiveLens] = useState(0);
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

  const springConfig = { stiffness: 100, damping: 30 };
  const x = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -200]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
    springConfig,
  );

  const themeStyles = {
    dark: {
      bg: "from-gray-900 via-black to-gray-900",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      success: "text-green-400",
      warning: "text-yellow-400",
    },
    light: {
      bg: "from-gray-50 via-white to-gray-50",
      card: "bg-white/70 border-neutral-200",
      cardHover: "hover:bg-white",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      success: "text-green-600",
      warning: "text-yellow-600",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className={`relative w-full min-h-screen bg-gradient-to-b ${styles.bg} transition-colors duration-500 pt-32`}
      aria-label="Glassophite Innovation Labs"
    >
      {/* Lab Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${isDark ? "#00A693" : "#00A693"} 1px, transparent 1px),
                            linear-gradient(90deg, ${isDark ? "#00A693" : "#00A693"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated Scan Line */}
      <motion.div
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00A693] to-transparent blur-sm"
      />

      {/* Floating Test Tubes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 5}%`,
          }}
        >
          <BsSunglasses
            className={`w-6 h-6 ${isDark ? "text-[#00A693]/20" : "text-[#00A693]/10"}`}
          />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 py-12 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 mb-4">
            <Atom className="w-4 h-4 text-[#00A693]" />
            <span className={`text-sm ${styles.textMuted}`} data-translate="innovation.badge">
              {innovationData.subtitle}
            </span>
          </div> */}
          <h2 className="text-5xl  font-bold mb-4">
            <span className={styles.text}>{innovationData.title}</span>
            <br />
            <span className="bg-gradient-to-r from-[#00A693] via-[#007C74] to-[#3C55A5] bg-clip-text text-transparent">
              Research & Development
            </span>
          </h2>
        </motion.div>

        {/* Stats Bar */}
        <motion.div style={{ x }} className="grid grid-cols-6 gap-3 mb-8">
          {innovationData.stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-xl ${styles.card} backdrop-blur-sm text-center`}
            >
              <stat.icon className="w-4 h-4 text-[#00A693] mx-auto mb-1" />
              <span className={`text-sm font-bold ${styles.text}`}>
                {stat.value}
              </span>
              <p className={`text-[10px] ${styles.textMutedLighter}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 flex-1">
          {/* Lens Types */}
          <div
            className={`lg:col-span-1 p-6 rounded-2xl ${styles.card} backdrop-blur-md`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#00A693]" />
              <span data-translate="innovation.lensTypes">
                Lens Technologies
              </span>
            </h3>

            <div className="space-y-3">
              {innovationData.lensTypes.map((lens, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveLens(index)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    activeLens === index
                      ? `${styles.card} border-[#00A693]/50 shadow-[0_0_30px_rgba(0,166,147,0.2)]`
                      : styles.card
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${styles.text}`}>
                      {lens.name}
                    </h4>
                    {activeLens === index && (
                      <Scan className="w-4 h-4 text-[#00A693]" />
                    )}
                  </div>
                  <div className="space-y-2">
                    {lens.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-[#00A693]" />
                        <span className={`text-xs ${styles.textMutedLighter}`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                  {activeLens === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <p className={`text-xs ${styles.textMutedLighter}`}>
                        <span className="font-medium">Best for:</span>{" "}
                        {lens.最适合}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Test Results */}
          <div
            className={`lg:col-span-1 p-6 rounded-2xl ${styles.card} backdrop-blur-md`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-[#00A693]" />
              <span data-translate="innovation.testResults">Test Results</span>
            </h3>

            <div className="space-y-3">
              {innovationData.testResults.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className={`text-sm ${styles.text}`}>{test.name}</p>
                    <p className={`text-xs ${styles.textMutedLighter}`}>
                      Standard: {test.standard}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${test.pass ? styles.success : styles.warning}`}
                    >
                      {test.result}
                    </p>
                    {test.pass ? (
                      <Check className="w-3 h-3 text-green-500 ml-auto" />
                    ) : (
                      <X className="w-3 h-3 text-red-500 ml-auto" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Certification Badge */}
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#00A693]/10 to-[#007C74]/10 border border-[#00A693]/20">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00A693]" />
                <span className={`text-xs ${styles.textMutedLighter}`}>
                  ISO 12312-1:2022 Certified
                </span>
              </div>
            </div>
          </div>

          {/* Lab Equipment & Team */}
          <div
            className={`lg:col-span-1 p-6 rounded-2xl ${styles.card} backdrop-blur-md`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Microscope className="w-5 h-5 text-[#00A693]" />
              <span data-translate="innovation.lab">Lab Equipment</span>
            </h3>

            <div className="space-y-4">
              {innovationData.labEquipment.map((equipment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00A693]/10 flex items-center justify-center">
                    <Thermometer className="w-4 h-4 text-[#00A693]" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${styles.text}`}>
                      {equipment.name}
                    </p>
                    <p className={`text-xs ${styles.textMutedLighter}`}>
                      {equipment.purpose}
                    </p>
                    <p className={`text-[10px] ${styles.textMutedLighter}`}>
                      Accuracy: {equipment.accuracy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <button className="group relative px-8 py-3 rounded-full overflow-hidden bg-gradient-to-r from-[#00A693] to-[#007C74] text-white font-medium inline-flex items-center gap-2">
            <span data-translate="innovation.cta">View Technical Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className={`text-xs ${styles.textMutedLighter} mt-2`}>
            Certified by BUET Optical Engineering Department
          </p>
        </motion.div> */}
      </div>

      {/* Scroll Progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A693] via-[#007C74] to-[#3C55A5] origin-left"
      />
    </motion.section>
  );
}
