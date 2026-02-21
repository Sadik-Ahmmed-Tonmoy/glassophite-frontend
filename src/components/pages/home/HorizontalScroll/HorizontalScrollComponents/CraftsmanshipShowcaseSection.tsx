/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Award,
  CheckCircle,
  Clock,
  Crown,
  Globe,
  Layers,
  Maximize2,
  Pause,
  Play,
  Shield,
  Truck,
  Users
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const productData = {
  id: "products",
  title: "Global Selection",
  subtitle: "Curated from the World's Best",
  description: "We travel the world to bring you premium eyewear. We don't manufacture, we select.",
  longDescription: "Glassophite partners with family-owned manufacturers in Italy, Japan, and China who've been making eyewear for 30+ years. We curate their best designs, add our branding, and bring them to Dhaka. No factories, no workshops - just great products at fair prices.",
  icon: Globe,
  color: "#3C55A5",
  image: "/images/story/craftsmanship-workshop.jpg",
  
  stats: [
    { label: "Partner Factories", value: "4", icon: Globe, description: "Italy, Japan & China" },
    { label: "Partner Experience", value: "30+", icon: Clock, description: "Years combined" },
    { label: "Quality Check", value: "100%", icon: Shield, description: "Each piece inspected" },
    { label: "Products", value: "50+", icon: Layers, description: "Styles available" },
    { label: "Turnaround", value: "2 Days", icon: Truck, description: "Local delivery" },
    { label: "Warranty", value: "1 Year", icon: Crown, description: "Against defects" },
  ],

  partners: [
    {
      country: "Italy",
      region: "Cadore, Veneto",
      partner: "SRL Ottica",
      since: "est. 1985",
      description: "Third-generation family workshop specializing in acetate frames.",
      products: ["Acetate frames", "Hand-finished"],
      flag: "🇮🇹",
    },
    // {
    //   country: "Japan",
    //   region: "Sabae, Fukui",
    //   partner: "Tanaka Precision",
    //   since: "est. 1972",
    //   description: "Known for titanium frames and precision engineering.",
    //   products: ["Titanium frames", "Beta-Titanium"],
    //   flag: "🇯🇵",
    // },
    {
      country: "China",
      region: "Shenzhen",
      partner: "Bright Optics",
      since: "since 2005",
      description: "Modern facility with ISO certification.",
      products: ["Lenses", "Accessories"],
      flag: "🇨🇳",
    },
  ],

  process: [
    {
      step: 1,
      title: "Sourcing",
      description: "We partner with established manufacturers in Italy, Japan, and China with 20+ years experience.",
      duration: "Ongoing",
      team: "Sourcing Team",
      tools: ["Factory visits", "Sample testing"],
      materials: ["Product catalogs"],
    },
    {
      step: 2,
      title: "Selection",
      description: "We visit factories twice a year to select designs that work for Bangladesh.",
      duration: "2 weeks",
      team: "Rahman & Tasnim",
      tools: ["Design review", "Price negotiation"],
      materials: ["Selected samples"],
    },
    {
      step: 3,
      title: "Import",
      description: "Frames are shipped to Dhaka in batches. We handle all customs and paperwork.",
      duration: "4-6 weeks",
      team: "Logistics Team",
      tools: ["Shipping", "Customs clearance"],
      materials: ["Inventory"],
    },
    {
      step: 4,
      title: "Quality Check",
      description: "Every single frame is inspected in our Dhaka office. We reject about 5%.",
      duration: "2 days",
      team: "QC Team (2 inspectors)",
      tools: ["Inspection tools", "Testing"],
      materials: ["Passed units"],
    },
    {
      step: 5,
      title: "Branding",
      description: "We add our logo to temples and include Glassophite packaging.",
      duration: "1 day",
      team: "Packaging Team",
      tools: ["Logo application", "Boxing"],
      materials: ["Boxes", "Cloths", "Logos"],
    },
    {
      step: 6,
      title: "Ready for Sale",
      description: "Products available online and at partner stores in Dhaka.",
      duration: "In stock",
      team: "Sales Team",
      tools: ["Website", "Retail partners"],
      materials: ["Final product"],
    },
  ],

  materials: [
    {
      name: "Italian Acetate",
      origin: "Mazzucchelli, Italy (est. 1849)",
      properties: ["Plant-based", "Vibrant colors", "Durable"],
      used_by: "Premium eyewear worldwide",
      color: "#3C55A5",
    },
    {
      name: "Grade 5 Titanium",
      origin: "Switzerland/Japan",
      properties: ["Ultra-light", "Flexible", "Hypoallergenic"],
      used_by: "Medical implants, luxury eyewear",
      color: "#007C74",
    },
    {
      name: "CR-39 Lenses",
      origin: "China/Japan",
      properties: ["UV protection", "Scratch-resistant", "Clear"],
      used_by: "Most optical brands",
      color: "#00A693",
    },
  ],

  achievements: [
    {
      title: "Best New Brand",
      year: "2025",
      description: "Bangladesh Retail Award",
      impact: "Recognized for quality selection"
    },
    {
      title: "Customer Choice",
      year: "2025",
      description: "Online voting",
      impact: "4.8★ rating from 200+ reviews"
    },
  ],

  team: [
    {
      name: "Rahman Ahmed",
      role: "Founder",
      experience: "12 years",
      specialty: "Sourcing & partnerships",
      story: "Former Swiss eyewear industry, now bringing global brands to BD"
    },
    {
      name: "Tasnim Khan",
      role: "Sourcing Manager",
      experience: "5 years",
      specialty: "Supplier relations",
      story: "Travels to factories 3-4 times a year"
    },
    {
      name: "QC Team",
      role: "2 Inspectors",
      experience: "In Dhaka",
      specialty: "Quality control",
      story: "Every frame checked before shipping"
    },
  ],
};

export default function ProductShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  // After mounting, we have access to the theme
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

  // Auto-rotate steps
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % productData.process.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const springConfig = { stiffness: 100, damping: 30 };
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.9, 1]), springConfig);
  const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 10]), springConfig);

  // Determine current theme - use resolvedTheme to handle 'system'
  const currentTheme = mounted ? (resolvedTheme || theme) : 'light';
  const isDark = currentTheme === 'dark';

  // Theme styles with proper dark/light values
  const themeStyles = {
    dark: {
      bg: "from-gray-950 via-gray-900 to-gray-950",
      card: "bg-gray-800/50 border-gray-700/50",
      cardHover: "hover:bg-gray-700/50",
      text: "text-white",
      textMuted: "text-gray-300",
      textMutedLighter: "text-gray-400",
      accent: "text-[#3C55A5]",
      accentBg: "bg-[#3C55A5]/20",
      border: "border-gray-700",
    },
    light: {
      bg: "from-gray-50 via-white to-gray-50",
      card: "bg-white/80 border-gray-200/80",
      cardHover: "hover:bg-white",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      textMutedLighter: "text-gray-500",
      accent: "text-[#3C55A5]",
      accentBg: "bg-[#3C55A5]/10",
      border: "border-gray-200",
    }
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <motion.section
      ref={containerRef}
      className={`relative w-full min-h-screen py-12 lg:py-16 overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-300`}
      aria-label="Glassophite Product Showcase"
    >
      {/* Background Pattern - Theme aware */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L60 60 M60 0 L0 60' stroke='${isDark ? '%233C55A5' : '%233C55A5'}' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating orbs - Theme aware */}
      <motion.div
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-20 w-96 h-96 bg-[#3C55A5]/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-[#007C74]/10 rounded-full blur-[100px]"
      />

      {/* Main Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 lg:pt-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-12"
        >
          {/* <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${styles.border} mb-4`}>
            <Globe className="w-4 h-4 text-[#3C55A5]" />
            <span className={`text-sm ${styles.textMuted}`}>
              {productData.subtitle}
            </span>
          </div> */}
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className={styles.text}>{productData.title}</span>
            <br />
            <span className="bg-gradient-to-r from-[#3C55A5] via-[#007C74] to-[#00A693] bg-clip-text text-transparent">
              Curated for Bangladesh
            </span>
          </h2>
          <p className={`text-base sm:text-lg ${styles.textMuted} leading-relaxed max-w-xl mx-auto`}>
            {productData.longDescription}
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column - Process Visualization */}
          <motion.div 
            style={{ scale }}
            className="space-y-6 -mt-3"
          >
            {/* Process Viewer */}
            <div className={`relative h-[295px]  rounded-2xl ${styles.card} backdrop-blur-md overflow-hidden p-5 lg:p-6 border ${styles.border}`}>
              {/* Step Number */}
              <div className="absolute top-6 right-6 text-7xl lg:text-8xl font-bold opacity-10 text-[#3C55A5]">
                {String(activeStep + 1).padStart(2, '0')}
              </div>

              {/* Active Step Content */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${styles.accentBg} flex items-center justify-center`}>
                    <span className="text-xl lg:text-2xl font-bold text-[#3C55A5]">{activeStep + 1}</span>
                  </div>
                  <div>
                    <h3 className={`text-lg lg:text-xl font-bold ${styles.text}`}>
                      {productData.process[activeStep].title}
                    </h3>
                    <p className={`text-xs lg:text-sm ${styles.textMutedLighter}`}>
                      {productData.process[activeStep].duration}
                    </p>
                  </div>
                </div>

                <p className={`text-sm ${styles.textMuted} mb-4 flex-1 line-clamp-3 lg:line-clamp-none`}>
                  {productData.process[activeStep].description}
                </p>

                {/* Team & Tools - Hidden on mobile */}
                <div className="space-y-3 hidden lg:block">
                  <div>
                    <p className={`text-xs uppercase tracking-wider ${styles.textMutedLighter} mb-2`}>Team</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${styles.card} border ${styles.border}`}>
                        {productData.process[activeStep].team}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-wider ${styles.textMutedLighter} mb-2`}>Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {productData.process[activeStep].tools.map((tool, i) => (
                        <span key={i} className={`px-2 py-1 rounded-full text-xs ${styles.card} border ${styles.border}`}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-1.5 lg:p-2 rounded-full ${styles.card} hover:bg-opacity-80 transition-colors border ${styles.border}`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? 
                    <Pause className="w-3 h-3 lg:w-4 lg:h-4 text-[#3C55A5]" /> : 
                    <Play className="w-3 h-3 lg:w-4 lg:h-4 text-[#3C55A5]" />
                  }
                </button>
                <div className="flex gap-1">
                  {productData.process.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveStep(i);
                        setIsPlaying(false);
                      }}
                      className={`h-1 rounded-full transition-all ${
                        activeStep === i 
                          ? 'w-4 lg:w-8 bg-[#3C55A5]' 
                          : `w-1 lg:w-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 lg:p-2 rounded-full lg:hidden bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                  aria-label="Toggle details"
                >
                  <Maximize2 className="w-3 h-3 lg:w-4 lg:h-4 text-[#3C55A5]" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {productData.stats.slice(0, 3).map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-xl ${styles.card} backdrop-blur-sm border ${styles.border} text-center`}
                >
                  <stat.icon className="w-4 h-4 text-[#3C55A5] mx-auto mb-1" />
                  <span className={`text-sm font-bold ${styles.text}`}>{stat.value}</span>
                  <p className={`text-[9px] ${styles.textMutedLighter}`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Partners & Materials */}
          <motion.div 
            style={{ rotateY }}
            className="space-y-4 lg:space-y-6"
          >
            {/* Partners Showcase */}
            <div className={`p-5 lg:p-6 rounded-2xl ${styles.card} backdrop-blur-md border ${styles.border}`}>
              <h3 className={`text-base lg:text-xl font-semibold mb-3 lg:mb-4 flex items-center gap-2 ${styles.text}`}>
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-[#3C55A5]" />
                <span>Our Partners</span>
              </h3>

              <div className="space-y-3 lg:space-y-4">
                {productData.partners.map((partner, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-xl ${styles.cardHover} transition-colors border ${styles.border}`}
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-[#3C55A5]/10 flex items-center justify-center text-2xl">
                      {partner.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm lg:text-base font-medium ${styles.text}`}>{partner.country}</h4>
                      <p className={`text-[10px] lg:text-xs ${styles.textMutedLighter}`}>
                        {partner.partner} {partner.since}
                      </p>
                      <p className={`text-[8px] lg:text-[10px] ${styles.textMutedLighter} mt-0.5`}>
                        {partner.products.join(" • ")}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-[#3C55A5] flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

        

            {/* Warranty & Team */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl ${styles.card} backdrop-blur-sm border ${styles.border}`}>
                <Shield className="w-5 h-5 text-[#3C55A5] mb-1" />
                <p className={`text-xs font-medium ${styles.text}`}>1 Year Warranty</p>
                <p className={`text-[8px] ${styles.textMutedLighter}`}>On all frames</p>
              </div>
              <div className={`p-3 rounded-xl ${styles.card} backdrop-blur-sm border ${styles.border}`}>
                <Award className="w-5 h-5 text-[#3C55A5] mb-1" />
                <p className={`text-xs font-medium ${styles.text}`}>4.8★ Rating</p>
                <p className={`text-[8px] ${styles.textMutedLighter}`}>From 200+ reviews</p>
              </div>
            </div>

          
          </motion.div>
        </div>
      </div>

      {/* Scroll Progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3C55A5] via-[#007C74] to-[#00A693] origin-left"
      />
    </motion.section>
  );
}