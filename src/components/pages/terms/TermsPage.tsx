"use client";

import { motion } from "framer-motion";
import { Gavel, Scale, ShieldAlert } from "lucide-react";

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

export default function TermsPage() {
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
            <span data-translate="terms.title">Terms of Service</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed"
            data-translate="terms.subtitle"
          >
            Understand the rules, guidelines, and purchasing constraints governing the
            usage of the Glassophite platform.
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
              <Scale className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="terms.p1_title"
            >
              User Responsibilities
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="terms.p1_desc"
            >
              You agree to provide true, accurate, and current user profile details
              during order checkouts.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <Gavel className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="terms.p2_title"
            >
              Purchase Terms
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="terms.p2_desc"
            >
              Orders are legally binding transaction agreements subject to quality
              control validation and local shipping laws.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="terms.p3_title"
            >
              Intellectual Property
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="terms.p3_desc"
            >
              Designs, structural drawings, logo marks, and visual graphics remain the
              sole asset property of Glassophite.
            </p>
          </motion.div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border border-neutral-200/80 dark:border-white/10 shadow-md">
          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="terms.sec1_title"
            >
              1. Order Processing & Verification
            </h2>
            <p data-translate="terms.sec1_p1">
              By submitting an order with Glassophite, you agree that your purchase
              is an offer to buy the items listed. We reserve the right to cancel or
              reject orders due to raw material stock shortages, shipping
              limitations, or payment verification failures.
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="terms.sec2_title"
            >
              2. Product Dimensions & Lens Accuracy
            </h2>
            <p data-translate="terms.sec2_p1">
              While we attempt to represent colors, patterns, and lens curvatures
              with high precision, actual display render metrics vary depending on your
              monitor and device settings. You agree to double-check optical
              prescription details before completing the checkout process.
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="terms.sec3_title"
            >
              3. Pricing Errors & Adjustments
            </h2>
            <p data-translate="terms.sec3_p1">
              Prices of products are shown in Bangladeshi Taka (BDT). While we strive
              to avoid typographical errors, if an item is listed with an incorrect
              price, we hold the authority to cancel outstanding shipments and request
              corrections.
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="terms.sec4_title"
            >
              4. Governing Law
            </h2>
            <p data-translate="terms.sec4_p1">
              These terms are constructed and governed in compliance with the
              consumer protection and digital commerce laws of the People&apos;s
              Republic of Bangladesh. Disputes arising hereunder shall be subject to
              the exclusive jurisdiction of the courts of Dhaka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
