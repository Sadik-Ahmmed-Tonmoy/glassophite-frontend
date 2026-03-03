"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { TProduct } from "@/types/types"
import QuickViewModal from "./quick-view-modal"
import ProductCard from "@/components/ui/ProductCard/ProductCard"

interface ProductGridProps {
  products: TProduct[]
  isLoading: boolean
  clearAllFilters: () => void
}

export default function ProductGrid({ products, isLoading, clearAllFilters }: ProductGridProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [quickViewProduct, setQuickViewProduct] = useState<TProduct | null>(null)

  // Theme styles
  const themeStyles = {
    dark: {
      skeletonBg: "bg-white/10",
      skeletonText: "bg-white/5",
      emptyIcon: "text-neutral-600",
      emptyTitle: "text-white",
      emptyText: "text-neutral-400",
      button: "bg-[#007C74] hover:bg-[#00A693] text-white",
    },
    light: {
      skeletonBg: "bg-gray-200",
      skeletonText: "bg-gray-200",
      emptyIcon: "text-gray-400",
      emptyTitle: "text-gray-900",
      emptyText: "text-gray-500",
      button: "bg-[#007C74] hover:bg-[#00A693] text-white",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="group relative animate-pulse">
            <div className={`aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg ${styles.skeletonBg} h-80`} />
            <div className={`mt-4 h-4 ${styles.skeletonText} rounded w-3/4`} />
            <div className={`mt-2 h-4 ${styles.skeletonText} rounded w-1/2`} />
            <div className={`mt-2 h-4 ${styles.skeletonText} rounded w-1/4`} />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          className={`mx-auto h-12 w-12 ${styles.emptyIcon}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className={`mt-2 text-sm font-medium ${styles.emptyTitle}`} data-translate="product.noProducts">
          No products found
        </h3>
        <p className={`mt-1 text-sm ${styles.emptyText}`} data-translate="product.adjustFilters">
          Try adjusting your filters or search criteria.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={clearAllFilters}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74] ${styles.button}`}
            data-translate="product.clearAll"
          >
            Clear all filters
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={products.map((p) => p.id).join(",")}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      <AnimatePresence>
        {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
      </AnimatePresence>
    </>
  )
}