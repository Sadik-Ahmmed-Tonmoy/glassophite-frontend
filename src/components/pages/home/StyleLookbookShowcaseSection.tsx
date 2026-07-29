"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Tag,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import type { TProduct } from "@/types/types";

// Curated style look data matching eyewear with lifestyles & outfits
const LOOKBOOK_ITEMS = [
  {
    id: "look-1",
    vibeId: "urban",
    vibeName: "Urban Streetwear",
    title: "The Midnight Silhouette",
    tagline: "Sharp angles, matte black acetates, and metropolitan attitude.",
    description: "Designed for nocturnal city strolls and high-contrast street style. Paired with tailored trench coats and minimalist streetwear.",
    modelImage: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop",
    colors: ["#111111", "#333333", "#007C74"],
    location: "Dhaka Gulshan District",
    categoryKeyword: "sunglasses",
  },
  {
    id: "look-2",
    vibeId: "coastal",
    vibeName: "Coastal Escape",
    title: "Oceanic Reflection",
    tagline: "Polarized mirror lenses with ultralight crystal acetate.",
    description: "Built to withstand intense tropical sun glare at Cox's Bazar sea shores. Offers 99.9% polarized UV protection with breezy seaside elegance.",
    modelImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
    colors: ["#007C74", "#3C55A5", "#E8F8F3"],
    location: "Cox's Bazar Riviera",
    categoryKeyword: "sunglasses",
  },
  {
    id: "look-3",
    vibeId: "executive",
    vibeName: "Executive Luxury",
    title: "Titanium Precision",
    tagline: "Swiss-engineered beta titanium for effortless boardroom authority.",
    description: "Featherweight strength (< 18g) designed for modern visionaries. Sleek geometric frames that complement executive suits and fine tailoring.",
    modelImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    colors: ["#D4AF37", "#1A1A1A", "#808080"],
    location: "Financial District",
    categoryKeyword: "optical glasses",
  },
  {
    id: "look-4",
    vibeId: "sunset",
    vibeName: "Sunset Lounge",
    title: "Golden Hour Glow",
    tagline: "Hand-layered vintage tortoiseshell with warm tint optics.",
    description: "Elevate late afternoon rooftop gatherings with rich amber hues and classic silhouette frames that radiate timeless warmth.",
    modelImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
    colors: ["#B87333", "#D4AF37", "#222222"],
    location: "Rooftop Terrace",
    categoryKeyword: "sunglasses",
  },
  {
    id: "look-5",
    vibeId: "urban",
    vibeName: "Modern Minimalist",
    title: "Monochrome Edge",
    tagline: "Clean rimless aesthetics with anti-reflective clarity.",
    description: "Understated elegance for contemporary creatives, architects, and designers who value pure geometry and weightless comfort.",
    modelImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop",
    colors: ["#F5F5F5", "#2B2B2B", "#00A693"],
    location: "Design Studio",
    categoryKeyword: "optical glasses",
  },
  {
    id: "look-6",
    vibeId: "coastal",
    vibeName: "Riviera Leisure",
    title: "Cat-Eye Glamour",
    tagline: "Dramatic upswept frames with gradient champagne lenses.",
    description: "Channel vintage Hollywood allure while lounging by the pool or enjoying weekend brunch in tropical weather.",
    modelImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    colors: ["#F4E0C9", "#E11D48", "#1A1A1A"],
    location: "Poolside Resort",
    categoryKeyword: "sunglasses",
  },
];

export default function StyleLookbookShowcaseSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tab & selection states
  const [activeVibe, setActiveVibe] = useState<string>("all");
  const [selectedLookId, setSelectedLookId] = useState<string>("look-1");

  // Fetch product catalog to pair products dynamically
  const { data: productsData, isLoading: isLoadingProducts } = useGetAllProductsQuery({ limit: 20 });
  const allProducts: TProduct[] = useMemo(() => productsData?.data || [], [productsData]);

  // Vibe Tabs
  const vibes = [
    { id: "all", label: "All Looks" },
    { id: "urban", label: "Urban Streetwear" },
    { id: "coastal", label: "Coastal Escape" },
    { id: "executive", label: "Executive Luxury" },
    { id: "sunset", label: "Sunset Lounge" },
  ];

  // Filtered looks
  const filteredLooks = useMemo(() => {
    if (activeVibe === "all") return LOOKBOOK_ITEMS;
    return LOOKBOOK_ITEMS.filter((item) => item.vibeId === activeVibe);
  }, [activeVibe]);

  // Currently active look detail
  const activeLook = useMemo(() => {
    return LOOKBOOK_ITEMS.find((item) => item.id === selectedLookId) || filteredLooks[0] || LOOKBOOK_ITEMS[0];
  }, [selectedLookId, filteredLooks]);

  // Pair a product from the database with the active look
  const pairedProduct = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null;
    const match = allProducts.find(
      (p) =>
        p.categories?.some((c) => c.toLowerCase().includes(activeLook.categoryKeyword)) ||
        p.title.toLowerCase().includes(activeLook.categoryKeyword)
    );
    return match || allProducts[0];
  }, [allProducts, activeLook]);

  const styles = useMemo(
    () => ({
      bg: isDark
        ? "from-black via-gray-950 to-black"
        : "from-neutral-50 via-white to-neutral-50",
      text: isDark ? "text-white" : "text-neutral-900",
      textMuted: isDark ? "text-neutral-400" : "text-neutral-600",
      border: isDark ? "border-white/10" : "border-neutral-200",
      glassBg: isDark
        ? "bg-white/5 backdrop-blur-md border-white/10"
        : "bg-white/80 backdrop-blur-md border-neutral-200/80 shadow-sm",
      activeTab: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white shadow-lg shadow-[#007C74]/20",
      inactiveTab: isDark
        ? "bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white"
        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 shadow-xs",
    }),
    [isDark]
  );

  return (
    <section
      id="style-lookbook-showcase"
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} py-16 sm:py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 border-t ${styles.border}`}
      aria-labelledby="lookbook-title"
    >
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-[clamp(280px,35vw,480px)] h-[clamp(280px,35vw,480px)] rounded-full blur-[140px] pointer-events-none bg-[#007C74]/15 dark:bg-[#007C74]/20" />
      <div className="absolute bottom-1/4 -right-20 w-[clamp(300px,40vw,520px)] h-[clamp(300px,40vw,520px)] rounded-full blur-[160px] pointer-events-none bg-[#3C55A5]/20 dark:bg-[#3C55A5]/25" />

      <div className="relative z-10 container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${styles.border} ${styles.glassBg} mb-4 shadow-xs`}
          >
            <Sparkles className="w-4 h-4 text-[#007C74] animate-pulse" />
            <span className={`text-xs font-bold tracking-widest uppercase ${styles.text}`}>
              Lifestyle & Style Matcher
            </span>
          </div>
          <h2
            id="lookbook-title"
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${styles.text} mb-4`}
          >
            Match Your Frame To{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Your Vibe
            </span>
          </h2>
          <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${styles.textMuted} max-w-2xl mx-auto`}>
            Discover curated eyewear lookbooks matched to modern aesthetics, travel destinations, and fashion statements.
          </p>
        </div>

        {/* Lifestyle Vibe Filter Tabs */}
        <div className="flex justify-center items-center gap-2.5 flex-wrap mb-10 sm:mb-14">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => {
                setActiveVibe(vibe.id);
                // Auto-select first item in new vibe list
                const firstMatch = vibe.id === "all" ? LOOKBOOK_ITEMS[0] : LOOKBOOK_ITEMS.find((i) => i.vibeId === vibe.id);
                if (firstMatch) setSelectedLookId(firstMatch.id);
              }}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-300 ${
                activeVibe === vibe.id ? styles.activeTab : styles.inactiveTab
              }`}
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Main Interactive Showcase (Grid + Paired Product Spotlight) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Top: Lookbook Grid (8 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredLooks.map((look) => {
                const isSelected = look.id === activeLook.id;

                return (
                  <motion.div
                    key={look.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedLookId(look.id)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500 ${
                      isSelected
                        ? "border-[#007C74] ring-2 ring-[#007C74]/50 shadow-xl scale-[1.02]"
                        : `${styles.border} ${styles.glassBg} opacity-90 hover:opacity-100 hover:scale-[1.01]`
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={look.modelImage}
                        alt={look.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Hotspot Pin */}
                      <div className="absolute top-4 right-4 flex items-center justify-center">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007C74] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#007C74] border-2 border-white"></span>
                        </span>
                      </div>

                      {/* Vibe Tag Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {look.vibeName}
                        </span>
                      </div>

                      {/* Text Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#007C74]" />
                          <span>{look.location}</span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-[#00A693] transition-colors">
                          {look.title}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                          {look.tagline}
                        </p>

                        {/* Color Swatches */}
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className="text-[10px] text-white/50 uppercase tracking-widest mr-1">Palette:</span>
                          {look.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active Selected Bar */}
                    {isSelected && (
                      <div className="bg-[#007C74] py-2 px-4 text-center text-white text-xs font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Viewing Matched Eyewear
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right / Bottom: Paired Product Feature Spotlight (5 cols on lg) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className={`rounded-3xl p-6 sm:p-8 border ${styles.border} ${styles.glassBg} shadow-2xl relative overflow-hidden`}>
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#007C74]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200/20 dark:border-neutral-800/20">
                <div>
                  <span className="text-[11px] font-bold text-[#007C74] tracking-widest uppercase block mb-1">
                    Style Match Spotlight
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black ${styles.text}`}>
                    {activeLook.title}
                  </h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#007C74]/10 text-[#007C74]">
                  <Tag className="w-5 h-5" />
                </div>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${styles.textMuted} mb-6`}>
                {activeLook.description}
              </p>

              {/* Paired Product Render */}
              {isLoadingProducts ? (
                <div className="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              ) : pairedProduct ? (
                <div className="space-y-4">
                  <div className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                    Recommended Eyewear Pairing
                  </div>

                  {/* Render Product Card */}
                  <div className="transform transition-transform duration-300">
                    <ProductCard product={pairedProduct} />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-neutral-500">
                  No matching product found for this look.
                </div>
              )}

              {/* Action Links */}
              <div className="pt-6 mt-6 border-t border-neutral-200/20 dark:border-neutral-800/20 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Looking for custom options?
                </span>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007C74] hover:text-[#00A693] transition-colors"
                >
                  Browse Full Shop
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
