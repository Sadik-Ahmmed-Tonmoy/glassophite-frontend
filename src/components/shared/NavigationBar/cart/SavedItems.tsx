"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function SavedItems() {
  const { savedItems, moveToCart, removeItem } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)

  if (savedItems.length === 0) return null

  return (
    <div className="px-4 py-3 border-t">
      <div className="mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold">Saved for Later ({savedItems.length})</h3>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 py-2">
              {savedItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.discountPrice ? (
                        <>
                          <span className="font-medium">₹{item.discountPrice}</span>
                          <span className="ml-1 line-through">₹{item.price}</span>
                        </>
                      ) : (
                        <span>₹{item.price}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveToCart(item.id)}
                      className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      aria-label="Move to cart"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
