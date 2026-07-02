"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Calendar,
  ChevronRight,
  FileText,
  Filter,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOrders } from "@/lib/data";
import { TOrderItem } from "@/types/types";
import { cn } from "@/lib/utils";

export default function OrderHistoryList() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      select: "bg-white/5 border-white/10 text-white",
      icon: "text-neutral-400",
      filterBg: "bg-white/5",
      filterBorder: "border-white/10",
      statusBadge: {
        delivered: "bg-green-500/20 text-green-400",
        shipped: "bg-blue-500/20 text-blue-400",
        processing: "bg-yellow-500/20 text-yellow-400",
        cancelled: "bg-red-500/20 text-red-400",
        default: "bg-white/10 text-neutral-400",
      },
      actionButton: "text-neutral-400 hover:text-primary",
    },
    light: {
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      input: "bg-white border-gray-300 text-gray-900",
      select: "bg-white border-gray-300 text-gray-900",
      icon: "text-gray-400",
      filterBg: "bg-gray-50",
      filterBorder: "border-gray-200",
      statusBadge: {
        delivered: "bg-green-100 text-green-800",
        shipped: "bg-blue-100 text-blue-800",
        processing: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
        default: "bg-gray-100 text-gray-800",
      },
      actionButton: "text-gray-600 hover:text-primary",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Filter and sort orders
  const filteredOrders = mockOrders
    .filter((order) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.items.some((item: TOrderItem) =>
            item.name.toLowerCase().includes(searchLower)
          )
        );
      }
      return true;
    })
    .filter((order) => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.orderDate ?? a.createdAt ?? 0).getTime() - new Date(b.orderDate ?? b.createdAt ?? 0).getTime();
        case "date-desc":
          return new Date(b.orderDate ?? b.createdAt ?? 0).getTime() - new Date(a.orderDate ?? a.createdAt ?? 0).getTime();
        case "total-asc":
          return a.total - b.total;
        case "total-desc":
          return b.total - a.total;
        default:
          return 0;
      }
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return styles.statusBadge.delivered;
      case "shipped":
        return styles.statusBadge.shipped;
      case "processing":
        return styles.statusBadge.processing;
      case "cancelled":
        return styles.statusBadge.cancelled;
      default:
        return styles.statusBadge.default;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const className = cn(
      status === "delivered" && "text-green-600 dark:text-green-400",
      status === "shipped" && "text-blue-600 dark:text-blue-400",
      status === "processing" && "text-yellow-600 dark:text-yellow-400",
      status === "cancelled" && "text-red-600 dark:text-red-400"
    );
    switch (status) {
      case "delivered":
        return <Package size={18} className={className} />;
      case "shipped":
        return <Truck size={18} className={className} />;
      case "processing":
        return <Package size={18} className={className} />;
      case "cancelled":
        return <Package size={18} className={className} />;
      default:
        return <Package size={18} className="text-gray-600 dark:text-neutral-400" />;
    }
  };

  const handleDownloadInvoice = (orderId: string, orderNumber: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Downloading invoice for order:", orderId);
    alert("Invoice download started. In a real application, this would download a PDF file.");
  };

  const handleTrackOrder = (trackingUrl: string | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (trackingUrl) {
      window.open(trackingUrl, "_blank");
    } else {
      alert("Tracking information is not available for this order.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Filters and Search */}
      <motion.div
        variants={itemVariants}
        className={cn("rounded-xl border shadow-sm p-4 transition-colors duration-500", styles.card)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={styles.icon} />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={cn(
                "ps-9 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                styles.input
              )}
              data-translate="orderHistory.searchPlaceholder"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={18} className={cn("flex-shrink-0", styles.icon)} />
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className={cn("w-full", styles.select)}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" data-translate="orderHistory.allStatuses">All Statuses</SelectItem>
                <SelectItem value="delivered" data-translate="orderHistory.delivered">Delivered</SelectItem>
                <SelectItem value="shipped" data-translate="orderHistory.shipped">Shipped</SelectItem>
                <SelectItem value="processing" data-translate="orderHistory.processing">Processing</SelectItem>
                <SelectItem value="cancelled" data-translate="orderHistory.cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className={cn("whitespace-nowrap", styles.textMutedLighter)} data-translate="orderHistory.sortBy">
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className={cn("w-full", styles.select)}>
                <SelectValue placeholder="Sort orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc" data-translate="orderHistory.newestFirst">Newest First</SelectItem>
                <SelectItem value="date-asc" data-translate="orderHistory.oldestFirst">Oldest First</SelectItem>
                <SelectItem value="total-desc" data-translate="orderHistory.highestAmount">Highest Amount</SelectItem>
                <SelectItem value="total-asc" data-translate="orderHistory.lowestAmount">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className={cn("rounded-xl border shadow-sm p-8 text-center transition-colors duration-500", styles.card)}
        >
          <ShoppingBag size={48} className={cn("mx-auto mb-4", styles.icon)} />
          <h3 className={cn("text-lg font-medium mb-2", styles.text)} data-translate="orderHistory.noOrders">
            No orders found
          </h3>
          <p className={cn("text-sm", styles.textMutedLighter)}>
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "You haven't placed any orders yet."}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                layout
                className={cn("rounded-xl border shadow-sm overflow-hidden transition-colors duration-500", styles.card)}
              >
                {/* Order Header */}
                <div
                  className={cn(
                    "p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between",
                    styles.border,
                    isDark ? "bg-white/5" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("font-medium", styles.text)}>
                          Order #{order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Calendar size={14} className={cn("mr-1", styles.icon)} />
                        <span className={styles.textMutedLighter}>
                          Ordered on {new Date(order.orderDate ?? order.createdAt ?? 0).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                    <div className="text-right">
                      <div className={cn("font-medium", styles.text)}>
                        ${order.total.toFixed(2)}
                      </div>
                      <div className={cn("text-xs", styles.textMutedLighter)}>
                        {order.items.length} items
                      </div>
                    </div>
                    {(order.status === "shipped" || order.status === "SHIPPED") && order.estimatedDelivery && (
                      <div className={cn("text-xs px-2 py-1 rounded", isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700")}>
                        Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item: TOrderItem) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className={cn("relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0", isDark ? "bg-white/5" : "bg-gray-100")}>
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", styles.text)}>{item.name}</p>
                          <p className={cn("text-xs", styles.textMutedLighter)}>
                            {item.variant && `${item.variant} • `}Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-sm font-medium", styles.text)}>${item.price.toFixed(2)}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="flex items-center justify-end space-x-1">
                              <p className={cn("text-xs line-through", styles.textMutedLighter)}>
                                ${item.originalPrice.toFixed(2)}
                              </p>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {Math.round(
                                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                                )}
                                % OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className={cn("text-xs italic", styles.textMutedLighter)}>
                        + {order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div
                  className={cn(
                    "p-4 border-t flex flex-wrap justify-between items-center gap-2",
                    styles.border,
                    isDark ? "bg-white/5" : "bg-gray-50"
                  )}
                >
                  <div className="flex space-x-2">
                    <button
                      className={cn("text-xs flex items-center transition-colors", styles.actionButton)}
                      onClick={(e) => handleDownloadInvoice(order.id, order.orderNumber, e)}
                      data-translate="orderHistory.invoice"
                    >
                      <FileText size={14} className="mr-1" />
                      Invoice
                    </button>
                    {order.trackingNumber && (
                      <button
                        className={cn("text-xs flex items-center transition-colors", styles.actionButton)}
                        onClick={(e) => handleTrackOrder(order.trackingUrl, e)}
                        data-translate="orderHistory.track"
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
                    <span data-translate="orderHistory.seeDetails">See Details</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}