"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/redux/features/wishlist/wishlistApi";

export default function WishlistPage() {
  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (wishlistData?.data?.items) {
      const items = wishlistData.data.items.map((item: any) => item.product || item);
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
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl space-y-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-[#007C74] fill-[#007C74] animate-pulse" />
            <span data-translate="wishlist.title">My Wishlist</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="wishlist.subtitle">
            Review and manage your saved luxury frames. Move them to your bag or consult with virtual try-ons.
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {wishlistItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {wishlistItems.map((product) => {
                  const variant = product.variants?.[0];
                  if (!variant) return null;
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: 15 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="glass-panel p-5 rounded-2xl flex gap-4 hover:shadow-md transition-shadow duration-300 relative group overflow-hidden"
                    >
                      {/* Image container */}
                      <div className="relative w-28 h-28 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        <Image
                          src={variant.imgList[0]?.image || product.img || "/placeholder.svg"}
                          alt={variant.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-350"
                        />
                        {variant.discountPercent > 0 && (
                          <div className="absolute top-1 left-1 bg-[#007C74] px-1.5 py-0.5 text-[9px] font-bold text-white rounded">
                            {variant.discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      {/* Info and Actions */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#007C74]">
                            {product.brand}
                          </span>
                          <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">
                            <Link href={`/product/${product.id}`} className="hover:text-[#007C74]">
                              {variant.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#007C74]">
                              ৳{variant.priceAfterDiscount}
                            </span>
                            {variant.discountPercent > 0 && (
                              <span className="text-xs text-neutral-500 line-through">
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
                            className="flex-grow py-2 bg-[#007C74] hover:bg-[#006059] disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span data-translate="wishlist.move_to_bag">Add to Bag</span>
                          </button>

                          <button
                            onClick={() => handleRemoveItem(product.id, variant.title)}
                            className="p-2 bg-neutral-100 hover:bg-red-500/10 dark:bg-neutral-800 dark:hover:bg-red-500/20 text-neutral-500 hover:text-red-550 dark:hover:text-red-400 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
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
                className="text-center py-12 glass-panel rounded-2xl space-y-4 max-w-md mx-auto"
              >
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit mx-auto text-neutral-450 dark:text-neutral-500">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="wishlist.empty_title">Your Wishlist is Empty</h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto" data-translate="wishlist.empty_desc">
                  Browse our collections and tap the heart icon on your favorite sunglasses to store them here.
                </p>
                <div className="pt-2">
                  <Link href="/product-filter">
                    <button className="px-6 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-[#007c74]/10 transition-colors inline-flex items-center gap-1.5 group cursor-pointer">
                      <span data-translate="wishlist.browse">Browse Collections</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
