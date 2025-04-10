"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface EmptyCartProps {
  onClose: () => void
}

export default function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 h-full"
    >
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <ShoppingBag size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Your bag is empty</h3>
      <p className="text-gray-500 text-center mb-6">Looks like you haven&apos;t added any products to your bag yet.</p>
      <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
        Continue Shopping
      </Button>
    </motion.div>
  )
}
