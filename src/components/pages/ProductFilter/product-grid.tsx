"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import ProductCard from "./product-card"

import { TProduct } from "@/types/types"
import QuickViewModal from "./quick-view-modal"

interface ProductGridProps {
  products: TProduct[]
  isLoading: boolean
  clearAllFilters: () => void
}

export default function ProductGrid({ products, isLoading, clearAllFilters }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<TProduct | null>(null)

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
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 h-80"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
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
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
        <div className="mt-6">
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center rounded-md bg-[#007C74] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00A693] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74]"
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
          <ProductCard key={product.id} product={product} onQuickView={() => setQuickViewProduct(product)} />
        ))}
      </motion.div>

      <AnimatePresence>
        {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
      </AnimatePresence>
    </>
  )
}

