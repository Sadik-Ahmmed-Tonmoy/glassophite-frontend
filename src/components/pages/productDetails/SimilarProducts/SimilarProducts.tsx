"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { MyButton } from "@/components/ui/buttons/MyButton/MyButton"
import ProductCard from "@/components/ui/ProductCard/ProductCard"
import { useGetSimilarProductsQuery } from "@/redux/features/product/productApi"
import type { TProduct } from "@/types/types"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./SimilarProducts.css"

interface SimilarProductsProps {
  productId: string
}

function ProductCardSkeleton() {
  return (
    <div className="h-full rounded-2xl bg-white/5 dark:bg-white/5 border border-neutral-200/20 dark:border-neutral-800/20 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-250 dark:bg-neutral-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-250 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-250 dark:bg-neutral-800 rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 bg-neutral-250 dark:bg-neutral-800 rounded" />
          <div className="h-4 w-16 bg-neutral-250 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function SimilarProducts({ productId }: SimilarProductsProps) {
  const { data: similarData, isLoading, error } = useGetSimilarProductsQuery({
    id: productId,
    limit: 12,
  })

  const similarProducts = (similarData as { data?: TProduct[] })?.data || []

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error || similarProducts.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Similar Products</h2>
        <div className="hidden sm:flex space-x-2">
          <MyButton variant="outline" size="icon" className="rounded-full h-8 w-8 swiper-button-prev-custom">
            <ChevronLeft className="h-4 w-4" />
          </MyButton>
         
          <MyButton variant="outline" size="icon" className="rounded-full h-8 w-8 swiper-button-next-custom">
            <ChevronRight className="h-4 w-4" />
          </MyButton>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        loop={similarProducts.length >= 4}
        pagination={{ clickable: true }}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 1.6,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="similar-products-swiper"
      >
        {similarProducts.map((product: TProduct, index: number) => (
          <SwiperSlide key={index} className="swiper-slide-custom">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
