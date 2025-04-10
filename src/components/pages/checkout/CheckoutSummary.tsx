"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/hooks/use-cart"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  couponCode: string
  onApplyCoupon: (code: string) => void
}

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  couponCode,
  onApplyCoupon,
}: CheckoutSummaryProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false)
  const [couponInput, setCouponInput] = useState("")
  const [isCouponExpanded, setIsCouponExpanded] = useState(false)

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      onApplyCoupon(couponInput)
      setCouponInput("")
      setIsCouponExpanded(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {/* Items Summary */}
        <div className="mb-6">
          <button
            className="flex items-center justify-between w-full text-left mb-3"
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
          >
            <span className="font-medium">Items ({items.length})</span>
            {isItemsExpanded ? (
              <ChevronUp size={18} className="text-gray-500" />
            ) : (
              <ChevronDown size={18} className="text-gray-500" />
            )}
          </button>

          {isItemsExpanded && (
            <div className="space-y-4 mt-3 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || "/placeholder.svg?height=48&width=48"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coupon Code */}
        <div className="mb-6">
          {couponCode ? (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Tag size={16} className="text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Coupon Applied</p>
                  <p className="text-xs text-green-600">&quot;{couponCode}&quot; - 10% off your order</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setIsCouponExpanded(!isCouponExpanded)}
                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center text-primary">
                  <Tag size={16} className="mr-2" />
                  <span className="text-sm font-medium">Apply Coupon</span>
                </div>
                {isCouponExpanded ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </button>

              {isCouponExpanded && (
                <div className="mt-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      className="bg-primary hover:bg-primary/90"
                      disabled={!couponInput.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try &quot;SAVE10&quot; for 10% off your order</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-b-lg">
        <p className="text-xs text-gray-500 mb-4">
          By placing your order, you agree to our Terms of Service and Privacy Policy. Your payment information is
          processed securely.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-5 relative">
            <Image src="/placeholder.svg?height=20&width=32" alt="Visa" fill className="object-contain" />
          </div>
          <div className="w-8 h-5 relative">
            <Image src="/placeholder.svg?height=20&width=32" alt="Mastercard" fill className="object-contain" />
          </div>
          <div className="w-8 h-5 relative">
            <Image src="/placeholder.svg?height=20&width=32" alt="Amex" fill className="object-contain" />
          </div>
          <div className="w-8 h-5 relative">
            <Image src="/placeholder.svg?height=20&width=32" alt="PayPal" fill className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
