/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import type { FilterState } from "@/types/filter-types"
// import { renderStars } from "@/lib/utils"
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
  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={["price", "brand", "frame", "lens", "color", "rating", "availability"]}>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Price Range</AccordionTrigger>
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

        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allBrands.map((brand) => (
                <motion.div
                  key={brand}
                  className="flex items-center"
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`brand-${brand}`}
                    name={`brand-${brand}`}
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleFilterChange("brands", brand)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74] cursor-pointer"
                  />
                  <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                    {brand}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="frame">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Frame Type</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allFrameTypes.map((frameType) => (
                <motion.div
                  key={frameType}
                  className="flex items-center"
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`frame-${frameType}`}
                    name={`frame-${frameType}`}
                    type="checkbox"
                    checked={filters.frameTypes.includes(frameType)}
                    onChange={() => handleFilterChange("frameTypes", frameType)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74] cursor-pointer"
                  />
                  <label htmlFor={`frame-${frameType}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                    {frameType}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lens">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Lens Type</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allLensTypes.map((lensType) => (
                <motion.div
                  key={lensType}
                  className="flex items-center"
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`lens-${lensType}`}
                    name={`lens-${lensType}`}
                    type="checkbox"
                    checked={filters.lensTypes.includes(lensType)}
                    onChange={() => handleFilterChange("lensTypes", lensType)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74] cursor-pointer"
                  />
                  <label htmlFor={`lens-${lensType}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                    {lensType}
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Color</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {allColors.map((colorObj) => (
                <motion.div
                  key={colorObj.color}
                  className="flex items-center"
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`color-${colorObj.color}`}
                    name={`color-${colorObj.color}`}
                    type="checkbox"
                    checked={filters.colors.includes(colorObj.color)}
                    onChange={() => handleFilterChange("colors", colorObj.color)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74] cursor-pointer"
                  />
                  <label htmlFor={`color-${colorObj.color}`} className="ml-3 flex items-center text-sm text-gray-600 cursor-pointer">
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

        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <motion.div
                  key={rating}
                  className="flex items-center"
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    id={`rating-${rating}`}
                    name={`rating-${rating}`}
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleFilterChange("ratings", rating)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74] cursor-pointer"
                  />
                  <label htmlFor={`rating-${rating}`} className="ml-3 flex items-center text-sm text-gray-600 cursor-pointer">
                    {/* {renderStars(rating)} <span className="ml-1">& Up</span> */}
                    <p className="text-red-500">starrrrr</p>
                  </label>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium text-gray-900">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <motion.div className="flex items-center" whileHover={{ scale: 1.0 }} whileTap={{ scale: 0.98 }}>
                <input
                  id="in-stock"
                  name="in-stock"
                  type="checkbox"
                  checked={filters.inStock === true}
                  onChange={() => handleFilterChange("inStock", filters.inStock === true ? null : true)}
                  className="h-4 w-4 rounded border-gray-300 text-[#007C74] focus:ring-[#007C74] cursor-pointer"
                />
                <label htmlFor="in-stock" className="ml-3 text-sm text-gray-600 cursor-pointer">
                  In Stock
                </label>
              </motion.div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

