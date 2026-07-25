"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { TVariant } from "@/types/types"

interface VariantSelectorProps {
  variants: TVariant[]
  selectedVariantId: string
  onSelectVariant: (variantId: string) => void
}

export default function VariantSelector({ variants, selectedVariantId, onSelectVariant }: VariantSelectorProps) {
  const currentVariant = variants.find((v) => v.id === selectedVariantId)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Color Variant
        </h3>
        {currentVariant && (
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {currentVariant.title}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id
          const isOutOfStock = !variant.inStock

          return (
            <button
              key={variant.id}
              onClick={() => onSelectVariant(variant.id)}
              className={cn(
                "relative h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#007C74]",
                isSelected
                  ? "border-[#007C74] ring-2 ring-[#007C74] ring-offset-2 dark:ring-offset-black scale-105"
                  : "border-neutral-200 dark:border-neutral-700 hover:scale-105",
                isOutOfStock && "opacity-60",
              )}
              title={variant.inStock ? `${variant.title} (In Stock: ${variant.quantity})` : `${variant.title} (Out of Stock)`}
            >
              <span className="absolute inset-0.5 rounded-full shadow-inner" style={{ backgroundColor: variant.color }} />

              {isSelected && !isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white drop-shadow-md stroke-[3]" />
                </span>
              )}

              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-[2px] bg-red-500 rotate-45 shadow-sm"></div>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

