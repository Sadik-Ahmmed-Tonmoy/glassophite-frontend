"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, LayoutGrid } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import type { TProduct } from "@/types/types";

// Skeleton Loader for product cards
function ProductSkeleton() {
  return (
    <div className="h-full rounded-2xl bg-white/5 dark:bg-white/5 border border-neutral-200/20 dark:border-neutral-800/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-200/60 dark:bg-neutral-800/60 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200/60 dark:bg-neutral-800/60 rounded w-3/4" />
        <div className="h-3 bg-neutral-200/60 dark:bg-neutral-800/60 rounded w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 bg-neutral-200/60 dark:bg-neutral-800/60 rounded" />
          <div className="h-4 w-12 bg-neutral-200/60 dark:bg-neutral-800/60 rounded" />
        </div>
      </div>
    </div>
  );
}

// Deterministic floating particles to avoid hydration mismatches
const FLOATING_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 11) % 90}%`,
  left: `${(i * 61 + 7) % 90}%`,
  dx: ((i % 4) - 2) * 10,
  duration: 18 + (i % 6) * 4,
  delay: (i * 0.5) % 3,
}));

export default function MoreProductsShowcaseSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const styles = useMemo(
    () => ({
      background: isDark
        ? "from-black via-gray-950 to-black"
        : "from-neutral-50 via-white to-neutral-50",
      text: isDark ? "text-white" : "text-neutral-900",
      textMuted: isDark ? "text-neutral-400" : "text-neutral-600",
      border: isDark ? "border-white/10" : "border-neutral-200",
      glassBg: isDark
        ? "bg-white/5 backdrop-blur-md"
        : "bg-white/70 backdrop-blur-md",
      orbPrimary: isDark ? "bg-[#007C74]/15" : "bg-[#007C74]/5",
      orbSecondary: isDark ? "bg-[#3C55A5]/20" : "bg-[#3C55A5]/5",
      tabActive: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white shadow-md shadow-[#007C74]/20",
      tabInactive: isDark
        ? "bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white"
        : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/60 hover:text-neutral-900",
    }),
    [isDark]
  );

  // Tab definitions
  const tabs = [
    { id: "all", label: "All Styles", filter: {} },
    { id: "sunglasses", label: "Sunglasses", filter: { categories: "sunglasses" } },
    { id: "optical", label: "Optical Glasses", filter: { categories: "optical glasses" } },
    { id: "accessories", label: "Accessories", filter: { categories: "accessories" } },
  ];

  const activeTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  // Fetch all products using filter. We set a large limit so we can paginate locally.
  const { data, isLoading, error } = useGetAllProductsQuery({
    limit: 8,
    ...activeTabObj.filter,
  });

  const products: TProduct[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const displayedProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setVisibleCount(8); // Reset pagination on tab change
  };

  // const loadMore = () => {
  //   setVisibleCount((prev) => Math.min(prev + 4, products.length));
  // };

  return (
    <section
      id="more-products-showcase-section"
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 border-t ${styles.border}`}
      aria-labelledby="showcase-title"
    >
      {/* Background Glow Orbs */}
      <div
        className={`absolute top-10 left-10 w-[clamp(260px,30vw,400px)] h-[clamp(260px,30vw,400px)] rounded-full blur-[100px] pointer-events-none ${styles.orbPrimary}`}
      />
      <div
        className={`absolute bottom-10 right-10 w-[clamp(300px,35vw,500px)] h-[clamp(300px,35vw,500px)] rounded-full blur-[120px] pointer-events-none ${styles.orbSecondary}`}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {FLOATING_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute w-1 h-1 ${
              isDark ? "bg-[#007C74]/30" : "bg-[#007C74]/20"
            } rounded-full`}
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [0, -30, 0],
              x: [0, p.dx, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border ${styles.border} ${styles.glassBg} mb-4 shadow-sm`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#007C74] animate-pulse" />
            <span
              className={`text-[10px] md:text-xs font-bold tracking-widest uppercase ${styles.text}`}
            >
              Curated Catalog
            </span>
          </div>
          <h2
            id="showcase-title"
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${styles.text} mb-4`}
          >
            Discover More{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Masterpieces
            </span>
          </h2>
          <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${styles.textMuted} px-2`}>
            Explore our complete designer portfolios, crafted to complement every lifestyle, face shape, and fashion expression.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex justify-center items-center gap-2 flex-wrap mb-8 sm:mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-300 ${
                activeTab === tab.id ? styles.tabActive : styles.tabInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Handling */}
        {error && (
          <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto text-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm font-semibold text-red-400">Failed to load showcase products</p>
            <p className="text-xs text-neutral-500">Please try again or check back later.</p>
          </div>
        )}

        {/* Product Grid */}
        {!error && (
          <div className="w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
                <LayoutGrid className="w-12 h-12 text-neutral-600 animate-pulse" />
                <p className="text-sm text-neutral-400 font-medium">No products found in this category.</p>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 18 }}
                      className="h-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}

        {/* Load More & Explore Full Collection Actions */}
        {!isLoading && !error && products.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16">
            {/* {visibleCount < products.length && (
              <button
                onClick={loadMore}
                className={`w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-300 shadow-sm ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                Load More Products
              </button>
            )} */}
            <Link href="/product-filter" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-semibold rounded-full text-white bg-[#007C74] hover:bg-[#007C74]/95 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[#007C74]/15">
                Explore Full Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
