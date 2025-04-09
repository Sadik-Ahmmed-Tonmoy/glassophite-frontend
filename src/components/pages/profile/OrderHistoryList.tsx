"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ChevronRight, Package, ShoppingBag, Calendar, FileText, Truck } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrders } from "@/lib/data"

export default function OrderHistoryList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  // Filter and sort orders
  const filteredOrders = mockOrders
    .filter((order) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
    .filter((order) => {
      // Apply status filter
      if (statusFilter === "all") return true
      return order.status === statusFilter
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "date-asc":
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        case "date-desc":
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        case "total-asc":
          return a.total - b.total
        case "total-desc":
          return b.total - a.total
        default:
          return 0
      }
    })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package size={18} className="text-green-600" />
      case "shipped":
        return <Truck size={18} className="text-blue-600" />
      case "processing":
        return <Package size={18} className="text-yellow-600" />
      case "cancelled":
        return <Package size={18} className="text-red-600" />
      default:
        return <Package size={18} className="text-gray-600" />
    }
  }

  // Handle invoice download
  const handleDownloadInvoice = (orderId: string, orderNumber: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // In a real application, this would generate and download a PDF
    console.log("Downloading invoice for order:", orderId)

    // Create a simulated download delay
    const link = document.createElement("a")
    link.href = "#"
    link.download = `Invoice-${orderNumber}.pdf`
    link.onclick = (e) => {
      e.preventDefault()
      alert("Invoice download started. In a real application, this would download a PDF file.")
    }
    link.click()
  }

  // Handle tracking
  const handleTrackOrder = (trackingUrl: string | undefined, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (trackingUrl) {
      window.open(trackingUrl, "_blank")
    } else {
      alert("Tracking information is not available for this order.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500 flex-shrink-0" />
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500 whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="total-desc">Highest Amount</SelectItem>
                <SelectItem value="total-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "You haven't placed any orders yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900">Order #{order.orderNumber}</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar size={14} className="mr-1" />
                      <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{order.items.length} items</div>
                  </div>
                  {order.status === "shipped" && order.estimatedDelivery && (
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4">
                <div className="space-y-4">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.variant && `${item.variant} • `}Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="flex items-center justify-end space-x-1">
                            <p className="text-xs text-gray-500 line-through">${item.originalPrice.toFixed(2)}</p>
                            <span className="text-xs text-green-600">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500 italic">+ {order.items.length - 2} more items</p>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="p-4 border-t bg-gray-50 flex flex-wrap justify-between items-center gap-2">
                <div className="flex space-x-2">
                  <button
                    className="text-xs flex items-center text-gray-600 hover:text-primary transition-colors"
                    onClick={(e) => handleDownloadInvoice(order.id, order.orderNumber, e)}
                  >
                    <FileText size={14} className="mr-1" />
                    Invoice
                  </button>
                  {order.trackingNumber && (
                    <button
                      className="text-xs flex items-center text-gray-600 hover:text-primary transition-colors"
                      onClick={(e) => handleTrackOrder(order.trackingUrl, e)}
                    >
                      <Truck size={14} className="mr-1" />
                      Track
                    </button>
                  )}
                </div>
                <Link
                  href={`/my-profile/order-history/${order.id}`}
                  className="inline-flex items-center px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
                >
                  See Details
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
