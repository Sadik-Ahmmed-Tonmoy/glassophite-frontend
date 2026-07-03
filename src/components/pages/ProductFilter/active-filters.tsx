/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Star, X } from "lucide-react"
import type { FilterState } from "@/types/filter-types"

interface ActiveFiltersProps {
  filters: FilterState
  collectionOptions?: readonly {
    label: string
    value: string
    type: "category" | "sale"
  }[]
  allColors: { color: string; title: string }[]
  minPrice: number
  maxPrice: number
  removeFilter: (filterType: keyof FilterState, value: any) => void
}

export default function ActiveFilters({
  filters,
  collectionOptions = [],
  allColors,
  minPrice,
  maxPrice,
  removeFilter,
}: ActiveFiltersProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme styles
  const themeStyles = {
    dark: {
      containerBg: "bg-[#007C74]/20",
      border: "border-[#007C74]/30",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      chipBg: "bg-[#007C74]/20",
      chipBorder: "border-[#007C74]/30",
      chipText: "text-[#007C74]",
      removeButton: "text-[#007C74] hover:bg-[#007C74]/30",
      starFilled: "text-yellow-400",
      starEmpty: "text-gray-600",
    },
    light: {
      containerBg: "bg-[#007C74]/5",
      border: "border-[#007C74]/20",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      chipBg: "bg-[#007C74]/10",
      chipBorder: "border-[#007C74]/20",
      chipText: "text-[#007C74]",
      removeButton: "text-[#007C74] hover:bg-[#007C74]/10",
      starFilled: "text-yellow-500",
      starEmpty: "text-gray-300",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  const formatPriceRange = (range: [number, number]) => {
    return `৳${range[0].toLocaleString()} - ৳${range[1].toLocaleString()}`
  }

  const renderStars = (rating: number) => {
    return (
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? `fill-current ${styles.starFilled}`
                : styles.starEmpty
            }`}
          />
        ))}
        <span className={`ml-1 text-xs ${styles.textMutedLighter}`}>& Up</span>
      </span>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className={`text-sm font-medium ${styles.text} mb-2`} data-translate="filter.activeFilters">
        Active Filters
      </h3>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {/* Price Range */}
          {(filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) && (
            <motion.div
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only" data-translate="filter.price">Price:</span>
                {formatPriceRange(filters.priceRange)}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("priceRange", null)}
                aria-label="Remove price filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Brands */}
          {filters.brands.map((brand) => (
            <motion.div
              key={`brand-${brand}`}
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only" data-translate="filter.brand">Brand:</span> {brand}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("brands", brand)}
                aria-label="Remove brand filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {/* Collections */}
          {filters.categories.map((category) => {
            const option = collectionOptions.find((item) => item.value === category)
            return (
              <motion.div
                key={`category-${category}`}
                className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <span>
                  <span className="sr-only">Collection:</span> {option?.label || category}
                </span>
                <button
                  type="button"
                  className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                  onClick={() => removeFilter("categories", category)}
                  aria-label="Remove collection filter"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}

          {/* Sub-Categories */}
          {filters.subCategories.map((subCat) => (
            <motion.div
              key={`subCategory-${subCat}`}
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only">Sub-Category:</span> {subCat}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("subCategories", subCat)}
                aria-label="Remove sub-category filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {/* Types */}
          {filters.types.map((type) => (
            <motion.div
              key={`type-${type}`}
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only">Type:</span> {type}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("types", type)}
                aria-label="Remove type filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {/* Sale */}
          {filters.saleOnly && (
            <motion.div
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only">Collection:</span> Sale
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("saleOnly", null)}
                aria-label="Remove sale filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Frame Types */}
          {filters.frameTypes.map((frameType) => (
            <motion.div
              key={`frame-${frameType}`}
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only" data-translate="filter.frameType">Frame:</span> {frameType}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("frameTypes", frameType)}
                aria-label="Remove frame type filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {/* Lens Types */}
          {filters.lensTypes.map((lensType) => (
            <motion.div
              key={`lens-${lensType}`}
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only" data-translate="filter.lensType">Lens:</span> {lensType}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("lensTypes", lensType)}
                aria-label="Remove lens type filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {/* Colors */}
          {filters.colors.map((color) => {
            const colorObj = allColors.find((c) => c.color === color)
            return (
              <motion.div
                key={`color-${color}`}
                className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <span className="flex items-center">
                  <span className="sr-only" data-translate="filter.color">Color:</span>
                  <span
                    className="mr-1 inline-block h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  {colorObj?.title || color}
                </span>
                <button
                  type="button"
                  className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                  onClick={() => removeFilter("colors", color)}
                  aria-label="Remove color filter"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}

          {/* Ratings */}
          {filters.ratings.map((rating) => (
            <motion.div
              key={`rating-${rating}`}
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span className="flex items-center">
                <span className="sr-only" data-translate="filter.rating">Rating:</span>
                {renderStars(rating)}
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("ratings", rating)}
                aria-label="Remove rating filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {/* Availability */}
          {filters.inStock !== null && (
            <motion.div
              className={`inline-flex items-center rounded-full border ${styles.chipBorder} ${styles.chipBg} py-1.5 pl-3 pr-2 text-sm font-medium ${styles.chipText}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>
                <span className="sr-only" data-translate="filter.availability">Availability:</span> In Stock
              </span>
              <button
                type="button"
                className={`ml-1 inline-flex h-6 w-6 flex-shrink-0 rounded-full p-1 ${styles.removeButton} transition-colors`}
                onClick={() => removeFilter("inStock", null)}
                aria-label="Remove availability filter"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
