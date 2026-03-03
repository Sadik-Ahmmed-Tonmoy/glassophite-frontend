"use client"

import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface PriceRangeSliderProps {
  minPrice: number
  maxPrice: number
  currentMin: number
  currentMax: number
  onChange: (min: number, max: number) => void
}

export default function PriceRangeSlider({
  minPrice,
  maxPrice,
  currentMin,
  currentMax,
  onChange,
}: PriceRangeSliderProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [localRange, setLocalRange] = useState<[number, number]>([currentMin, currentMax])


  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      sliderTrack: "bg-white/20",
      sliderRange: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      sliderThumb: "bg-white border-2 border-[#007C74] shadow-lg shadow-[#007C74]/20",
    },
    light: {
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      sliderTrack: "bg-neutral-200",
      sliderRange: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      sliderThumb: "bg-white border-2 border-[#007C74] shadow-lg",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light


  // Update local state when props change
  useEffect(() => {
    setLocalRange([currentMin, currentMax])
  }, [currentMin, currentMax])

  // Debounce the onChange to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localRange[0] !== currentMin || localRange[1] !== currentMax) {
        onChange(localRange[0], localRange[1])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localRange, onChange, currentMin, currentMax])

  const handleSliderChange = (value: number[]) => {
    setLocalRange([value[0], value[1]])
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Price display with animation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className={`text-sm ${styles.textMuted}`} data-translate="currency">
            ৳
          </span>
            <span
              className={`text-sm font-medium ${styles.text}`}
            >
              {localRange[0].toLocaleString()}
            </span>
      
        </div>

        <div className="flex items-center gap-1">
          <span className={`text-sm ${styles.textMuted}`} data-translate="currency">
            ৳
          </span>
            <span
              key={localRange[1]}
       
              className={`text-sm font-medium ${styles.text}`}
            >
              {localRange[1].toLocaleString()}
            </span>
        </div>
      </div>

      {/* Slider */}
      <Slider
         defaultValue={[minPrice, maxPrice]}
        value={localRange}
        min={minPrice}
        max={maxPrice}
        step={1}
        onValueChange={handleSliderChange}
        className="my-4"
        // Custom styling via classNames passed to the slider's internal parts
        // This assumes the Slider component supports custom classNames for track, range, thumb
        // If not, we might need to use CSS variables or custom CSS.
        // We'll use inline styles or pass data attributes.
        // trackClassName={styles.sliderTrack}
        // rangeClassName={styles.sliderRange}
        // thumbClassName={styles.sliderThumb}
      />

      {/* Optional: Range indicator */}
      <div className="flex justify-between text-xs">
        <span className={styles.textMutedLighter} data-translate="filter.min">Min</span>
        <span className={styles.textMutedLighter} data-translate="filter.max">Max</span>
      </div>
    </motion.div>
  )
}