"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@nextui-org/react";

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
import ImageSlider from "./ImageSlider";
import ProductReview from "./ProductReview";
import SimilarProducts from "./SimilarProducts/SimilarProducts";
import VariantSelector from "./VariantSelector";

interface ProductDetailsProps {
  product: TProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { items } = useCart();
  const selectedItemFromCart = items.find((item) => item.id == product.id);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);

  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      badgeSuccess: "border-green-500 text-green-500",
      badgeWarning: "border-yellow-500 text-yellow-500",
      badgeDanger: "border-red-500 text-red-500",
      badgeDefault: "border-white/20 text-white",
      tabActive: "data-[state=active]:bg-[#007C74] data-[state=active]:text-white",
      tabInactive: "text-neutral-400 hover:text-white",
      starFilled: "text-yellow-400 fill-yellow-400",
      starEmpty: "text-gray-600",
    },
    light: {
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      bg: "bg-white",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      badgeSuccess: "border-green-600 text-green-600",
      badgeWarning: "border-yellow-600 text-yellow-600",
      badgeDanger: "border-red-600 text-red-600",
      badgeDefault: "border-neutral-300 text-neutral-700",
      tabActive: "data-[state=active]:bg-[#007C74] data-[state=active]:text-white",
      tabInactive: "text-neutral-500 hover:text-neutral-900",
      starFilled: "text-yellow-500 fill-yellow-500",
      starEmpty: "text-gray-300",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  useEffect(() => {
    if (selectedItemFromCart) {
      setQuantity(selectedItemFromCart.quantity);
    } else {
      setQuantity(1);
    }
  }, [selectedItemFromCart]);

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ||
    product.variants[0];

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

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity(quantity + 1);
    }
  };

  if (!product || !selectedVariant) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-8 text-center ${styles.textMuted}`}
        data-translate="product.notFound"
      >
        Product not found
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Image Slider */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative lg:col-span-5"
        >
          <ImageSlider
            images={selectedVariant.imgList}
            inStock={selectedVariant.inStock}
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6 lg:col-span-7"
        >
          {/* Title and Stock Badge */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className={`text-2xl sm:text-3xl font-bold ${styles.text}`}>
                {selectedVariant.title}
              </h1>
              {!selectedVariant.inStock ? (
                <Badge
                  className={`text-sm border ${styles.badgeDanger}`}
                  data-translate="product.outOfStock"
                >
                  Out of Stock
                </Badge>
              ) : (
                <Badge
                  className={`text-sm border ${
                    selectedVariant.quantity <= 5
                      ? styles.badgeWarning
                      : styles.badgeSuccess
                  }`}
                >
                  {selectedVariant.quantity <= 5
                    ? `Only ${selectedVariant.quantity} left!`
                    : "In Stock"}
                </Badge>
              )}
            </div>
            <p className={`${styles.textMuted} mt-2`}>
              {selectedVariant.shortDescription}
            </p>

            {/* Rating and SKU */}
            <div className="flex items-center mt-4 space-x-2 flex-wrap gap-2">
              {product.averageRating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.averageRating ?? 0)
                          ? styles.starFilled
                          : styles.starEmpty
                      }`}
                    />
                  ))}
                  <span className={`ml-2 text-sm ${styles.textMutedLighter}`}>
                    ({product.averageRating} reviews)
                  </span>
                </div>
              )}
              <span className={`text-sm ${styles.textMutedLighter}`}>
                SKU: {selectedVariant.productCode}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            {selectedVariant.priceAfterDiscount && selectedVariant.mainPrice ? (
              <>
                <span className="text-2xl font-bold text-green-600 dark:text-green-500">
                  ৳{selectedVariant.priceAfterDiscount}
                </span>
                <span className={`text-lg line-through ${styles.textMutedLighter}`}>
                  ৳{selectedVariant.mainPrice}
                </span>
                {selectedVariant.discountPercent && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {selectedVariant.discountPercent}% OFF
                  </Badge>
                )}
              </>
            ) : (
              <span className={`text-2xl font-bold ${styles.text}`}>
                Price not available
              </span>
            )}
          </div>

          {/* Variant Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelectVariant={handleVariantChange}
          />

          {/* Quantity and Add to Cart */}
          <div>
            <div className="flex flex-col xs:flex-row sm:items-center gap-4">
              {/* Quantity Selector */}
              <div
                className={cn(
                  "flex items-center border rounded-md w-fit",
                  selectedVariant.inStock ? "flex" : "hidden",
                  styles.border
                )}
              >
                <MyButton
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={!selectedVariant.inStock || quantity <= 1}
                  className={styles.text}
                >
                  -
                </MyButton>
                <span className={`w-10 text-center ${styles.text}`}>
                  {quantity}
                </span>
                <MyButton
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={
                    !selectedVariant.inStock ||
                    quantity >= selectedVariant.quantity
                  }
                  className={styles.text}
                >
                  +
                </MyButton>
              </div>

              {/* Action Buttons */}
              <div className="flex-1 flex items-center space-x-2 sm:space-x-4">
                {!selectedVariant.inStock ? (
                  <RequestStockButton />
                ) : (
                  <AddToCartButton
                    product={{
                      id: selectedVariant.id.toString(),
                      title: selectedVariant.title,
                      brand: product.brand,
                      size: product.dimensions,
                      color: selectedVariant.color,
                      colorName: selectedVariant.title?.split(" ").pop() || "",
                      price: selectedVariant.mainPrice || 0,
                      priceAfterDiscount: selectedVariant.priceAfterDiscount,
                      inStock: selectedVariant.inStock,
                      quantity: selectedVariant.quantity,
                      img:
                        selectedVariant.imgList &&
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

          <Separator className={styles.border} />

          {/* Tabs */}
          <Tabs defaultValue="specifications">
            <TabsList className={`grid grid-cols-2 ${styles.border}`}>
              <TabsTrigger
                value="specifications"
                className={cn(styles.tabInactive, styles.tabActive)}
                data-translate="product.specifications"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className={cn(styles.tabInactive, styles.tabActive)}
                data-translate="product.description"
              >
                Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <p className={styles.textMuted}>{product.longDescription}</p>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.brand">Brand:</span>{" "}
                    <span className={styles.textMuted}>{product.brand}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.material">Material:</span>{" "}
                    <span className={styles.textMuted}>{product.material}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.dimensions">Dimensions:</span>{" "}
                    <span className={styles.textMuted}>{product.dimensions}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.weight">Weight:</span>{" "}
                    <span className={styles.textMuted}>{product.weight}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.frameType">Frame Type:</span>{" "}
                    <span className={styles.textMuted}>{product.frameType}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.lensType">Lens Type:</span>{" "}
                    <span className={styles.textMuted}>{product.lensType}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.warranty">Warranty:</span>{" "}
                    <span className={styles.textMuted}>{product.warranty}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.countryOfOrigin">Country of Origin:</span>{" "}
                    <span className={styles.textMuted}>{product.countryOfOrigin}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.targetAudience">Target Audience:</span>{" "}
                    <span className={styles.textMuted}>{product.targetAudience}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`} data-translate="product.shippingInfo">Shipping:</span>{" "}
                    <span className={styles.textMuted}>{product.shippingInfo}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className={`font-semibold ${styles.text}`} data-translate="product.careInstructions">Care Instructions:</span>{" "}
                <span className={styles.textMuted}>{product.careInstructions}</span>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Similar Products */}
      <SimilarProducts
        allProducts={mockProducts}
        currentProduct={productMockData}
      />

      {/* Reviews Section */}
      <div className="mt-8 md:mt-16">
        <ProductReview productId={product.id} initialReviews={reviewsData} />
      </div>
    </motion.div>
  );
}