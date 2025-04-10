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

// Import the new components
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import DeliveryInfo from "./DeliveryInfo";
import RecentlyViewed from "./RecentlyViewed";
import SavedItems from "./SavedItems";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice, totalItems } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}  >
      <SheetContent >
        {/* <SheetHeader > */}
          <DialogTitle></DialogTitle>
         
          <>
         

         
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
             
              // className=" h-screen shadow-2xl w-full sm:w-[450px] bg-white z-50 flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
                <button
                  onClick={onClose}
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  <span className="font-medium">Continue Shopping</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Title */}
              <div className="px-4 py-3 bg-gray-50">
                <h2 className="text-lg font-semibold">
                  My Bag ({totalItems} items)
                </h2>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <EmptyCart onClose={onClose} />
                ) : (
                  <div className="divide-y">
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
                      <CartCoupon />
                      <CartRewards points={550} />
                    </div>

                    {/* Order Summary */}
                    <CartSummary subtotal={totalPrice} />

                    {/* Recently Viewed */}
                    <RecentlyViewed />
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t bg-white">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6"
                    onClick={() => console.log("Proceed to checkout")}
                  >
                    <span className="mr-2">Proceed</span>
                    <ChevronRight size={18} />
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        {/* </SheetHeader> */}
      </SheetContent>
    </Sheet>
  );
}
