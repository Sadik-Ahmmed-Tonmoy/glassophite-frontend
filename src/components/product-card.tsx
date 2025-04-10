import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Badge } from "./ui/Badge"

interface Review {
  rating: number
  comment: string
}

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

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0

  return (
    <Link href={`/products/${index}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={product.img || "/placeholder.svg?height=256&width=256"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {product.discountPercent && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              {product.discountPercent}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="outline" className="text-white border-white">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="pt-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.shortDescription}</p>

          {avgRating > 0 && (
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">({product.reviews.length})</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div>
            {product.priceAfterDiscount && product.mainPrice ? (
              <div className="flex items-center space-x-2">
                <span className="font-bold">${product.priceAfterDiscount}</span>
                <span className="text-sm text-gray-500 line-through">${product.mainPrice}</span>
              </div>
            ) : (
              <span className="font-bold">Price not available</span>
            )}
          </div>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }}></div>
        </CardFooter>
      </Card>
    </Link>
  )
}
