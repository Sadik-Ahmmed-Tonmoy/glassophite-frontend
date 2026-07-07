"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import type { FilterState } from "@/types/filter-types"
import { normalizeCategoryForUI } from "@/lib/utils"

interface BreadcrumbProps {
  filters: FilterState
}

export default function Breadcrumb({ filters }: BreadcrumbProps) {
  const searchParams = useSearchParams()

  // Helper function to build correct search parameter URLs for each breadcrumb step
  const buildBreadcrumbUrl = (level: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page") // Reset pagination on breadcrumb navigation

    // Clear sub-filters relative to the clicked breadcrumb level
    if (level === "eyewear") {
      params.delete("category")
      params.delete("subCategory")
      params.delete("type")
      params.delete("sale")
      params.delete("brands")
      params.delete("frameTypes")
    } else if (level === "category") {
      if (value) params.set("category", value)
      params.delete("subCategory")
      params.delete("type")
      params.delete("sale")
      params.delete("brands")
      params.delete("frameTypes")
    } else if (level === "subCategory") {
      if (value) params.set("subCategory", value)
      params.delete("type")
      params.delete("sale")
      params.delete("brands")
      params.delete("frameTypes")
    } else if (level === "type") {
      if (value) params.set("type", value)
      params.delete("sale")
      params.delete("brands")
      params.delete("frameTypes")
    } else if (level === "sale") {
      params.set("sale", "true")
      params.delete("brands")
      params.delete("frameTypes")
    } else if (level === "brands") {
      if (value) params.set("brands", value)
      params.delete("frameTypes")
    } else if (level === "frameTypes") {
      if (value) params.set("frameTypes", value)
    }

    return `/product-filter?${params.toString()}`
  }

  // Construct items for breadcrumb
  const items: { label: string; href?: string }[] = [
    { label: "Home", href: "/" }
  ]

  const hasSubsequent =
    filters.categories.length === 1 ||
    filters.subCategories.length === 1 ||
    filters.types.length === 1 ||
    filters.saleOnly ||
    filters.brands.length === 1 ||
    filters.frameTypes.length === 1

  items.push({
    label: "Eyewear",
    href: hasSubsequent ? buildBreadcrumbUrl("eyewear") : undefined
  })

  if (filters.categories.length === 1) {
    const category = filters.categories[0]
    const nextHasSubsequent =
      filters.subCategories.length === 1 ||
      filters.types.length === 1 ||
      filters.saleOnly ||
      filters.brands.length === 1 ||
      filters.frameTypes.length === 1

    items.push({
      label: normalizeCategoryForUI(category),
      href: nextHasSubsequent ? buildBreadcrumbUrl("category", category) : undefined
    })
  }

  if (filters.subCategories.length === 1) {
    const subCategory = filters.subCategories[0]
    const nextHasSubsequent =
      filters.types.length === 1 ||
      filters.saleOnly ||
      filters.brands.length === 1 ||
      filters.frameTypes.length === 1

    items.push({
      label: subCategory,
      href: nextHasSubsequent ? buildBreadcrumbUrl("subCategory", subCategory) : undefined
    })
  }

  if (filters.types.length === 1) {
    const type = filters.types[0]
    const nextHasSubsequent =
      filters.saleOnly ||
      filters.brands.length === 1 ||
      filters.frameTypes.length === 1

    items.push({
      label: type,
      href: nextHasSubsequent ? buildBreadcrumbUrl("type", type) : undefined
    })
  }

  if (filters.saleOnly) {
    const nextHasSubsequent =
      filters.brands.length === 1 ||
      filters.frameTypes.length === 1

    items.push({
      label: "Sale",
      href: nextHasSubsequent ? buildBreadcrumbUrl("sale") : undefined
    })
  }

  if (filters.brands.length === 1) {
    const brand = filters.brands[0]
    const nextHasSubsequent = filters.frameTypes.length === 1

    items.push({
      label: brand,
      href: nextHasSubsequent ? buildBreadcrumbUrl("brands", brand) : undefined
    })
  }

  if (filters.frameTypes.length === 1) {
    const frameType = filters.frameTypes[0]
    items.push({
      label: frameType,
      href: undefined
    })
  }

  return (
    <motion.nav
      aria-label="Breadcrumb"
      className="mb-6 mt-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 dark:text-neutral-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg className="h-4 w-4 mx-1 text-gray-400 dark:text-neutral-600 animate-fade-in" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLast || !item.href ? (
                <span className="font-semibold text-gray-800 dark:text-neutral-200 transition-all duration-200" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-gray-800 dark:hover:text-neutral-200 hover:underline transition-all duration-200">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </motion.nav>
  )
}


