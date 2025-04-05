"use client"

import { useState, useEffect } from "react"
import { Star, Heart } from "lucide-react"



import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageSlider from "./ImageSlider"
import ReviewSlider from "./ReviewSlider"
import VariantSelector from "./VariantSelector"
import { Badge } from "@/components/ui/Badge"
import { MyButton } from "@/components/ui/buttons/MyButton/MyButton"
import AddToCartButton from "@/components/ui/buttons/AddToCartButton/AddToCartButton"
import RequestStockButton from "@/components/ui/buttons/RequestStockButton/RequestStockButton"

interface Review {
  rating: number
  comment: string
}

interface ImageItem {
  image: string
  id: number
}

interface Variant {
  id: number
  title: string
  color: string
  priceAfterDiscount?: number
  mainPrice?: number
  discountPercent?: number
  inStock: boolean
  quantity: number
  productCode: string
  shortDescription: string
  imgList: ImageItem[]
}

interface Product {
  id: number
  shortDescription: string
  longDescription: string
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
  variants: Variant[]
}

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number>(product.variants[0]?.id || 0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlistActive, setIsWishlistActive] = useState(false)

  // Find the selected variant
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0]

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1)
  }, [selectedVariantId])

  const handleVariantChange = (variantId: number) => {
    setSelectedVariantId(variantId)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const toggleWishlist = () => {
    setIsWishlistActive(!isWishlistActive)
  }

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0

  if (!product || !selectedVariant) {
    return <div className="p-8 text-center">Product not found</div>
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="relative lg:col-span-5">
          <ImageSlider images={selectedVariant.imgList} inStock={selectedVariant.inStock} />

          {/* Wishlist Button */}
          <button
            className={`absolute top-4 right-4 z-30 bg-white/80 p-2 rounded-full hover:bg-white transition-all duration-300 ${
              isWishlistActive ? "scale-110" : "scale-100"
            }`}
            onClick={toggleWishlist}
            aria-label={isWishlistActive ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlistActive ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </button>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{selectedVariant.title}</h1>
              {!selectedVariant.inStock ? (
                <Badge variant="destructive" className="text-sm">
                  Out of Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-sm border-green-500 text-green-600">
                  {selectedVariant.quantity <= 5 ? `Only ${selectedVariant.quantity} left!` : "In Stock"}
                </Badge>
              )}
            </div>
            <p className="text-gray-500 mt-2">{selectedVariant.shortDescription}</p>

            <div className="flex items-center mt-4 space-x-2">
              {product.reviews.length > 0 && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">({product.reviews.length} reviews)</span>
                </div>
              )}
              <span className="text-sm text-gray-500">SKU: {selectedVariant.productCode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {selectedVariant.priceAfterDiscount && selectedVariant.mainPrice ? (
              <>
                <span className="text-2xl font-bold text-green-600">${selectedVariant.priceAfterDiscount}</span>
                <span className="text-gray-500 line-through">${selectedVariant.mainPrice}</span>
                {selectedVariant.discountPercent && (
                  <Badge className="bg-green-500 hover:bg-green-600">{selectedVariant.discountPercent}% OFF</Badge>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold">Price not available</span>
            )}
          </div>

          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={handleVariantChange}
          />

          <div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <MyButton
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={!selectedVariant.inStock || quantity <= 1}
                >
                  -
                </MyButton>
                <span className="w-10 text-center">{quantity}</span>
                <MyButton
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={!selectedVariant.inStock || quantity >= selectedVariant.quantity}
                >
                  +
                </MyButton>
              </div>
              {!selectedVariant.inStock ? (
                // <MyButton className="flex-1 bg-amber-500 hover:bg-amber-600">Request Stock</MyButton>
                <RequestStockButton/>
              ) : (
                // <MyButton className="flex-1 bg-green-600 hover:bg-green-700">Add to Cart</MyButton>
                <AddToCartButton />
              )}
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="description">
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
          </Tabs>
        </div>
      </div>
    </div>
  )
}

