"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Gem, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const CORE_VALUES = [
  {
    icon: Sparkles,
    title: "Timeless Elegance",
    translateKey: "about.value1_title",
    description:
      "Every frame is designed to be a piece of art, standing at the intersection of modern trends and classic luxury.",
    translateDescKey: "about.value1_desc",
  },
  {
    icon: Eye,
    title: "Swiss Lens Precision",
    translateKey: "about.value2_title",
    description:
      "Equipped with advanced UV400 protection and polarizing filters for crystal-clear, distortion-free vision.",
    translateDescKey: "about.value2_desc",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    translateKey: "about.value3_title",
    description:
      "Handcrafted using top-tier Japanese titanium and bio-acetate for lightweight, durable, and comfortable wear.",
    translateDescKey: "about.value3_desc",
  },
  {
    icon: ShieldCheck,
    title: "Absolute Protection",
    translateKey: "about.value4_title",
    description:
      "Engineered to withstand daily wear while protecting your eyes from blue light and harsh glare.",
    translateDescKey: "about.value4_desc",
  },
] as const;

const MATERIALS = [
  {
    name: "Japanese Titanium",
    translateNameKey: "about.material1_name",
    tag: "Ultra-Lightweight & Resilient",
    translateTagKey: "about.material1_tag",
    description:
      "Sourced from the finest metallurgists, our titanium temples offer unmatched flexibility and strength, feeling virtually weightless on your face.",
    translateDescKey: "about.material1_desc",
    gradient: "from-slate-400 to-zinc-600",
  },
  {
    name: "Italian Acetate",
    translateNameKey: "about.material2_name",
    tag: "Rich Color & Bio-Friendly",
    translateTagKey: "about.material2_tag",
    description:
      "Hand-carved from natural cotton fibers, our premium Italian acetate frames boast deep, glossy finishes and hypoallergenic properties.",
    translateDescKey: "about.material2_desc",
    gradient: "from-amber-750 to-amber-900",
  },
  {
    name: "Swiss-Engineered Lenses",
    translateNameKey: "about.material3_name",
    tag: "Optical Excellence",
    translateTagKey: "about.material3_tag",
    description:
      "Featuring anti-reflective, scratch-resistant, and high-contrast coatings, our Swiss-grade lenses provide the ultimate shield for your eyes.",
    translateDescKey: "about.material3_desc",
    gradient: "from-[#007C74] to-[#00A693]",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      <div className="container space-y-16 sm:space-y-20 lg:space-y-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6 pt-4 sm:pt-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="about.hero_title">
              Elegance in Every Frame
            </span>
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto"
            data-translate="about.hero_subtitle"
          >
            Glassophite stands at the intersection of premium craftsmanship,
            state-of-the-art optical technology, and contemporary style.
            Designed specifically for those who choose to lead.
          </p>
        </motion.div>

        {/* Brand Story Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <motion.div
            variants={itemVariants}
            className="space-y-4 sm:space-y-6"
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#007C74] dark:text-white"
              data-translate="about.story_title"
            >
              Our Journey
            </h2>
            <div className="space-y-3.5 sm:space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs sm:text-sm md:text-base">
              <p data-translate="about.story_p1">
                Born out of a desire to redefine luxury eyewear for the modern
                Bangladeshi tastemaker, Glassophite was established in 2026. We
                noticed a void in the market: the lack of premium, thoughtfully
                designed sunglasses that offer both extreme protection and
                distinct style.
              </p>
              <p data-translate="about.story_p2">
                Our design studio collaborates with master artisans globally,
                importing high-end materials and combining them with Swiss
                precision lens cutting. Every curve of a Glassophite frame is
                micro-adjusted to suit varied facial structures, offering
                ergonomic comfort alongside high-fashion aesthetics.
              </p>
              <p data-translate="about.story_p3">
                Whether walking through Dhaka&apos;s bustling premium avenues or
                relaxing along the pristine beaches of Cox&apos;s Bazar, our
                collections match your identity, elevating your confidence with
                elegance you can feel.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-[320px] sm:h-[380px] md:h-[440px] rounded-3xl overflow-hidden glass-panel border border-[#007C74]/20 flex items-center justify-center p-6 sm:p-8 bg-neutral-100/10 dark:bg-neutral-900/10 shadow-xl"
          >
            {/* Ambient Orbs */}
            <div className="absolute top-10 left-10 w-[clamp(140px,20vw,200px)] h-[clamp(140px,20vw,200px)] rounded-full bg-[#007C74]/10 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[clamp(140px,20vw,200px)] h-[clamp(140px,20vw,200px)] rounded-full bg-[#3C55A5]/10 blur-3xl animate-pulse pointer-events-none" />

            <div className="text-center space-y-4 relative z-10">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#007C74] dark:text-[#00A693] tracking-widest uppercase">
                GLASSOPHITE
              </div>
              <p
                className="text-neutral-500 dark:text-neutral-400 font-bold tracking-wider text-[10px] sm:text-xs uppercase"
                data-translate="about.badge_text"
              >
                Luxury Eyewear Label
              </p>
              <div className="h-[2px] w-20 sm:w-24 bg-gradient-to-r from-[#007C74] to-[#3C55A5] mx-auto my-3 sm:my-4" />
              <p
                className="text-xs sm:text-sm italic text-neutral-600 dark:text-neutral-300 max-w-sm"
                data-translate="about.badge_quote"
              >
                &ldquo;We don&apos;t follow trends; we frame them.&rdquo;
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Core Values Section */}
        <div className="space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#007C74] dark:text-white"
              data-translate="about.values_title"
            >
              Our Core Pillars
            </h2>
            <p
              className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm"
              data-translate="about.values_subtitle"
            >
              Built on four fundamental values that govern everything we create.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {CORE_VALUES.map((value, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4 border border-neutral-200/80 dark:border-white/10 hover:border-[#007C74]/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 text-[#007C74] rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3
                    className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
                    data-translate={value.translateKey}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                    data-translate={value.translateDescKey}
                  >
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Materials Section */}
        <div className="space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-[#007C74] dark:text-white"
              data-translate="about.materials_title"
            >
              The Materials of Luxury
            </h2>
            <p
              className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm"
              data-translate="about.materials_subtitle"
            >
              Sourcing the best components globally to create the ultimate
              premium sunglasses.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {MATERIALS.map((mat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[290px] border border-neutral-200/80 dark:border-white/10 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 dark:opacity-20 blur-2xl rounded-full pointer-events-none" />
                <div className="space-y-3.5 relative z-10">
                  <span
                    className="text-[10px] uppercase font-extrabold tracking-widest text-[#007C74]"
                    data-translate={mat.translateTagKey}
                  >
                    {mat.tag}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white"
                    data-translate={mat.translateNameKey}
                  >
                    {mat.name}
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                    data-translate={mat.translateDescKey}
                  >
                    {mat.description}
                  </p>
                </div>

                <div className="relative z-10 w-fit pt-4">
                  <div className="h-1 w-20 bg-gradient-to-r from-[#007C74] to-[#3C55A5] rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden bg-gradient-to-r from-[#007c74]/20 via-[#3c55a5]/10 to-[#007c74]/20 border border-[#007C74]/20 text-center space-y-6 shadow-lg"
        >
          <div className="absolute inset-0 bg-neutral-900/5 dark:bg-black/40 backdrop-blur-[2px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white"
              data-translate="about.cta_title"
            >
              Experience the Luxury of Glassophite
            </h2>
            <p
              className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto leading-relaxed"
              data-translate="about.cta_desc"
            >
              Browse our collections of polarized and blue-light blocking
              sunglasses, handcrafted to upgrade your style statement.
            </p>
            <div className="pt-2">
              <Link href="/product-filter">
                <button className="px-6 sm:px-8 py-3 bg-[#007C74] hover:bg-[#006059] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg hover:shadow-[#007c74]/20 transition-all duration-300 inline-flex items-center gap-2 group cursor-pointer">
                  <span data-translate="about.cta_btn">
                    Explore Collections
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
