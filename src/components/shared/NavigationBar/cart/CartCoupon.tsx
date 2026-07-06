"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, ChevronDown, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useValidateCouponMutation } from "@/redux/features/coupon/couponApi"
import { toast } from "sonner"

interface AppliedCoupon {
  code: string
  discount: number   // percentage
}

interface CartCouponProps {
  appliedCoupon: AppliedCoupon | null
  onApply: (coupon: AppliedCoupon) => void
  onRemove: () => void
}

export default function CartCoupon({ appliedCoupon, onApply, onRemove }: CartCouponProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [validateCoupon, { isLoading }] = useValidateCouponMutation()

  const handleApplyCoupon = async () => {
    const trimmed = couponCode.trim().toUpperCase()
    if (!trimmed) {
      setError("Please enter a coupon code")
      return
    }
    setError(null)
    try {
      const result = await validateCoupon({ code: trimmed }).unwrap()
      const couponData = result?.data?.coupon ?? result?.data
      if (couponData) {
        onApply({ code: couponData.code, discount: couponData.discount })
        setCouponCode("")
        setIsExpanded(false)
        toast.success(`Coupon applied! ${couponData.discount}% off your order.`)
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      const msg = error?.data?.message || "Invalid or expired coupon code"
      setError(msg)
    }
  }

  const handleRemove = () => {
    onRemove()
    setError(null)
    setCouponCode("")
  }

  return (
    <div className="px-4 py-3">
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Coupon Applied</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                &quot;{appliedCoupon.code}&quot; — {appliedCoupon.discount}% off
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-700 hover:text-green-900 p-1 rounded transition-colors"
            aria-label="Remove coupon"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <div className="flex items-center text-primary">
              <Tag size={18} className="mr-2" />
              <span className="text-sm font-medium">Apply now and save extra!</span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-2 px-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase())
                        setError(null)
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 min-w-[72px]"
                    >
                      {isLoading ? <Loader2 size={15} className="animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>}
                  <p className="text-xs text-gray-500 mt-2">
                    Try &quot;GLASSOPHITE10&quot; for 10% off your order
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
