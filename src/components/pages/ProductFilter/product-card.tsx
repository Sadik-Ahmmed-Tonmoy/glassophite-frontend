"use client"

import { TProduct } from "@/types/types"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"



interface ProductCardProps {
  product: TProduct
  onQuickView: () => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const variant = product.variants[0]

  // Animation variants
  // const cardVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   show: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.4,
  //       ease: "easeOut",
  //     },
  //   },
  // }

  return (
    <motion.article
      className="group relative"
      // variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content={variant.title} />
      <meta itemProp="description" content={variant.shortDescription ?? undefined} />
      <meta itemProp="sku" content={variant.productCode} />
      {product.brand && <meta itemProp="brand" content={product.brand} />}

      <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="price" content={variant.priceAfterDiscount.toString()} />
        <meta itemProp="priceCurrency" content="USD" />
        <meta
          itemProp="availability"
          content={variant.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
        />
      </div>

      {product.averageRating && (
        <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          <meta itemProp="ratingValue" content={product.averageRating.toString()} />
          <meta itemProp="reviewCount" content={product.totalReviews?.toString() || "0"} />
        </div>
      )}

      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={variant.imgList[0].image || "/placeholder.svg"}
          alt={variant.title}
          width={400}
          height={400}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          itemProp="image"
        />
        {!variant.inStock && (
          <div className="absolute top-0 right-0 bg-white bg-opacity-90 m-2 px-2 py-1 text-xs font-medium text-gray-900 rounded">
            Out of Stock
          </div>
        )}
        {variant.discountPercent > 0 && (
          <div className="absolute top-0 left-0 bg-[#007C74] m-2 px-2 py-1 text-xs font-bold text-white rounded">
            {variant.discountPercent}% OFF
          </div>
        )}
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-[#007C74] bg-opacity-90 p-4 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between">
            <button
              onClick={onQuickView}
              className="text-white text-sm font-medium hover:underline focus:outline-none"
              aria-label={`Quick view of ${variant.title}`}
            >
              Quick View
            </button>
            <button
              className="text-white text-sm font-medium hover:underline focus:outline-none"
              disabled={!variant.inStock}
              aria-label={variant.inStock ? `Add ${variant.title} to cart` : `${variant.title} is sold out`}
            >
              {variant.inStock ? "Add to Cart" : "Sold Out"}
            </button>
          </div>
        </motion.div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link href={`/product/${product.id}`} className="hover:text-[#007C74]">
              {variant.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          <div className="mt-1 flex items-center">
            {/* {renderStars(product.averageRating || 0)} */}
            <p className="text-red-500">starrrrr</p>
            <span className="ml-1 text-xs text-gray-500">({product.totalReviews})</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#007C74]">${variant.priceAfterDiscount.toFixed(2)}</p>
          {variant.discountPercent > 0 && (
            <p className="text-xs text-gray-500 line-through">${variant.mainPrice.toFixed(2)}</p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

