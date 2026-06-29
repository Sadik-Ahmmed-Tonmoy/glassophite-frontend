"use client";

import { motion } from "framer-motion";
import { Cookie, Eye, Cpu } from "lucide-react";

export default function CookiesPage() {
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
            <span data-translate="cookies.title">Cookie Policy</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="cookies.subtitle">
            Understand how our storefront employs cookies and analytics tracking to refine performance and preserve login states.
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
              <Cookie className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="cookies.p1_title">Essential Cookies</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="cookies.p1_desc">
              Preserves items added to your bag, current layout views, and authenticated login sessions.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="cookies.p2_title">Preference Cookies</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="cookies.p2_desc">
              Tracks local parameter configs like light vs dark theme toggles and language choices.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl space-y-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold" data-translate="cookies.p3_title">Performance Metrics</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="cookies.p3_desc">
              Collects anonymous loading metrics and speed bottlenecks so we can refine loading rates.
            </p>
          </motion.div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-6 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="cookies.sec1_title">1. What are Cookies?</h2>
            <p data-translate="cookies.sec1_p1">
              Cookies are small, encrypted text documents created by websites inside your client device browser storage. They help us remember critical navigation records to save you from re-entering authentication keys or rebuilding your cart on every visit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="cookies.sec2_title">2. Type of Cookies We Use</h2>
            <p data-translate="cookies.sec2_p1">
              - **Session Cookies**: Essential for NextAuth account preservation and secure checkout processing. These expire when the tab is closed.
            </p>
            <p data-translate="cookies.sec2_p2">
              - **Persistent Cookies**: Retains local states such as your active theme selection (e.g. Next Themes setup) and language preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="cookies.sec3_title">3. Disabling & Modifying Browser Configs</h2>
            <p data-translate="cookies.sec3_p1">
              You can toggle, block, or delete cookies via your browser settings panel at any time. However, disabling all essential cookies might lock you out of secure areas, empty your shopping cart, or interfere with Google Translate integrations.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
