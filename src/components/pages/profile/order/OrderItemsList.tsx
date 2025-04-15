"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, ShoppingCart, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TOrderItem } from "@/types/types"


interface OrderItemsListProps {
  items: TOrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  status: "processing" | "shipped" | "delivered" | "cancelled"
}

export default function OrderItemsList({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  status,
}: OrderItemsListProps) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true)
  const [showBuyAgainSuccess, setShowBuyAgainSuccess] = useState<string | null>(null)

  // Toggle order details with animation
  const toggleOrderDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded)
  }

  // Handle buy again function
  const handleBuyAgain = async (itemId: string, itemName: string) => {
    try {
      // Simulate API call to add item to cart
      await new Promise((resolve) => setTimeout(resolve, 800))

      console.log("Item added to cart:", itemId)

      // Show success message
      setShowBuyAgainSuccess(itemName)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowBuyAgainSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      alert("There was an error adding this item to your cart. Please try again.")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-6 cursor-pointer" onClick={toggleOrderDetails}>
        <h3 className="text-lg font-medium text-gray-900">Order Items ({items.length})</h3>
        <button className="text-gray-500 hover:text-gray-700 transition-transform duration-200">
          {isDetailsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t transition-all duration-300 ease-in-out overflow-hidden",
          isDetailsExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 relative rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={item.image || "/placeholder.svg?height=96&width=96"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="sm:ml-6 flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{item.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.variant && `${item.variant} • `}SKU: {item.sku}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <p className="text-md font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    {item.originalPrice && item.originalPrice > item.price ? (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <p className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</p>
                        <span className="text-xs text-green-600">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    )}
                  </div>
                </div>

                {status === "delivered" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Write review logic
                      }}
                    >
                      Write a Review
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuyAgain(item.id, item.name)
                      }}
                    >
                      <ShoppingCart size={14} className="mr-1.5" />
                      Buy Again
                    </button>

                    {/* Buy Again Success Message */}
                    {showBuyAgainSuccess === item.name && (
                      <div className="ml-2 text-xs text-green-600 flex items-center animate-fade-in">
                        <CheckIcon size={14} className="mr-1" />
                        Added to cart!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">${shipping.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
