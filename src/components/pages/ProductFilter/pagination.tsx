"use client"

import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationProps {
  currentPage: number
  totalPages: number
  paginate: (pageNumber: number) => void
  indexOfFirstProduct: number
  indexOfLastProduct: number
  totalProducts: number
  productsPerPage: number
  onProductsPerPageChange: (limit: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  paginate,
  indexOfFirstProduct,
  indexOfLastProduct,
  totalProducts,
  productsPerPage,
  onProductsPerPageChange,
}: PaginationProps) {
  // Function to generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md px-2 py-2 text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          >
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>

          <div className="flex space-x-1 overflow-x-auto max-w-[180px] px-1">
            {totalPages <= 5 ? (
              // If 5 or fewer pages, show all
              [...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                return (
                  <motion.button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                      currentPage === pageNumber
                        ? "bg-[#007C74] text-white"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNumber}
                  </motion.button>
                )
              })
            ) : (
              // If more than 5 pages, show a subset with current page in the middle
              <>
                {/* Always show first page */}
                <motion.button
                  onClick={() => paginate(1)}
                  className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                    currentPage === 1 ? "bg-[#007C74] text-white" : "bg-white text-gray-700 border border-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  1
                </motion.button>

                {/* Show ellipsis if current page is far from start */}
                {currentPage > 3 && (
                  <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm">...</span>
                )}

                {/* Show pages around current page */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  // Show current page and one page before/after (if they exist)
                  if (
                    pageNumber !== 1 &&
                    pageNumber !== totalPages &&
                    (pageNumber === currentPage || pageNumber === currentPage - 1 || pageNumber === currentPage + 1)
                  ) {
                    return (
                      <motion.button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? "bg-[#007C74] text-white"
                            : "bg-white text-gray-700 border border-gray-300"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {pageNumber}
                      </motion.button>
                    )
                  }
                  return null
                })}

                {/* Show ellipsis if current page is far from end */}
                {currentPage < totalPages - 2 && (
                  <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm">...</span>
                )}

                {/* Always show last page */}
                <motion.button
                  onClick={() => paginate(totalPages)}
                  className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-[#007C74] text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {totalPages}
                </motion.button>
              </>
            )}
          </div>

          <motion.button
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center rounded-md px-2 py-2 text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          >
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-700 mr-6">
            Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastProduct, totalProducts)}</span> of{" "}
            <span className="font-medium">{totalProducts}</span> results
          </p>

          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <Select
              value={productsPerPage.toString()}
              onValueChange={(value) => onProductsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue placeholder="6" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <motion.button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
              }`}
              whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              aria-label="Previous page"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>

            {/* Page numbers with ellipsis */}
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                  >
                    ...
                  </span>
                )
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => paginate(pageNumber as number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === pageNumber
                      ? "z-10 bg-[#007C74] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74]"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </motion.button>
              )
            })}

            <motion.button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
              }`}
              whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              aria-label="Next page"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </nav>
        </div>
      </div>
    </div>
  )
}

