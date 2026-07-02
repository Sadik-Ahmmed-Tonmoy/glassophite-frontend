import Image from "next/image"
import Link from "next/link"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { TProduct } from "@/types/types"
import { Badge } from "@nextui-org/react"
import { Star } from "lucide-react"

interface ProductCardProps {
  product: TProduct
  index?: number
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate average rating from reviews array or use precomputed averageRating
  const reviews = product.reviews ?? []
  const avgRating =
    product.averageRating ??
    (reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0)

  const reviewCount = product.totalReviews ?? reviews.length

  // Get display price from top-level fields (legacy/mock) or first variant
  const firstVariant = product.variants?.[0]
  const displayPrice = product.priceAfterDiscount ?? firstVariant?.priceAfterDiscount
  const originalPrice = product.mainPrice ?? firstVariant?.mainPrice
  const displayImage = product.img ?? firstVariant?.imgList?.[0]?.image ?? "/placeholder.svg?height=256&width=256"
  const displayColor = product.color ?? firstVariant?.color
  const discount = product.discountPercent ?? firstVariant?.discountPercent
  const inStock = product.inStock ?? (firstVariant?.inStock ?? true)

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {discount && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              {discount}% OFF
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="text-white border-white">
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
              <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div>
            {displayPrice && originalPrice ? (
              <div className="flex items-center space-x-2">
                <span className="font-bold">${displayPrice}</span>
                <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
              </div>
            ) : (
              <span className="font-bold">Price not available</span>
            )}
          </div>
          {displayColor && (
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: displayColor }} />
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
