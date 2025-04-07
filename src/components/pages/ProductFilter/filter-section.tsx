/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion, AnimatePresence } from "framer-motion"
import FilterSidebar from "./filter-sidebar"
import ActiveFilters from "./active-filters"
import type { FilterState } from "@/types/filter-types"

interface FilterSectionProps {
  filters: FilterState
  allBrands: string[]
  allFrameTypes: string[]
  allLensTypes: string[]
  allColors: { color: string; title: string }[]
  minPrice: number
  maxPrice: number
  handleFilterChange: (filterType: keyof FilterState, value: any) => void
  removeFilter: (filterType: keyof FilterState, value: any) => void
  clearAllFilters: () => void
  hasActiveFilters: boolean
}

export default function FilterSection({
  filters,
  allBrands,
  allFrameTypes,
  allLensTypes,
  allColors,
  minPrice,
  maxPrice,
  handleFilterChange,
  removeFilter,
  clearAllFilters,
  hasActiveFilters,
}: FilterSectionProps) {
  return (
    <div className="hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <motion.button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center rounded-md bg-[#007C74] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00A693] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear all filters
          </motion.button>
        )}
      </div>

      {/* Active filters */}
      <AnimatePresence>
        {hasActiveFilters && (
          <ActiveFilters
            filters={filters}
            allColors={allColors}
            minPrice={minPrice}
            maxPrice={maxPrice}
            removeFilter={removeFilter}
          />
        )}
      </AnimatePresence>

      {/* Filter sidebar */}
      <FilterSidebar
        filters={filters}
        allBrands={allBrands}
        allFrameTypes={allFrameTypes}
        allLensTypes={allLensTypes}
        allColors={allColors}
        minPrice={minPrice}
        maxPrice={maxPrice}
        handleFilterChange={handleFilterChange}
      />
    </div>
  )
}

