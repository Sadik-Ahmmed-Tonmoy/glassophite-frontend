/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion } from "framer-motion"
import type { FilterState } from "@/types/filter-types"
// import { renderStars } from "@/lib/utils"
import PriceRangeSlider from "./price-range-slider"
import ActiveFilters from "./active-filters"

interface MobileFilterDrawerProps {
  filters: FilterState
  allBrands: string[]
  allFrameTypes: string[]
  allLensTypes: string[]
  allColors: { color: string; title: string }[]
  minPrice: number
  maxPrice: number
  handleFilterChange: (filterType: keyof FilterState, value: any) => void
  onClose: () => void
}

export default function MobileFilterDrawer({
  filters,
  allBrands,
  allFrameTypes,
  allLensTypes,
  allColors,
  minPrice,
  maxPrice,
  handleFilterChange,
  onClose,
}: MobileFilterDrawerProps) {
  // Check if any filters are applied
  const hasActiveFilters = () => {
    return (
      filters.brands.length > 0 ||
      filters.frameTypes.length > 0 ||
      filters.lensTypes.length > 0 ||
      filters.colors.length > 0 ||
      filters.ratings.length > 0 ||
      filters.inStock !== null ||
      filters.priceRange[0] > minPrice ||
      filters.priceRange[1] < maxPrice
    )
  }

  // Function to remove a filter
  const removeFilter = (filterType: keyof FilterState, value: any) => {
    if (filterType === "priceRange") {
      handleFilterChange("priceRange", [minPrice, maxPrice])
    } else if (filterType === "inStock") {
      handleFilterChange("inStock", null)
    } else if (Array.isArray(filters[filterType])) {
      handleFilterChange(filterType, value)
    }
  }

  return (
    <div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      ></motion.div>

      <div className="fixed inset-0 z-40 flex">
        <motion.div
          className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
        >
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              onClick={onClose}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Active filters section */}
          {hasActiveFilters() && (
            <div className="px-4 py-4 border-t border-gray-200">
              <ActiveFilters
                filters={filters}
                allColors={allColors}
                minPrice={minPrice}
                maxPrice={maxPrice}
                removeFilter={removeFilter}
              />
            </div>
          )}

          {/* Mobile filters */}
          <div className="mt-4 border-t border-gray-200">
            <div className="px-4 py-6">
              <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
              <div className="mt-4">
                <PriceRangeSlider
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  currentMin={filters.priceRange[0]}
                  currentMax={filters.priceRange[1]}
                  onChange={(min, max) => handleFilterChange("priceRange", [min, max])}
                />
              </div>
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Brand</h3>
              <div className="mt-4 space-y-4">
                {allBrands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      id={`mobile-brand-${brand}`}
                      name={`mobile-brand-${brand}`}
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleFilterChange("brands", brand)}
                      className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74]"
                    />
                    <label htmlFor={`mobile-brand-${brand}`} className="ml-3 text-sm text-gray-600">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Frame Type</h3>
              <div className="mt-4 space-y-4">
                {allFrameTypes.map((frameType) => (
                  <div key={frameType} className="flex items-center">
                    <input
                      id={`mobile-frame-${frameType}`}
                      name={`mobile-frame-${frameType}`}
                      type="checkbox"
                      checked={filters.frameTypes.includes(frameType)}
                      onChange={() => handleFilterChange("frameTypes", frameType)}
                      className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74]"
                    />
                    <label htmlFor={`mobile-frame-${frameType}`} className="ml-3 text-sm text-gray-600">
                      {frameType}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Lens Type</h3>
              <div className="mt-4 space-y-4">
                {allLensTypes.map((lensType) => (
                  <div key={lensType} className="flex items-center">
                    <input
                      id={`mobile-lens-${lensType}`}
                      name={`mobile-lens-${lensType}`}
                      type="checkbox"
                      checked={filters.lensTypes.includes(lensType)}
                      onChange={() => handleFilterChange("lensTypes", lensType)}
                      className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74]"
                    />
                    <label htmlFor={`mobile-lens-${lensType}`} className="ml-3 text-sm text-gray-600">
                      {lensType}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-4 space-y-4">
                {allColors.map((colorObj) => (
                  <div key={colorObj.color} className="flex items-center">
                    <input
                      id={`mobile-color-${colorObj.color}`}
                      name={`mobile-color-${colorObj.color}`}
                      type="checkbox"
                      checked={filters.colors.includes(colorObj.color)}
                      onChange={() => handleFilterChange("colors", colorObj.color)}
                      className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74]"
                    />
                    <label
                      htmlFor={`mobile-color-${colorObj.color}`}
                      className="ml-3 flex items-center text-sm text-gray-600"
                    >
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-full border"
                        style={{ backgroundColor: colorObj.color }}
                      ></span>
                      {colorObj.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Rating</h3>
              <div className="mt-4 space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      id={`mobile-rating-${rating}`}
                      name={`mobile-rating-${rating}`}
                      type="checkbox"
                      checked={filters.ratings.includes(rating)}
                      onChange={() => handleFilterChange("ratings", rating)}
                      className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74]"
                    />
                    <label htmlFor={`mobile-rating-${rating}`} className="ml-3 flex items-center text-sm text-gray-600">
                      {/* {renderStars(rating)} <span className="ml-1">& Up</span> */}
                      <p className="text-red-500">starrrrr</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Availability</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="mobile-in-stock"
                    name="mobile-in-stock"
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={() => handleFilterChange("inStock", filters.inStock === true ? null : true)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74]"
                  />
                  <label htmlFor="mobile-in-stock" className="ml-3 text-sm text-gray-600">
                    In Stock
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Clear all filters button */}
          {hasActiveFilters() && (
            <div className="px-4 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  handleFilterChange("priceRange", [minPrice, maxPrice])
                  handleFilterChange("brands", [])
                  handleFilterChange("frameTypes", [])
                  handleFilterChange("lensTypes", [])
                  handleFilterChange("colors", [])
                  handleFilterChange("ratings", [])
                  handleFilterChange("inStock", null)
                  onClose()
                }}
                className="w-full rounded-md bg-[#007C74] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00A693] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74]"
              >
                Clear all filters
              </button>
            </div>
          )}
          {/* Done button */}
          <div className="px-4 py-4 border-t border-gray-200 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md bg-[#007C74] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00A693] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74]"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

