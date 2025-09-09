"use client";


import AddToCartButton from "@/components/ui/buttons/AddToCartButton/AddToCartButton";
import { MyButton } from "@/components/ui/buttons/MyButton/MyButton";
import RequestStockButton from "@/components/ui/buttons/RequestStockButton/RequestStockButton";
import WishlistButton from "@/components/ui/buttons/WishlistButton/WishlistButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import {
  mockProducts,
  productMockData,
  reviewsData,
} from "@/lib/productMockData";
import { cn } from "@/lib/utils";
import { TProduct } from "@/types/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import ProductReview from "./ProductReview";
import SimilarProducts from "./SimilarProducts/SimilarProducts";
import VariantSelector from "./VariantSelector";
import { Badge } from "@nextui-org/react";

interface ProductDetailsProps {
  product: TProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { items } = useCart();
  const selectedItemFormCart = items.find((item) => item.id == product.id);
  console.log(selectedItemFormCart, items, product.id);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (selectedItemFormCart) {
      setQuantity(selectedItemFormCart.quantity);
    } else {
      setQuantity(1);
    }
  }, [selectedItemFormCart]);

  // Find the selected variant
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ||
    product.variants[0];

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariantId]);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // const handleQuantityChange = (newQuantity: number) => {
  //   console.log(newQuantity, selectedVariant.quantity);
  //   if (newQuantity < 1) return;
  //   if (newQuantity > selectedVariant.quantity) return;
  //   updateItemQuantity(selectedVariant.id, newQuantity);
  // };

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
          <ImageSlider
            images={selectedVariant.imgList}
            inStock={selectedVariant.inStock}
          />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{selectedVariant.title}</h1>
              {!selectedVariant.inStock ? (
                <Badge
                  // variant="destructive"
                  className="text-sm text-red-500 border-red-500"
                >
                  Out of Stock
                </Badge>
              ) : (
                <Badge
                  // variant="outline"
                  className="text-sm border-green-500 text-green-600"
                >
                  {selectedVariant.quantity <= 5
                    ? `Only ${selectedVariant.quantity} left!`
                    : "In Stock"}
                </Badge>
              )}
            </div>
            <p className="text-gray-500 mt-2">
              {selectedVariant.shortDescription}
            </p>

            <div className="flex items-center mt-4 space-x-2">
              {product.averageRating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product?.averageRating ?? 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({product?.averageRating} reviews)
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-500">
                SKU: {selectedVariant.productCode}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {selectedVariant.priceAfterDiscount && selectedVariant.mainPrice ? (
              <>
                <span className="text-2xl font-bold text-green-600">
                  ${selectedVariant.priceAfterDiscount}
                </span>
                <span className="text-gray-500 line-through">
                  ${selectedVariant.mainPrice}
                </span>
                {selectedVariant.discountPercent && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {selectedVariant.discountPercent}% OFF
                  </Badge>
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
            <div className="flex flex-col xs:flex-row sm:items-center gap-4 ">
              <div
                className={cn(
                  "flex items-center border rounded-md w-fit",
                  selectedVariant.inStock ? "flex" : "hidden"
                )}
              >
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
                  disabled={
                    !selectedVariant.inStock ||
                    quantity >= selectedVariant.quantity
                  }
                >
                  +
                </MyButton>
              </div>

              {/* <div className="flex items-center border rounded-md py-[9px]">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      (selectedItemFormCart?.quantity ?? 1) - 1
                    )
                  }
                  disabled={
                    !selectedItemFormCart || selectedItemFormCart.quantity <= 1
                  }
                  className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm">
                  {selectedItemFormCart?.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      (selectedItemFormCart?.quantity ?? 0) + 1
                    )
                  }
                  // disabled={item.quantity >= selectedVariant.maxQuantity}
                  className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div> */}

              <div className="flex-1 flex items-center space-x-2 sm:space-x-4">
                {!selectedVariant.inStock ? (
                  // <MyButton className="flex-1 bg-amber-500 hover:bg-amber-600">Request Stock</MyButton>
                  <RequestStockButton />
                ) : (
                  // <MyButton className="flex-1 bg-green-600 hover:bg-green-700">Add to Cart</MyButton>
                  // <AddToCartButton />
                  <AddToCartButton
                    product={{
                      id: selectedVariant?.id.toString() || "",
                      title: selectedVariant?.title || "",
                      brand: product.brand,
                      size: product.dimensions,
                      color: selectedVariant?.color,
                      colorName: selectedVariant?.title?.split(" ").pop() || "",
                      price: selectedVariant?.mainPrice || 0,
                      priceAfterDiscount: selectedVariant?.priceAfterDiscount,
                      inStock: selectedVariant?.inStock || false,
                      quantity: selectedVariant?.quantity || 0,
                      img:
                        selectedVariant?.imgList &&
                        selectedVariant.imgList.length > 0
                          ? selectedVariant.imgList[0].image
                          : undefined,
                    }}
                    cartQuantity={quantity}
                  />
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
                    <span className="font-semibold">Brand:</span>{" "}
                    {product.brand}
                  </div>
                  <div>
                    <span className="font-semibold">Material:</span>{" "}
                    {product.material}
                  </div>
                  <div>
                    <span className="font-semibold">Dimensions:</span>{" "}
                    {product.dimensions}
                  </div>
                  <div>
                    <span className="font-semibold">Weight:</span>{" "}
                    {product.weight}
                  </div>
                  <div>
                    <span className="font-semibold">Frame Type:</span>{" "}
                    {product.frameType}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Lens Type:</span>{" "}
                    {product.lensType}
                  </div>
                  <div>
                    <span className="font-semibold">Warranty:</span>{" "}
                    {product.warranty}
                  </div>
                  <div>
                    <span className="font-semibold">Country of Origin:</span>{" "}
                    {product.countryOfOrigin}
                  </div>
                  <div>
                    <span className="font-semibold">Target Audience:</span>{" "}
                    {product.targetAudience}
                  </div>
                  <div>
                    <span className="font-semibold">Shipping:</span>{" "}
                    {product.shippingInfo}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-semibold">Care Instructions:</span>{" "}
                {product.careInstructions}
              </div>
            </TabsContent>

            {/* <TabsContent value="reviews" className="mt-4">
              <ReviewSlider reviews={product.reviews} />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
      <SimilarProducts
        allProducts={mockProducts}
        currentProduct={productMockData}
      />
      {/* Reviews Section */}
      <div className="mt-8 md:mt-16">
        <ProductReview productId={product.id} initialReviews={reviewsData} />
      </div>
    </div>
  );
}
