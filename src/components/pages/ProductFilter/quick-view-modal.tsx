"use client"

import { TProduct } from "@/types/types"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"


interface QuickViewModalProps {
  product: TProduct
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <motion.div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left sm:w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                      <Image
                        src={product.variants[0].imgList[0].image || "/placeholder.svg"}
                        alt={product.variants[0].title}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {product.variants[0].imgList.map((img) => (
                        <div key={img.id} className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={img.image || "/placeholder.svg"}
                            alt={`Product view ${img.id}`}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                      {product.variants[0].title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>

                    <div className="mt-2 flex items-center">
                      {/* {renderStars(product.averageRating || 0)} */}
                      <p className="text-red-500">starrrrr</p>
                      <span className="ml-1 text-sm text-gray-500">({product.totalReviews} reviews)</span>
                    </div>

                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ${product.variants[0].priceAfterDiscount.toFixed(2)}
                        {product.variants[0].discountPercent > 0 && (
                          <span className="ml-2 text-lg text-gray-500 line-through">
                            ${product.variants[0].mainPrice.toFixed(2)}
                          </span>
                        )}
                      </p>
                      {product.variants[0].discountPercent > 0 && (
                        <p className="mt-1 text-sm text-red-600">
                          Save {product.variants[0].discountPercent}% right now
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Description</h4>
                      <p className="mt-2 text-sm text-gray-500">{product.variants[0].shortDescription}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Details</h4>
                      <ul className="mt-2 text-sm text-gray-500 space-y-2">
                        {product.frameType && <li>Frame Type: {product.frameType}</li>}
                        {product.lensType && <li>Lens Type: {product.lensType}</li>}
                        {product.material && <li>Material: {product.material}</li>}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <motion.button
                        type="button"
                        className={`w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74] ${
                          product.variants[0].inStock
                            ? "bg-[#007C74] hover:bg-[#00A693]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!product.variants[0].inStock}
                        whileHover={product.variants[0].inStock ? { scale: 1.02 } : {}}
                        whileTap={product.variants[0].inStock ? { scale: 0.98 } : {}}
                      >
                        {product.variants[0].inStock ? "Add to Cart" : "Out of Stock"}
                      </motion.button>

                      <div className="mt-4 flex items-center justify-between">
                        <motion.button
                          type="button"
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Wishlist
                        </motion.button>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          View Full Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

