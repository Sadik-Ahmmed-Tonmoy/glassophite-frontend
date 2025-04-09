"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"

interface Review {
  rating: number
  comment: string
}

interface Product {
  img: string
  title: string
  shortDescription: string
  longDescription: string
  color: string
  priceAfterDiscount?: number
  mainPrice?: number
  discountPercent?: number
  inStock: boolean
  quantity: number
  productCode: string
  brand: string
  material: string
  dimensions: string
  weight: string
  shippingInfo: string
  frameType: string
  lensType: string
  warranty: string
  countryOfOrigin: string
  targetAudience: string
  careInstructions: string
  reviews: Review[]
  imgList: string[]
}

interface SimilarProductsProps {
  currentProduct: Product
  allProducts: Product[]
  currentIndex: number
}

export default function SimilarProducts({ currentProduct, allProducts, currentIndex }: SimilarProductsProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Filter out the current product and find similar products
  // Products are considered similar if they have the same frame type, brand, or material
  const similarProducts = allProducts
    .map((product, index) => ({ product, index }))
    .filter(
      ({ product, index }) =>
        index !== currentIndex &&
        (product.frameType === currentProduct.frameType ||
          product.brand === currentProduct.brand ||
          product.material === currentProduct.material),
    )

  // If no similar products, show other products
  const productsToShow =
    similarProducts.length > 0
      ? similarProducts
      : allProducts.map((product, index) => ({ product, index })).filter(({ index }) => index !== currentIndex)

  const scrollLeft = () => {
    const container = document.getElementById("similar-products-container")
    if (container) {
      const newPosition = Math.max(scrollPosition - 300, 0)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("similar-products-container")
    if (container) {
      const newPosition = Math.min(scrollPosition + 300, container.scrollWidth - container.clientWidth)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  if (productsToShow.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Similar Products</h2>
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
        id="similar-products-container"
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {productsToShow.map(({ product, index }) => (
          <div key={index} className="min-w-[250px] max-w-[250px]">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}
