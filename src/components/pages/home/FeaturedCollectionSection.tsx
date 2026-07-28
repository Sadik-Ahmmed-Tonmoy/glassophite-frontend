/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Eye,
  ShoppingBag,
  Award,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useGetFeaturedProductsQuery } from "@/redux/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard/ProductCard";

const TABS = [
  { id: "all", label: "All Premium", icon: Sparkles, typeFilter: null },
  { id: "aviator", label: "Aviator", icon: Eye, typeFilter: "Aviator" },
  {
    id: "wayfarer",
    label: "Wayfarer",
    icon: ShoppingBag,
    typeFilter: "Wayfarer",
  },
  { id: "luxury", label: "Limited", icon: Award, typeFilter: "luxury" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl aspect-[3/4] w-full" />
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function FeaturedCollectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [activeTab, setActiveTab] = useState("all");
  const [tabLoading, setTabLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styles = useMemo(
    () => ({
      text: isDark ? "text-white" : "text-neutral-900",
      textMuted: isDark ? "text-neutral-400" : "text-neutral-500",
      border: isDark ? "border-white/10" : "border-neutral-200",
      orb: isDark ? "bg-primary/15" : "bg-primary/8",
    }),
    [isDark],
  );

  const { data: featuredProductsData, isLoading: queryLoading } =
    useGetFeaturedProductsQuery(20);
  const featuredProducts = useMemo(
    () => (featuredProductsData as any)?.data || [],
    [featuredProductsData],
  );

  const filteredProducts = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab || !tab.typeFilter) return featuredProducts;
    if (tab.id === "luxury") {
      return featuredProducts.filter(
        (p: any) =>
          p.types?.some((t: string) => t.toLowerCase().includes("luxury")) ||
          (p.averageRating || 0) >= 4.5,
      );
    }
    return featuredProducts.filter((p: any) =>
      p.types?.some(
        (t: string) => t.toLowerCase() === tab.typeFilter!.toLowerCase(),
      ),
    );
  }, [featuredProducts, activeTab]);

  const handleTabChange = useCallback((tabId: string) => {
    setTabLoading(true);
    setActiveTab(tabId);
    setTimeout(() => setTabLoading(false), 150);
  }, []);

  const currentLabel = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.label || "All Premium",
    [activeTab],
  );

  const isLoading = queryLoading || tabLoading;

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-b ${
        isDark
          ? "from-black via-gray-950 to-black"
          : "from-neutral-50 via-white to-neutral-50"
      }`}
      aria-label="Featured Premium Sunglasses Collection"
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-[-20%] -right-20 w-[clamp(300px,45vw,600px)] h-[clamp(300px,45vw,600px)] rounded-full blur-[90px] sm:blur-[140px] ${styles.orb}`}
        />
        <div
          className={`absolute bottom-[-20%] -left-20 w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vw,500px)] rounded-full blur-[80px] sm:blur-[120px] ${styles.orb}`}
        />
      </div>

      <div className="relative z-10 container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12 lg:mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-primary uppercase">
                Curated Collection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className={isDark ? "text-white" : "text-neutral-900"}>
                Featured{" "}
              </span>
              <span className="text-primary">Premium</span>
            </h2>
          </div>

          {!isLoading && filteredProducts.length > 0 && (
            <Link
              href="/shop"
              className="group hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-1.5 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative shrink-0 px-4 py-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer rounded-full ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : `${styles.textMuted} hover:text-${isDark ? "white" : "neutral-900"} hover:bg-neutral-100 dark:hover:bg-neutral-900`
                }`}
                aria-pressed={isActive}
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="featured-tab-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {filteredProducts.map((product: any) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile View All */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="sm:hidden mt-10 text-center"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
              >
                <span>View Complete Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${isDark ? "bg-white/5" : "bg-black/5"} mb-4`}
            >
              <AlertCircle className={`w-6 h-6 ${styles.textMuted}`} />
            </div>
            <p
              className={`${styles.textMuted} text-xs sm:text-sm font-semibold`}
            >
              No products found in &ldquo;{currentLabel}&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
