"use client";

import CartCoupon from "@/components/shared/NavigationBar/cart/CartCoupon";
import type { CartItem } from "@/hooks/use-cart";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon?: () => void;
}

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  discount,
  total,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
}: CheckoutSummaryProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);

  const reduxCoupon = useAppSelector((state) => state.checkout.coupon)
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
      input:
        "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      buttonPrimary:
        "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      buttonOutline: "border-white/20 text-white hover:bg-white/10",
      couponApplied: "bg-green-500/20 border-green-500/30 text-green-500",
      couponText: "text-green-400",
      infoBg: "bg-white/5",
      footerBg: "bg-white/5 border-white/10",
      icon: "text-neutral-400",
      successIcon: "text-green-400",
      discountText: "text-green-400",
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
      input:
        "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400",
      label: "text-neutral-700",
      buttonPrimary:
        "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
      buttonOutline: "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
      couponApplied: "bg-green-50 border-green-200 text-green-800",
      couponText: "text-green-600",
      infoBg: "bg-gray-50",
      footerBg: "bg-gray-50 border-gray-200",
      icon: "text-gray-400",
      successIcon: "text-green-600",
      discountText: "text-green-600",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, type: "spring" as const, stiffness: 100 },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl border ${styles.card} backdrop-blur-sm shadow-sm sticky top-4 transition-colors duration-500`}
    >
      <div className="p-6">
        <h2
          className={`text-xl font-semibold ${styles.text} mb-4`}
          data-translate="checkout.summaryTitle"
        >
          Order Summary
        </h2>

        {/* Items Summary */}
        <div className="mb-6">
          <button
            className={`flex items-center justify-between w-full text-left mb-3 ${styles.textMuted} hover:${styles.text} transition-colors`}
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
          >
            <span className="font-medium" data-translate="checkout.itemsCount">
              Items ({items.length})
            </span>
            {isItemsExpanded ? (
              <ChevronUp size={18} className={styles.icon} />
            ) : (
              <ChevronDown size={18} className={styles.icon} />
            )}
          </button>

          <AnimatePresence>
            {isItemsExpanded && (
              <motion.div
                variants={expandVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4 mt-3 max-h-60 overflow-y-auto pr-2"
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="flex items-center"
                  >
                    <div
                      className={`relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden ${styles.infoBg}`}
                    >
                      <Image
                        src={
                          item.image || "/placeholder.svg?height=48&width=48"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${styles.text} truncate`}
                      >
                        {item.name}
                      </p>
                      <p className={`text-xs ${styles.textMutedLighter}`}>
                        <span data-translate="checkout.qty">Qty</span>:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${styles.text}`}>
                      $
                      {(
                        (item.discountPrice || item.price) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Coupon Code */}
          <CartCoupon
            appliedCoupon={reduxCoupon}
            onApply={(coupon) => {
              onApplyCoupon(coupon.code);
            }}
            onRemove={onRemoveCoupon || (() => {})}
          />

        {/* Price Breakdown */}
        <div className={`space-y-2 text-sm border-t ${styles.border} pt-4`}>
          <div className="flex justify-between">
            <span
              className={styles.textMuted}
              data-translate="checkout.subtotal"
            >
              Subtotal
            </span>
            <span className={styles.text}>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span
              className={styles.textMuted}
              data-translate="checkout.shipping"
            >
              Shipping
            </span>
            <span className={styles.text}>৳{shipping.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between">
              <span
                className={styles.textMuted}
                data-translate="checkout.discount"
              >
                Discount
              </span>
              <span className={styles.discountText}>
                -৳{discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className={`border-t ${styles.border} pt-2 mt-2`}>
            <div className="flex justify-between font-medium">
              <span className={styles.text} data-translate="checkout.total">
                Total
              </span>
              <span className={styles.text}>৳{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-b-lg border-t ${styles.footerBg}`}>
        <p
          className={`text-xs ${styles.textMutedLighter} mb-4`}
          data-translate="checkout.terms"
        >
          By placing your order, you agree to our Terms of Service and Privacy
          Policy. Your payment information is processed securely.
        </p>
        <div className="text-center text-xs font-semibold text-[#007C74] dark:text-[#3C55A5]">
          Secured by SSL Commerz Payment Gateway
        </div>
      </div>
    </motion.div>
  );
}
