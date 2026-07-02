/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import Head from "next/head"
import Script from "next/script"
import { useTheme } from "next-themes"
import {  SlidersHorizontal, X } from "lucide-react"
import MobileFilterDrawer from "./mobile-filter-drawer"
import type { FilterOptionCounts, FilterState, SortOption } from "@/types/filter-types"
import { mockProducts } from "@/lib/productMockData"
import Breadcrumb from "./breadcrumb"
import FilterSection from "./filter-section"
import ProductSection from "./product-section"

const collectionOptions = [
  { label: "Sunglass", value: "sunglasses", type: "category" },
  { label: "Optical", value: "optical", type: "category" },
  { label: "Accessories", value: "accessories", type: "category" },
  { label: "Sale", value: "sale", type: "sale" },
  { label: "Contact Lens", value: "contact-lens", type: "category" },
] as const

const getInitialBrandsFromParams = (searchParams: Pick<URLSearchParams, "get">) => {
  const brands = searchParams.get("brands")?.split(",").filter(Boolean) || []
  const brand = searchParams.get("brand")
  return brand && !brands.includes(brand) ? [brand, ...brands] : brands
}

const getInitialCategoriesFromParams = (searchParams: Pick<URLSearchParams, "get">) => {
  return searchParams.get("category")?.split(",").filter(Boolean) || []
}

const isSaleProduct = (product: (typeof mockProducts)[number]) => {
  const discount = Number.parseInt(String(product.discountPercent || "0"))
  return discount > 0 || Boolean(product.priceAfterDiscount && product.mainPrice && product.priceAfterDiscount < product.mainPrice)
}

export default function ProductFilterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Parse initial filters from URL
  const initialFilters: FilterState = {
    priceRange: [
      Number.parseInt(searchParams.get("minPrice") || "0"),
      Number.parseInt(searchParams.get("maxPrice") || "5000"),
    ],
    categories: getInitialCategoriesFromParams(searchParams),
    saleOnly: searchParams.get("sale") === "true",
    brands: getInitialBrandsFromParams(searchParams),
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

  const optionCounts: FilterOptionCounts = {
    collections: collectionOptions.reduce<Record<string, number>>((counts, option) => {
      if (option.type === "sale") {
        counts[option.value] = mockProducts.filter(isSaleProduct).length
        return counts
      }

      counts[option.value] =
        option.value === "sunglasses"
          ? mockProducts.length
          : mockProducts.filter((product) => product.category?.toLowerCase() === option.value).length

      return counts
    }, {}),
    brands: allBrands.reduce<Record<string, number>>((counts, brand) => {
      counts[brand] = mockProducts.filter((product) => product.brand === brand).length
      return counts
    }, {}),
    frameTypes: allFrameTypes.reduce<Record<string, number>>((counts, frameType) => {
      counts[frameType] = mockProducts.filter((product) => product.frameType === frameType).length
      return counts
    }, {}),
    lensTypes: allLensTypes.reduce<Record<string, number>>((counts, lensType) => {
      counts[lensType] = mockProducts.filter((product) => product.lensType?.split(", ").includes(lensType)).length
      return counts
    }, {}),
    colors: allColors.reduce<Record<string, number>>((counts, colorObj: { color: string; title: string }) => {
      counts[colorObj.color] = mockProducts.filter((product) =>
        product.variants.some((variant) => variant.color === colorObj.color)
      ).length
      return counts
    }, {}),
    ratings: [5, 4, 3, 2, 1].reduce<Record<number, number>>((counts, rating) => {
      counts[rating] = mockProducts.filter((product) => Math.floor(product.averageRating || 0) === rating).length
      return counts
    }, {}),
    inStock: mockProducts.filter((product) => product.variants.some((variant) => variant.inStock)).length,
  }

  // Price range
  const minPrice = Math.min(
    ...mockProducts.flatMap((product) => product.variants.map((variant) => variant.priceAfterDiscount)),
  )
  const maxPrice = Math.max(
    ...mockProducts.flatMap((product) => product.variants.map((variant) => variant.priceAfterDiscount)),
  )

  // Sync URL search params to React state
  useEffect(() => {
    const minP = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxP = Number.parseInt(searchParams.get("maxPrice") || "5000")
    const categories = getInitialCategoriesFromParams(searchParams)
    const saleOnly = searchParams.get("sale") === "true"
    const brands = getInitialBrandsFromParams(searchParams)
    const frameTypes = searchParams.get("frameTypes")?.split(",").filter(Boolean) || []
    const lensTypes = searchParams.get("lensTypes")?.split(",").filter(Boolean) || []
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || []
    const ratings = searchParams.get("ratings")?.split(",").map(Number).filter(Boolean) || []
    const inStock = searchParams.get("inStock") === "true" ? true : searchParams.get("inStock") === "false" ? false : null

    setFilters((prev) => {
      if (
        prev.priceRange[0] === minP &&
        prev.priceRange[1] === maxP &&
        prev.categories.length === categories.length && prev.categories.every((v, i) => v === categories[i]) &&
        prev.saleOnly === saleOnly &&
        prev.brands.length === brands.length && prev.brands.every((v, i) => v === brands[i]) &&
        prev.frameTypes.length === frameTypes.length && prev.frameTypes.every((v, i) => v === frameTypes[i]) &&
        prev.lensTypes.length === lensTypes.length && prev.lensTypes.every((v, i) => v === lensTypes[i]) &&
        prev.colors.length === colors.length && prev.colors.every((v, i) => v === colors[i]) &&
        prev.ratings.length === ratings.length && prev.ratings.every((v, i) => v === ratings[i]) &&
        prev.inStock === inStock
      ) {
        return prev
      }
      return {
        priceRange: [minP, maxP],
        categories,
        saleOnly,
        brands,
        frameTypes,
        lensTypes,
        colors,
        ratings,
        inStock,
      }
    })

    const sort = (searchParams.get("sort") as SortOption) || "featured"
    setSortOption((prev) => (prev === sort ? prev : sort))

    const page = Number.parseInt(searchParams.get("page") || "1")
    setCurrentPage((prev) => (prev === page ? prev : page))

    const limit = Number.parseInt(searchParams.get("limit") || "6")
    setProductsPerPage((prev) => (prev === limit ? prev : limit))
  }, [searchParams])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    const updateParam = (key: string, value: string | null, defaultValue?: string) => {
      if (value && value !== defaultValue) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }

    updateParam("minPrice", filters.priceRange[0] > minPrice ? filters.priceRange[0].toString() : null)
    updateParam("maxPrice", filters.priceRange[1] < maxPrice ? filters.priceRange[1].toString() : null)

    updateParam("category", filters.categories.length > 0 ? filters.categories.join(",") : null)
    updateParam("sale", filters.saleOnly ? "true" : null)
    params.delete("brand")
    updateParam("brands", filters.brands.length > 0 ? filters.brands.join(",") : null)
    updateParam("frameTypes", filters.frameTypes.length > 0 ? filters.frameTypes.join(",") : null)
    updateParam("lensTypes", filters.lensTypes.length > 0 ? filters.lensTypes.join(",") : null)
    updateParam("colors", filters.colors.length > 0 ? filters.colors.join(",") : null)
    updateParam("ratings", filters.ratings.length > 0 ? filters.ratings.join(",") : null)
    updateParam("inStock", filters.inStock !== null ? filters.inStock.toString() : null)

    updateParam("sort", sortOption, "featured")
    updateParam("page", currentPage > 1 ? currentPage.toString() : null)
    updateParam("limit", productsPerPage !== 6 ? productsPerPage.toString() : null)

    const newSearch = params.toString()
    const currentSearch = searchParams.toString()

    if (newSearch !== currentSearch) {
      router.push(`${pathname}?${newSearch}`, { scroll: false })
    }
  }, [filters, sortOption, currentPage, pathname, router, minPrice, maxPrice, productsPerPage, searchParams])

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
      let result = [...mockProducts]

      if (filters.categories.length > 0) {
        result = result.filter((product) => {
          const productCategory = product.category?.toLowerCase()
          return filters.categories.some((category) => {
            if (category === "sunglasses") return true
            return productCategory === category.toLowerCase()
          })
        })
      }

      if (filters.saleOnly) {
        result = result.filter((product) => {
          const discount = Number.parseInt(String(product.discountPercent || "0"))
          return discount > 0 || (product.priceAfterDiscount && product.mainPrice && product.priceAfterDiscount < product.mainPrice)
        })
      }

      result = result.filter((product) => {
        const productPrice = product.variants[0].priceAfterDiscount
        return productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1]
      })

      if (filters.brands.length > 0) {
        result = result.filter((product) => filters.brands.includes(product.brand || ""))
      }

      if (filters.frameTypes.length > 0) {
        result = result.filter((product) => filters.frameTypes.includes(product.frameType || ""))
      }

      if (filters.lensTypes.length > 0) {
        result = result.filter((product) => {
          const productLensTypes = product.lensType ? product.lensType.split(", ") : []
          return filters.lensTypes.some((lensType) => productLensTypes.includes(lensType))
        })
      }

      if (filters.colors.length > 0) {
        result = result.filter((product) => product.variants.some((variant) => filters.colors.includes(variant.color)))
      }

      if (filters.ratings.length > 0) {
        result = result.filter((product) => {
          const rating = Math.floor(product.averageRating || 0)
          return filters.ratings.includes(rating)
        })
      }

      if (filters.inStock !== null) {
        result = result.filter((product) => product.variants.some((variant) => variant.inStock === filters.inStock))
      }

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
          result.sort((a, b) => Number(b.id) - Number(a.id))
          break
        default:
          result.sort(
            (a, b) => (b.averageRating || 0) * (b.totalReviews || 0) - (a.averageRating || 0) * (a.totalReviews || 0),
          )
      }

      setFilteredProducts(result)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters, sortOption, searchParams])

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "priceRange") {
        newFilters.priceRange = value
      } else if (filterType === "inStock") {
        newFilters.inStock = value
      } else if (filterType === "saleOnly") {
        newFilters.saleOnly = value
      } else if (Array.isArray(newFilters[filterType])) {
        if (Array.isArray(value)) {
          newFilters[filterType] = value as any
          return newFilters
        }

        const filterArray = newFilters[filterType] as any[]
        if (filterArray.includes(value)) {
          newFilters[filterType] = filterArray.filter((item) => item !== value) as any
        } else {
          newFilters[filterType] = [...filterArray, value] as any
        }
      }

      return newFilters
    })

    if (currentPage !== 1) setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      categories: [],
      saleOnly: false,
      brands: [],
      frameTypes: [],
      lensTypes: [],
      colors: [],
      ratings: [],
      inStock: null,
    })
    setSortOption("featured")
    setCurrentPage(1)

    // Clear only managed filters from the URL, preserving others
    const params = new URLSearchParams(searchParams.toString())
    const managedKeys = ["minPrice", "maxPrice", "category", "sale", "brand", "brands", "frameTypes", "lensTypes", "colors", "ratings", "inStock", "sort", "page", "limit"]
    managedKeys.forEach((key) => params.delete(key))

    const newSearch = params.toString()
    router.push(newSearch ? `${pathname}?${newSearch}` : pathname, { scroll: false })
  }

  const removeFilter = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "priceRange") {
        newFilters.priceRange = [minPrice, maxPrice]
      } else if (filterType === "inStock") {
        newFilters.inStock = null
      } else if (filterType === "saleOnly") {
        newFilters.saleOnly = false
      } else if (Array.isArray(newFilters[filterType])) {
        newFilters[filterType] = (newFilters[filterType] as any[]).filter((item) => item !== value) as any
      }

      return newFilters
    })
  }

  const handleProductsPerPageChange = (limit: number) => {
    setProductsPerPage(limit)
    setCurrentPage(1)
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const hasActiveFilters = () => {
    return (
      filters.brands.length > 0 ||
      filters.categories.length > 0 ||
      filters.saleOnly ||
      filters.frameTypes.length > 0 ||
      filters.lensTypes.length > 0 ||
      filters.colors.length > 0 ||
      filters.ratings.length > 0 ||
      filters.inStock !== null ||
      filters.priceRange[0] > minPrice ||
      filters.priceRange[1] < maxPrice
    )
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.brands.length
    count += filters.categories.length
    if (filters.saleOnly) count += 1
    count += filters.frameTypes.length
    count += filters.lensTypes.length
    count += filters.colors.length
    count += filters.ratings.length
    if (filters.inStock !== null) count += 1
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count += 1
    return count
  }

  const getMetaTitle = () => {
    let title = "Eyewear Collection"
    if (filters.categories.length === 1) {
      const option = collectionOptions.find((item) => item.value === filters.categories[0])
      title = `${option?.label || filters.categories[0]} Eyewear`
    }
    if (filters.saleOnly) title = `Sale ${title}`
    if (filters.brands.length === 1) title = `${filters.brands[0]} Eyewear`
    if (filters.frameTypes.length === 1) title = `${filters.frameTypes[0]} ${title}`
    if (filters.lensTypes.length === 1) title = `${filters.lensTypes[0]} ${title}`
    if (currentPage > 1) title += ` - Page ${currentPage}`
    return title
  }

  const getMetaDescription = () => {
    let description = "Browse our premium collection of eyewear including sunglasses and prescription glasses."
    const filterParts = []
    if (filters.categories.length > 0) {
      const labels = filters.categories.map((category) => collectionOptions.find((item) => item.value === category)?.label || category)
      filterParts.push(`collections like ${labels.join(", ")}`)
    }
    if (filters.saleOnly) filterParts.push("sale items")
    if (filters.brands.length > 0) filterParts.push(`brands like ${filters.brands.join(", ")}`)
    if (filters.frameTypes.length > 0) filterParts.push(`${filters.frameTypes.join(", ")} frames`)
    if (filters.lensTypes.length > 0) filterParts.push(`${filters.lensTypes.join(", ")} lenses`)
    if (filterParts.length > 0) description = `Discover our selection of eyewear with ${filterParts.join(" and ")}. ${description}`
    return description
  }

  const getCanonicalUrl = () => {
    const baseUrl = "https://yourdomain.com"
    if (!hasActiveFilters() && currentPage === 1) return `${baseUrl}${pathname}`
    if (hasActiveFilters() && currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      return `${baseUrl}${pathname}?${params.toString()}`
    }
    return `${baseUrl}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  }

  const generateStructuredData = () => {
    const itemListElement = currentProducts.map((product, index) => ({
      "@type": "ListItem",
      position: indexOfFirstProduct + index + 1,
      item: {
        "@type": "Product",
        name: product.variants[0].title,
        image: product.variants[0].imgList[0].image,
        description: product.variants[0].shortDescription,
        brand: { "@type": "Brand", name: product.brand },
        offers: {
          "@type": "Offer",
          price: product.variants[0].priceAfterDiscount,
          priceCurrency: "USD",
          availability: product.variants[0].inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
        aggregateRating: product.averageRating ? {
          "@type": "AggregateRating",
          ratingValue: product.averageRating,
          reviewCount: product.totalReviews,
        } : undefined,
      },
    }))

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement,
      numberOfItems: currentProducts.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    }
  }

  const structuredData = generateStructuredData()
  const metaTitle = getMetaTitle()
  const metaDescription = getMetaDescription()
  const canonicalUrl = getCanonicalUrl()

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      gradient: "from-[#007C74] to-[#3C55A5]",
      button: "bg-white/10 hover:bg-white/20 text-white",
      activeFilter: "bg-[#007C74]/20 text-[#007C74] border-[#007C74]/30",
    },
    light: {
      bg: "bg-neutral-50",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      gradient: "from-[#007C74] to-[#3C55A5]",
      button: "bg-neutral-200 hover:bg-neutral-300 text-neutral-900",
      activeFilter: "bg-[#007C74]/10 text-[#007C74] border-[#007C74]/30",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Filter props
  const filterProps = {
    filters,
    collectionOptions,
    optionCounts,
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

  // Product props
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

  // Breadcrumb props
  const breadcrumbProps = { filters }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="/twitter-image.jpg" />
      </Head>

      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen transition-colors duration-500 ${styles.bg}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="fixed top-20 left-20 w-96 h-96 bg-[#007C74]/10 rounded-full blur-[120px] -z-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="fixed bottom-20 right-20 w-[500px] h-[500px] bg-[#3C55A5]/10 rounded-full blur-[150px] -z-10"
        />

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <MobileFilterDrawer
              filters={filters}
              optionCounts={optionCounts}
              allBrands={allBrands}
              collectionOptions={collectionOptions}
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

        <main className="container relative z-10 lg:mt-28">
          {/* Header with title and mobile filter button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 pt-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${styles.text}`}>
                {metaTitle}
              </h1>
              <p className={`text-sm ${styles.textMutedLighter} mt-1`} data-translate="filter.results">
                {filteredProducts.length} products found
              </p>
            </motion.div>

            {/* Mobile filter toggle */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => setMobileFiltersOpen(true)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${styles.card} ${styles.cardHover} transition-colors`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm" data-translate="filter.filter">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="px-2 py-0.5 text-xs bg-[#007C74] text-white rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </motion.button>
          </div>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:py-4"
          >
            <Breadcrumb {...breadcrumbProps} />
          </motion.div>

          {/* Active filters bar (for desktop) */}
          {hasActiveFilters() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex lg:hidden flex-wrap items-center gap-2 py-4"
            >
              <span className={`text-sm ${styles.textMutedLighter}`} data-translate="filter.active">
                Active filters:
              </span>
              {filters.brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => removeFilter("brands", brand)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  {brand}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.categories.map((category) => {
                const option = collectionOptions.find((item) => item.value === category)
                return (
                  <button
                    key={category}
                    onClick={() => removeFilter("categories", category)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                  >
                    {option?.label || category}
                    <X className="w-3 h-3" />
                  </button>
                )
              })}
              {filters.saleOnly && (
                <button
                  onClick={() => removeFilter("saleOnly", null)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  Sale
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.frameTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => removeFilter("frameTypes", type)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  {type}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.lensTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => removeFilter("lensTypes", type)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  {type}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.colors.map((color) => {
                const colorObj = allColors.find((c: any) => c.color === color)
                return (
                  <button
                    key={color}
                    onClick={() => removeFilter("colors", color)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    {colorObj?.title || color}
                    <X className="w-3 h-3" />
                  </button>
                )
              })}
              {filters.ratings.map((rating) => (
                <button
                  key={rating}
                  onClick={() => removeFilter("ratings", rating)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  {rating}★
                  <X className="w-3 h-3" />
                </button>
              ))}
              {filters.inStock !== null && (
                <button
                  onClick={() => removeFilter("inStock", null)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  {filters.inStock ? "In Stock" : "Out of Stock"}
                  <X className="w-3 h-3" />
                </button>
              )}
              {(filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) && (
                <button
                  onClick={() => removeFilter("priceRange", null)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${styles.activeFilter}`}
                >
                  ৳{filters.priceRange[0]} - ৳{filters.priceRange[1]}
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className={`text-xs underline ${styles.textMutedLighter} hover:text-[#007C74] transition-colors`}
                data-translate="filter.clearAll"
              >
                Clear all
              </button>
            </motion.div>
          )}

          <section aria-labelledby="products-heading" className="pb-24 lg:pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Left side - Filter section (desktop) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="hidden lg:block"
              >
                <FilterSection {...filterProps} />
              </motion.div>

              {/* Right side - Product section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="lg:col-span-3"
              >
                <ProductSection {...productProps} />
              </motion.div>
            </div>
          </section>
        </main>
      </motion.div>
    </>
  )
}
