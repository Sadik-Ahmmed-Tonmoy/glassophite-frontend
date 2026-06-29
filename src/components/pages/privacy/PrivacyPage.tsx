"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock } from "lucide-react";

export default function PrivacyPage() {
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
            <span data-translate="privacy.title">Privacy Policy</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="privacy.subtitle">
            How Glassophite collects, uses, and safeguards your personal data during purchase and web-camera fittings.
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
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="privacy.p1_title">Data Transparency</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="privacy.p1_desc">
              We collect billing data, profile parameters, and email metrics solely to fulfill purchases and provide order logs.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="privacy.p2_title">Secure SSL Encryptions</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="privacy.p2_desc">
              All payment credentials and SSL authorizations are processed securely. We never store credit card records directly.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="privacy.p3_title">Virtual Try-On Security</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="privacy.p3_desc">
              Camera feeds mapped for 3D face fitting are processed inside your client browser. We never upload your video stream.
            </p>
          </motion.div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-6 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="privacy.sec1_title">1. Information We Collect</h2>
            <p data-translate="privacy.sec1_p1">
              We collect information that is required to process and ship products. This includes your name, delivery address, billing information, telephone number, and account credentials handled via NextAuth (e.g. Google Login parameters).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="privacy.sec2_title">2. Try-On Camera Processing & Privacy</h2>
            <p data-translate="privacy.sec2_p1">
              Glassophite features 3D face mesh camera try-ons. This tracking handles local browser calculations using client-side libraries. No raw media, videos, images, or face mappings are sent to our servers. They reside entirely within your local device memory and are destroyed when the browser window closes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="privacy.sec3_title">3. Analytics & Cookies</h2>
            <p data-translate="privacy.sec3_p1">
              We employ standard cookies to sustain user login sessions, shopping bags, and theme states (light vs dark mode configuration). Analytical pixels are solely gathered to check shopping trends and web errors to optimize loading speeds.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="privacy.sec4_title">4. Third-Party Disclosures</h2>
            <p data-translate="privacy.sec4_p1">
              We do not distribute, exchange, or rent client records to marketing companies. We share selected parameters exclusively with essential support entities, including local courier companies (for address delivery) and SSL gateway transaction systems.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
