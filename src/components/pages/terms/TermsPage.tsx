"use client";

import { motion } from "framer-motion";
import { Gavel, Scale, ShieldAlert } from "lucide-react";

export default function TermsPage() {
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
            <span data-translate="terms.title">Terms of Service</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="terms.subtitle">
            Understand the rules, guidelines, and purchasing constraints governing the usage of the Glassophite platform.
          </p>
        </div>

        {/* Pillars */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="terms.p1_title">User Responsibilities</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="terms.p1_desc">
              You agree to provide true, accurate, and current user profile details during order checkouts.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <Gavel className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="terms.p2_title">Purchase Terms</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="terms.p2_desc">
              Orders are legally binding transaction agreements subject to quality control validation and local shipping laws.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="terms.p3_title">Intellectual Property</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="terms.p3_desc">
              Designs, structural drawings, logo marks, and visual graphics remain the sole asset property of Glassophite.
            </p>
          </motion.div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-6 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="terms.sec1_title">1. Order Processing & Verification</h2>
            <p data-translate="terms.sec1_p1">
              By submitting an order with Glassophite, you agree that your purchase is an offer to buy the items listed. We reserve the right to cancel or reject orders due to raw material stock shortages, shipping limitations, or payment verification failures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="terms.sec2_title">2. Product Dimensions & Lens Accuracy</h2>
            <p data-translate="terms.sec2_p1">
              While we attempt to represent colors, patterns, and lens curvatures with high precision, actual display render metrics vary depending on your monitor and device settings. You agree to double-check optical prescription details before completing the checkout process.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="terms.sec3_title">3. Pricing Errors & Adjustments</h2>
            <p data-translate="terms.sec3_p1">
              Prices of products are shown in Bangladeshi Taka (BDT). While we strive to avoid typographical errors, if an item is listed with an incorrect price, we hold the authority to cancel outstanding shipments and request corrections.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="terms.sec4_title">4. Governing Law</h2>
            <p data-translate="terms.sec4_p1">
              These terms are constructed and governed in compliance with the consumer protection and digital commerce laws of the People&apos;s Republic of Bangladesh. Disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of Dhaka.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
