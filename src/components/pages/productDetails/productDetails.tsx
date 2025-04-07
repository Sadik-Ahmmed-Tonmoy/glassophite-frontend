"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import AddToCartButton from "@/components/ui/buttons/AddToCartButton/AddToCartButton";
import { MyButton } from "@/components/ui/buttons/MyButton/MyButton";
import RequestStockButton from "@/components/ui/buttons/RequestStockButton/RequestStockButton";
import WishlistButton from "@/components/ui/buttons/WishlistButton/WishlistButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageSlider from "./ImageSlider";
import VariantSelector from "./VariantSelector";
import SimilarProducts from "./SimilarProducts/SimilarProducts";
import { productMockData, productsMockDataList, reviewsData } from "@/lib/productMockData";
import { cn } from "@/lib/utils";
import ProductReview from "./ProductReview";
import { TProduct } from "@/types/types";







interface ProductDetailsProps {
  product: TProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number>(product.variants[0]?.id || 0);
  const [quantity, setQuantity] = useState(1);

  // Find the selected variant
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0];

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariantId]);

  const handleVariantChange = (variantId: number) => {
    setSelectedVariantId(variantId);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity(quantity + 1);
    }
  };

  // Calculate average rating
  // const avgRating = product.reviews.length > 0 ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length : 0;

  if (!product || !selectedVariant) {
    return <div className="p-8 text-center">Product not found</div>;
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="relative lg:col-span-5">
          <ImageSlider images={selectedVariant.imgList} inStock={selectedVariant.inStock} />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{selectedVariant.title}</h1>
              {!selectedVariant.inStock ? (
                <Badge variant="destructive" className="text-sm text-red-500 border-red-500">
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
              {product.averageRating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product?.averageRating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">({product?.averageRating} reviews)</span>
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
                {selectedVariant.discountPercent && <Badge className="bg-green-500 hover:bg-green-600">{selectedVariant.discountPercent}% OFF</Badge>}
              </>
            ) : (
              <span className="text-2xl font-bold">Price not available</span>
            )}
          </div>

          <VariantSelector variants={product.variants} selectedVariantId={selectedVariantId} onSelectVariant={handleVariantChange} />

          <div>
            <div className="flex flex-col xs:flex-row sm:items-center gap-4 ">
              <div className={cn("flex items-center border rounded-md w-fit",
                selectedVariant.inStock ? "flex" : "hidden",
              )}>
                <MyButton variant="ghost" size="icon" onClick={decreaseQuantity} disabled={!selectedVariant.inStock || quantity <= 1}>
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
             <div className="flex-1 flex items-center space-x-2 sm:space-x-4">
             {!selectedVariant.inStock ? (
                // <MyButton className="flex-1 bg-amber-500 hover:bg-amber-600">Request Stock</MyButton>
                <RequestStockButton />
              ) : (
                // <MyButton className="flex-1 bg-green-600 hover:bg-green-700">Add to Cart</MyButton>
                <AddToCartButton />
              )}
              <WishlistButton />
             </div>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="specifications">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <p>{product.longDescription}</p>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* <TabsContent value="reviews" className="mt-4">
              <ReviewSlider reviews={product.reviews} />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
      <SimilarProducts allProducts={productsMockDataList} currentProduct={ productMockData}/>
         {/* Reviews Section */}
         <div className="mt-8 md:mt-16">
        <ProductReview productId={product.id} initialReviews={reviewsData} />
      </div>
    </div>
  );
}
