/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { SlidersHorizontal, X } from "lucide-react"
import FilterSidebar from "./filter-sidebar"
import ActiveFilters from "./active-filters"
import type { FilterOptionCounts, FilterState } from "@/types/filter-types"

interface FilterSectionProps {
  filters: FilterState
  collectionOptions: readonly {
    label: string
    value: string
    type: "category" | "sale"
  }[]
  optionCounts: FilterOptionCounts
  allBrands: string[]
  allSubCategories: string[]
  // allTypes: string[]
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
  collectionOptions,
  optionCounts,
  allBrands,
  allSubCategories,
  // allTypes,
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
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      gradient: "from-[#007C74] to-[#3C55A5]",
      button: "bg-white/10 hover:bg-white/20 text-white border-white/10",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      activeFilter: "bg-[#007C74]/20 text-[#007C74] border-[#007C74]/30",
    },
    light: {
      bg: "bg-neutral-50",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      gradient: "from-[#007C74] to-[#3C55A5]",
      button: "bg-neutral-200 hover:bg-neutral-300 text-neutral-900 border-neutral-300",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      activeFilter: "bg-[#007C74]/10 text-[#007C74] border-[#007C74]/30",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-full max-w-[280px] xl:max-w-[320px]"
    >
      <div className={`sticky top-24 rounded-2xl backdrop-blur-sm border ${styles.card} p-6 transition-colors duration-500`}>
        {/* Header with title and clear button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className={`w-5 h-5 ${styles.textMuted}`} />
            <h3 className={`text-lg font-semibold ${styles.text}`} data-translate="filter.filters">
              Filters
            </h3>
            {/* {hasActiveFilters && (
              <span className="px-2 py-0.5 text-xs bg-[#007C74] text-white rounded-full">
                {Object.values(filters).reduce((acc, val) => {
                  if (Array.isArray(val)) return acc + val.length
                  if (val === true || val === false) return acc + 1
                  if (typeof val === 'object' && val !== null && 'length' in val) return acc + 1
                  return acc
                }, 0)}
              </span>
            )} */}
          </div>

          {hasActiveFilters && (
            <motion.button
              type="button"
              onClick={clearAllFilters}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${styles.buttonPrimary}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-translate="filter.clearAll"
            >
              <X className="w-3 h-3" />
              <span>Clear all</span>
            </motion.button>
          )}
        </div>

        {/* Active filters section */}
        <AnimatePresence mode="wait">
          {hasActiveFilters && (
            <motion.div
              key="active-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 hidden lg:block"
            >
              {/* <h4 className={`text-xs uppercase tracking-wider ${styles.textMutedLighter} mb-3`} data-translate="filter.activeFilters">
                Active Filters
              </h4> */}
              <ActiveFilters
                filters={filters}
                allColors={allColors}
                minPrice={minPrice}
                maxPrice={maxPrice}
                removeFilter={removeFilter}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter sidebar */}
        <FilterSidebar
          filters={filters}
          collectionOptions={collectionOptions}
          optionCounts={optionCounts}
          allBrands={allBrands}
          allSubCategories={allSubCategories}
          // allTypes={allTypes}
          allFrameTypes={allFrameTypes}
          allLensTypes={allLensTypes}
          allColors={allColors}
          minPrice={minPrice}
          maxPrice={maxPrice}
          handleFilterChange={handleFilterChange}
        />

        {/* Decorative element */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-[#007C74]/5 rounded-full blur-3xl -z-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#3C55A5]/5 rounded-full blur-3xl -z-10"
        />
      </div>
    </motion.aside>
  )
}
