"use client";

import { motion } from "framer-motion";
import { Accessibility, Eye, Keyboard } from "lucide-react";

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

export default function AccessibilityPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 space-y-10 sm:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 pt-4 sm:pt-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="accessibility.title">Accessibility Statement</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed"
            data-translate="accessibility.subtitle"
          >
            Glassophite&apos;s commitment to ensuring that digital commerce remains
            universally accessible to all users.
          </p>
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <Eye className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="accessibility.p1_title"
            >
              Visual Contrast
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="accessibility.p1_desc"
            >
              We leverage semantic styling tokens to maintain robust contrast ratios
              in both light and dark modes.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="accessibility.p2_title"
            >
              Keyboard Navigation
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="accessibility.p2_desc"
            >
              Interactive buttons, inputs, and dropdown sections are keyboard
              tab-accessible with clear outline states.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <Accessibility className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="accessibility.p3_title"
            >
              Screen Reader Compatible
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="accessibility.p3_desc"
            >
              Images include alt attributes and interactive controls employ standard
              ARIA labels for compatibility.
            </p>
          </motion.div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border border-neutral-200/80 dark:border-white/10 shadow-md">
          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="accessibility.sec1_title"
            >
              1. Our Commitment
            </h2>
            <p data-translate="accessibility.sec1_p1">
              At Glassophite, we believe elegance should be experienced by
              everyone. We are dedicated to ensuring digital usability for people of
              all abilities, continually upgrading our codebase to comply with the
              Web Content Accessibility Guidelines (WCAG 2.1 AA parameters).
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="accessibility.sec2_title"
            >
              2. Accessible Features
            </h2>
            <p data-translate="accessibility.sec2_p1">
              - <strong className="text-neutral-800 dark:text-neutral-200">Contrast Compliance</strong>: Our text-to-background contrast adheres to recommended standards.
            </p>
            <p data-translate="accessibility.sec2_p2">
              - <strong className="text-neutral-800 dark:text-neutral-200">Aria Tags</strong>: Semantic tags ensure that assistive technology tools can read our site maps, checkout forms, and filtering sections.
            </p>
            <p data-translate="accessibility.sec2_p3">
              - <strong className="text-neutral-800 dark:text-neutral-200">Dynamic Themes</strong>: The layout is responsive to system fonts and zoom settings, preventing word clipping when viewport scaling is adjusted.
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="accessibility.sec3_title"
            >
              3. Feedback
            </h2>
            <p data-translate="accessibility.sec3_p1">
              If you face issues navigating any section of Glassophite, please notify
              us at{" "}
              <a
                href="mailto:support.glassophite@gmail.com"
                className="text-[#007C74] font-semibold hover:underline"
              >
                support.glassophite@gmail.com
              </a>
              . We will optimize the layout elements to accommodate your
              assistive requirements.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
