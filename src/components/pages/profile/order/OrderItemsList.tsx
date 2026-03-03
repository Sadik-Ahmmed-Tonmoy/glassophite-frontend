"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ChevronDown, ShoppingCart, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOrderItem } from "@/types/types";

interface OrderItemsListProps {
  items: TOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [showBuyAgainSuccess, setShowBuyAgainSuccess] = useState<string | null>(null);

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-black border-white/10",
      headerText: "text-white",
      border: "border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      icon: "text-neutral-400 hover:text-white",
      summaryBg: "bg-white/5",
      buttonPrimary: "bg-primary/20 text-primary hover:bg-primary/30",
      buttonSecondary: "bg-white/10 text-neutral-300 hover:bg-white/20",
      success: "text-green-400",
      discount: "text-green-400",
      overlay: "bg-black/50",
    },
    light: {
      card: "bg-white border-gray-200",
      headerText: "text-gray-900",
      border: "border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      icon: "text-gray-500 hover:text-gray-700",
      summaryBg: "bg-gray-50",
      buttonPrimary: "bg-primary/10 text-primary hover:bg-primary/20",
      buttonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      success: "text-green-600",
      discount: "text-green-600",
      overlay: "bg-black/50",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const toggleOrderDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  const handleBuyAgain = async (itemId: string, itemName: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Item added to cart:", itemId);
      setShowBuyAgainSuccess(itemName);
      setTimeout(() => setShowBuyAgainSuccess(null), 3000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("There was an error adding this item to your cart. Please try again.");
    }
  };

  // Animation variants
  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("rounded-xl border shadow-sm overflow-hidden transition-colors duration-500", styles.card)}
    >
      <div
        className="flex items-center justify-between p-4 sm:p-6 cursor-pointer"
        onClick={toggleOrderDetails}
      >
        <h3 className={cn("text-lg font-medium", styles.headerText)} data-translate="order.itemsTitle">
          Order Items ({items.length})
        </h3>
        <motion.button
          className={styles.icon}
          animate={{ rotate: isDetailsExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isDetailsExpanded && (
          <motion.div
            key="content"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn("border-t", styles.border)}
          >
            <div className="divide-y" style={{ borderColor: styles.border }}>
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 relative rounded-md overflow-hidden bg-gray-100 dark:bg-white/5">
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
                        <h4 className={cn("text-md font-medium", styles.text)}>{item.name}</h4>
                        <p className={cn("mt-1 text-sm", styles.textMutedLighter)}>
                          {item.variant && `${item.variant} • `}
                          <span data-translate="order.sku">SKU</span>: {item.sku}
                        </p>
                        <p className={cn("mt-1 text-sm", styles.textMutedLighter)}>
                          <span data-translate="order.qty">Qty</span>: {item.quantity}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className={cn("text-md font-medium", styles.text)}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.originalPrice && item.originalPrice > item.price ? (
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <p className={cn("text-sm line-through", styles.textMutedLighter)}>
                              ${item.originalPrice.toFixed(2)}
                            </p>
                            <span className={cn("text-xs", styles.discount)}>
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        ) : (
                          <p className={cn("mt-1 text-sm", styles.textMutedLighter)}>
                            ${item.price.toFixed(2)} <span data-translate="order.each">each</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {status === "delivered" && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          className={cn("px-3 py-1 text-sm rounded-md transition-colors", styles.buttonPrimary)}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Write review logic
                          }}
                          data-translate="order.writeReview"
                        >
                          Write a Review
                        </button>
                        <button
                          className={cn("px-3 py-1 text-sm rounded-md transition-colors flex items-center", styles.buttonSecondary)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyAgain(item.id, item.name);
                          }}
                        >
                          <ShoppingCart size={14} className="mr-1.5" />
                          <span data-translate="order.buyAgain">Buy Again</span>
                        </button>

                        <AnimatePresence>
                          {showBuyAgainSuccess === item.name && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className={cn("ml-2 text-xs flex items-center", styles.success)}
                            >
                              <CheckIcon size={14} className="mr-1" />
                              <span data-translate="order.addedToCart">Added to cart!</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={cn("p-4 sm:p-6", styles.summaryBg)}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={styles.textMuted} data-translate="order.subtotal">Subtotal</span>
                  <span className={styles.text}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={styles.textMuted} data-translate="order.shipping">Shipping</span>
                  <span className={styles.text}>${shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={styles.textMuted} data-translate="order.discount">Discount</span>
                    <span className={cn(styles.discount)}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={styles.textMuted} data-translate="order.tax">Tax</span>
                    <span className={styles.text}>${tax.toFixed(2)}</span>
                  </div>
                )}
                <div className={cn("border-t pt-2 mt-2", styles.border)}>
                  <div className="flex justify-between font-medium">
                    <span className={styles.text} data-translate="order.total">Total</span>
                    <span className={styles.text}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}