"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import CartCoupon from "./CartCoupon";
import CartItem from "./CartItem";
import CartRewards from "./CartRewards";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import DeliveryInfo from "./DeliveryInfo";
import RecentlyViewed from "./RecentlyViewed";
import SavedItems from "./SavedItems";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetDeliverySettingsQuery } from "@/redux/features/order/orderApi";

interface AppliedCoupon {
  code: string;
  discount: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice, totalItems } = useCart()
  const router = useRouter()

  // Fetch delivery settings for shipping cost calculation
  const { data: deliveryData } = useGetDeliverySettingsQuery()
  const deliverySettings = deliveryData?.data

  // ── Coupon state ──────────────────────────────────────────────────────────
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  const couponDiscount = appliedCoupon
    ? totalPrice * (appliedCoupon.discount / 100)
    : 0

  // ── Reward points state ───────────────────────────────────────────────────
  const [rewardPointsApplied, setRewardPointsApplied] = useState(0)
  const POINT_RATE = deliverySettings?.rewardPointRate ?? 0.1
  const rewardDiscount = rewardPointsApplied * POINT_RATE

  // ── Free shipping check ───────────────────────────────────────────────────
  const freeShippingThreshold = deliverySettings?.freeShippingThreshold ?? 1000
  const shippingCost = totalPrice >= freeShippingThreshold
    ? 0
    : (deliverySettings?.standardCost ?? 5)

  const grandTotal = Math.max(0, totalPrice + shippingCost - couponDiscount - rewardDiscount)

  const handleProceed = () => {
    onClose()
    // Pass cart discount context via sessionStorage so checkout can pre-fill
    const cartContext = {
      couponCode: appliedCoupon?.code ?? null,
      couponDiscount,
      rewardPointsUsed: rewardPointsApplied,
      rewardDiscount,
    }
    sessionStorage.setItem("cart_checkout_context", JSON.stringify(cartContext))
    router.push("/checkout")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <DialogTitle></DialogTitle>

        <>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 z-10 flex items-center justify-between p-4 border-b dark:border-neutral-800">
              <button
                onClick={onClose}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <ChevronLeft size={20} className="mr-1" />
                <span className="font-medium">Continue Shopping</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Title */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-800/50">
              <h2 className="text-lg font-semibold">
                My Bag ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h2>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <div className="divide-y dark:divide-neutral-800">
                  {/* Cart Items */}
                  <div className="pb-2">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CartItem item={item} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Delivery Information */}
                  <DeliveryInfo />

                  {/* Saved Items */}
                  <SavedItems />

                  {/* Promotions */}
                  <div className="py-2">
                    <CartCoupon
                      appliedCoupon={appliedCoupon}
                      onApply={setAppliedCoupon}
                      onRemove={() => setAppliedCoupon(null)}
                    />
                    <CartRewards
                      pointsApplied={rewardPointsApplied}
                      onApply={setRewardPointsApplied}
                      onRemove={() => setRewardPointsApplied(0)}
                    />
                  </div>

                  {/* Order Summary */}
                  <CartSummary
                    subtotal={totalPrice}
                    shipping={shippingCost}
                    couponDiscount={couponDiscount}
                    couponCode={appliedCoupon?.code}
                    rewardDiscount={rewardDiscount}
                    rewardPointsUsed={rewardPointsApplied}
                  />

                  {/* Recently Viewed */}
                  <RecentlyViewed />
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Grand Total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">৳{grandTotal.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6"
                  onClick={handleProceed}
                >
                  <span className="mr-2">Proceed</span>
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      </SheetContent>
    </Sheet>
  );
}
