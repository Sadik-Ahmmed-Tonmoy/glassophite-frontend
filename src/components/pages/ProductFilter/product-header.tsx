"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { SlidersHorizontal } from "lucide-react"
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
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      button: "text-neutral-300 hover:text-white border-white/10",
      buttonBg: "bg-white/5 hover:bg-white/10",
      filterCount: "bg-white/10 text-neutral-300",
    },
    light: {
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      button: "text-neutral-700 hover:text-neutral-900 border-neutral-200",
      buttonBg: "bg-neutral-100 hover:bg-neutral-200",
      filterCount: "bg-neutral-200 text-neutral-700",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  return (
    <div className="flex items-center justify-between mb-6">
      <motion.p
        className={`text-sm ${styles.textMuted}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={totalProducts}
        data-translate="product.showing"
      >
        Showing <span className={`font-medium ${styles.text}`}>{totalProducts}</span> products
      </motion.p>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>

        <button
          type="button"
          className={`inline-flex items-center lg:hidden text-sm font-medium ${styles.button} border rounded-lg px-3 py-2 backdrop-blur-sm transition-colors duration-300 ${styles.buttonBg}`}
          onClick={() => setMobileFiltersOpen(true)}
          aria-expanded="false"
          aria-controls="mobile-filter-panel"
        >
          <SlidersHorizontal className="mr-1 h-4 w-4" />
          <span data-translate="product.filters">Filters</span>
          {activeFilterCount > 0 && (
            <span className={`ml-1 text-xs rounded-full ${styles.filterCount} px-2 py-0.5`}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}