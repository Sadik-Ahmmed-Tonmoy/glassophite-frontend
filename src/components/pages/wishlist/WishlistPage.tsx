"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/redux/features/wishlist/wishlistApi";

export default function WishlistPage() {
  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (wishlistData?.data?.items) {
      const items = wishlistData.data.items.map(
        (item: any) => item.product || item,
      );
      setWishlistItems(items);
    }
  }, [wishlistData]);

  const handleRemoveItem = async (id: string, name: string) => {
    try {
      await removeFromWishlist(id).unwrap();
      toast.success("Removed from Wishlist", {
        description: `${name} has been removed from your saved items.`,
      });
    } catch (err: any) {
      toast.error("Failed to remove item", {
        description: err?.data?.message || "Something went wrong.",
      });
    }
  };

  const handleMoveToBag = (name: string) => {
    toast.success("Added to Bag", {
      description: `${name} has been moved to your shopping bag.`,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      <div className="container space-y-10 sm:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 pt-4 sm:pt-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent flex items-center justify-center gap-2.5 sm:gap-3">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-[#007C74] fill-[#007C74] animate-pulse shrink-0" />
            <span data-translate="wishlist.title">My Wishlist</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed"
            data-translate="wishlist.subtitle"
          >
            Review and manage your saved luxury frames. Move them to your bag or
            consult with virtual try-ons.
          </p>
        </motion.div>

        {/* Wishlist Items Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {wishlistItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
              >
                {wishlistItems.map((product) => {
                  const variant = product.variants?.[0];
                  if (!variant) return null;
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="glass-panel p-4 sm:p-5 rounded-3xl flex gap-3.5 sm:gap-4 hover:shadow-md transition-all duration-300 relative group overflow-hidden border border-neutral-200/80 dark:border-white/10"
                    >
                      {/* Image container */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-white/5">
                        <Image
                          src={
                            variant.imgList?.[0]?.image ||
                            product.img ||
                            "/placeholder.svg"
                          }
                          alt={variant.title}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {variant.discountPercent > 0 && (
                          <div className="absolute top-1.5 left-1.5 bg-[#007C74] px-1.5 py-0.5 text-[9px] font-extrabold text-white rounded-md shadow-xs">
                            {variant.discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      {/* Info and Actions */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#007C74]">
                            {product.brand}
                          </span>
                          <h3 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                            <Link
                              href={`/product/${product.id}`}
                              className="hover:text-[#007C74] transition-colors"
                            >
                              {variant.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-[#007C74] dark:text-[#00A693]">
                              ৳{variant.priceAfterDiscount}
                            </span>
                            {variant.discountPercent > 0 && (
                              <span className="text-[10px] sm:text-xs text-neutral-500 line-through">
                                ৳{variant.mainPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* CTA button items */}
                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 mt-2">
                          <button
                            onClick={() => handleMoveToBag(variant.title)}
                            disabled={!variant.inStock}
                            className="flex-1 py-2 bg-[#007C74] hover:bg-[#006059] disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-bold rounded-full text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span data-translate="wishlist.move_to_bag">
                              Add to Bag
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              handleRemoveItem(product.id, variant.title)
                            }
                            className="p-2 bg-neutral-100 hover:bg-red-500/10 dark:bg-neutral-800 dark:hover:bg-red-500/20 text-neutral-500 hover:text-red-500 dark:hover:text-red-400 rounded-full border border-neutral-200/60 dark:border-neutral-800 transition-colors cursor-pointer shrink-0"
                            aria-label={`Remove ${variant.title} from wishlist`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 glass-panel rounded-3xl space-y-3.5 max-w-md mx-auto border border-neutral-200/80 dark:border-white/10 shadow-md"
              >
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit mx-auto text-neutral-400 dark:text-neutral-500">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3
                  className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
                  data-translate="wishlist.empty_title"
                >
                  Your Wishlist is Empty
                </h3>
                <p
                  className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed"
                  data-translate="wishlist.empty_desc"
                >
                  Browse our collections and tap the heart icon on your favorite
                  sunglasses to store them here.
                </p>
                <div className="pt-2">
                  <Link href="/product-filter">
                    <button className="px-6 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs sm:text-sm font-bold rounded-full shadow-md hover:shadow-[#007c74]/20 transition-all inline-flex items-center gap-1.5 group cursor-pointer">
                      <span data-translate="wishlist.browse">
                        Browse Collections
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
