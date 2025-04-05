"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { MyButton } from "@/components/ui/buttons/MyButton/MyButton"
import ProductCard from "@/components/ui/ProductCard/ProductCard"
import type { TProduct } from "@/app/types/types"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./SimilarProducts.css"

interface SimilarProductsProps {
  currentProduct: TProduct
  allProducts: TProduct[]
}

export default function SimilarProducts({ currentProduct, allProducts }: SimilarProductsProps) {
  // Filter out the current product and find similar products
  // Products are considered similar if they have the same frame type, brand, or material
  const similarProducts = allProducts.filter(
    (product) =>
      product.id !== currentProduct.id &&
      (product.frameType === currentProduct.frameType ||
        product.brand === currentProduct.brand ||
        product.material === currentProduct.material),
  )

  if (similarProducts?.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Similar Products</h2>
        <div className="flex space-x-2">
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
        slidesPerView="auto"
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        loop={true}
        pagination={false}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="similar-products-swiper"
      >
        {allProducts?.map((product, index) => (
          <SwiperSlide key={index} className="swiper-slide-custom">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

