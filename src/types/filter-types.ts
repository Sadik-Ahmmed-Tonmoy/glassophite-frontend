export type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest"

export type FilterState = {
  priceRange: [number, number]
  categories: string[]
  subCategories: string[]
  types: string[]
  saleOnly: boolean
  brands: string[]
  frameTypes: string[]
  lensTypes: string[]
  colors: string[]
  ratings: number[]
  inStock: boolean | null
}

export type FilterOptionCounts = {
  collections: Record<string, number>
  subCategories: Record<string, number>
  types: Record<string, number>
  brands: Record<string, number>
  frameTypes: Record<string, number>
  lensTypes: Record<string, number>
  colors: Record<string, number>
  ratings: Record<number, number>
  inStock: number
}

