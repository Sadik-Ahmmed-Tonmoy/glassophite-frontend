"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, X, Tag } from "lucide-react"

interface CartSummaryProps {
  subtotal: number
  shipping?: number
  couponDiscount?: number
  couponCode?: string
  rewardDiscount?: number
  rewardPointsUsed?: number
  onRemoveCoupon?: () => void
  onApplyCoupon?: (code: string) => void
}

export default function CartSummary({
  subtotal,
  shipping = 0,
  couponDiscount = 0,
  couponCode,
  rewardDiscount = 0,
  rewardPointsUsed = 0,
  onRemoveCoupon,
  onApplyCoupon,
}: CartSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [couponInput, setCouponInput] = useState("")
  const [isCouponExpanded, setIsCouponExpanded] = useState(false)

  const totalDiscount = couponDiscount + rewardDiscount
  const total = Math.max(0, subtotal - totalDiscount)

  const handleApplyCoupon = () => {
    if (couponInput.trim() && onApplyCoupon) {
      onApplyCoupon(couponInput)
      setCouponInput("")
      setIsCouponExpanded(false)
    }
  }

  return (
    <div className="px-4 py-3">
      <div className="mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold">Order Summary</h3>
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
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
           

            <div className="space-y-2 text-sm pb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>৳{shipping.toFixed(2)}</span>
                </div>
              )}


              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    Coupon{couponCode ? ` (${couponCode})` : ""}
                  </span>
                  <span>-৳{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {rewardDiscount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span className="flex items-center gap-1">
                    Reward Points ({rewardPointsUsed} pts)
                  </span>
                  <span>-৳{rewardDiscount.toFixed(2)}</span>
                </div>
              )}

              {totalDiscount > 0 && (
                <div className="flex justify-between font-medium text-green-600 border-t pt-2">
                  <span>Total Savings</span>
                  <span>-৳{totalDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-2 border-t">
        <span className="font-semibold">Grand Total <span className="text-xs text-gray-500">(excluding shipping)</span></span>
        <span className="font-semibold text-lg">৳{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
