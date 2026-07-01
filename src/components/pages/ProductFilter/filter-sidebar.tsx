/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FilterOptionCounts, FilterState } from "@/types/filter-types";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import PriceRangeSlider from "./price-range-slider";

interface FilterSidebarProps {
  filters: FilterState;
  collectionOptions: readonly {
    label: string;
    value: string;
    type: "category" | "sale";
  }[];
  optionCounts: FilterOptionCounts;
  allBrands: string[];
  allFrameTypes: string[];
  allLensTypes: string[];
  allColors: { color: string; title: string }[];
  minPrice: number;
  maxPrice: number;
  handleFilterChange: (filterType: keyof FilterState, value: any) => void;
}

export default function FilterSidebar({
  filters,
  collectionOptions,
  optionCounts,
  allBrands,
  allFrameTypes,
  allLensTypes,
  allColors,
  minPrice,
  maxPrice,
  handleFilterChange,
}: FilterSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      accordionTrigger:
        "text-neutral-300 hover:text-white data-[state=open]:text-white",
      label: "text-neutral-300",
      checkbox:
        "border-white/30 bg-white/5 checked:bg-[#007C74] checked:border-[#007C74]",
      star: "text-yellow-400",
    },
    light: {
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      accordionTrigger:
        "text-neutral-600 hover:text-neutral-900 data-[state=open]:text-neutral-900",
      label: "text-neutral-600",
      checkbox:
        "border-neutral-300 bg-white checked:bg-[#007C74] checked:border-[#007C74]",
      star: "text-yellow-500",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? `fill-current ${styles.star}`
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className={`ml-1 text-xs ${styles.textMutedLighter}`}>& Up</span>
      </div>
    );
  };

  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Accordion
        type="multiple"
        defaultValue={[
          "collection",
          "price",
          "brand",
          "frame",
          "lens",
          "color",
          "rating",
          "availability",
        ]}
      >
        {/* Collection */}
        <AccordionItem value="collection" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
          >
            Collection
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {collectionOptions.map((option, index) => (
                <motion.div
                  onMouseEnter={() => setHoveredItem(option.value)}
                  onMouseLeave={() => setHoveredItem(null)}
                  key={option.value}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                  // whileHover={{ scale: 1.02, x: 5 }}
                  // whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.input
                    id={`collection-${option.value}`}
                    name={`collection-${option.value}`}
                    type="checkbox"
                    checked={
                      option.type === "sale"
                        ? filters.saleOnly
                        : filters.categories.includes(option.value)
                    }
                    onChange={() =>
                      option.type === "sale"
                        ? handleFilterChange("saleOnly", !filters.saleOnly)
                        : handleFilterChange("categories", option.value)
                    }
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                    animate={{ x: hoveredItem === option.value ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  <label
                    htmlFor={`collection-${option.value}`}
                    className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  >
                    <motion.span
                      animate={{ x: hoveredItem === option.value ? 5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {option.label}
                    </motion.span>
                    <motion.span
                      animate={{ x: hoveredItem === option.value ? -5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`text-xs ${styles.textMutedLighter}`}
                    >
                      ({optionCounts.collections[option.value] || 0})
                    </motion.span>
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.priceRange"
          >
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <PriceRangeSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentMin={filters.priceRange[0]}
                currentMax={filters.priceRange[1]}
                onChange={(min, max) =>
                  handleFilterChange("priceRange", [min, max])
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.brand"
          >
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
                  // whileHover={{ scale: 1.02, translateX: 5 }}
                  // whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredItem(brand)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.input
                    id={`brand-${brand}`}
                    name={`brand-${brand}`}
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleFilterChange("brands", brand)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                    animate={{ x: hoveredItem === brand ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  >
                    <motion.span
                      animate={{ x: hoveredItem === brand ? 5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {brand}
                    </motion.span>
                    <motion.span
                      animate={{ x: hoveredItem === brand ? -5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`text-xs ${styles.textMutedLighter}`}
                    >
                      ({optionCounts.brands[brand] || 0})
                    </motion.span>
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Frame Type */}
        <AccordionItem value="frame" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.frameType"
          >
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
                  // whileHover={{ scale: 1.02, translateX: 5 }}
                  // whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredItem(frameType)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.input
                    id={`frame-${frameType}`}
                    name={`frame-${frameType}`}
                    type="checkbox"
                    checked={filters.frameTypes.includes(frameType)}
                    onChange={() => handleFilterChange("frameTypes", frameType)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                    animate={{ x: hoveredItem === frameType ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  <label
                    htmlFor={`frame-${frameType}`}
                    className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  >
                    <motion.span
                      animate={{ x: hoveredItem === frameType ? 5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {frameType}
                    </motion.span>
                    <motion.span
                      animate={{ x: hoveredItem === frameType ? -5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`text-xs ${styles.textMutedLighter}`}
                    >
                      ({optionCounts.frameTypes[frameType] || 0})
                    </motion.span>
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lens Type */}
        <AccordionItem value="lens" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.lensType"
          >
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
                  whileHover={{ scale: 1.02 }}
                  // whileHover={{ scale: 1.02, translateX: 5 }}
                  // whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredItem(lensType)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.input
                    id={`lens-${lensType}`}
                    name={`lens-${lensType}`}
                    type="checkbox"
                    checked={filters.lensTypes.includes(lensType)}
                    onChange={() => handleFilterChange("lensTypes", lensType)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                    animate={{ x: hoveredItem === lensType ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  <label
                    htmlFor={`lens-${lensType}`}
                    className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  >
                    <motion.span
                      animate={{ x: hoveredItem === lensType ? 5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {lensType}
                    </motion.span>
                    <motion.span
                      animate={{ x: hoveredItem === lensType ? -5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`text-xs ${styles.textMutedLighter}`}
                    >
                      ({optionCounts.lensTypes[lensType] || 0})
                    </motion.span>
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.color"
          >
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
                  onMouseEnter={() => setHoveredItem(colorObj.color)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.input
                    id={`color-${colorObj.color}`}
                    name={`color-${colorObj.color}`}
                    type="checkbox"
                    checked={filters.colors.includes(colorObj.color)}
                    onChange={() =>
                      handleFilterChange("colors", colorObj.color)
                    }
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                    animate={{ x: hoveredItem === colorObj.color ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  <label
                    htmlFor={`color-${colorObj.color}`}
                    className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  >
                    <motion.span
                      className="flex items-center"
                      animate={{ x: hoveredItem === colorObj.color ? 5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-full border"
                        style={{ backgroundColor: colorObj.color }}
                      ></span>
                      {colorObj.title}
                    </motion.span>
                    <motion.span
                      animate={{ x: hoveredItem === colorObj.color ? -5 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`text-xs ${styles.textMutedLighter}`}
                    >
                      ({optionCounts.colors[colorObj.color] || 0})
                    </motion.span>
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.rating"
          >
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
                  // whileHover={{ scale: 1.02, translateX: 5 }}
                  // whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredItem(rating.toString())}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.input
                    id={`rating-${rating}`}
                    name={`rating-${rating}`}
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleFilterChange("ratings", rating)}
                    className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                    animate={{ x: hoveredItem === rating.toString() ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  <motion.label
                    htmlFor={`rating-${rating}`}
                    className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm cursor-pointer`}
                    animate={{ x: hoveredItem === rating.toString() ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    {renderStars(rating)}
                    <motion.span
                      className={`text-xs ${styles.textMutedLighter}`}
                      animate={{
                        x: hoveredItem === rating.toString() ? -10 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      ({optionCounts.ratings[rating] || 0})
                    </motion.span>
                  </motion.label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.availability"
          >
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <motion.div
                className="flex items-center"
                // whileHover={{ scale: 1.02, translateX: 5 }}
                // whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setHoveredItem("inStock")}
                onMouseLeave={() => setHoveredItem(null)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <motion.input
                  id="in-stock"
                  name="in-stock"
                  type="checkbox"
                  checked={filters.inStock === true}
                  onChange={() =>
                    handleFilterChange(
                      "inStock",
                      filters.inStock === true ? null : true,
                    )
                  }
                  className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  animate={{ x: hoveredItem === "inStock" ? 5 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                />
                <label
                  htmlFor="in-stock"
                  className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  data-translate="filter.inStock"
                >
                  <motion.span
                    animate={{ x: hoveredItem === "inStock" ? 5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    In Stock
                  </motion.span>
                  <motion.span
                    className={`text-xs ${styles.textMutedLighter}`}
                    animate={{ x: hoveredItem === "inStock" ? -5 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    ({optionCounts.inStock})
                  </motion.span>
                </label>
              </motion.div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
