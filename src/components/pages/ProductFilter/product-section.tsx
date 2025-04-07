"use client"
import ProductGrid from "./product-grid"
import Pagination from "./pagination"


import type { SortOption } from "@/types/filter-types"
import { TProduct } from "@/types/types"
import ProductHeader from "./product-header"

interface ProductSectionProps {
  products: TProduct[]
  filteredProducts: TProduct[]
  isLoading: boolean
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  currentPage: number
  totalPages: number
  paginate: (pageNumber: number) => void
  indexOfFirstProduct: number
  indexOfLastProduct: number
  totalProducts: number
  productsPerPage: number
  onProductsPerPageChange: (limit: number) => void
  clearAllFilters: () => void
  getActiveFilterCount: number
  setMobileFiltersOpen: (open: boolean) => void
}

export default function ProductSection({
  products,
  filteredProducts,
  isLoading,
  sortOption,
  setSortOption,
  currentPage,
  totalPages,
  paginate,
  indexOfFirstProduct,
  indexOfLastProduct,
  totalProducts,
  productsPerPage,
  onProductsPerPageChange,
  clearAllFilters,
  getActiveFilterCount,
  setMobileFiltersOpen,
}: ProductSectionProps) {
  return (
    <div className="lg:col-span-3">
      {/* Product header with count, sort and mobile filter button */}
      <ProductHeader
        totalProducts={totalProducts}
        sortOption={sortOption}
        setSortOption={setSortOption}
        setMobileFiltersOpen={setMobileFiltersOpen}
        activeFilterCount={getActiveFilterCount}
      />

      {/* Product grid */}
      <ProductGrid products={products} isLoading={isLoading} clearAllFilters={clearAllFilters} />

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          totalProducts={totalProducts}
          productsPerPage={productsPerPage}
          onProductsPerPageChange={onProductsPerPageChange}
        />
      )}
    </div>
  )
}

