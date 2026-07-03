/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertCircle, ShieldCheck, Gem, Compass } from "lucide-react";
import { useTheme } from "next-themes";
import { useGetNewArrivalsQuery, useGetAllProductsQuery } from "@/redux/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard/ProductCard";

// Theme-based styles matching the Glassophite design system
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

// Skeleton loader for grid cards
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

export default function NewArrivalsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = getThemeStyles(isDark);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Hook to detect screen width for interactive features
  const [isLarge, setIsLarge] = useState(false);
  useEffect(() => {
    const check = () => setIsLarge(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch specifically flagged new arrivals
  const {
    data: newArrivalsData,
    isLoading: isLoadingNewArrivals,
    isFetching: isFetchingNewArrivals,
    error: errorNewArrivals,
  } = useGetNewArrivalsQuery(6);

  // Fetch all products sorted by newest as a fallback
  const {
    data: allProductsData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    error: errorAll,
  } = useGetAllProductsQuery({ limit: 6, sortBy: "newest" });

  const primaryProducts = (newArrivalsData as any)?.data || [];
  const fallbackProducts = (allProductsData as any)?.data || [];
  
  // Use primary if available, otherwise use general newest products
  const products = primaryProducts.length > 0 ? primaryProducts : fallbackProducts;

  const isLoading = (isLoadingNewArrivals || isFetchingNewArrivals) && (isLoadingAll || isFetchingAll);
  const error = errorNewArrivals && errorAll;

  // SEO details
  const sectionTitle = "New Arrivals";
  const sectionDescription = "Discover the latest additions to our curated luxury eyewear collection. Handcrafted frames designed to redefine style.";

  // Loading State
  if (isLoading) {
    return (
      <section className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-20 px-4 sm:px-6`}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="h-8 w-40 bg-neutral-350 dark:bg-neutral-800 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-20 px-4 sm:px-6`}>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-500 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className={`text-xl font-bold ${styles.text}`}>Failed to load new arrivals</h2>
          <p className={`${styles.textMuted} mt-2`}>Please check your connection and try again.</p>
        </div>
      </section>
    );
  }

  // Empty State
  if (products.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="new-arrivals-section"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.background} py-16 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-8 border-t ${styles.border}`}
      aria-labelledby="new-arrivals-title"
    >
      {/* Dynamic Background Glows */}
      <div className={`absolute top-1/4 right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000 ${styles.orbPrimary}`} />
      <div className={`absolute bottom-1/4 left-[-10%] w-[600px] h-[600px] rounded-full blur-[170px] pointer-events-none transition-opacity duration-1000 ${styles.orbSecondary}`} />

      {/* Luxury Geometric Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${isDark ? "#fff" : "#000"} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? "#fff" : "#000"} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Premium Editorial Introduction (Takes 4 cols on lg, full width on mobile) */}
     

          {/* RIGHT: Grid of Products (Takes 8 cols on lg, wraps on mobile) */}
          <div className="lg:col-span-8">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  }
                }
              }}
            >
              {products.map((product: any) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { type: "spring", stiffness: 100, damping: 15 } 
                    }
                  }}
                  className="w-full flex justify-center"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
