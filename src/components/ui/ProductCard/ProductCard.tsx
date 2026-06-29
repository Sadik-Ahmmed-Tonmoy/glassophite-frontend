"use client";

import { TProduct, TVariant } from "@/types/types";
import { Heart, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import AddToCartButton from "../buttons/AddToCartButton/AddToCartButton";
import RequestStockButton from "../buttons/RequestStockButton/RequestStockButton";
import ViewDetailsButton from "../buttons/ViewDetailsButton/view-details-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: TProduct;
}

// Theme-based styles
const getThemeStyles = (isDark: boolean) => ({
  cardBg: isDark ? "bg-gray-900" : "bg-gray-100",
  text: isDark ? "text-white" : "text-black",
  textMuted: isDark ? "text-gray-400" : "text-gray-600",
  textMutedLighter: isDark ? "text-gray-500" : "text-gray-500",
  border: isDark ? "border-gray-800" : "border-gray-200",
  borderLight: isDark ? "border-gray-700" : "border-gray-100",
  pricePrimary: isDark ? "text-[#00A693]" : "text-[#007C74]",
  priceSecondary: isDark ? "text-gray-400" : "text-gray-500",
  discount: isDark ? "text-[#00A693]" : "text-[#007C74]",
  stockIn: isDark ? "text-green-400" : "text-green-600",
  stockOut: isDark ? "text-red-400" : "text-red-600",
  productCode: isDark ? "bg-black/50" : "bg-black/70",
  colorButton: {
    active: isDark ? "border-white" : "border-black",
    inactive: isDark ? "border-gray-700" : "border-gray-200",
  },
  overlay: isDark ? "bg-black/60" : "bg-black/50",
});

function ProductCard({ product }: ProductCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = getThemeStyles(isDark);
  
  const [selectedVariant, setSelectedVariant] = useState<TVariant>(
    product?.variants[0]
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleColorButtonClick = (variant: TVariant) => {
    setSelectedVariant(variant);
  };

  const handleWishlistClick = () => {
    setIsWishlisted((prevState) => !prevState);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 17,
      },
    },
  };

  const imageVariants = {
    initial: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
    animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" },
    exit: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full max-w-[350px] mx-auto"
    >
      <div className={`${styles.cardBg} rounded-xl overflow-hidden shadow-xl transition-colors duration-500 border`}>
        {/* Image Container */}
        <div className="w-full h-52 relative overflow-hidden group">
          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
              isDark ? 'bg-black/50 hover:bg-black/70' : 'bg-white/50 hover:bg-white/70'
            }`, isHovered && "top-6")}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isWishlisted 
                  ? "fill-red-500 text-red-500" 
                  : isDark ? "text-white" : "text-gray-700"
              }`} 
            />
          </motion.button>

          {/* Product Code Badge */}
          <motion.div 
            initial={{ x: -100 }}
            animate={{ x: isHovered ? 0 : -100 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`absolute bottom-3 left-3 z-20 ${styles.productCode} backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1`}
          >
            <span data-translate="product.code">Code</span>
            <span className="font-mono">{selectedVariant.productCode}</span>
          </motion.div>

          {/* Variant Images */}
          <AnimatePresence mode="wait">
            {product.variants.map((variant, index) => (
              <motion.div
                key={index}
                initial="initial"
                animate={selectedVariant.color === variant.color ? "animate" : "exit"}
                variants={imageVariants}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={variant.imgList[0]?.image || "/placeholder.svg"}
                  alt={variant.title}
                  width={400}
                  height={400}
                  priority={index === 0}
                  quality={90}
                  placeholder="blur"
                  blurDataURL={variant.imgList[0]?.image}
                  className="h-full w-full object-cover"
                />
                
                {/* Stock Overlay */}
                <AnimatePresence>
                  {selectedVariant.color === variant.color && !variant.inStock && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`absolute inset-0 ${styles.overlay} z-20 flex flex-col items-center justify-center backdrop-blur-sm`}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <XCircle className="w-12 h-12 text-white mb-2" />
                      </motion.div>
                      <motion.span 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white font-bold text-xl tracking-wider"
                        data-translate="product.stock.out"
                      >
                        STOCK OUT
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Content */}
        <article className={`${styles.text} p-4 transition-colors duration-500`}>
          {/* Title and Stock Status */}
          <div className="flex justify-between items-start gap-2">
            <motion.h3 
              className="font-semibold text-lg line-clamp-1"
              whileHover={{ x: 2 }}
            >
              {selectedVariant.title}
            </motion.h3>
            
            <motion.span 
              className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                !selectedVariant.inStock 
                  ? styles.stockOut
                  : selectedVariant.quantity <= 5
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : styles.stockIn
              }`}
              animate={!selectedVariant.inStock ? { opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {!selectedVariant.inStock ? (
                <span data-translate="product.stock.out">Out of Stock</span>
              ) : selectedVariant.quantity <= 5 ? (
                <span data-translate="product.stock.low">Only {selectedVariant.quantity} left!</span>
              ) : (
                <span data-translate="product.stock.in">In Stock</span>
              )}
            </motion.span>
          </div>

          {/* Description */}
          <p className={`text-xs ${styles.textMuted} mt-1 line-clamp-2`}>
            {selectedVariant.shortDescription}
          </p>

          {/* Price Section */}
          <div className="flex justify-between items-center py-3">
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-2xl ${styles.pricePrimary}`}>
                ৳{selectedVariant.priceAfterDiscount}
              </span>
              <span className={`text-xs ${styles.textMutedLighter}`} data-translate="currency.bdt">
                BDT
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-sm line-through ${styles.priceSecondary}`}>
                ৳{selectedVariant.mainPrice}
              </span>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className={`text-sm font-semibold ${styles.discount}`}
              >
                {selectedVariant.discountPercent}% <span data-translate="product.off">off</span>
              </motion.span>
            </div>
          </div>

          {/* Variant Selector */}
          <div className="flex justify-between items-center py-2">
            <div className="flex gap-2 items-center">
              <span className={`text-xs ${styles.textMutedLighter}`} data-translate="product.color">
                Color:
              </span>
              {product.variants.map((variant, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorButtonClick(variant)}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                    selectedVariant.color === variant.color
                      ? styles.colorButton.active
                      : styles.colorButton.inactive
                  } ${!variant.inStock ? "opacity-50" : ""}`}
                  title={variant.inStock ? `Available: ${variant.quantity}` : "Out of Stock"}
                  aria-label={`Select ${variant.color} color variant`}
                >
                  <span
                    className="absolute inset-1 rounded-full"
                    style={{
                      backgroundColor: variant.color,
                    }}
                  />
                  {!variant.inStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-[2px] bg-red-500 rotate-45" />
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* SKU */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`text-xs ${styles.textMutedLighter} font-mono`}
            >
              <span data-translate="product.sku">SKU</span>: {selectedVariant.productCode}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link href={`/product/${product.id}`} className="w-full flex">
              <ViewDetailsButton />
            </Link>
            
            {!selectedVariant.inStock ? (
              <RequestStockButton 
                // productId={product.id}
                // variantId={selectedVariant.id}
              />
            ) : (
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
                  img: selectedVariant?.imgList[0]?.image,
                }}
                className="flex-1"
              />
            )}
          </div>
        </article>
      </div>
    </motion.div>
  );
}

export default ProductCard;