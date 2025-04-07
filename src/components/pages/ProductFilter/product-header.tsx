"use client"

import { motion } from "framer-motion"
import SortDropdown from "./sort-dropdown"
import type { SortOption } from "@/types/filter-types"

interface ProductHeaderProps {
  totalProducts: number
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  setMobileFiltersOpen: (open: boolean) => void
  activeFilterCount: number
}

export default function ProductHeader({
  totalProducts,
  sortOption,
  setSortOption,
  setMobileFiltersOpen,
  activeFilterCount,
}: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.p className="text-sm text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={totalProducts}>
        Showing <span className="font-medium">{totalProducts}</span> products
      </motion.p>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>

        <button
          type="button"
          className="inline-flex items-center lg:hidden text-sm font-medium text-gray-700"
          onClick={() => setMobileFiltersOpen(true)}
          aria-expanded="false"
          aria-controls="mobile-filter-panel"
        >
          <svg className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
              clipRule="evenodd"
            />
          </svg>
          Filters <span className="ml-1 text-xs rounded-full bg-gray-200 px-2 py-0.5">{activeFilterCount}</span>
        </button>
      </div>
    </div>
  )
}

