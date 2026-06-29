"use client";

import { motion } from "framer-motion";
import { Download, PhoneCall, Calendar } from "lucide-react";

const pressReleases = [
  {
    date: "April 15, 2026",
    title: "Glassophite Launches 2026 Titanium & Bio-Acetate Collection",
    translateTitleKey: "press.pr1_title",
    excerpt: "Redefining ergonomics and optical clarity, Glassophite introduces its latest limited-run sunglasses featuring Japanese titanium templates and custom polarized filters.",
    translateExcerptKey: "press.pr1_excerpt",
  },
  {
    date: "February 28, 2026",
    title: "Glassophite Flagship Showroom Opens in Gulshan-2, Dhaka",
    translateTitleKey: "press.pr2_title",
    excerpt: "The luxury label establishes its physical footprint with an immersive try-on experience room, providing bespoke styling consultations for guests.",
    translateExcerptKey: "press.pr2_excerpt",
  },
];

export default function PressPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="press.title">Press Room</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="press.subtitle">
            Find the latest corporate news, brand assets, and press releases from Glassophite.
          </p>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Media Kit */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="press.kit_title">Brand Assets & Media Kit</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="press.kit_desc">
                Download the official Glassophite logo package, frame photography catalogues, and brand guidelines for publication.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer w-fit">
              <Download className="w-4 h-4" />
              <span data-translate="press.kit_btn">Download Media Kit (ZIP)</span>
            </button>
          </div>

          {/* PR Contact */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="press.contact_title">Media Relations</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="press.contact_desc">
                For press inquiries, sample requests, or interview schedules with our creative leads, contact our PR division.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
              <PhoneCall className="w-4 h-4 text-[#007C74]" />
              <span>press@glassophite.com</span>
            </div>
          </div>
        </div>

        {/* Press Releases List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#007C74] dark:text-white text-center" data-translate="press.releases_title">Recent Releases</h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-4"
          >
            {pressReleases.map((pr, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="glass-panel p-6 rounded-xl space-y-3 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-2 text-[10px] text-[#007C74] font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{pr.date}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white" data-translate={pr.translateTitleKey}>
                  {pr.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate={pr.translateExcerptKey}>
                  {pr.excerpt}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
