"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"

interface Product {
  img: string
  title: string
  shortDescription: string
  color: string
  priceAfterDiscount?: number
  mainPrice?: number
  discountPercent?: number
  inStock: boolean
  reviews: Review[]
}

interface Review {
  rating: number
  comment: string
}

interface YouMightLikeProps {
  products: Product[]
  currentIndex: number
}

export default function YouMightLike({ products, currentIndex }: YouMightLikeProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [shuffledProducts, setShuffledProducts] = useState<{ product: Product; index: number }[]>([])

  // Shuffle products on component mount
  useEffect(() => {
    const filteredProducts = products
      .map((product, index) => ({ product, index }))
      .filter(({ index }) => index !== currentIndex)

    // Fisher-Yates shuffle algorithm
    const shuffled = [...filteredProducts]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setShuffledProducts(shuffled)
  }, [products, currentIndex])

  const scrollLeft = () => {
    const container = document.getElementById("you-might-like-container")
    if (container) {
      const newPosition = Math.max(scrollPosition - 300, 0)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("you-might-like-container")
    if (container) {
      const newPosition = Math.min(scrollPosition + 300, container.scrollWidth - container.clientWidth)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  if (shuffledProducts.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">You Might Also Like</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id="you-might-like-container"
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {shuffledProducts.map(({ product, index }) => (
          <div key={index} className="min-w-[250px] max-w-[250px]">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}
