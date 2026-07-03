/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import Head from "next/head"
import Script from "next/script"
import { useTheme } from "next-themes"
import { SlidersHorizontal, X } from "lucide-react"
import MobileFilterDrawer from "./mobile-filter-drawer"
import type { FilterOptionCounts, FilterState, SortOption } from "@/types/filter-types"
import { useGetAllProductsQuery, useGetFilterOptionsQuery } from "@/redux/features/product/productApi"
import { useGetAllNavbarMenusQuery } from "@/redux/features/navbar/navbarApi"
import Breadcrumb from "./breadcrumb"
import FilterSection from "./filter-section"
import ProductSection from "./product-section"
import { normalizeCategoryForDB, normalizeCategoryForUI } from "@/lib/utils"

const getInitialBrandsFromParams = (searchParams: Pick<URLSearchParams, "get">) => {
  const brands = searchParams.get("brands")?.split(",").filter(Boolean) || []
  const brand = searchParams.get("brand")
  return brand && !brands.includes(brand) ? [brand, ...brands] : brands
}

const getInitialCategoriesFromParams = (searchParams: Pick<URLSearchParams, "get">) => {
  const raw = searchParams.get("category")?.split(",").filter(Boolean) || []
  return raw.map(normalizeCategoryForDB)
}

export default function ProductFilterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const initialFilters: FilterState = {
    priceRange: [
      Number.parseInt(searchParams.get("minPrice") || "0"),
      Number.parseInt(searchParams.get("maxPrice") || "5000"),
    ],
    categories: getInitialCategoriesFromParams(searchParams),
    subCategories: searchParams.get("subCategory")?.split(",").filter(Boolean) || [],
    types: searchParams.get("type")?.split(",").filter(Boolean) || [],
    saleOnly: searchParams.get("sale") === "true",
    brands: getInitialBrandsFromParams(searchParams),
    frameTypes: searchParams.get("frameTypes")?.split(",").filter(Boolean) || [],
    lensTypes: searchParams.get("lensTypes")?.split(",").filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    ratings: searchParams.get("ratings")?.split(",").map(Number).filter(Boolean) || [],
    inStock: searchParams.get("inStock") === "true" ? true : null,
  }

  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [sortOption, setSortOption] = useState<SortOption>((searchParams.get("sort") as SortOption) || "featured")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"))
  const [productsPerPage, setProductsPerPage] = useState(Number.parseInt(searchParams.get("limit") || "12"))

  // Special boolean categories check
  const isNewArrivalSelected = filters.categories.some((c) => c.toLowerCase() === "new arrivals")
  const isBestSellerSelected = filters.categories.some((c) => c.toLowerCase() === "best sellers" || c.toLowerCase() === "best seller")
  const isFeaturedSelected = filters.categories.some((c) => c.toLowerCase() === "featured" || c.toLowerCase() === "featured picks")
  const isTrendingSelected = filters.categories.some((c) => c.toLowerCase() === "trending" || c.toLowerCase() === "trending now")

  const specialCategories = ["new arrivals", "best sellers", "best seller", "featured", "featured picks", "trending", "trending now"]
  const categoriesQueryParam = filters.categories
    .filter((c) => !specialCategories.includes(c.toLowerCase()))
    .map(normalizeCategoryForDB)
    .join(",") || undefined

  const { data: productsData, isLoading, isFetching } = useGetAllProductsQuery({
    page: currentPage,
    limit: productsPerPage,
    sortBy: sortOption === "price-low" ? "price_asc" : sortOption === "price-high" ? "price_desc" : sortOption === "newest" ? "newest" : sortOption === "rating" ? "rating" : undefined,
    categories: categoriesQueryParam,
    subCategories: filters.subCategories.length > 0 ? filters.subCategories.join(",") : undefined,
    types: filters.types.length > 0 ? filters.types.join(",") : undefined,
    brand: filters.brands.length === 1 ? filters.brands[0] : undefined,
    frameType: filters.frameTypes.length === 1 ? filters.frameTypes[0] : undefined,
    lensType: filters.lensTypes.length === 1 ? filters.lensTypes[0] : undefined,
    inStock: filters.inStock ?? undefined,
    priceMin: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    priceMax: filters.priceRange[1] < 5000 ? filters.priceRange[1] : undefined,
    isNewArrival: isNewArrivalSelected ? true : undefined,
    isBestSeller: isBestSellerSelected ? true : undefined,
    isFeatured: isFeaturedSelected ? true : undefined,
    isTrending: isTrendingSelected ? true : undefined,
  })

  const { data: filterOptionsData } = useGetFilterOptionsQuery(undefined)
  const backendFilterOptions = useMemo(() => filterOptionsData?.data || {}, [filterOptionsData])

  const { data: navbarData } = useGetAllNavbarMenusQuery(undefined)
  const navbarMenus = useMemo(() => navbarData?.data || [], [navbarData])

  const navbarCategoryOptions = useMemo(() => {
    const options = navbarMenus.map((menu: any) => ({
      label: menu.menu,
      value: menu.menu,
      type: "category" as const,
    }))
    options.push({ label: "Sale", value: "sale", type: "sale" as const })
    return options
  }, [navbarMenus])

  const products = useMemo(() => productsData?.data || [], [productsData])
  const total = productsData?.meta?.total || 0
  const totalPages = Math.ceil(total / productsPerPage)

  const allBrands: string[] = useMemo(() => {
    const fromBackend = (backendFilterOptions.brands || []) as string[]
    const fromFilters = filters.brands.filter((b) => b && !fromBackend.includes(b))
    return [...fromBackend, ...fromFilters]
  }, [backendFilterOptions, filters.brands])
  const allSubCategories: string[] = useMemo(() => {
    const subs = new Set<string>()
    navbarMenus.forEach((menu: any) => {
      ;(menu.subMenu || []).forEach((sub: any) => {
        if (sub.subMenuTitle) subs.add(sub.subMenuTitle)
      })
    })
    const active = filters.subCategories.filter((sc) => sc && !subs.has(sc))
    return [...Array.from(subs), ...active]
  }, [navbarMenus, filters.subCategories])
  const allTypes: string[] = useMemo(() => {
    const types = new Set<string>()
    navbarMenus.forEach((menu: any) => {
      ;(menu.subMenu || []).forEach((sub: any) => {
        ;(sub.chieldMenu || []).forEach((child: any) => {
          if (child.chieldMenuTitle) types.add(child.chieldMenuTitle)
        })
      })
    })
    const active = filters.types.filter((t) => t && !types.has(t))
    return [...Array.from(types), ...active]
  }, [navbarMenus, filters.types])
  const allFrameTypes: string[] = useMemo(() => {
    const fromBackend = (backendFilterOptions.frameTypes || []) as string[]
    const fromFilters = filters.frameTypes.filter((f) => f && !fromBackend.includes(f))
    return [...fromBackend, ...fromFilters]
  }, [backendFilterOptions, filters.frameTypes])
  const allLensTypes: string[] = useMemo(() => {
    const fromBackend = (backendFilterOptions.lensTypes || []) as string[]
    const fromFilters = filters.lensTypes.filter((l) => l && !fromBackend.includes(l))
    return [...fromBackend, ...fromFilters]
  }, [backendFilterOptions, filters.lensTypes])
  const allColors: { color: string; title: string }[] = useMemo(() =>
    Array.from(new Set(products.flatMap((p: any) => p.variants?.map((v: any) => JSON.stringify({ color: v.color, title: v.title.split(" ")[0] })) || [])))
      .map((item: any) => JSON.parse(item)),
  [products])

  const minPrice = useMemo(() => {
    const prices = products.flatMap((p: any) => p.variants?.map((v: any) => v.priceAfterDiscount) || [])
    return prices.length ? Math.min(...prices) : 0
  }, [products])

  const maxPrice = useMemo(() => {
    const prices = products.flatMap((p: any) => p.variants?.map((v: any) => v.priceAfterDiscount) || [])
    return prices.length ? Math.max(...prices) : 5000
  }, [products])

  const optionCounts: FilterOptionCounts = useMemo(() => {
    const collections: Record<string, number> = {}

    // Explicitly calculate highlight options counts
    collections["New Arrivals"] = products.filter((p: any) => p.isNewArrival).length
    collections["Best Sellers"] = products.filter((p: any) => p.isBestSeller).length
    collections["Trending Now"] = products.filter((p: any) => p.isTrending).length
    collections["Featured Picks"] = products.filter((p: any) => p.isFeatured).length

    navbarCategoryOptions.forEach((option) => {
      if (option.type === "sale") {
        collections[option.value] = products.filter((p: any) =>
          p.variants?.some((v: any) => v.discountPercent > 0 || (v.priceAfterDiscount && v.mainPrice && v.priceAfterDiscount < v.mainPrice))
        ).length
      } else if (option.value.toLowerCase() === "new arrivals") {
        collections[option.value] = products.filter((p: any) => p.isNewArrival).length
      } else if (option.value.toLowerCase() === "best sellers" || option.value.toLowerCase() === "best seller") {
        collections[option.value] = products.filter((p: any) => p.isBestSeller).length
      } else if (option.value.toLowerCase() === "featured" || option.value.toLowerCase() === "featured picks") {
        collections[option.value] = products.filter((p: any) => p.isFeatured).length
      } else if (option.value.toLowerCase() === "trending" || option.value.toLowerCase() === "trending now") {
        collections[option.value] = products.filter((p: any) => p.isTrending).length
      } else {
        const dbValue = normalizeCategoryForDB(option.value)
        collections[option.value] = products.filter((p: any) => 
          p.categories?.map((c: string) => c.toLowerCase()).includes(dbValue.toLowerCase())
        ).length
      }
    })

    return {
      collections,
      subCategories: Object.fromEntries(allSubCategories.map((s: string) => [s, products.filter((p: any) => p.subCategories?.map((sc: string) => sc.toLowerCase()).includes(s.toLowerCase())).length])),
      types: Object.fromEntries(allTypes.map((t: string) => [t, products.filter((p: any) => p.types?.map((ty: string) => ty.toLowerCase()).includes(t.toLowerCase())).length])),
      brands: Object.fromEntries(allBrands.map((b: string) => [b, products.filter((p: any) => p.brand?.toLowerCase() === b.toLowerCase()).length])),
      frameTypes: Object.fromEntries(allFrameTypes.map((f: string) => [f, products.filter((p: any) => p.frameType?.toLowerCase() === f.toLowerCase()).length])),
      lensTypes: Object.fromEntries(allLensTypes.map((l: string) => [l, products.filter((p: any) => p.lensType?.toLowerCase().includes(l.toLowerCase())).length])),
      colors: Object.fromEntries(allColors.map((c: any) => [c.color, products.filter((p: any) => p.variants?.some((v: any) => v.color?.toLowerCase() === c.color?.toLowerCase())).length])),
      ratings: Object.fromEntries([5, 4, 3, 2, 1].map((r) => [r, products.filter((p: any) => Math.floor(p.averageRating || 0) === r).length])),
      inStock: products.filter((p: any) => p.variants?.some((v: any) => v.inStock)).length,
    }
  }, [products, allBrands, allSubCategories, allTypes, allFrameTypes, allLensTypes, allColors, navbarCategoryOptions])

  useEffect(() => {
    const minP = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxP = Number.parseInt(searchParams.get("maxPrice") || "5000")
    const rawCategories = getInitialCategoriesFromParams(searchParams)
    const categories = rawCategories.map((c) => normalizeCategoryForDB(c))
    const subCategories = searchParams.get("subCategory")?.split(",").filter(Boolean) || []
    const types = searchParams.get("type")?.split(",").filter(Boolean) || []
    const saleOnly = searchParams.get("sale") === "true"
    const brands = getInitialBrandsFromParams(searchParams)
    const frameTypes = searchParams.get("frameTypes")?.split(",").filter(Boolean) || []
    const lensTypes = searchParams.get("lensTypes")?.split(",").filter(Boolean) || []
    const colors = searchParams.get("colors")?.split(",").filter(Boolean) || []
    const ratings = searchParams.get("ratings")?.split(",").map(Number).filter(Boolean) || []
    const inStock = searchParams.get("inStock") === "true" ? true : searchParams.get("inStock") === "false" ? false : null

    setFilters((prev) => {
      if (prev.priceRange[0] === minP && prev.priceRange[1] === maxP &&
        prev.categories.length === categories.length && prev.categories.every((v, i) => v === categories[i]) &&
        prev.subCategories.length === subCategories.length && prev.subCategories.every((v, i) => v === subCategories[i]) &&
        prev.types.length === types.length && prev.types.every((v, i) => v === types[i]) &&
        prev.saleOnly === saleOnly && prev.brands.length === brands.length && prev.brands.every((v, i) => v === brands[i]) &&
        prev.frameTypes.length === frameTypes.length && prev.frameTypes.every((v, i) => v === frameTypes[i]) &&
        prev.lensTypes.length === lensTypes.length && prev.lensTypes.every((v, i) => v === lensTypes[i]) &&
        prev.colors.length === colors.length && prev.colors.every((v, i) => v === colors[i]) &&
        prev.ratings.length === ratings.length && prev.ratings.every((v, i) => v === ratings[i]) && prev.inStock === inStock
      ) return prev
      return { priceRange: [minP, maxP], categories, subCategories, types, saleOnly, brands, frameTypes, lensTypes, colors, ratings, inStock }
    })

    const sort = (searchParams.get("sort") as SortOption) || "featured"
    setSortOption((prev) => prev === sort ? prev : sort)
    const page = Number.parseInt(searchParams.get("page") || "1")
    setCurrentPage((prev) => prev === page ? prev : page)
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    setProductsPerPage((prev) => prev === limit ? prev : limit)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    // ── Preserve pass-through params the filter state doesn't manage ──
    const passThrough = ["search", "q"]
    passThrough.forEach((key) => {
      const val = searchParams.get(key)
      if (val) params.set(key, val)
    })

    const updateParam = (key: string, value: string | null) => {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    updateParam("minPrice", filters.priceRange[0] > 0 ? filters.priceRange[0].toString() : null)
    updateParam("maxPrice", filters.priceRange[1] < 5000 ? filters.priceRange[1].toString() : null)
    updateParam("category", filters.categories.length > 0 ? filters.categories.join(",") : null)
    updateParam("subCategory", filters.subCategories.length > 0 ? filters.subCategories.join(",") : null)
    updateParam("type", filters.types.length > 0 ? filters.types.join(",") : null)
    updateParam("sale", filters.saleOnly ? "true" : null)
    updateParam("brands", filters.brands.length > 0 ? filters.brands.join(",") : null)
    updateParam("frameTypes", filters.frameTypes.length > 0 ? filters.frameTypes.join(",") : null)
    updateParam("lensTypes", filters.lensTypes.length > 0 ? filters.lensTypes.join(",") : null)
    updateParam("colors", filters.colors.length > 0 ? filters.colors.join(",") : null)
    updateParam("ratings", filters.ratings.length > 0 ? filters.ratings.join(",") : null)
    updateParam("inStock", filters.inStock !== null ? filters.inStock.toString() : null)
    updateParam("sort", sortOption !== "featured" ? sortOption : null)
    updateParam("page", currentPage > 1 ? currentPage.toString() : null)
    updateParam("limit", productsPerPage !== 12 ? productsPerPage.toString() : null)

    const newSearch = params.toString()
    const currentSearch = searchParams.toString()
    if (newSearch !== currentSearch) {
      router.replace(`${pathname}?${newSearch}`, { scroll: false })
    }
    // NOTE: searchParams intentionally excluded from deps to prevent infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortOption, currentPage, pathname, router, productsPerPage])

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      if (filterType === "priceRange") newFilters.priceRange = value
      else if (filterType === "inStock") newFilters.inStock = value
      else if (filterType === "saleOnly") newFilters.saleOnly = value
      else if (Array.isArray(newFilters[filterType])) {
        const arr = newFilters[filterType] as any[]
        if (Array.isArray(value)) {
          newFilters[filterType] = value.map((val) => 
            filterType === "categories" ? normalizeCategoryForDB(val) : val
          ) as any
        } else {
          const mappedValue = filterType === "categories" ? normalizeCategoryForDB(value) : value
          newFilters[filterType] = (arr.includes(mappedValue) ? arr.filter((i) => i !== mappedValue) : [...arr, mappedValue]) as any
        }
      }
      return newFilters
    })
    if (currentPage !== 1) setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({ priceRange: [0, 5000], categories: [], subCategories: [], types: [], saleOnly: false, brands: [], frameTypes: [], lensTypes: [], colors: [], ratings: [], inStock: null })
    setSortOption("featured")
    setCurrentPage(1)
    const params = new URLSearchParams(searchParams.toString())
    const managedKeys = ["minPrice", "maxPrice", "category", "subCategory", "type", "sale", "brand", "brands", "frameTypes", "lensTypes", "colors", "ratings", "inStock", "sort", "page", "limit"]
    managedKeys.forEach((key) => params.delete(key))
    const newSearch = params.toString()
    router.push(newSearch ? `${pathname}?${newSearch}` : pathname, { scroll: false })
  }

  const removeFilter = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const n = { ...prev }
      if (filterType === "priceRange") n.priceRange = [0, 5000]
      else if (filterType === "inStock") n.inStock = null
      else if (filterType === "saleOnly") n.saleOnly = false
      else if (Array.isArray(n[filterType])) {
        const mappedValue = filterType === "categories" ? normalizeCategoryForDB(value) : value
        n[filterType] = (n[filterType] as any[]).filter((i) => i !== mappedValue) as any
      }
      return n
    })
  }

  const handleProductsPerPageChange = (limit: number) => {
    setProductsPerPage(limit)
    setCurrentPage(1)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const hasActiveFilters = () => filters.brands.length > 0 || filters.categories.length > 0 || filters.subCategories.length > 0 || filters.types.length > 0 || filters.saleOnly ||
    filters.frameTypes.length > 0 || filters.lensTypes.length > 0 || filters.colors.length > 0 ||
    filters.ratings.length > 0 || filters.inStock !== null || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000

  const getActiveFilterCount = () => {
    let c = 0
    c += filters.brands.length + filters.categories.length + filters.subCategories.length + filters.types.length + filters.frameTypes.length + filters.lensTypes.length + filters.colors.length + filters.ratings.length
    if (filters.saleOnly) c++
    if (filters.inStock !== null) c++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) c++
    return c
  }

  const getMetaTitle = () => {
    let title = "Eyewear Collection"
    if (filters.categories.length === 1) {
      const label = normalizeCategoryForUI(filters.categories[0])
      title = `${label} Eyewear`
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
    const parts: string[] = []
    if (filters.categories.length > 0) parts.push(`collections like ${filters.categories.map((c) => normalizeCategoryForUI(c)).join(", ")}`)
    if (filters.saleOnly) parts.push("sale items")
    if (filters.brands.length > 0) parts.push(`brands like ${filters.brands.join(", ")}`)
    if (filters.frameTypes.length > 0) parts.push(`${filters.frameTypes.join(", ")} frames`)
    if (filters.lensTypes.length > 0) parts.push(`${filters.lensTypes.join(", ")} lenses`)
    if (parts.length > 0) description = `Discover our selection of eyewear with ${parts.join(" and ")}. ${description}`
    return description
  }

  const generateStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, productsPerPage).map((product: any, index: number) => ({
      "@type": "ListItem",
      position: (currentPage - 1) * productsPerPage + index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        image: product.variants?.[0]?.imgList?.[0]?.image || "",
        description: product.shortDescription,
        brand: { "@type": "Brand", name: product.brand },
        offers: {
          "@type": "Offer",
          price: product.variants?.[0]?.priceAfterDiscount || 0,
          priceCurrency: "USD",
          availability: product.variants?.[0]?.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  })

  const themeStyles = {
    dark: { bg: "bg-black", card: "bg-white/5 border-white/10", cardHover: "hover:bg-white/10", text: "text-white", textMuted: "text-neutral-300", textMutedLighter: "text-neutral-400", border: "border-white/10", gradient: "from-[#007C74] to-[#3C55A5]", button: "bg-white/10 hover:bg-white/20 text-white", activeFilter: "bg-[#007C74]/20 text-[#007C74] border-[#007C74]/30" },
    light: { bg: "bg-neutral-50", card: "bg-white border-neutral-200", cardHover: "hover:bg-neutral-50", text: "text-neutral-900", textMuted: "text-neutral-600", textMutedLighter: "text-neutral-500", border: "border-neutral-200", gradient: "from-[#007C74] to-[#3C55A5]", button: "bg-neutral-200 hover:bg-neutral-300 text-neutral-900", activeFilter: "bg-[#007C74]/10 text-[#007C74] border-[#007C74]/30" },
  }
  const s = isDark ? themeStyles.dark : themeStyles.light

  return (
    <>
      <Head>
        <title>{getMetaTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <link rel="canonical" href={`https://glassophite.com${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`} />
      </Head>
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`min-h-screen transition-colors duration-500 ${s.bg}`}>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#007C74" : "#007C74"} 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <AnimatePresence>
          {mobileFiltersOpen && (
            <MobileFilterDrawer
              filters={filters} optionCounts={optionCounts} allBrands={allBrands}
              collectionOptions={navbarCategoryOptions} allSubCategories={allSubCategories} allTypes={allTypes} allFrameTypes={allFrameTypes}
              allLensTypes={allLensTypes} allColors={allColors} minPrice={minPrice} maxPrice={maxPrice}
              handleFilterChange={handleFilterChange} onClose={() => setMobileFiltersOpen(false)}
            />
          )}
        </AnimatePresence>
        <main className="container relative z-10 lg:mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 pt-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${s.text}`}>{getMetaTitle()}</h1>
              <p className={`text-sm ${s.textMutedLighter} mt-1`} data-translate="filter.results">{total} products found</p>
            </motion.div>
            <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => setMobileFiltersOpen(true)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${s.card} ${s.cardHover} transition-colors`}>
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm" data-translate="filter.filter">Filters</span>
              {getActiveFilterCount() > 0 && <span className="px-2 py-0.5 text-xs bg-[#007C74] text-white rounded-full">{getActiveFilterCount()}</span>}
            </motion.button>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:py-4">
            <Breadcrumb filters={filters} />
          </motion.div>
          {hasActiveFilters() && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex lg:hidden flex-wrap items-center gap-2 py-4">
              <span className={`text-sm ${s.textMutedLighter}`} data-translate="filter.active">Active filters:</span>
              {filters.brands.map((b) => <ActiveFilterBtn key={b} onClick={() => removeFilter("brands", b)} s={s}>{b}</ActiveFilterBtn>)}
              {filters.categories.map((c) => <ActiveFilterBtn key={c} onClick={() => removeFilter("categories", c)} s={s}>{normalizeCategoryForUI(c)}</ActiveFilterBtn>)}
              {filters.subCategories.map((sc) => <ActiveFilterBtn key={sc} onClick={() => removeFilter("subCategories", sc)} s={s}>{sc}</ActiveFilterBtn>)}
              {filters.types.map((t) => <ActiveFilterBtn key={t} onClick={() => removeFilter("types", t)} s={s}>{t}</ActiveFilterBtn>)}
              {filters.saleOnly && <ActiveFilterBtn onClick={() => removeFilter("saleOnly", null)} s={s}>Sale</ActiveFilterBtn>}
              {filters.frameTypes.map((t) => <ActiveFilterBtn key={t} onClick={() => removeFilter("frameTypes", t)} s={s}>{t}</ActiveFilterBtn>)}
              {filters.lensTypes.map((t) => <ActiveFilterBtn key={t} onClick={() => removeFilter("lensTypes", t)} s={s}>{t}</ActiveFilterBtn>)}
              {filters.colors.map((clr) => {
                const co = allColors.find((c: any) => c.color === clr)
                return (
                  <button key={clr} onClick={() => removeFilter("colors", clr)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${s.activeFilter}`}>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: clr }} />
                    {co?.title || clr}<X className="w-3 h-3" />
                  </button>
                )
              })}
              {filters.ratings.map((r) => <ActiveFilterBtn key={r} onClick={() => removeFilter("ratings", r)} s={s}>{r}★</ActiveFilterBtn>)}
              {filters.inStock !== null && <ActiveFilterBtn onClick={() => removeFilter("inStock", null)} s={s}>{filters.inStock ? "In Stock" : "Out of Stock"}</ActiveFilterBtn>}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && <ActiveFilterBtn onClick={() => removeFilter("priceRange", null)} s={s}>৳{filters.priceRange[0]} - ৳{filters.priceRange[1]}</ActiveFilterBtn>}
              <button onClick={clearAllFilters} className={`text-xs underline ${s.textMutedLighter} hover:text-[#007C74] transition-colors`} data-translate="filter.clearAll">Clear all</button>
            </motion.div>
          )}
          <section aria-labelledby="products-heading" className="pb-24 lg:pt-6">
            <h2 id="products-heading" className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="hidden lg:block">
                <FilterSection filters={filters} collectionOptions={navbarCategoryOptions} optionCounts={optionCounts}
                  allBrands={allBrands} allSubCategories={allSubCategories} allTypes={allTypes} allFrameTypes={allFrameTypes} allLensTypes={allLensTypes} allColors={allColors}
                  minPrice={minPrice} maxPrice={maxPrice} handleFilterChange={handleFilterChange} removeFilter={removeFilter}
                  clearAllFilters={clearAllFilters} hasActiveFilters={hasActiveFilters()} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="lg:col-span-3">
                <ProductSection products={products} filteredProducts={products} isLoading={isLoading || isFetching}
                  sortOption={sortOption} setSortOption={setSortOption} currentPage={currentPage} totalPages={totalPages}
                  paginate={paginate} indexOfFirstProduct={(currentPage - 1) * productsPerPage} indexOfLastProduct={currentPage * productsPerPage}
                  totalProducts={total} productsPerPage={productsPerPage} onProductsPerPageChange={handleProductsPerPageChange}
                  clearAllFilters={clearAllFilters} getActiveFilterCount={getActiveFilterCount()} setMobileFiltersOpen={setMobileFiltersOpen} />
              </motion.div>
            </div>
          </section>
        </main>
      </motion.div>
    </>
  )
}

function ActiveFilterBtn({ children, onClick, s }: { children: React.ReactNode; onClick: () => void; s: any }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${s.activeFilter}`}>
      {children}<X className="w-3 h-3" />
    </button>
  )
}
