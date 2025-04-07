"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SortOption } from "@/types/filter-types"

interface SortDropdownProps {
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
}

export default function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  return (
    <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="rating">Highest Rated</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
      </SelectContent>
    </Select>
  )
}

