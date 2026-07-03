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
import PriceRangeSlider from "./price-range-slider";
import { normalizeCategoryForDB } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  collectionOptions: readonly {
    label: string;
    value: string;
    type: "category" | "sale";
  }[];
  optionCounts: FilterOptionCounts;
  allBrands: string[];
  allSubCategories: string[];
  allTypes: string[];
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
  allSubCategories,
  allTypes,
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

  // Render stars for rating
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

  // -------------------- Variants --------------------
  // Entry animation (fade + slide in)
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  // Move the main content (checkbox + label text) right by 5px on hover
  const contentVariants = {
    rest: { x: 0 },
    hover: { x: 5, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  };

  // Move the count span left by 5px on hover (to cancel the right shift)
  const countVariants = {
    rest: { x: 0 },
    hover: { x: -5, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  };
 
  const ratingCountVariants = {
    rest: { x: 0 },
    hover: { x: -10, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  };

  // Helper to map over filter options and render a consistent row
  const renderFilterRow = ({
    id,
    checked,
    onChange,
    label,
    count,
    key,
    index,
    inputClassName = "",
  }: {
    id: string;
    checked: boolean;
    onChange: () => void;
    label: React.ReactNode;
    count: number | string;
    key: string;
    index: number;
    inputClassName?: string;
  }) => (
    <motion.div
      key={key}
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex items-center"
    >
      <motion.input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors ${inputClassName}`}
        variants={contentVariants}
      />
      <label
        htmlFor={id}
        className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
      >
        <motion.span variants={contentVariants}>{label}</motion.span>
        <motion.span
          variants={countVariants}
          className={`text-xs ${styles.textMutedLighter}`}
        >
          ({count})
        </motion.span>
      </label>
    </motion.div>
  );

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
          "highlights",
          "collection",
          "subCategory",
          "type",
          "price",
          "brand",
          "frame",
          "lens",
          "color",
          "rating",
          "availability",
        ]}
      >
        {/* ========== Highlights ========== */}
        <AccordionItem value="highlights" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
          >
            Highlights
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {[
                { label: "New Arrivals", value: "New Arrivals" },
                { label: "Best Sellers", value: "Best Sellers" },
                { label: "Trending Now", value: "Trending Now" },
                { label: "Featured Picks", value: "Featured Picks" },
              ].map((option, index) => {
                const dbValue = normalizeCategoryForDB(option.value);
                const checked = filters.categories.includes(dbValue);
                const onChange = () => handleFilterChange("categories", option.value);
                const count = optionCounts.collections[option.value] || 0;
                return renderFilterRow({
                  id: `highlights-${option.value}`,
                  checked,
                  onChange,
                  label: option.label,
                  count,
                  key: option.value,
                  index,
                });
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Collection ========== */}
        <AccordionItem value="collection" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
          >
            Collection
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {collectionOptions
                .filter((o) => o.value.toLowerCase() !== "new arrivals" && o.value.toLowerCase() !== "blogs" && o.value.toLowerCase() !== "brands")
                .map((option, index) => {
                  const isSale = option.type === "sale";
                  const dbValue = normalizeCategoryForDB(option.value);
                  const checked = isSale ? filters.saleOnly : filters.categories.includes(dbValue);
                  const onChange = () =>
                    isSale
                      ? handleFilterChange("saleOnly", !filters.saleOnly)
                      : handleFilterChange("categories", option.value);
                  const count = optionCounts.collections[option.value] || 0;
                  return renderFilterRow({
                    id: `collection-${option.value}`,
                    checked,
                    onChange,
                    label: option.label,
                    count,
                    key: option.value,
                    index,
                  });
                })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Sub-Category ========== */}
        {allSubCategories.length > 0 && (
          <AccordionItem value="subCategory" className={styles.border}>
            <AccordionTrigger
              className={`text-sm font-medium ${styles.accordionTrigger}`}
            >
              Sub-Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4 space-y-4">
                {allSubCategories.map((subCat, index) =>
                  renderFilterRow({
                    id: `subCategory-${subCat}`,
                    checked: filters.subCategories.includes(subCat),
                    onChange: () => handleFilterChange("subCategories", subCat),
                    label: subCat,
                    count: optionCounts.subCategories[subCat] || 0,
                    key: subCat,
                    index,
                  })
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ========== Type ========== */}
        {allTypes.length > 0 && (
          <AccordionItem value="type" className={styles.border}>
            <AccordionTrigger
              className={`text-sm font-medium ${styles.accordionTrigger}`}
            >
              Type
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4 space-y-4">
                {allTypes.map((type, index) =>
                  renderFilterRow({
                    id: `type-${type}`,
                    checked: filters.types.includes(type),
                    onChange: () => handleFilterChange("types", type),
                    label: type,
                    count: optionCounts.types[type] || 0,
                    key: type,
                    index,
                  })
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ========== Price Range ========== */}
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

        {/* ========== Brand ========== */}
        <AccordionItem value="brand" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.brand"
          >
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allBrands.map((brand, index) =>
                renderFilterRow({
                  id: `brand-${brand}`,
                  checked: filters.brands.includes(brand),
                  onChange: () => handleFilterChange("brands", brand),
                  label: brand,
                  count: optionCounts.brands[brand] || 0,
                  key: brand,
                  index,
                })
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Frame Type ========== */}
        <AccordionItem value="frame" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.frameType"
          >
            Frame Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allFrameTypes.map((frameType, index) =>
                renderFilterRow({
                  id: `frame-${frameType}`,
                  checked: filters.frameTypes.includes(frameType),
                  onChange: () => handleFilterChange("frameTypes", frameType),
                  label: frameType,
                  count: optionCounts.frameTypes[frameType] || 0,
                  key: frameType,
                  index,
                })
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Lens Type ========== */}
        <AccordionItem value="lens" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.lensType"
          >
            Lens Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allLensTypes.map((lensType, index) =>
                renderFilterRow({
                  id: `lens-${lensType}`,
                  checked: filters.lensTypes.includes(lensType),
                  onChange: () => handleFilterChange("lensTypes", lensType),
                  label: lensType,
                  count: optionCounts.lensTypes[lensType] || 0,
                  key: lensType,
                  index,
                })
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Color ========== */}
        <AccordionItem value="color" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.color"
          >
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allColors.map((colorObj, index) => {
                const label = (
                  <span className="flex items-center">
                    <span
                      className="mr-2 inline-block h-4 w-4 rounded-full border"
                      style={{ backgroundColor: colorObj.color }}
                    />
                    {colorObj.title}
                  </span>
                );
                return renderFilterRow({
                  id: `color-${colorObj.color}`,
                  checked: filters.colors.includes(colorObj.color),
                  onChange: () => handleFilterChange("colors", colorObj.color),
                  label,
                  count: optionCounts.colors[colorObj.color] || 0,
                  key: colorObj.color,
                  index,
                });
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Rating ========== */}
        <AccordionItem value="rating" className={styles.border}>
          <AccordionTrigger
            className={`text-sm font-medium ${styles.accordionTrigger}`}
            data-translate="filter.rating"
          >
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {[5, 4, 3, 2, 1].map((rating, index) => {
                const id = `rating-${rating}`;
                return (
                  <motion.div
                    key={rating}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="flex items-center"
                  >
                    <motion.input
                      id={id}
                      type="checkbox"
                      checked={filters.ratings.includes(rating)}
                      onChange={() => handleFilterChange("ratings", rating)}
                      className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                      variants={contentVariants}
                    />
                    <motion.label
                      htmlFor={id}
                      className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm cursor-pointer`}
                      variants={contentVariants}
                    >
                      {renderStars(rating)}
                      <motion.span
                        variants={ratingCountVariants}
                        className={`text-xs ${styles.textMutedLighter}`}
                      >
                        ({optionCounts.ratings[rating] || 0})
                      </motion.span>
                    </motion.label>
                  </motion.div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ========== Availability ========== */}
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
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                whileHover="hover"
              >
                <motion.input
                  id="in-stock"
                  type="checkbox"
                  checked={filters.inStock === true}
                  onChange={() =>
                    handleFilterChange(
                      "inStock",
                      filters.inStock === true ? null : true
                    )
                  }
                  className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] cursor-pointer transition-colors`}
                  variants={contentVariants}
                />
                <label
                  htmlFor="in-stock"
                  className={`ml-3 flex flex-1 items-center justify-between gap-3 text-sm ${styles.label} cursor-pointer`}
                  data-translate="filter.inStock"
                >
                  <motion.span variants={contentVariants}>In Stock</motion.span>
                  <motion.span
                    variants={countVariants}
                    className={`text-xs ${styles.textMutedLighter}`}
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