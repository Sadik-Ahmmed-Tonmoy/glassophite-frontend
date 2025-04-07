export type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest"

export type FilterState = {
  priceRange: [number, number]
  brands: string[]
  frameTypes: string[]
  lensTypes: string[]
  colors: string[]
  ratings: number[]
  inStock: boolean | null
}

