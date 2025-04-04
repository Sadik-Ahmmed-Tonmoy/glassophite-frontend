"use client"

import { useState } from "react"
import { Badge, SeparatorHorizontal, Star } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageSlider from "./ImageSlider"
import YouMightLike from "./YouMightLike"
import SimilarProducts from "./SimilarProducts"

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

interface ProductDetailsProps {
  product: Product
  allProducts: Product[]
  currentIndex: number
}

export default function ProductDetails({ product, allProducts = [], currentIndex = 0 }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.quantity || !product.inStock) {
      setQuantity(quantity + 1)
    }
  }

  // Calculate average rating
  const avgRating =
    product?.reviews?.length > 0
      ? product?.reviews?.reduce((acc, review) => acc + review.rating, 0) / product?.reviews?.length
      : 0

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ImageSlider images={product?.imgList} />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product?.title}</h1>
            <p className="text-gray-500 mt-2">{product?.shortDescription}</p>

            <div className="flex items-center mt-4 space-x-2">
              {product?.reviews?.length > 0 && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">({product?.reviews?.length} reviews)</span>
                </div>
              )}
              <span className="text-sm text-gray-500">Product Code: {product?.productCode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {product?.priceAfterDiscount && product?.mainPrice ? (
              <>
                <span className="text-2xl font-bold">${product?.priceAfterDiscount}</span>
                <span className="text-gray-500 line-through">${product?.mainPrice}</span>
                {product?.discountPercent && (
                  <Badge className="bg-green-500 hover:bg-green-600">{product?.discountPercent}% OFF</Badge>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold">Price not available</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: product?.color }}></div>
            <span>Color</span>
          </div>

          <div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decreaseQuantity}
                  disabled={!product?.inStock || quantity <= 1}
                >
                  -
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={!product?.inStock || quantity >= product?.quantity}
                >
                  +
                </button>
              </div>
              <button className="flex-1" disabled={!product?.inStock}>
                {product?.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            <div className="mt-4">
              <Badge  className="text-sm">
                {product?.inStock ? `In Stock (${product?.quantity} available)` : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <SeparatorHorizontal />

          {/* <Tabs defaultValue="description">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <p>{product.longDescription}</p>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Brand:</span> {product.brand}
                  </div>
                  <div>
                    <span className="font-semibold">Material:</span> {product.material}
                  </div>
                  <div>
                    <span className="font-semibold">Dimensions:</span> {product.dimensions}
                  </div>
                  <div>
                    <span className="font-semibold">Weight:</span> {product.weight}
                  </div>
                  <div>
                    <span className="font-semibold">Frame Type:</span> {product.frameType}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Lens Type:</span> {product.lensType}
                  </div>
                  <div>
                    <span className="font-semibold">Warranty:</span> {product.warranty}
                  </div>
                  <div>
                    <span className="font-semibold">Country of Origin:</span> {product.countryOfOrigin}
                  </div>
                  <div>
                    <span className="font-semibold">Target Audience:</span> {product.targetAudience}
                  </div>
                  <div>
                    <span className="font-semibold">Shipping:</span> {product.shippingInfo}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-semibold">Care Instructions:</span> {product.careInstructions}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <ReviewSlider reviews={product.reviews} />
            </TabsContent>
          </Tabs> */}
        </div>
      </div>
      {allProducts?.length > 0 && (
        <>
          <SimilarProducts currentProduct={product} allProducts={allProducts} currentIndex={currentIndex} />

          <YouMightLike products={allProducts} currentIndex={currentIndex} />
        </>
      )}
      
    </div>
  )
}

