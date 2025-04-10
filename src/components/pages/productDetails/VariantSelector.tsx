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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Color</h3>
        <span className="text-xs text-gray-500">{variants.find((v) => v.id == selectedVariantId)?.title || ""}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId == variant.id
          const isOutOfStock = !variant.inStock

          return (
            <button
              key={variant.id}
              onClick={() => onSelectVariant(variant.id)}
              className={cn(
                "relative h-10 w-10 rounded-full border-2 transition-all",
                isSelected ? "border-black ring-2 ring-black ring-offset-2" : "border-gray-200",
                isOutOfStock && "opacity-60",
              )}
              title={variant.inStock ? `Available: ${variant.quantity}` : "Out of Stock"}
            >
              <span className="absolute inset-1 rounded-full" style={{ backgroundColor: variant.color }} />

              {isSelected && !isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white drop-shadow-md" />
                </span>
              )}

              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-[1px] bg-red-500 rotate-45"></div>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

