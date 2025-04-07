"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { FilterState } from "@/types/filter-types"

interface BreadcrumbProps {
  filters: FilterState
}

export default function Breadcrumb({ filters }: BreadcrumbProps) {
  return (
    <motion.nav
      aria-label="Breadcrumb"
      className="mb-6 mt-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <p  className="hover:text-gray-700">
            Eyewear
          </p>
        </li>
        {filters.brands.length === 1 && (
          <li className="flex items-center">
            <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span aria-current="page">{filters.brands[0]}</span>
          </li>
        )}
        {filters.frameTypes.length === 1 && (
          <li className="flex items-center">
            <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span aria-current="page">{filters.frameTypes[0]}</span>
          </li>
        )}
      </ol>
    </motion.nav>
  )
}

