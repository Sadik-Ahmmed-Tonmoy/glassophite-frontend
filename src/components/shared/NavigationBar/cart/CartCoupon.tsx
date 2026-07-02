"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, ChevronRight, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetAllCouponsQuery } from "@/redux/features/coupon/couponApi"

export default function CartCoupon() {
  const { data: couponsData } = useGetAllCouponsQuery(undefined);
  const [isExpanded, setIsExpanded] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code")
      return
    }

    const coupons = couponsData || []
    const found = coupons.find(
      (c: { code: string }) => c.code === couponCode.toUpperCase().trim()
    )

    if (found) {
      if (found.status !== "Active") {
        setError("This coupon is no longer active")
        return
      }

      const expiryDate = new Date(found.expiry)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (expiryDate < today) {
        setError("This coupon has expired")
        return
      }

      setAppliedCoupon(found)
      setError(null)
      setCouponCode("")
      setIsExpanded(false)
    } else {
      setError("Invalid coupon code")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }

  return (
    <div className="px-4 py-3">
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Check size={18} className="text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">Coupon Applied</p>
              <p className="text-xs text-green-600">&quot;{appliedCoupon.code}&quot; - {appliedCoupon.discount}% off your order</p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-700 hover:text-green-900 p-1"
            aria-label="Remove coupon"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center text-primary">
              <Tag size={18} className="mr-2" />
              <span className="text-sm font-medium">Apply now and save extra!</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-2 px-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value)
                        setError(null)
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button onClick={handleApplyCoupon} className="bg-primary hover:bg-primary/90">
                      Apply
                    </Button>
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
                  <p className="text-xs text-gray-500 mt-2">Try &quot;GLASSOPHITE10&quot; for 10% off your order</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
