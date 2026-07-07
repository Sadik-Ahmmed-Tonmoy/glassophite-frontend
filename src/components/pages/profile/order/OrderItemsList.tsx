"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ShoppingCart, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TOrderItem } from "@/types/types";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { toast } from "sonner";

interface OrderItemsListProps {
  items: TOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
}

const getItemImage = (item: TOrderItem) => {
  if (!item.image) return "/placeholder.svg?height=80&width=80";
  try {
    const parsed = JSON.parse(item.image);
    return parsed?.image || item.image;
  } catch {
    return item.image;
  }
};

export default function OrderItemsList({ items, subtotal, shipping, discount, total, status }: OrderItemsListProps) {
  const { isDark, theme: styles } = useProfileTheme();
  const [expanded, setExpanded] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleBuyAgain = (itemId: string, itemName: string) => {
    setAddedItem(itemName);
    toast.success(`${itemName} added to cart!`);
    setTimeout(() => setAddedItem(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("rounded-2xl border shadow-sm overflow-hidden transition-all duration-500", styles.card, styles.cardGlow)}
    >
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full p-4 sm:p-6 text-left">
        <h3 className={cn("text-lg font-semibold", styles.text)}>Order Items ({items.length})</h3>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }} className={styles.icon}>
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn("border-t divide-y", isDark ? "border-white/[0.04] divide-white/[0.04]" : "border-gray-100 divide-gray-100")}>
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="shrink-0 w-full sm:w-20 h-20 relative rounded-xl overflow-hidden border dark:border-white/[0.06] bg-gray-100 dark:bg-white/[0.04]">
                    <Image src={getItemImage(item)} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className={cn("text-base font-semibold truncate", styles.text)}>{item.name}</h4>
                        <p className={cn("mt-0.5 text-xs", styles.textMutedLighter)}>
                          {item.variant && `${item.variant} • `}SKU: {item.sku} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className={cn("text-base font-bold", styles.text)}>${(item.price * item.quantity).toFixed(2)}</p>
                        {item.originalPrice && item.originalPrice > item.price ? (
                          <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                            <span className={cn("text-xs line-through", styles.textMutedLighter)}>${item.originalPrice.toFixed(2)}</span>
                            <span className="text-[11px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                              -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                            </span>
                          </div>
                        ) : (
                          <p className={cn("mt-0.5 text-xs", styles.textMutedLighter)}>${item.price.toFixed(2)} each</p>
                        )}
                      </div>
                    </div>

                    {status === "delivered" && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-[#007C74]/10 to-[#3C55A5]/10 text-[#007C74] hover:from-[#007C74]/20 hover:to-[#3C55A5]/20 transition-all"
                          onClick={(e) => { e.stopPropagation(); toast.info("Review feature coming soon!"); }}
                        >
                          <Star size={13} /> Write a Review
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border dark:border-white/[0.06] dark:text-neutral-300 dark:hover:bg-white/[0.06] border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
                          onClick={(e) => { e.stopPropagation(); handleBuyAgain(item.id, item.name); }}
                        >
                          <ShoppingCart size={13} /> Buy Again
                        </button>
                        <AnimatePresence>
                          {addedItem === item.name && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="text-xs flex items-center gap-1 text-green-500"
                            >
                              <Check size={13} /> Added to cart!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={cn("p-4 sm:p-6 border-t", isDark ? "bg-white/[0.02] border-white/[0.04]" : "bg-gray-50/50 border-gray-100")}>
              {[
                { label: "Subtotal", value: subtotal },
                { label: "Shipping", value: shipping },
                ...(discount > 0 ? [{ label: "Discount", value: -discount, isDiscount: true as const }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm py-1">
                  <span className={styles.textMuted}>{row.label}</span>
                  <span className={cn(styles.text, row.isDiscount && "text-green-500")}>
                    {row.isDiscount ? "-" : ""}${Math.abs(row.value).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className={cn("flex justify-between font-bold text-base pt-3 mt-3 border-t", isDark ? "border-white/[0.06]" : "border-gray-200")}>
                <span className={styles.text}>Total</span>
                <span className={styles.text}>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}