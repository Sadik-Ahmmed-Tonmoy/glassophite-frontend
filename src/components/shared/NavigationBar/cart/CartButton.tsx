"use client"

import { ShoppingBag } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CartDrawer from "./CartDrawer"
import { useCart } from "@/hooks/use-cart"

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 relative"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-5 w-5 text-gray-700" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
