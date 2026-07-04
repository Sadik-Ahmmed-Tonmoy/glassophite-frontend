/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Minus, Plus, AlertTriangle, X, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"


export default function CartItem({ item }: any) {
  const { updateItemQuantity, removeItem } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > item.maxQuantity) {
      toast.error("Stock limit reached", {
        description: `Only ${item.maxQuantity} items are available in stock.`,
      })
      return
    }
    updateItemQuantity(item.id, newQuantity)
  }

  const handleRemoveClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmRemove = () => {
    setShowConfirm(false)
    setIsRemoving(true)
    setTimeout(() => {
      removeItem(item.id)
    }, 300)
  }

  const handleCancelRemove = () => {
    setShowConfirm(false)
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
          <div className="flex justify-between  ">
            <div className="flex-1 pr-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{item.name}</h3>
              <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2 flex-wrap">
                <span>Brand: {item.brand}</span>
                <span>•</span>
                <span>Size: {item.size}</span>
                <span>•</span>
                <span className={item.maxQuantity < 7 ? "text-red-500 font-bold" : "text-emerald-600 font-medium"}>
                  Stock: {item.maxQuantity}
                </span>
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
              onClick={handleRemoveClick}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 h-fit"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Inline Delete Confirmation */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2">
                  <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                    <AlertTriangle size={13} />
                    <span>Remove this item?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCancelRemove}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                      <X size={11} />
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmRemove}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    >
                      <Check size={11} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price and Quantity */}
          <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
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
                className={`px-2 py-1 text-gray-500 hover:text-gray-700 cursor-pointer ${
                  item.quantity >= item.maxQuantity ? "opacity-50" : ""
                }`}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.quantity} × ৳{item.discountPrice || item.price} =
              </div>
              <div className="mt-0.5">
                {item.discountPrice ? (
                  <>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">৳{(item.discountPrice * item.quantity).toFixed(2)}</span>
                    <span className="ml-1.5 text-xs text-gray-400 line-through">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-semibold text-gray-900 dark:text-gray-100">৳{(item.price * item.quantity).toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
          {/* Removed save for later container */}
        </div>
      </div>
    </motion.div>
  )
}
