/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FilterState } from "@/types/filter-types"

interface ActiveFiltersProps {
  filters: FilterState
  allColors: { color: string; title: string }[]
  minPrice: number
  maxPrice: number
  removeFilter: (filterType: keyof FilterState, value: any) => void
}

export default function ActiveFilters({ filters, allColors, minPrice, maxPrice, removeFilter }: ActiveFiltersProps) {
  const formatPriceRange = (range: [number, number]) => {
    return `$${range[0]} - $${range[1]}`
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Active Filters</h3>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {(filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) && (
            <motion.div
              className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>Price: {formatPriceRange(filters.priceRange)}</span>
              <button
                type="button"
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                onClick={() => removeFilter("priceRange", null)}
              >
                <span className="sr-only">Remove price filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </motion.div>
          )}

          {filters.brands.map((brand) => (
            <motion.div
              key={brand}
              className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>Brand: {brand}</span>
              <button
                type="button"
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                onClick={() => removeFilter("brands", brand)}
              >
                <span className="sr-only">Remove brand filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </motion.div>
          ))}

          {filters.frameTypes.map((frameType) => (
            <motion.div
              key={frameType}
              className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>Frame: {frameType}</span>
              <button
                type="button"
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                onClick={() => removeFilter("frameTypes", frameType)}
              >
                <span className="sr-only">Remove frame type filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </motion.div>
          ))}

          {filters.lensTypes.map((lensType) => (
            <motion.div
              key={lensType}
              className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>Lens: {lensType}</span>
              <button
                type="button"
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                onClick={() => removeFilter("lensTypes", lensType)}
              >
                <span className="sr-only">Remove lens type filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </motion.div>
          ))}

          {filters.colors.map((color) => {
            const colorObj = allColors.find((c) => c.color === color)
            return (
              <motion.div
                key={color}
                className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <span className="flex items-center">
                  Color:
                  <span
                    className="mx-1 inline-block h-3 w-3 rounded-full border"
                    style={{ backgroundColor: color }}
                  ></span>
                  {colorObj?.title}
                </span>
                <button
                  type="button"
                  className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                  onClick={() => removeFilter("colors", color)}
                >
                  <span className="sr-only">Remove color filter</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </motion.div>
            )
          })}

          {filters.ratings.map((rating) => (
            <motion.div
              key={rating}
              className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              {/* <span className="flex items-center">Rating: {renderStars(rating)} & Up</span> */}
              <p className="text-red-500">STarrrrrrrr</p>
              <button
                type="button"
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                onClick={() => removeFilter("ratings", rating)}
              >
                <span className="sr-only">Remove rating filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </motion.div>
          ))}

          {filters.inStock !== null && (
            <motion.div
              className="inline-flex items-center rounded-full border border-[#007C74]/20 bg-[#007C74]/10 py-1.5 pl-3 pr-2 text-sm font-medium text-[#007C74]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <span>Availability: In Stock</span>
              <button
                type="button"
                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-[#007C74] hover:bg-[#007C74]/20 hover:text-[#007C74]"
                onClick={() => removeFilter("inStock", null)}
              >
                <span className="sr-only">Remove availability filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

