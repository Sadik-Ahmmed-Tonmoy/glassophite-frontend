"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function RecentlyViewed() {
  const { recentlyViewed } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)

  // Don't render anything if there are no recently viewed items
  if (!recentlyViewed || recentlyViewed.length === 0) return null

  return (
    <div className="px-4 py-3 border-t">
      <div className="mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold">Recently Viewed</h3>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 py-2">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group relative rounded-md overflow-hidden bg-gray-100 aspect-square"
                >
                  <Image
                    src={item.image || "/placeholder.svg?height=120&width=120"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 text-gray-800 px-2 py-1 rounded-md text-xs flex items-center">
                      <Eye size={12} className="mr-1" />
                      View
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-white text-xs truncate">{item.name}</p>
                    <p className="text-white/80 text-xs">
                      {item.discountPrice ? (
                        <>
                          <span className="font-medium">₹{item.discountPrice}</span>
                          <span className="ml-1 line-through">₹{item.price}</span>
                        </>
                      ) : (
                        <span>₹{item.price}</span>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
