"use client";

import { HeroParallax } from "@/components/hero-parallax";
import { useGetFeaturedProductsQuery } from "@/redux/features/product/productApi";
import React, { useMemo } from "react";
import type { TProduct } from "@/types/types";

export default function HeroParallaxDemo() {
  const { data: response, isLoading } = useGetFeaturedProductsQuery(20);

  const products: TProduct[] = useMemo(() => response?.data || [], [response]);
  const productsWithImages = useMemo(
    () =>
      products.filter(
        (product) => product.variants?.[0]?.imgList?.[0]?.image
      ),
    [products]
  );

  const parallaxProducts = useMemo(() => {
    if (productsWithImages.length === 0) return [];
    const result: { title: string; link: string; thumbnail: string }[] = [];
    while (result.length < 15) {
      for (const product of productsWithImages) {
        if (result.length >= 15) break;
        result.push({
          title: product.title,
          link: `/product/${product.id}`,
          thumbnail: product.variants[0].imgList[0].image,
        });
      }
    }
    return result;
  }, [productsWithImages]);

  if (isLoading) {
    return (
      <div className="h-[180vh] sm:h-[240vh] py-16 sm:py-20 overflow-hidden antialiased relative flex flex-col justify-start items-center bg-background">
        <div className="max-w-7xl relative mx-auto py-10 md:py-20 lg:py-40 px-4 w-full left-0 top-0 animate-pulse">
          <div className="h-12 sm:h-16 w-3/4 bg-neutral-300 dark:bg-neutral-800 rounded-lg mb-6" />
          <div className="h-5 sm:h-6 w-1/2 bg-neutral-300 dark:bg-neutral-800 rounded-lg mb-4" />
          <div className="h-5 sm:h-6 w-1/3 bg-neutral-300 dark:bg-neutral-800 rounded-lg" />
        </div>
      </div>
    );
  }

  if (parallaxProducts.length === 0) {
    return null;
  }

  return <HeroParallax products={parallaxProducts} />;
}
