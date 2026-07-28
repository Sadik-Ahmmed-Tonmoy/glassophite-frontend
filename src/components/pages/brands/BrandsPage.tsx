"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brandApi";

export default function BrandsPage() {
  const { data: brandsData, isLoading } = useGetAllBrandsQuery({});
  const [searchTerm, setSearchTerm] = useState("");

  const brands = useMemo(() => brandsData?.data || [], [brandsData]);

  const activeBrands = useMemo(() => {
    return brands
      .filter((brand: any) => brand.status === "Active")
      .filter((brand: any) => {
        const query = searchTerm.toLowerCase();
        return (
          brand.name?.toLowerCase().includes(query) ||
          brand.category?.toLowerCase().includes(query) ||
          brand.origin?.toLowerCase().includes(query)
        );
      })
      .sort(
        (a: any, b: any) =>
          Number(b.featured) - Number(a.featured) ||
          a.name?.localeCompare(b.name),
      );
  }, [brands, searchTerm]);

  const featuredBrands = useMemo(
    () => activeBrands.filter((brand: any) => brand.featured).slice(0, 3),
    [activeBrands],
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007C74]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#090909] dark:via-neutral-900 dark:to-[#090909] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      {/* Header Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 pb-8 sm:pb-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-end">
            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007C74]/10 text-[#007C74] text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premium Partners</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Explore <span className="text-[#007C74]">Brands</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                Discover world-class eyewear brands curated for style,
                precision, and durability.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 focus:border-[#007C74] transition-all text-xs sm:text-sm shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      {featuredBrands.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16">
          <div className="container space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
                Featured Brands
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Handpicked collections from our top partners.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBrands.map((brand: any, index: number) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-black rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <Image
                      src={brand.logoUrl || "/placeholder.svg"}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {brand.name}
                      </h3>
                      {brand.tagline && (
                        <p className="text-xs text-white/80 line-clamp-1">
                          {brand.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap gap-2">
                        {brand.origin && (
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[10px] sm:text-[11px] font-bold">
                            {brand.origin}
                          </span>
                        )}
                        {brand.category && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#007C74]/10 text-[#007C74] text-[10px] sm:text-[11px] font-bold">
                            {brand.category}
                          </span>
                        )}
                      </div>
                      {brand.description && (
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {brand.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/brands?slug=${brand.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007C74] group-hover:gap-2.5 transition-all"
                      >
                        <span>View Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Brands Grid */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 pb-16">
        <div className="container space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
              All Brands
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {activeBrands.length} brand{activeBrands.length !== 1 ? "s" : ""}{" "}
              available.
            </p>
          </motion.div>

          {activeBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeBrands.map((brand: any, index: number) => (
                <Link key={brand.id} href={`/brands?slug=${brand.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-black border border-neutral-200/80 dark:border-neutral-800 hover:border-[#007C74]/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-white/5">
                      <Image
                        src={brand.logoUrl || "/placeholder.svg"}
                        alt={brand.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm truncate group-hover:text-[#007C74] transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {brand.category}
                        {brand.origin ? ` · ${brand.origin}` : ""}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#007C74] group-hover:translate-x-1 transition-all shrink-0" />
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-semibold">
                No brands match your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
