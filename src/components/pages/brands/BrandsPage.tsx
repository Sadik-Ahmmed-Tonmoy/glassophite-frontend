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

  const brands = brandsData || [];

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
      .sort((a: any, b: any) => Number(b.featured) - Number(a.featured) || a.name?.localeCompare(b.name));
  }, [brands, searchTerm]);

  const featuredBrands = activeBrands.filter((brand: any) => brand.featured).slice(0, 3);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007C74]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] text-neutral-900 dark:text-neutral-100 transition-colors duration-500">
      <section className="px-4 md:px-6 pt-12 pb-8 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007C74]/10 text-[#007C74] text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Partners
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                Explore <span className="text-[#007C74]">Brands</span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                Discover world-class eyewear brands curated for style, precision, and durability.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 focus:border-[#007C74] transition-all text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {featuredBrands.length > 0 && (
        <section className="px-4 md:px-6 py-16">
          <div className="container mx-auto max-w-6xl space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Featured Brands</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Handpicked collections from our top partners.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBrands.map((brand: any, index: number) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-black rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src={brand.logoUrl || "/placeholder.svg"} alt={brand.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                      {brand.tagline && <p className="text-sm text-white/80">{brand.tagline}</p>}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {brand.origin && <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[11px] font-bold">{brand.origin}</span>}
                      {brand.category && <span className="px-2.5 py-1 rounded-full bg-[#007C74]/10 text-[#007C74] text-[11px] font-bold">{brand.category}</span>}
                    </div>
                    {brand.description && <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{brand.description}</p>}
                    <div className="pt-1">
                      <Link href={`/brands?slug=${brand.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007C74] group-hover:gap-2.5 transition-all">
                        View Collection <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 md:px-6 pb-16">
        <div className="container mx-auto max-w-6xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">All Brands</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">{activeBrands.length} brand{activeBrands.length !== 1 ? "s" : ""} available.</p>
          </motion.div>

          {activeBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeBrands.map((brand: any, index: number) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-[#007C74]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-900">
                    <Image src={brand.logoUrl || "/placeholder.svg"} alt={brand.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{brand.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{brand.category}{brand.origin ? ` · ${brand.origin}` : ""}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#007C74] group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-500 dark:text-neutral-400">No brands match your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
