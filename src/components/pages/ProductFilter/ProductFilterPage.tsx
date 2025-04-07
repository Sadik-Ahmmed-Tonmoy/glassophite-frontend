/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import Head from "next/head"
import Script from "next/script"
import MobileFilterDrawer from "./mobile-filter-drawer"
import type { FilterState, SortOption } from "@/types/filter-types"
import { mockProducts } from "@/lib/productMockData"
import Breadcrumb from "./breadcrumb"
import FilterSection from "./filter-section"
import ProductSection from "./product-section"

export default function ProductFilterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse initial filters from URL
  const initialFilters: FilterState = {
    priceRange: [
      Number.parseInt(searchParams.get("minPrice") || "0"),
      Number.parseInt(searchParams.get("maxPrice") || "5000"),
    ],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    frameTypes: searchParams.get("frameTypes")?.split(",").filter(Boolean) || [],
    lensTypes: searchParams.get("lensTypes")?.split(",").filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    ratings: searchParams.get("ratings")?.split(",").map(Number).filter(Boolean) || [],
    inStock: searchParams.get("inStock") === "true" ? true : null,
  }

  // State for filters
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  // State for sorting
  const [sortOption, setSortOption] = useState<SortOption>((searchParams.get("sort") as SortOption) || "featured")

  // State for mobile filter visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // State for pagination
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"))
  const [productsPerPage, setProductsPerPage] = useState(Number.parseInt(searchParams.get("limit") || "6"))

  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  // Get all available filter options from products
  const allBrands = Array.from(new Set(mockProducts.map((product) => product.brand || "")))
  const allFrameTypes = Array.from(new Set(mockProducts.map((product) => product.frameType || "")))
  const allLensTypes = Array.from(new Set(mockProducts.map((product) => product.lensType || "")))
    .flatMap((lensType) => (lensType ? lensType.split(", ") : []))
    .filter((value, index, self) => self.indexOf(value) === index)
  const allColors = Array.from(
    new Set(
      mockProducts
        .flatMap((product) =>
          product.variants.map((variant) => ({ color: variant.color, title: variant.title.split(" ")[0] })),
        )
        .map((item) => JSON.stringify(item)),
    ),
  ).map((item) => JSON.parse(item))

  // Price range
  const minPrice = Math.min(
    ...mockProducts.flatMap((product) => product.variants.map((variant) => variant.priceAfterDiscount)),
  )
  const maxPrice = Math.max(
    ...mockProducts.flatMap((product) => product.variants.map((variant) => variant.priceAfterDiscount)),
  )

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    // Only add parameters that have values
    if (filters.priceRange[0] > minPrice) params.set("minPrice", filters.priceRange[0].toString())
    if (filters.priceRange[1] < maxPrice) params.set("maxPrice", filters.priceRange[1].toString())

    if (filters.brands.length > 0) params.set("brands", filters.brands.join(","))
    if (filters.frameTypes.length > 0) params.set("frameTypes", filters.frameTypes.join(","))
    if (filters.lensTypes.length > 0) params.set("lensTypes", filters.lensTypes.join(","))
    if (filters.colors.length > 0) params.set("colors", filters.colors.join(","))
    if (filters.ratings.length > 0) params.set("ratings", filters.ratings.join(","))
    if (filters.inStock !== null) params.set("inStock", filters.inStock.toString())

    if (sortOption !== "featured") params.set("sort", sortOption)
    if (currentPage > 1) params.set("page", currentPage.toString())
    if (productsPerPage !== 6) params.set("limit", productsPerPage.toString())

    // Update URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [filters, sortOption, currentPage, pathname, router, minPrice, maxPrice, productsPerPage])

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      let result = [...mockProducts]

      // Filter by price range
      result = result.filter((product) => {
        const productPrice = product.variants[0].priceAfterDiscount
        return productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1]
      })

      // Filter by brand
      if (filters.brands.length > 0) {
        result = result.filter((product) => filters.brands.includes(product.brand || ""))
      }

      // Filter by frame type
      if (filters.frameTypes.length > 0) {
        result = result.filter((product) => filters.frameTypes.includes(product.frameType || ""))
      }

      // Filter by lens type
      if (filters.lensTypes.length > 0) {
        result = result.filter((product) => {
          const productLensTypes = product.lensType ? product.lensType.split(", ") : []
          return filters.lensTypes.some((lensType) => productLensTypes.includes(lensType))
        })
      }

      // Filter by color
      if (filters.colors.length > 0) {
        result = result.filter((product) => product.variants.some((variant) => filters.colors.includes(variant.color)))
      }

      // Filter by rating
      if (filters.ratings.length > 0) {
        result = result.filter((product) => {
          const rating = Math.floor(product.averageRating || 0)
          return filters.ratings.includes(rating)
        })
      }

      // Filter by stock
      if (filters.inStock !== null) {
        result = result.filter((product) => product.variants.some((variant) => variant.inStock === filters.inStock))
      }

      // Apply sorting
      switch (sortOption) {
        case "price-low":
          result.sort((a, b) => a.variants[0].priceAfterDiscount - b.variants[0].priceAfterDiscount)
          break
        case "price-high":
          result.sort((a, b) => b.variants[0].priceAfterDiscount - a.variants[0].priceAfterDiscount)
          break
        case "rating":
          result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          break
        case "newest":
          result.sort((a, b) => b.id - a.id)
          break
        default:
          // Featured - could be a custom algorithm, here we'll use rating * reviews
          result.sort(
            (a, b) => (b.averageRating || 0) * (b.totalReviews || 0) - (a.averageRating || 0) * (a.totalReviews || 0),
          )
      }

      setFilteredProducts(result)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters, sortOption])

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "priceRange") {
        newFilters.priceRange = value
      } else if (filterType === "inStock") {
        newFilters.inStock = value
      } else if (Array.isArray(newFilters[filterType])) {
        const filterArray = newFilters[filterType] as any[]
        if (filterArray.includes(value)) {
          // Remove value if already selected
          newFilters[filterType] = filterArray.filter((item) => item !== value) as any
        } else {
          // Add value if not selected
          newFilters[filterType] = [...filterArray, value] as any
        }
      }

      return newFilters
    })

    // Reset to first page when filters change
    if (currentPage !== 1) setCurrentPage(1)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      brands: [],
      frameTypes: [],
      lensTypes: [],
      colors: [],
      ratings: [],
      inStock: null,
    })
    setSortOption("featured")
    setCurrentPage(1)

    // Clear URL parameters
    router.push(pathname, { scroll: false })
  }

  // Remove a single filter
  const removeFilter = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "priceRange") {
        newFilters.priceRange = [minPrice, maxPrice]
      } else if (filterType === "inStock") {
        newFilters.inStock = null
      } else if (Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = (newFilters[filterType] as any[]).filter((item) => item !== value) as any
      }

      return newFilters
    })
  }

  // Add a handler for changing products per page
  const handleProductsPerPageChange = (limit: number) => {
    setProductsPerPage(limit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Check if any filters are applied
  const hasActiveFilters = () => {
    return (
      filters.brands.length > 0 ||
      filters.frameTypes.length > 0 ||
      filters.lensTypes.length > 0 ||
      filters.colors.length > 0 ||
      filters.ratings.length > 0 ||
      filters.inStock !== null ||
      filters.priceRange[0] > minPrice ||
      filters.priceRange[1] < maxPrice
    )
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    count += filters.brands.length
    count += filters.frameTypes.length
    count += filters.lensTypes.length
    count += filters.colors.length
    count += filters.ratings.length
    if (filters.inStock !== null) count += 1
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count += 1
    return count
  }

  // Generate meta title and description based on filters
  const getMetaTitle = () => {
    let title = "Eyewear Collection"

    if (filters.brands.length === 1) {
      title = `${filters.brands[0]} Eyewear`
    }

    if (filters.frameTypes.length === 1) {
      title = `${filters.frameTypes[0]} ${title}`
    }

    if (filters.lensTypes.length === 1) {
      title = `${filters.lensTypes[0]} ${title}`
    }

    if (currentPage > 1) {
      title += ` - Page ${currentPage}`
    }

    return title
  }

  const getMetaDescription = () => {
    let description = "Browse our premium collection of eyewear including sunglasses and prescription glasses."

    const filterParts = []

    if (filters.brands.length > 0) {
      filterParts.push(`brands like ${filters.brands.join(", ")}`)
    }

    if (filters.frameTypes.length > 0) {
      filterParts.push(`${filters.frameTypes.join(", ")} frames`)
    }

    if (filters.lensTypes.length > 0) {
      filterParts.push(`${filters.lensTypes.join(", ")} lenses`)
    }

    if (filterParts.length > 0) {
      description = `Discover our selection of eyewear with ${filterParts.join(" and ")}. ${description}`
    }

    return description
  }

  // Generate canonical URL
  const getCanonicalUrl = () => {
    // Base URL - in production, this would be your actual domain
    const baseUrl = "https://yourdomain.com"

    // For SEO, the canonical URL should typically be the unfiltered version
    // or the first page of filtered results
    if (!hasActiveFilters() && currentPage === 1) {
      return `${baseUrl}${pathname}`
    }

    // If we have filters but we're not on page 1, canonical should point to page 1
    if (hasActiveFilters() && currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      return `${baseUrl}${pathname}?${params.toString()}`
    }

    // Otherwise, use the current URL
    return `${baseUrl}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  }

  // Generate structured data for product listing
  const generateStructuredData = () => {
    const itemListElement = currentProducts.map((product, index) => ({
      "@type": "ListItem",
      position: indexOfFirstProduct + index + 1,
      item: {
        "@type": "Product",
        name: product.variants[0].title,
        image: product.variants[0].imgList[0].image,
        description: product.variants[0].shortDescription,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        offers: {
          "@type": "Offer",
          price: product.variants[0].priceAfterDiscount,
          priceCurrency: "USD",
          availability: product.variants[0].inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
        aggregateRating: product.averageRating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.averageRating,
              reviewCount: product.totalReviews,
            }
          : undefined,
      },
    }))

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: itemListElement,
      numberOfItems: currentProducts.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    }
  }

  const structuredData = generateStructuredData()
  const metaTitle = getMetaTitle()
  const metaDescription = getMetaDescription()
  const canonicalUrl = getCanonicalUrl()

  // Prepare filter props
  const filterProps = {
    filters,
    allBrands,
    allFrameTypes,
    allLensTypes,
    allColors,
    minPrice,
    maxPrice,
    handleFilterChange,
    removeFilter,
    clearAllFilters,
    hasActiveFilters: hasActiveFilters(),
  }

  // Prepare product props
  const productProps = {
    products: currentProducts,
    filteredProducts,
    isLoading,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    paginate,
    indexOfFirstProduct,
    indexOfLastProduct,
    totalProducts: filteredProducts.length,
    productsPerPage,
    onProductsPerPageChange: handleProductsPerPageChange,
    clearAllFilters,
    getActiveFilterCount: getActiveFilterCount(),
    setMobileFiltersOpen,
  }

  // Prepare breadcrumb props
  const breadcrumbProps = {
    filters,
  }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="/twitter-image.jpg" />
      </Head>

      {/* Structured data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <motion.div className="bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {/* Mobile filter drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <MobileFilterDrawer
              filters={filters}
              allBrands={allBrands}
              allFrameTypes={allFrameTypes}
              allLensTypes={allLensTypes}
              allColors={allColors}
              minPrice={minPrice}
              maxPrice={maxPrice}
              handleFilterChange={handleFilterChange}
              onClose={() => setMobileFiltersOpen(false)}
            />
          )}
        </AnimatePresence>

        <main className="container">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{metaTitle}</h1>
          </div>

          {/* Breadcrumb component */}
          <Breadcrumb {...breadcrumbProps} />

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Left side - Filter section */}
              <FilterSection {...filterProps} />

              {/* Right side - Product section */}
              <ProductSection {...productProps} />
            </div>
          </section>
        </main>
      </motion.div>
    </>
  )
}

