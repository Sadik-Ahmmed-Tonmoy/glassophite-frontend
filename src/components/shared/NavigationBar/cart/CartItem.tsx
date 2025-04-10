/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Trash2, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"


export default function CartItem({ item }: any) {
  const { updateItemQuantity, removeItem, saveForLater } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > item.maxQuantity) return
    updateItemQuantity(item.id, newQuantity)
  }

  const handleRemove = () => {
    setIsRemoving(true)
    // Slight delay to allow animation to complete
    setTimeout(() => {
      removeItem(item.id)
    }, 300)
  }

  return (
    <motion.div
      className={`p-4 ${isRemoving ? "opacity-50" : ""}`}
      animate={{ opacity: isRemoving ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <div className="flex-1 pr-2">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
              <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                <span>Brand: {item.brand}</span>
                <span>•</span>
                <span>Size: {item.size}</span>
              </div>

              {/* Color Variant */}
              {item.color && (
                <div className="mt-1.5 flex items-center">
                  <div
                    className="h-4 w-4 rounded-full border border-gray-300 mr-1.5"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-500">{item.colorName}</span>
                </div>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Price and Quantity */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.maxQuantity}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right">
              {item.discountPrice ? (
                <>
                  <span className="font-medium text-gray-900">₹{item.discountPrice}</span>
                  <span className="ml-1.5 text-sm text-gray-500 line-through">₹{item.price}</span>
                </>
              ) : (
                <span className="font-medium text-gray-900">₹{item.price}</span>
              )}
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => saveForLater(item.id)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Save for later
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
