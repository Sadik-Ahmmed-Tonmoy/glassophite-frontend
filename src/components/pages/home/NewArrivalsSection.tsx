/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, ShieldCheck, Gem, Clock, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { useGetNewArrivalsQuery, useGetAllProductsQuery } from "@/redux/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard/ProductCard";

const getThemeStyles = (isDark: boolean) => ({
  background: isDark 
    ? "from-black via-gray-900 to-black" 
    : "from-neutral-50 via-white to-neutral-50",
  text: isDark ? "text-white" : "text-neutral-900",
  textMuted: isDark ? "text-neutral-400" : "text-neutral-600",
  border: isDark ? "border-white/10" : "border-neutral-200",
  glassBg: isDark ? "bg-white/5 backdrop-blur-md" : "bg-white/70 backdrop-blur-md",
  cardBg: isDark ? "bg-neutral-900/40 border-white/5" : "bg-white/80 border-neutral-200/60",
  orbPrimary: isDark ? "bg-[#007C74]/20" : "bg-[#007C74]/10",
  orbSecondary: isDark ? "bg-[#3C55A5]/25" : "bg-[#3C55A5]/10",
  editorialGradient: isDark 
    ? "from-[#007C74]/20 via-black/40 to-[#3C55A5]/20"
    : "from-[#007C74]/5 via-white/50 to-[#3C55A5]/5",
  statBg: isDark ? "bg-white/5 border-white/5" : "bg-neutral-100 border-neutral-200/50",
});

function ProductSkeleton() {
  return (
    <div className="h-full rounded-2xl bg-white/5 dark:bg-white/5 border border-neutral-200/20 dark:border-neutral-800/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Animation variants ──────────────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.8 } 
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
} as const;

export default function NewArrivalsSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = getThemeStyles(isDark);

  // ─── Queries ──────────────────────────────────────────────────────────────
  const {
    data: newArrivalsData,
    isLoading: isLoadingNewArrivals,
    isFetching: isFetchingNewArrivals,
    error: errorNewArrivals,
  } = useGetNewArrivalsQuery(6);
 
  const {
    data: allProductsData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    error: errorAll,
  } = useGetAllProductsQuery({ limit: 6, sortBy: "newest" });

  // ✅ Correct loading: if any query is still loading
  const isLoading = isLoadingNewArrivals || isFetchingNewArrivals || isLoadingAll || isFetchingAll;
  // ✅ Correct error: if any query fails
  const hasError = !!errorNewArrivals || !!errorAll;

  const primaryProducts = (newArrivalsData as any)?.data || [];
  const fallbackProducts = (allProductsData as any)?.data || [];
  const products = primaryProducts.length > 0 ? primaryProducts : fallbackProducts;

  // ─── Loading State ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-20 px-4 sm:px-6`}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="h-8 w-40 bg-neutral-300 dark:bg-neutral-800 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────
  if (hasError) {
    return (
      <section className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-20 px-4 sm:px-6`}>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className={`text-xl font-bold ${styles.text}`}>Failed to load new arrivals</h2>
          <p className={`${styles.textMuted} mt-2`}>Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#007C74] text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // ─── Empty State ──────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <section className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-20 px-4 sm:px-6`}>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 mb-4">
            <Gem className="w-6 h-6 text-neutral-400" />
          </div>
          <h2 className={`text-xl font-bold ${styles.text}`}>No new arrivals yet</h2>
          <p className={`${styles.textMuted} mt-2`}>Check back soon for our latest collections.</p>
        </div>
      </section>
    );
  }

  // ─── Stats ────────────────────────────────────────────────────────────
  const stats = [
    { icon: Gem, label: "Italian Acetate", value: "Premium" },
    { icon: ShieldCheck, label: "UV Protection", value: "100%" },
    { icon: Clock, label: "Craft Time", value: "72 hrs" },
    { icon: Eye, label: "New Styles", value: `${products.length}+` },
  ];

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <motion.section
      id="new-arrivals-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-8 border-t ${styles.border}`}
      aria-labelledby="new-arrivals-title"
    >
      {/* Background decorations (unchanged) */}
      <div className={`absolute top-1/4 right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000 ${styles.orbPrimary}`} />
      <div className={`absolute bottom-1/4 left-[-10%] w-[600px] h-[600px] rounded-full blur-[170px] pointer-events-none transition-opacity duration-1000 ${styles.orbSecondary}`} />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${isDark ? "#fff" : "#000"} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? "#fff" : "#000"} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Mobile Header */}
      <div className="relative z-10 max-w-7xl mx-auto mb-8 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#007C74]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#007C74] uppercase">Just Landed</span>
            </div>
            <h2 id="new-arrivals-title" className={`text-2xl sm:text-3xl font-bold ${styles.text}`}>New Arrivals</h2>
          </div>
          <Link href="/new-arrivals" className="group flex items-center gap-1.5 text-sm font-medium text-[#007C74] hover:text-[#00A693] transition-colors">
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT: Editorial */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-24 space-y-6"
            >
              <div className="hidden lg:flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#007C74]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-[#007C74] uppercase">Just Landed</span>
              </div>
              <h2 className={`hidden lg:block text-3xl xl:text-4xl font-bold ${styles.text}`}>New Arrivals</h2>
              <p className={`${styles.textMuted} text-sm leading-relaxed`}>
                Discover the latest additions to our curated luxury eyewear collection. Each frame is handcrafted by master artisans using premium materials from around the world.
              </p>
              <div className={`h-px w-16 bg-gradient-to-r ${styles.editorialGradient}`} />
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    className={`${styles.statBg} rounded-lg p-3 border ${styles.border}`}
                  >
                    <stat.icon className="w-4 h-4 text-[#007C74] mb-1" />
                    <p className={`text-xs font-semibold ${styles.text}`}>{stat.value}</p>
                    <p className={`text-[10px] ${styles.textMuted}`}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/new-arrivals"
                className="group hidden lg:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#007C74] to-[#00A693] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#007C74]/25 transition-all duration-300"
              >
                Explore New Collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Product Grid */}
          <div className="lg:col-span-8">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={gridVariants}
            >
              {products.map((product: any) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="w-full flex justify-center"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10 text-center lg:hidden">
              <Link
                href="/new-arrivals"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#007C74] to-[#00A693] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#007C74]/25 transition-all duration-300"
              >
                View All New Arrivals
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}