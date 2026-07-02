"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
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
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      button: "bg-white/10 hover:bg-white/20 text-white border-white/10",
      buttonDisabled: "bg-white/5 text-neutral-600 cursor-not-allowed",
      buttonActive: "bg-[#007C74] text-white",
      buttonInactive: "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10",
      select: "bg-white/5 border-white/10 text-white",
      selectItem: "text-white hover:bg-white/10",
      ellipsis: "text-neutral-500",
      paginationText: "text-neutral-400",
    },
    light: {
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      bg: "bg-white",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      button: "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
      buttonDisabled: "bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200",
      buttonActive: "bg-[#007C74] text-white",
      buttonInactive: "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50",
      select: "bg-white border-neutral-300 text-neutral-900",
      selectItem: "text-neutral-900 hover:bg-neutral-100",
      ellipsis: "text-neutral-500",
      paginationText: "text-neutral-600",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Function to generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        endPage = 4
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      if (startPage > 2) {
        pageNumbers.push("ellipsis-start")
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end")
      }

      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`mt-8 flex items-center justify-between border-t ${styles.border} pt-6`}>
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md px-2 py-2 text-sm font-medium ${
              currentPage === 1 ? styles.buttonDisabled : styles.button
            }`}
            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          >
            <span className="sr-only" data-translate="pagination.previous">Previous</span>
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
              [...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                return (
                  <motion.button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                      currentPage === pageNumber ? styles.buttonActive : styles.buttonInactive
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNumber}
                  </motion.button>
                )
              })
            ) : (
              <>
                <motion.button
                  onClick={() => paginate(1)}
                  className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                    currentPage === 1 ? styles.buttonActive : styles.buttonInactive
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  1
                </motion.button>

                {currentPage > 3 && (
                  <span className={`inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm ${styles.ellipsis}`}>
                    ...
                  </span>
                )}

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
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
                          currentPage === pageNumber ? styles.buttonActive : styles.buttonInactive
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

                {currentPage < totalPages - 2 && (
                  <span className={`inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm ${styles.ellipsis}`}>
                    ...
                  </span>
                )}

                <motion.button
                  onClick={() => paginate(totalPages)}
                  className={`relative inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? styles.buttonActive : styles.buttonInactive
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
              currentPage === totalPages ? styles.buttonDisabled : styles.button
            }`}
            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          >
            <span className="sr-only" data-translate="pagination.next">Next</span>
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
          <p className={`text-sm ${styles.paginationText} mr-6`} data-translate="pagination.showing">
            Showing <span className={`font-medium ${styles.text}`}>{indexOfFirstProduct + 1}</span> to{" "}
            <span className={`font-medium ${styles.text}`}>{Math.min(indexOfLastProduct, totalProducts)}</span> of{" "}
            <span className={`font-medium ${styles.text}`}>{totalProducts}</span> results
          </p>

          <div className="hidden sm:flex items-center space-x-2">
            <span className={`text-sm ${styles.paginationText}`} data-translate="pagination.show">Show</span>
            <Select
              value={productsPerPage.toString()}
              onValueChange={(value) => onProductsPerPageChange(Number(value))}
            >
              <SelectTrigger className={`w-[80px] h-8 ${styles.select}`}>
                <SelectValue placeholder="6" />
              </SelectTrigger>
              <SelectContent className={isDark ? "bg-gray-900 border-white/10" : "bg-white"}>
                <SelectItem value="6" className={styles.selectItem}>6</SelectItem>
                <SelectItem value="12" className={styles.selectItem}>12</SelectItem>
                <SelectItem value="24" className={styles.selectItem}>24</SelectItem>
                <SelectItem value="48" className={styles.selectItem}>48</SelectItem>
              </SelectContent>
            </Select>
            <span className={`text-sm ${styles.paginationText}`} data-translate="pagination.perPage">per page</span>
          </div>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <motion.button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                currentPage === 1 ? styles.buttonDisabled : styles.button
              }`}
              whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              aria-label="Previous page"
            >
              <span className="sr-only" data-translate="pagination.previous">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>

            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${styles.ellipsis}`}
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
                      ? `${styles.buttonActive} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007C74]`
                      : `${styles.buttonInactive} ring-1 ring-inset ring-gray-300`
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
                currentPage === totalPages ? styles.buttonDisabled : styles.button
              }`}
              whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              aria-label="Next page"
            >
              <span className="sr-only" data-translate="pagination.next">Next</span>
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