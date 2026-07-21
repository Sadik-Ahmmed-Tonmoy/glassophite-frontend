"use client";

import { motion } from "framer-motion";
import { Cookie, Eye, Cpu } from "lucide-react";

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

export default function CookiesPage() {
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
            <span data-translate="cookies.title">Cookie Policy</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed"
            data-translate="cookies.subtitle"
          >
            Understand how our storefront employs cookies and analytics tracking to
            refine performance and preserve login states.
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
              <Cookie className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="cookies.p1_title"
            >
              Essential Cookies
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="cookies.p1_desc"
            >
              Preserves items added to your bag, current layout views, and
              authenticated login sessions.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="cookies.p2_title"
            >
              Preference Cookies
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="cookies.p2_desc"
            >
              Tracks local parameter configs like light vs dark theme toggles and
              language choices.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-neutral-200/80 dark:border-white/10 shadow-xs"
          >
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit">
              <Eye className="w-5 h-5" />
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
              data-translate="cookies.p3_title"
            >
              Performance Metrics
            </h3>
            <p
              className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="cookies.p3_desc"
            >
              Collects anonymous loading metrics and speed bottlenecks so we can
              refine loading rates.
            </p>
          </motion.div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border border-neutral-200/80 dark:border-white/10 shadow-md">
          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="cookies.sec1_title"
            >
              1. What are Cookies?
            </h2>
            <p data-translate="cookies.sec1_p1">
              Cookies are small, encrypted text documents created by websites
              inside your client device browser storage. They help us remember
              critical navigation records to save you from re-entering
              authentication keys or rebuilding your cart on every visit.
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="cookies.sec2_title"
            >
              2. Type of Cookies We Use
            </h2>
            <p data-translate="cookies.sec2_p1">
              - <strong className="text-neutral-800 dark:text-neutral-200">Session Cookies</strong>: Essential for NextAuth account preservation and secure checkout processing. These expire when the tab is closed.
            </p>
            <p data-translate="cookies.sec2_p2">
              - <strong className="text-neutral-800 dark:text-neutral-200">Persistent Cookies</strong>: Retains local states such as your active theme selection (e.g. Next Themes setup) and language preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="cookies.sec3_title"
            >
              3. Disabling & Modifying Browser Configs
            </h2>
            <p data-translate="cookies.sec3_p1">
              You can toggle, block, or delete cookies via your browser settings
              panel at any time. However, disabling all essential cookies might lock
              you out of secure areas, empty your shopping cart, or interfere with
              Google Translate integrations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
