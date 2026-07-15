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
import { cn } from "@/lib/utils";
import { TProduct } from "@/types/types";
import ImageSlider from "./ImageSlider";
import { useGetPrescriptionLensesQuery } from "@/redux/features/lens/lensApi";
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

  const { data: lensesData, isLoading: isLensesLoading } = useGetPrescriptionLensesQuery({ isAvailable: true });
  const lenses = lensesData?.data || [];

  const [addPowerGlass, setAddPowerGlass] = useState(false);
  const [selectedLensId, setSelectedLensId] = useState<string>("");
  const [leftEyePower, setLeftEyePower] = useState<string>("0.00");
  const [rightEyePower, setRightEyePower] = useState<string>("0.00");

  useEffect(() => {
    if (lenses.length > 0 && !selectedLensId) {
      setSelectedLensId(lenses[0].id);
    }
  }, [lenses, selectedLensId]);

  const selectedLens = lenses.find(l => l.id === selectedLensId);
  const lensPrice = addPowerGlass && selectedLens ? selectedLens.price : 0;

  const powerOptions: string[] = [];
  // Populate power selections from -10.00 to +6.00 in 0.25 steps
  for (let i = -10.00; i <= 6.00; i += 0.25) {
    const val = i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
    powerOptions.push(val);
  }

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
      className="space-y-12 mt-16"
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
                  className="text-sm border border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500 font-bold"
                  data-translate="product.outOfStock"
                  
                >
                  Out of Stock
                </Badge>
              ) : (
                <div
                  className={`text-sm border ${
                    selectedVariant.quantity < 7
                      ? " border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500 font-bold"
                      : styles.badgeSuccess
                  }`}
                >
                  {selectedVariant.quantity < 7
                    ? `Only ${selectedVariant.quantity} left!`
                    : `In Stock: ${selectedVariant.quantity}`}
                </div>
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
                  ৳{(selectedVariant.priceAfterDiscount + lensPrice).toFixed(2)}
                </span>
                <span className={`text-lg line-through ${styles.textMutedLighter}`}>
                  ৳{(selectedVariant.mainPrice + lensPrice).toFixed(2)}
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

          {/* Glowing Power Glass Flow Configuration Section */}
          <div className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
            addPowerGlass 
              ? "border-[#007C74] bg-[#007C74]/5 shadow-[0_0_20px_rgba(0,124,116,0.15)] dark:shadow-[0_0_25px_rgba(0,124,116,0.25)]" 
              : `${styles.border} bg-transparent hover:border-neutral-300 dark:hover:border-neutral-700`
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">👓</span>
                <div>
                  <h3 className={`font-semibold text-base ${styles.text}`}>Custom Prescription Lenses</h3>
                  <p className={`text-xs ${styles.textMutedLighter}`}>Configure custom power glass for your optical frames</p>
                </div>
              </div>
              
              {/* Glowing Toggle switch button */}
              <button
                type="button"
                onClick={() => setAddPowerGlass(!addPowerGlass)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  addPowerGlass 
                    ? "bg-[#007C74] shadow-[0_0_10px_#007C74]" 
                    : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                    addPowerGlass ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {addPowerGlass && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-5"
              >
                {/* Lens Protection Type selection */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${styles.textMutedLighter} mb-3`}>
                    1. Select Lens Protection Type
                  </label>
                  {isLensesLoading ? (
                    <div className="text-xs text-[#007C74] animate-pulse">Loading prescription lens options...</div>
                  ) : lenses.length === 0 ? (
                    <div className="text-xs text-red-500">No prescription lenses available at the moment.</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {lenses.map((opt) => {
                        const isSelected = selectedLensId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedLensId(opt.id)}
                            className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-[#007C74] bg-[#007C74]/10 dark:bg-[#007C74]/20 ring-1 ring-[#007C74]"
                                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50"
                            }`}
                          >
                            <span className="text-lg mb-1">🔍</span>
                            <span className={`text-xs font-bold ${styles.text}`}>{opt.name}</span>
                            {opt.description && (
                              <span className={`text-[10px] ${styles.textMutedLighter} line-clamp-1 mt-0.5`}>{opt.description}</span>
                            )}
                            <span className="text-xs font-semibold text-[#007C74] mt-1.5">+ ৳{opt.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Left/Right SPH Power dropdowns */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${styles.textMutedLighter} mb-3`}>
                    2. Input Lens Power (SPH)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left Eye */}
                    <div className="space-y-1.5">
                      <span className={`text-xs font-medium ${styles.textMuted} flex items-center`}>
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" /> Left Eye (OS / Left Power)
                      </span>
                      <select
                        value={leftEyePower}
                        onChange={(e) => setLeftEyePower(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 ${styles.border} focus:ring-1 focus:ring-[#007C74] outline-none cursor-pointer`}
                      >
                        {powerOptions.map((opt) => (
                          <option key={`left-${opt}`} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Right Eye */}
                    <div className="space-y-1.5">
                      <span className={`text-xs font-medium ${styles.textMuted} flex items-center`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" /> Right Eye (OD / Right Power)
                      </span>
                      <select
                        value={rightEyePower}
                        onChange={(e) => setRightEyePower(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 ${styles.border} focus:ring-1 focus:ring-[#007C74] outline-none cursor-pointer`}
                      >
                        {powerOptions.map((opt) => (
                          <option key={`right-${opt}`} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

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
              <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 w-full">
                <div className="flex-1 flex items-center space-x-2 sm:space-x-4 w-full">
                  <AddToCartButton
                    product={{
                      id: selectedVariant.id.toString(),
                      title: selectedVariant.title,
                      brand: product.brand,
                      size: product.dimensions,
                      color: selectedVariant.color,
                      colorName: selectedVariant.title?.split(" ").pop() || "",
                      price: (selectedVariant.mainPrice || 0) + lensPrice,
                      priceAfterDiscount: selectedVariant.priceAfterDiscount ? (selectedVariant.priceAfterDiscount + lensPrice) : undefined,
                      inStock: selectedVariant.inStock,
                      quantity: selectedVariant.quantity,
                      img:
                        selectedVariant.imgList &&
                        selectedVariant.imgList.length > 0
                          ? selectedVariant.imgList[0].image
                          : undefined,
                    }}
                    productId={product.id}
                    cartQuantity={quantity}
                    lensPowerDetails={addPowerGlass && selectedLens ? { lensType: selectedLens.name, leftEye: leftEyePower, rightEye: rightEyePower } : null}
                    lensId={addPowerGlass && selectedLens ? selectedLens.id : null}
                  />
                  <WishlistButton productId={product.id} productName={product.title} />
                </div>
                
                {!selectedVariant.inStock && (
                  <div className="w-full md:w-auto min-w-[200px]">
                    <RequestStockButton 
                      productId={product.id}
                      variantId={selectedVariant.id}
                    />
                  </div>
                )}
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
        productId={product.id}
      />

      {/* Reviews Section */}
      <div className="mt-8 md:mt-16">
        <ProductReview productId={product.id} initialReviews={product.reviews || []} />
      </div>
    </motion.div>
  );
}