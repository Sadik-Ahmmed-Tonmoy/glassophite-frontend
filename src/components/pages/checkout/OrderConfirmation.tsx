"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { CheckCircle, Calendar, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { CartItem } from "@/hooks/use-cart"

interface OrderConfirmationProps {
  orderId: string
  orderDate: string
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
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
}

export default function OrderConfirmation({
  orderId,
  orderDate,
  shippingDetails,
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
}: OrderConfirmationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
      button: "bg-white/10 hover:bg-white/20 text-white border-white/10",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      buttonSecondary: "border-white/20 text-white hover:bg-white/10",
      infoBox: "bg-blue-500/10 border-blue-500/20",
      infoText: "text-blue-300",
      infoTitle: "text-blue-200",
      successIcon: "text-green-400",
      successBg: "bg-green-500/20",
      summaryBg: "bg-white/5",
      itemBg: "bg-white/5",
      divider: "border-white/10",
    },
    light: {
      bg: "bg-neutral-50",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      borderHover: "hover:border-neutral-300",
      button: "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      buttonSecondary: "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
      infoBox: "bg-blue-50 border-blue-100",
      infoText: "text-blue-600",
      infoTitle: "text-blue-800",
      successIcon: "text-green-600",
      successBg: "bg-green-100",
      summaryBg: "bg-gray-50",
      itemBg: "bg-white",
      divider: "border-neutral-200",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Calculate estimated delivery date (7 days from order)
  const estimatedDelivery = new Date(orderDate)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  }

  const successIconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring" as const, stiffness: 200, damping: 15, delay: 0.3 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`container mx-auto px-4 py-8 max-w-4xl ${styles.bg}`}
    >
      <motion.div
        variants={itemVariants}
        className={`rounded-2xl border backdrop-blur-sm ${styles.card} p-6 md:p-8 transition-colors duration-500`}
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            variants={successIconVariants}
            className={`inline-flex items-center justify-center w-16 h-16 ${styles.successBg} rounded-full mb-4`}
          >
            <CheckCircle size={32} className={styles.successIcon} />
          </motion.div>
          <h1 className={`text-2xl md:text-3xl font-bold ${styles.text}`} data-translate="order.confirmedTitle">
            Order Confirmed!
          </h1>
          <p className={`${styles.textMuted} mt-2`} data-translate="order.confirmedMessage">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants} className={`p-4 rounded-xl ${styles.summaryBg} border ${styles.border}`}>
            <h2 className={`font-medium ${styles.text} mb-2`} data-translate="order.orderInfo">
              Order Information
            </h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className={styles.textMutedLighter} data-translate="order.orderNumber">
                  Order Number:
                </span>{" "}
                <span className={`font-medium ${styles.text}`}>{orderId}</span>
              </p>
              <p>
                <span className={styles.textMutedLighter} data-translate="order.orderDate">
                  Order Date:
                </span>{" "}
                <span className={styles.textMuted}>{formatDate(orderDate)}</span>
              </p>
              <p className="flex items-center">
                <Calendar size={14} className={`${styles.textMutedLighter} mr-1`} />
                <span className={styles.textMutedLighter} data-translate="order.estimatedDelivery">
                  Estimated Delivery:
                </span>
                <span className={`ml-1 ${styles.textMuted}`}>{formatDate(estimatedDelivery.toISOString())}</span>
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={`p-4 rounded-xl ${styles.summaryBg} border ${styles.border}`}>
            <h2 className={`font-medium ${styles.text} mb-2`} data-translate="order.shippingAddress">
              Shipping Address
            </h2>
            <div className={`space-y-1 text-sm ${styles.textMuted}`}>
              <p>
                {shippingDetails.firstName} {shippingDetails.lastName}
              </p>
              <p>{shippingDetails.address}</p>
              <p>
                {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}
              </p>
              <p>{shippingDetails.country}</p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className={`font-medium ${styles.text} mb-4`} data-translate="order.orderSummary">
            Order Summary
          </h2>
          <div className={`border ${styles.border} rounded-xl overflow-hidden`}>
            <div className={`divide-y ${styles.divider}`}>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  custom={index}
                  className={`flex items-center p-4 ${styles.itemBg}`}
                >
                  <div className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden ${styles.summaryBg}`}>
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
                      {item.colorName && `Color: ${item.colorName}`}
                      {item.size && ` • Size: ${item.size}`}
                      {` • Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${styles.text}`}>
                      ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={`${styles.summaryBg} p-4 border-t ${styles.border}`}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={styles.textMutedLighter} data-translate="order.subtotal">
                    Subtotal
                  </span>
                  <span className={styles.textMuted}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={styles.textMutedLighter} data-translate="order.shipping">
                    Shipping
                  </span>
                  <span className={styles.textMuted}>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={styles.textMutedLighter} data-translate="order.tax">
                    Tax
                  </span>
                  <span className={styles.textMuted}>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={styles.textMutedLighter} data-translate="order.discount">
                      Discount
                    </span>
                    <span className="text-green-500">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`border-t ${styles.divider} pt-2 mt-2`}>
                  <div className="flex justify-between font-medium">
                    <span className={styles.text} data-translate="order.total">
                      Total
                    </span>
                    <span className={styles.text}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          variants={itemVariants}
          className={`p-4 rounded-xl border ${styles.infoBox} mb-8`}
        >
          <div className="flex items-start">
            <Truck size={20} className={styles.infoText + " mr-3 flex-shrink-0 mt-0.5"} />
            <div>
              <h3 className={`font-medium ${styles.infoTitle}`} data-translate="order.shippingInfo">
                Shipping Information
              </h3>
              <p className={`text-sm ${styles.infoText} mt-1`} data-translate="order.trackingInfo">
                You will receive an email with tracking information once your order ships.
              </p>
              <p className={`text-sm ${styles.infoText} mt-1`}>
                <span data-translate="order.contactInfo">For any questions about your order, please contact our customer service at</span>{" "}
                <a href="mailto:support@glassophite.com" className="underline hover:no-underline">
                  support@glassophite.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Button asChild variant="outline" className={styles.buttonSecondary}>
            <Link href="/my-profile/order-history" data-translate="order.viewHistory">
              View Order History
            </Link>
          </Button>
          <Button asChild className={styles.buttonPrimary}>
            <Link href="/products" className="flex items-center">
              <span data-translate="order.continueShopping">Continue Shopping</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}