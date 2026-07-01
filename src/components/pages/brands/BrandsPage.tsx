"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { getBrandProfiles, TBrandProfile } from "@/lib/contentMockData";

export default function BrandsPage() {
  const [brands, setBrands] = useState<TBrandProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setBrands(getBrandProfiles());
  }, []);

  const activeBrands = useMemo(() => {
    return brands
      .filter((brand) => brand.status === "Active")
      .filter((brand) => {
        const query = searchTerm.toLowerCase();
        return (
          brand.name.toLowerCase().includes(query) ||
          brand.category.toLowerCase().includes(query) ||
          brand.origin.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }, [brands, searchTerm]);

  const featuredBrands = activeBrands.filter((brand) => brand.featured).slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] text-neutral-900 dark:text-neutral-100 transition-colors duration-500">
      <section className="px-4 md:px-6 pt-12 pb-8 border-b border-neutral-200 dark:border-neutral-850 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007C74]/10 text-[#007C74] text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Eyewear Houses</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Brands
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Explore Glassophite partner labels by collection focus, origin, and signature frame language.
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search brand, category, origin..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
              />
            </div>
          </div>
        </div>
      </section>

      {featuredBrands.length > 0 && (
        <section className="px-4 md:px-6 py-8 bg-neutral-100/70 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-850">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/product-filter?brand=${encodeURIComponent(brand.name)}`}
                  className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-4 flex items-center gap-4 hover:border-[#007C74]/50 transition-colors"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                    <Image src={brand.logoUrl} alt={brand.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#007C74]">
                      Featured Brand
                    </p>
                    <h2 className="font-extrabold text-sm truncate">{brand.name}</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {brand.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 md:px-6 py-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeBrands.map((brand, index) => (
              <motion.article
                key={brand.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden hover:border-[#007C74]/50 transition-colors"
              >
                <div className="relative h-40 bg-neutral-100 dark:bg-neutral-900">
                  <Image src={brand.logoUrl} alt={brand.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                  {brand.featured && (
                    <span className="absolute left-3 top-3 px-2 py-1 rounded-md bg-white/90 dark:bg-black/80 text-[10px] font-extrabold text-[#007C74]">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-extrabold">{brand.name}</h2>
                      <span className="text-[10px] font-bold text-neutral-500 whitespace-nowrap">
                        Est. {brand.founded}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#007C74] mt-1">{brand.category}</p>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {brand.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-150 dark:border-neutral-850">
                    <span className="text-[11px] text-neutral-500">{brand.origin}</span>
                    <Link
                      href={`/product-filter?brand=${encodeURIComponent(brand.name)}`}
                      className="text-xs font-extrabold text-[#007C74] flex items-center gap-1 group"
                    >
                      <span>Shop</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {activeBrands.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 p-10 text-center text-sm text-neutral-500">
              No brands found for this search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
