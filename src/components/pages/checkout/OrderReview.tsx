/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/hooks/use-cart"

interface OrderReviewProps {
  items: CartItem[]
  shippingDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentDetails: any
  shippingMethod: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  onBack: () => void
  onPlaceOrder: () => void
  isSubmitting: boolean
}

export default function OrderReview({
  items,
  shippingDetails,
  paymentMethod,
  shippingMethod,
  subtotal,
  shipping,
  discount,
  total,
  onBack,
  onPlaceOrder,
  isSubmitting,
}: OrderReviewProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      borderHover: "hover:border-white/20",
      buttonOutline: "border-white/20 text-white hover:bg-white/10",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      infoBg: "bg-white/5 border-white/10",
      itemBg: "bg-white/5",
      discountText: "text-green-400",
      link: "text-[#007C74] hover:text-[#00A693]",
    },
    light: {
      bg: "bg-white",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      borderHover: "hover:border-neutral-300",
      buttonOutline: "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      infoBg: "bg-gray-50 border-gray-200",
      itemBg: "bg-white",
      discountText: "text-green-600",
      link: "text-[#007C74] hover:text-[#00A693]",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light



  // Get shipping method label
  const getShippingMethodLabel = () => {
    switch (shippingMethod) {
      case "express":
        return "Express Shipping (৳15.00)"
      case "standard":
        return "Standard Shipping (৳5.00)"
      case "free":
        return "Free Shipping"
      default:
        return "Standard Shipping"
    }
  }

  // Get payment method label
  const getPaymentMethodLabel = () => {
    if (paymentMethod === "CASH_ON_DELIVERY") return "Cash on Delivery"
    return "SSL Commerz (Card, bKash, Nagad)"
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl border ${styles.card} backdrop-blur-sm p-6 transition-colors duration-500`}
    >
      <h2 className={`text-xl font-semibold ${styles.text} mb-6`} data-translate="review.title">
        Review Your Order
      </h2>

      {/* Order Items */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className={`text-lg font-medium ${styles.text} mb-4`} data-translate="review.itemsTitle">
          Items in Your Order
        </h3>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              custom={idx}
              className={`flex items-center border-b ${styles.border} pb-4`}
            >
              <div className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden ${styles.infoBg}`}>
                <Image
                  src={item.image || "/placeholder.svg?height=64&width=64"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <h4 className={`text-sm font-medium ${styles.text}`}>{item.name}</h4>
                <p className={`text-xs ${styles.textMutedLighter}`}>
                  {item.colorName && <span data-translate="review.color">Color:</span>} {item.colorName}
                  {item.size && <span> • <span data-translate="review.size">Size:</span> {item.size}</span>}
                  {` • <span data-translate="review.qty">Qty:</span> ${item.quantity}`}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${styles.text}`}>
                  ৳{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                </p>
                {item.discountPrice && (
                  <p className={`text-xs ${styles.textMutedLighter} line-through`}>
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Shipping Information */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className={`text-lg font-medium ${styles.text} mb-4`} data-translate="review.shippingTitle">
          Shipping Information
        </h3>
        <div className={`p-4 rounded-lg border ${styles.infoBg}`}>
          <p className={`font-medium ${styles.text}`}>
            {shippingDetails.firstName} {shippingDetails.lastName}
          </p>
          <p className={styles.textMuted}>{shippingDetails.address}</p>
          <p className={styles.textMuted}>
            {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}
          </p>
          <p className={styles.textMuted}>{shippingDetails.country}</p>
          <p className={`mt-2 ${styles.textMuted}`}>{shippingDetails.email}</p>
          <p className={styles.textMuted}>{shippingDetails.phone}</p>
          <p className={`mt-2 text-sm ${styles.textMuted}`}>
            <span data-translate="review.shippingMethod">Shipping Method:</span> {getShippingMethodLabel()}
          </p>
        </div>
      </motion.div>

      {/* Payment Information */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className={`text-lg font-medium ${styles.text} mb-4`} data-translate="review.paymentTitle">
          Payment Information
        </h3>
        <div className={`p-4 rounded-lg border ${styles.infoBg}`}>
          <p className={`font-medium ${styles.text}`}>{getPaymentMethodLabel()}</p>
          <p className={`text-sm ${styles.textMuted} mt-1`}>
            {paymentMethod === "CASH_ON_DELIVERY"
              ? "You will pay in cash when your order is delivered."
              : "You will be redirected to the SSL Commerz gateway to complete your payment."}
          </p>
        </div>
      </motion.div>

      {/* Order Summary */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className={`text-lg font-medium ${styles.text} mb-4`} data-translate="review.summaryTitle">
          Order Summary
        </h3>
        <div className={`p-4 rounded-lg border ${styles.infoBg}`}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={styles.textMuted} data-translate="review.subtotal">Subtotal</span>
              <span className={styles.text}>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={styles.textMuted} data-translate="review.shipping">Shipping</span>
              <span className={styles.text}>৳{shipping.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between">
                <span className={styles.textMuted} data-translate="review.discount">Discount</span>
                <span className={styles.discountText}>-৳{discount.toFixed(2)}</span>
              </div>
            )}
            <div className={`border-t ${styles.border} pt-2 mt-2`}>
              <div className="flex justify-between font-medium">
                <span className={styles.text} data-translate="review.total">Total</span>
                <span className={styles.text}>৳{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terms and Conditions */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className={cn(
              "h-4 w-4 rounded focus:ring-[#007C74] transition-colors",
              isDark ? "bg-white/5 border-white/30" : "border-gray-300 bg-white"
            )}
          />
          <label htmlFor="terms" className={`ml-2 block text-sm ${styles.textMuted}`}>
            <span data-translate="review.agree">I agree to the</span>{" "}
            <Link href="/terms" className={styles.link} data-translate="review.terms">
              Terms and Conditions
            </Link>{" "}
            <span data-translate="review.and">and</span>{" "}
            <Link href="/privacy" className={styles.link} data-translate="review.privacy">
              Privacy Policy
            </Link>
          </label>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className={cn("flex items-center", styles.buttonOutline)}
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} className="mr-2" />
          <span data-translate="review.back">Back to Payment</span>
        </Button>

        <Button
          onClick={onPlaceOrder}
          className={styles.buttonPrimary}
          disabled={isSubmitting || !termsAccepted}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              <span data-translate="review.processing">Processing...</span>
            </>
          ) : (
            <span data-translate="review.placeOrder">Place Order</span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}