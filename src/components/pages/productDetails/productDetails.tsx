"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Star } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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

const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
};

// Static prescription lens power options array
const POWER_OPTIONS: string[] = (() => {
  const options: string[] = [];
  for (let i = -10.0; i <= 6.0; i += 0.25) {
    const val = i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
    options.push(val);
  }
  return options;
})();

interface ProductDetailsProps {
  product: TProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { items } = useCart();
  const selectedItemFromCart = items.find((item) => item.id == product.id);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || "",
  );
  const [quantity, setQuantity] = useState(1);

  const { data: lensesData, isLoading: isLensesLoading } =
    useGetPrescriptionLensesQuery({ isAvailable: true });
  const lenses = useMemo(() => lensesData?.data || [], [lensesData]);

  const [addPowerGlass, setAddPowerGlass] = useState(false);
  const [selectedLensId, setSelectedLensId] = useState<string>("");
  const [leftEyePower, setLeftEyePower] = useState<string>("0.00");
  const [rightEyePower, setRightEyePower] = useState<string>("0.00");

  useEffect(() => {
    if (lenses.length > 0 && !selectedLensId) {
      setSelectedLensId(lenses[0].id);
    }
  }, [lenses, selectedLensId]);

  const selectedLens = lenses.find((l) => l.id === selectedLensId);
  const lensPrice = addPowerGlass && selectedLens ? selectedLens.price : 0;

  const styles = useMemo(
    () =>
      isDark
        ? {
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
            tabActive:
              "data-[state=active]:bg-[#007C74] data-[state=active]:text-white",
            tabInactive: "text-neutral-400 hover:text-white",
            starFilled: "text-yellow-400 fill-yellow-400",
            starEmpty: "text-neutral-600",
          }
        : {
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
            tabActive:
              "data-[state=active]:bg-[#007C74] data-[state=active]:text-white",
            tabInactive: "text-neutral-500 hover:text-neutral-900",
            starFilled: "text-yellow-500 fill-yellow-500",
            starEmpty: "text-neutral-300",
          },
    [isDark],
  );

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

  const activeVideoUrl =
    selectedVariant?.videoUrl ||
    product.variants?.find((v) => v.videoUrl)?.videoUrl;

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
      className="space-y-8 sm:space-y-12 mt-2 sm:mt-6 container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Image Slider */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative lg:col-span-5 w-full"
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
          className="space-y-5 sm:space-y-6 lg:col-span-7 w-full"
        >
          {/* Title and Stock Badge */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ">
              <h1
                className={`text-xl sm:text-3xl font-extrabold tracking-tight ${styles.text}`}
              >
                {selectedVariant.title}
              </h1>
            
            </div>
            <p
              className={`text-xs sm:text-sm ${styles.textMuted} mt-2 leading-relaxed`}
            >
              {selectedVariant.shortDescription}
            </p>

            {/* Rating and SKU */}
            <div className="flex items-center mt-3 flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
              {product.averageRating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                        i < Math.round(product.averageRating ?? 0)
                          ? styles.starFilled
                          : styles.starEmpty
                      }`}
                    />
                  ))}
                  <span
                    className={`ml-1.5 text-xs sm:text-sm ${styles.textMutedLighter}`}
                  >
                    ({product.averageRating} reviews)
                  </span>
                </div>
              )}
              <span
                className={`text-xs sm:text-sm ${styles.textMutedLighter} font-mono`}
              >
                SKU: {selectedVariant.productCode}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-4">
            {selectedVariant.priceAfterDiscount && selectedVariant.mainPrice ? (
              <>
                <span className="text-2xl sm:text-3xl font-black text-[#007C74] dark:text-[#00A693]">
                  ৳{(selectedVariant.priceAfterDiscount + lensPrice).toFixed(2)}
                </span>
                <span
                  className={`text-sm sm:text-lg line-through ${styles.textMutedLighter}`}
                >
                  ৳{(selectedVariant.mainPrice + lensPrice).toFixed(2)}
                </span>
                {selectedVariant.discountPercent && (
                  <Badge className="bg-[#007C74] text-white font-bold text-xs px-2 py-0.5">
                    {selectedVariant.discountPercent}% OFF
                  </Badge>
                )}
<div className="flex items-center">
                  {!selectedVariant.inStock ? (
                <Badge
                  className="text-xs sm:text-sm border border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500 font-bold self-start sm:self-auto"
                  data-translate="product.outOfStock"
                >
                  Out of Stock
                </Badge>
              ) : (
                <div
                  className={`text-xs sm:text-sm px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                    selectedVariant.quantity < 7
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500 font-bold "
                      : styles.badgeSuccess
                  }`}
                >
                  {selectedVariant.quantity < 7
                    ? `Only ${selectedVariant.quantity} left!`
                    : `In Stock: ${selectedVariant.quantity}`}
                </div>
              )}
</div>
              </>
            ) : (
              <span className={`text-xl sm:text-2xl font-bold ${styles.text}`}>
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
          {product.showPrescriptionLenses !== false && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                addPowerGlass
                  ? "border-[#007C74] bg-[#007C74]/5 shadow-[0_0_20px_rgba(0,124,116,0.15)] dark:shadow-[0_0_25px_rgba(0,124,116,0.25)]"
                  : `${styles.border} bg-transparent hover:border-neutral-300 dark:hover:border-neutral-700`
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl sm:text-2xl">👓</span>
                  <div>
                    <h3
                      className={`font-bold text-xs sm:text-base ${styles.text}`}
                    >
                      Custom Prescription Lenses
                    </h3>
                    <p
                      className={`text-[11px] sm:text-xs ${styles.textMutedLighter}`}
                    >
                      Configure custom power glass for your optical frames
                    </p>
                  </div>
                </div>

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
                  className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-4 sm:space-y-5"
                >
                  {/* Lens Protection Type selection */}
                  <div>
                    <label
                      className={`block text-[11px] sm:text-xs font-bold uppercase tracking-wider ${styles.textMutedLighter} mb-2.5`}
                    >
                      1. Select Lens Protection Type
                    </label>
                    {isLensesLoading ? (
                      <div className="text-xs text-[#007C74] animate-pulse">
                        Loading prescription lens options...
                      </div>
                    ) : lenses.length === 0 ? (
                      <div className="text-xs text-red-500">
                        No prescription lenses available at the moment.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {lenses.map((opt) => {
                          const isSelected = selectedLensId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedLensId(opt.id)}
                              className={`flex flex-col items-start p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "border-[#007C74] bg-[#007C74]/10 dark:bg-[#007C74]/20 ring-1 ring-[#007C74]"
                                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50"
                              }`}
                            >
                              <span className="text-sm sm:text-base mb-1">
                                🔍
                              </span>
                              <span
                                className={`text-xs font-bold ${styles.text}`}
                              >
                                {opt.name}
                              </span>
                              {opt.description && (
                                <span
                                  className={`text-[10px] ${styles.textMutedLighter} line-clamp-1 mt-0.5`}
                                >
                                  {opt.description}
                                </span>
                              )}
                              <span className="text-xs font-bold text-[#007C74] mt-1.5">
                                + ৳{opt.price.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Left/Right SPH Power dropdowns */}
                  <div>
                    <label
                      className={`block text-[11px] sm:text-xs font-bold uppercase tracking-wider ${styles.textMutedLighter} mb-2.5`}
                    >
                      2. Input Lens Power (SPH)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Left Eye */}
                      <div className="space-y-1.5">
                        <span
                          className={`text-xs font-medium ${styles.textMuted} flex items-center`}
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />{" "}
                          Left Eye (OS / Left Power)
                        </span>
                        <select
                          value={leftEyePower}
                          onChange={(e) => setLeftEyePower(e.target.value)}
                          className={`w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 ${styles.border} focus:ring-1 focus:ring-[#007C74] outline-none cursor-pointer`}
                        >
                          {POWER_OPTIONS.map((opt) => (
                            <option key={`left-${opt}`} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Right Eye */}
                      <div className="space-y-1.5">
                        <span
                          className={`text-xs font-medium ${styles.textMuted} flex items-center`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />{" "}
                          Right Eye (OD / Right Power)
                        </span>
                        <select
                          value={rightEyePower}
                          onChange={(e) => setRightEyePower(e.target.value)}
                          className={`w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 ${styles.border} focus:ring-1 focus:ring-[#007C74] outline-none cursor-pointer`}
                        >
                          {POWER_OPTIONS.map((opt) => (
                            <option key={`right-${opt}`} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="pt-2">
            <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4">
              {/* Quantity Selector */}
              <div
                className={cn(
                  "flex items-center justify-between border rounded-full px-1 py-0.5 w-full xs:w-auto self-start xs:self-auto",
                  selectedVariant.inStock ? "flex" : "hidden",
                  styles.border,
                )}
              >
                <MyButton
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={!selectedVariant.inStock || quantity <= 1}
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-full",
                    styles.text,
                  )}
                >
                  -
                </MyButton>
                <span
                  className={`w-8 sm:w-10 text-center font-bold text-xs sm:text-sm ${styles.text}`}
                >
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
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-full",
                    styles.text,
                  )}
                >
                  +
                </MyButton>
              </div>

              {/* Action Buttons */}
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 w-full">
                <div className="flex-1 flex items-center space-x-2 sm:space-x-3 w-full">
                  <AddToCartButton
                    product={{
                      id: selectedVariant.id.toString(),
                      title: selectedVariant.title,
                      brand: product.brand,
                      size: product.dimensions,
                      color: selectedVariant.color,
                      colorName: selectedVariant.title?.split(" ").pop() || "",
                      price: (selectedVariant.mainPrice || 0) + lensPrice,
                      priceAfterDiscount: selectedVariant.priceAfterDiscount
                        ? selectedVariant.priceAfterDiscount + lensPrice
                        : undefined,
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
                    lensPowerDetails={
                      addPowerGlass && selectedLens
                        ? {
                            lensType: selectedLens.name,
                            leftEye: leftEyePower,
                            rightEye: rightEyePower,
                          }
                        : null
                    }
                    lensId={
                      addPowerGlass && selectedLens ? selectedLens.id : null
                    }
                  />
                  <WishlistButton
                    productId={product.id}
                    productName={product.title}
                  />
                </div>

                {!selectedVariant.inStock && (
                  <div className="w-full sm:w-auto min-w-[180px]">
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
            <TabsList
              className={`grid ${
                activeVideoUrl ? "grid-cols-3" : "grid-cols-2"
              } ${styles.border}`}
            >
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
              {activeVideoUrl && (
                <TabsTrigger
                  value="video"
                  className={cn(styles.tabInactive, styles.tabActive)}
                >
                  Product Video
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <p
                className={`text-xs sm:text-sm ${styles.textMuted} leading-relaxed`}
              >
                {product.longDescription}
              </p>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.brand"
                    >
                      Brand:
                    </span>{" "}
                    <span className={styles.textMuted}>{product.brand}</span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.material"
                    >
                      Material:
                    </span>{" "}
                    <span className={styles.textMuted}>{product.material}</span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.dimensions"
                    >
                      Dimensions:
                    </span>{" "}
                    <span className={styles.textMuted}>
                      {product.dimensions}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.weight"
                    >
                      Weight:
                    </span>{" "}
                    <span className={styles.textMuted}>{product.weight}</span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.frameType"
                    >
                      Frame Type:
                    </span>{" "}
                    <span className={styles.textMuted}>
                      {product.frameType}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.lensType"
                    >
                      Lens Type:
                    </span>{" "}
                    <span className={styles.textMuted}>{product.lensType}</span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.warranty"
                    >
                      Warranty:
                    </span>{" "}
                    <span className={styles.textMuted}>{product.warranty}</span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.countryOfOrigin"
                    >
                      Country of Origin:
                    </span>{" "}
                    <span className={styles.textMuted}>
                      {product.countryOfOrigin}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.targetAudience"
                    >
                      Target Audience:
                    </span>{" "}
                    <span className={styles.textMuted}>
                      {product.targetAudience}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${styles.text}`}
                      data-translate="product.shippingInfo"
                    >
                      Shipping:
                    </span>{" "}
                    <span className={styles.textMuted}>
                      {product.shippingInfo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs sm:text-sm">
                <span
                  className={`font-bold ${styles.text}`}
                  data-translate="product.careInstructions"
                >
                  Care Instructions:
                </span>{" "}
                <span className={styles.textMuted}>
                  {product.careInstructions}
                </span>
              </div>
            </TabsContent>

            {activeVideoUrl && (
              <TabsContent value="video" className="mt-4">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
                  {getYoutubeEmbedUrl(activeVideoUrl) ? (
                    <iframe
                      src={getYoutubeEmbedUrl(activeVideoUrl)!}
                      title={`${product.title} YouTube Video`}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-neutral-100 dark:bg-neutral-900/50 text-neutral-500 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                      <span className="text-3xl mb-2">⚠️</span>
                      <p className="text-sm font-semibold">Invalid Video URL</p>
                      <p className="text-xs">
                        The video URL provided is not a valid YouTube link.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>

      {/* Similar Products */}
      <SimilarProducts productId={product.id} />

      {/* Reviews Section */}
      <div className="mt-8 md:mt-16">
        <ProductReview
          productId={product.id}
          initialReviews={product.reviews || []}
        />
      </div>
    </motion.div>
  );
}
