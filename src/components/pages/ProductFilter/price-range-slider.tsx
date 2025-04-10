"use client"

import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"

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
  const [localRange, setLocalRange] = useState<[number, number]>([currentMin, currentMax])

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">${localRange[0]}</span>
        <span className="text-sm text-gray-500">${localRange[1]}</span>
      </div>

      <Slider
        defaultValue={[minPrice, maxPrice]}
        value={localRange}
        min={minPrice}
        max={maxPrice}
        step={1}
        onValueChange={handleSliderChange}
        className="my-4"
      />
    </div>
  )
}

