/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star } from "lucide-react"
import type { FilterState } from "@/types/filter-types"
import PriceRangeSlider from "./price-range-slider"

interface FilterSidebarProps {
  filters: FilterState
  allBrands: string[]
  allFrameTypes: string[]
  allLensTypes: string[]
  allColors: { color: string; title: string }[]
  minPrice: number
  maxPrice: number
  handleFilterChange: (filterType: keyof FilterState, value: any) => void
}

export default function FilterSidebar({
  filters,
  allBrands,
  allFrameTypes,
  allLensTypes,
  allColors,
  minPrice,
  maxPrice,
  handleFilterChange,
}: FilterSidebarProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      accordionTrigger: "text-neutral-300 hover:text-white data-[state=open]:text-white",
      label: "text-neutral-300",
      checkbox: "border-white/30 bg-white/5 checked:bg-[#007C74] checked:border-[#007C74]",
      star: "text-yellow-400",
    },
    light: {
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      accordionTrigger: "text-neutral-600 hover:text-neutral-900 data-[state=open]:text-neutral-900",
      label: "text-neutral-600",
      checkbox: "border-neutral-300 bg-white checked:bg-[#007C74] checked:border-[#007C74]",
      star: "text-yellow-500",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? `fill-current ${styles.star}` : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className={`ml-1 text-xs ${styles.textMutedLighter}`}>& Up</span>
      </div>
    )
  }

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Accordion type="multiple" defaultValue={["price", "brand", "frame", "lens", "color", "rating", "availability"]}>
        {/* Price Range */}
        <AccordionItem value="price" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.priceRange">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <PriceRangeSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentMin={filters.priceRange[0]}
                currentMax={filters.priceRange[1]}
                onChange={(min, max) => handleFilterChange("priceRange", [min, max])}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.brand">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allBrands.map((brand, index) => (
                <motion.div
                  key={brand}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                  whileHover={{ scale: 1.02 , translateX : 5}}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`brand-${brand}`}
                    name={`brand-${brand}`}
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleFilterChange("brands", brand)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  />
                  <label htmlFor={`brand-${brand}`} className={`ml-3 text-sm ${styles.label} cursor-pointer`}>
                    {brand}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Frame Type */}
        <AccordionItem value="frame" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.frameType">
            Frame Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allFrameTypes.map((frameType, index) => (
                <motion.div
                  key={frameType}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                  whileHover={{ scale: 1.02 , translateX : 5}}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`frame-${frameType}`}
                    name={`frame-${frameType}`}
                    type="checkbox"
                    checked={filters.frameTypes.includes(frameType)}
                    onChange={() => handleFilterChange("frameTypes", frameType)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  />
                  <label htmlFor={`frame-${frameType}`} className={`ml-3 text-sm ${styles.label} cursor-pointer`}>
                    {frameType}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lens Type */}
        <AccordionItem value="lens" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.lensType">
            Lens Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allLensTypes.map((lensType, index) => (
                <motion.div
                  key={lensType}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                  whileHover={{ scale: 1.02 , translateX : 5}}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`lens-${lensType}`}
                    name={`lens-${lensType}`}
                    type="checkbox"
                    checked={filters.lensTypes.includes(lensType)}
                    onChange={() => handleFilterChange("lensTypes", lensType)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  />
                  <label htmlFor={`lens-${lensType}`} className={`ml-3 text-sm ${styles.label} cursor-pointer`}>
                    {lensType}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.color">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allColors.map((colorObj, index) => (
                <motion.div
                  key={colorObj.color}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                  whileHover={{ scale: 1.02 , translateX : 5}}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`color-${colorObj.color}`}
                    name={`color-${colorObj.color}`}
                    type="checkbox"
                    checked={filters.colors.includes(colorObj.color)}
                    onChange={() => handleFilterChange("colors", colorObj.color)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  />
                  <label
                    htmlFor={`color-${colorObj.color}`}
                    className={`ml-3 flex items-center text-sm ${styles.label} cursor-pointer`}
                  >
                    <span
                      className="mr-2 inline-block h-4 w-4 rounded-full border"
                      style={{ backgroundColor: colorObj.color }}
                    ></span>
                    {colorObj.title}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.rating">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <motion.div
                  key={rating}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                  whileHover={{ scale: 1.02, translateX : 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`rating-${rating}`}
                    name={`rating-${rating}`}
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleFilterChange("ratings", rating)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  />
                  <label htmlFor={`rating-${rating}`} className={`ml-3 flex items-center text-sm cursor-pointer`}>
                    {renderStars(rating)}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability" className={styles.border}>
          <AccordionTrigger className={`text-sm font-medium ${styles.accordionTrigger}`} data-translate="filter.availability">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.02, translateX : 5 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <input
                  id="in-stock"
                  name="in-stock"
                  type="checkbox"
                  checked={filters.inStock === true}
                  onChange={() => handleFilterChange("inStock", filters.inStock === true ? null : true)}
                  className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                />
                <label htmlFor="in-stock" className={`ml-3 text-sm ${styles.label} cursor-pointer`} data-translate="filter.inStock">
                  In Stock
                </label>
              </motion.div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}