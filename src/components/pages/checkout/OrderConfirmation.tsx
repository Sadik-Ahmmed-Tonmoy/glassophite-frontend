"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { CheckCircle, Calendar, Truck, ArrowRight, Package, BadgePercent, Gift, CreditCard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { CartItem } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface OrderConfirmationProps {
  orderData: any
  items: CartItem[]
}

export default function OrderConfirmation({ orderData, items }: OrderConfirmationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const styles = {
    bg: isDark ? "bg-black" : "bg-neutral-50",
    card: isDark ? "bg-white/5 border-white/10" : "bg-white border-neutral-200",
    cardHover: isDark ? "hover:bg-white/10" : "hover:bg-neutral-50",
    text: isDark ? "text-white" : "text-neutral-900",
    textMuted: isDark ? "text-neutral-300" : "text-neutral-600",
    textMutedLighter: isDark ? "text-neutral-400" : "text-neutral-500",
    border: isDark ? "border-white/10" : "border-neutral-200",
    buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
    buttonSecondary: isDark ? "border-white/20 text-white hover:bg-white/10" : "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
    successIcon: isDark ? "text-green-400" : "text-green-600",
    successBg: isDark ? "bg-green-500/20" : "bg-green-100",
    summaryBg: isDark ? "bg-white/5" : "bg-gray-50",
    divider: isDark ? "border-white/10" : "border-neutral-200",
    infoBox: isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100",
    infoText: isDark ? "text-blue-300" : "text-blue-600",
    infoTitle: isDark ? "text-blue-200" : "text-blue-800",
  }

  const d = orderData || {}

  const orderNumber = d.orderNumber || d.id || ""
  const orderDate = d.createdAt || d.orderDate || new Date().toISOString()
  const status = d.status || "PROCESSING"
  const paymentMethod = d.paymentMethod || ""
  const subtotal = d.subtotal ?? 0
  const shipping = d.shipping ?? 0
  const discount = d.discount ?? 0
  const discountPercent = d.discountPercent ?? 0
  const total = d.total ?? 0
  const couponCode = d.couponCode || ""
  const rewardPointsEarned = d.rewardPointsEarned ?? 0
  const shippingAddress = d.shippingAddress || {}

  const estimatedDelivery = d.estimatedDelivery
    ? new Date(d.estimatedDelivery)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit",
    })
  }

  const paymentLabel = paymentMethod === "CASH_ON_DELIVERY"
    ? "Cash on Delivery"
    : paymentMethod === "SSLCO"
      ? "Card / Mobile Banking"
      : paymentMethod

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  }

  const successIconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 15, delay: 0.3 } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn("container mx-auto px-4 py-8 max-w-4xl", styles.bg)}
    >
      <motion.div
        variants={itemVariants}
        className={cn("rounded-2xl border backdrop-blur-sm", styles.card, "p-6 md:p-8 transition-colors duration-500")}
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            variants={successIconVariants}
            className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full mb-4", styles.successBg)}
          >
            <CheckCircle size={32} className={styles.successIcon} />
          </motion.div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", styles.text)}>
            Order Confirmed!
          </h1>
          <p className={cn("mt-2", styles.textMuted)}>
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants} className={cn("p-4 rounded-xl border", styles.summaryBg, styles.border)}>
            <h2 className={cn("font-medium mb-2", styles.text)}>Order Information</h2>
            <div className="space-y-2 text-sm">
              {orderNumber && (
                <div className="flex items-center gap-2">
                  <Package size={14} className={styles.textMutedLighter} />
                  <span className={styles.textMutedLighter}>Order:</span>
                  <span className={cn("font-mono font-medium", styles.text)}>{orderNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={14} className={styles.textMutedLighter} />
                <span className={styles.textMutedLighter}>Date:</span>
                <span className={styles.textMuted}>{formatDate(orderDate)}</span>
              </div>
              {orderDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} className={styles.textMutedLighter} />
                  <span className={styles.textMutedLighter}>Time:</span>
                  <span className={styles.textMuted}>{formatTime(orderDate)}</span>
                </div>
              )}
              <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1", isDark ? "bg-[#007C74]/20 text-[#007C74]" : "bg-[#007C74]/10 text-[#007C74]")}>
                <span>{status}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <CreditCard size={14} className={styles.textMutedLighter} />
                <span className={styles.textMutedLighter}>Payment:</span>
                <span className={styles.textMuted}>{paymentLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className={styles.textMutedLighter} />
                <span className={styles.textMutedLighter}>Delivery:</span>
                <span className={styles.textMuted}>{formatDate(estimatedDelivery.toISOString())}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={cn("p-4 rounded-xl border", styles.summaryBg, styles.border)}>
            <h2 className={cn("font-medium mb-2 flex items-center gap-2", styles.text)}>
              <MapPin size={14} className={styles.textMutedLighter} />
              Shipping Address
            </h2>
            <div className={cn("space-y-1 text-sm", styles.textMuted)}>
              <p className={cn("font-medium", styles.text)}>
                {shippingAddress.firstName || shippingAddress.name?.split(" ")[0] || ""}{" "}
                {shippingAddress.lastName || shippingAddress.name?.split(" ").slice(1).join(" ") || ""}
              </p>
              <p>{shippingAddress.street || shippingAddress.address || ""}</p>
              <p>
                {[shippingAddress.city, shippingAddress.state, shippingAddress.zipCode].filter(Boolean).join(", ")}
              </p>
              <p>{shippingAddress.country || ""}</p>
              {shippingAddress.phone && <p className="mt-1">Phone: {shippingAddress.phone}</p>}
            </div>
          </motion.div>
        </div>

        {/* Rewards & Coupon */}
        {(couponCode || rewardPointsEarned > 0) && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {couponCode && (
              <div className={cn("p-4 rounded-xl border flex items-center gap-3", isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-100")}>
                <BadgePercent size={20} className="text-purple-500 shrink-0" />
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-purple-300" : "text-purple-800")}>Coupon Applied</p>
                  <p className={cn("text-xs", isDark ? "text-purple-300/80" : "text-purple-600/80")}>
                    {couponCode} {discountPercent > 0 && `(${discountPercent}% off)`}
                  </p>
                </div>
              </div>
            )}
            {rewardPointsEarned > 0 && (
              <div className={cn("p-4 rounded-xl border flex items-center gap-3", isDark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-100")}>
                <Gift size={20} className="text-amber-500 shrink-0" />
                <div>
                  <p className={cn("text-sm font-medium", isDark ? "text-amber-300" : "text-amber-800")}>Rewards Earned</p>
                  <p className={cn("text-xs", isDark ? "text-amber-300/80" : "text-amber-600/80")}>
                    +{rewardPointsEarned} reward points
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className={cn("font-medium mb-4", styles.text)}>Order Summary</h2>
          <div className={cn("border rounded-xl overflow-hidden", styles.border)}>
            <div className={cn("divide-y", styles.divider)}>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  custom={index}
                  className={cn("flex items-center p-4", styles.summaryBg)}
                >
                  <div className={cn("relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden", styles.summaryBg)}>
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className={cn("text-sm font-medium", styles.text)}>{item.name}</h4>
                    <p className={cn("text-xs", styles.textMutedLighter)}>
                      {item.colorName && `Color: ${item.colorName}`}
                      {item.size && ` \u2022 Size: ${item.size}`}
                      {` \u2022 Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-medium", styles.text)}>
                      ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={cn("p-4 border-t", styles.summaryBg, styles.border)}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={styles.textMutedLighter}>Subtotal</span>
                  <span className={styles.textMuted}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={styles.textMutedLighter}>Shipping</span>
                  <span className={styles.textMuted}>${shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={styles.textMutedLighter}>Discount</span>
                    <span className="text-green-500">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={cn("border-t pt-2 mt-2", styles.divider)}>
                  <div className="flex justify-between font-medium">
                    <span className={styles.text}>Total</span>
                    <span className={styles.text}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping Info */}
        <motion.div variants={itemVariants} className={cn("p-4 rounded-xl border flex items-start gap-3 mb-8", styles.infoBox)}>
          <Truck size={20} className={cn("shrink-0 mt-0.5", styles.infoText)} />
          <div>
            <h3 className={cn("font-medium", styles.infoTitle)}>Shipping Information</h3>
            <p className={cn("text-sm mt-1", styles.infoText)}>
              You will receive an email with tracking information once your order ships.
            </p>
            <p className={cn("text-sm mt-1", styles.infoText)}>
              For any questions, contact{" "}
              <a href="mailto:support@glassophite.com" className="underline hover:no-underline">
                support@glassophite.com
              </a>
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline" className={styles.buttonSecondary}>
            <Link href="/my-profile/order-history">View Order History</Link>
          </Button>
          <Button asChild className={styles.buttonPrimary}>
            <Link href="/products" className="flex items-center">
              <span>Continue Shopping</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
