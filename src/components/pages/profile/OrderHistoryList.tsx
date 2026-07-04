"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Filter,
  Package,
  Search,
  ShoppingBag,
  Truck,
  ArrowUpDown,
  Download,
  ExternalLink,
  AlertCircle,
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
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import type { TOrderItem } from "@/types/types";
import { cn } from "@/lib/utils";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { staggerContainer, staggerItems } from "@/lib/profileAnimations";
import { toast } from "sonner";

const statusIconMap: Record<string, typeof Package> = {
  delivered: Package,
  shipped: Truck,
  processing: Package,
  cancelled: AlertCircle,
};

const statusColorMap: Record<string, string> = {
  delivered: "bg-green-500/15 text-green-400 border-green-500/20 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/20 bg-green-100 text-green-700 border-green-200",
  shipped: "bg-blue-500/15 text-blue-400 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20 bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/20 bg-yellow-100 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20 bg-red-100 text-red-700 border-red-200",
};

function getStatusClass(status: string): string {
  const s = status.toLowerCase();
  return statusColorMap[s] || statusColorMap.processing;
}

export default function OrderHistoryList() {
  const { isDark, theme: styles } = useProfileTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const { data: ordersData } = useGetMyOrdersQuery(undefined);
  const orders = ordersData?.data || ordersData || [];

  const filteredOrders = orders
    .filter((order) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return order.orderNumber.toLowerCase().includes(q) ||
        order.items.some((item: TOrderItem) => item.name.toLowerCase().includes(q));
    })
    .filter((order) => statusFilter === "all" || order.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc": return new Date(a.orderDate ?? a.createdAt ?? 0).getTime() - new Date(b.orderDate ?? b.createdAt ?? 0).getTime();
        case "date-desc": return new Date(b.orderDate ?? b.createdAt ?? 0).getTime() - new Date(a.orderDate ?? a.createdAt ?? 0).getTime();
        case "total-asc": return a.total - b.total;
        case "total-desc": return b.total - a.total;
        default: return 0;
      }
    });

  const handleDownloadInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Invoice download will be available once integrated with the backend.");
  };

  const handleTrackOrder = (trackingUrl: string | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (trackingUrl) window.open(trackingUrl, "_blank");
    else toast.info("Tracking information is not available for this order.");
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItems}
        className={cn("rounded-2xl border shadow-sm p-4 sm:p-5 transition-all duration-500", styles.card, styles.cardGlow)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Search size={16} className={cn("absolute left-3 top-1/2 -translate-y-1/2", styles.icon)} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-9 w-full px-4 py-2.5 rounded-xl transition-all outline-none text-sm",
                "focus:ring-2 focus:ring-[#007C74]/20",
                isDark ? "bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 focus:border-[#007C74]/50" : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#007C74]/50"
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className={cn("shrink-0", styles.icon)} />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={cn("w-full rounded-xl", isDark ? "bg-white/[0.04] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900")}>
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

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className={cn("shrink-0", styles.icon)} />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={cn("w-full rounded-xl", isDark ? "bg-white/[0.04] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900")}>
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
      </motion.div>

      {filteredOrders.length === 0 ? (
        <motion.div variants={staggerItems}
          className={cn("rounded-2xl border shadow-sm p-10 text-center transition-all duration-500", styles.card)}
        >
          <div className={cn("inline-flex p-4 rounded-2xl mb-4", isDark ? "bg-white/[0.04]" : "bg-gray-100")}>
            <ShoppingBag size={40} className={styles.icon} />
          </div>
          <h3 className={cn("text-lg font-medium mb-1.5", styles.text)}>No orders found</h3>
          <p className={cn("text-sm", styles.textMutedLighter)}>
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "You haven't placed any orders yet."}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order) => {
              const statusKey = order.status.toLowerCase() as keyof typeof statusIconMap;
              const StatusIcon = statusIconMap[statusKey] || Package;
              const statusClass = getStatusClass(order.status);
              return (
                <motion.div
                  key={order.id}
                  variants={staggerItems}
                  layout
                  className={cn(
                    "rounded-2xl border shadow-sm overflow-hidden transition-all duration-500",
                    styles.card, styles.cardGlow,
                    "hover:shadow-md"
                  )}
                >
                  <div className={cn("p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-xl", isDark ? "bg-white/[0.04]" : "bg-gray-100")}>
                        <StatusIcon size={18} className={statusKey === "delivered" ? "text-green-500" : statusKey === "shipped" ? "text-blue-500" : statusKey === "cancelled" ? "text-red-500" : "text-yellow-500"} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("font-semibold text-sm", styles.text)}>Order #{order.orderNumber}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar size={12} className={styles.icon} />
                          <span className={cn("text-xs", styles.textMutedLighter)}>
                            Ordered on {new Date(order.orderDate ?? order.createdAt ?? 0).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <div className={cn("font-semibold text-base", styles.text)}>${order.total.toFixed(2)}</div>
                        <div className={cn("text-xs", styles.textMutedLighter)}>{order.items.length} items</div>
                      </div>
                      {(order.status === "shipped" || order.status === "SHIPPED") && order.estimatedDelivery && (
                        <div className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap">
                          Est. {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item: TOrderItem) => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                          <div className={cn("relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border", isDark ? "border-white/[0.06] bg-white/[0.04]" : "border-gray-100 bg-gray-50")}>
                            <Image src={item.image || "/placeholder.svg?height=64&width=64"} alt={item.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-medium truncate", styles.text)}>{item.name}</p>
                            <p className={cn("text-xs mt-0.5", styles.textMutedLighter)}>
                              {item.variant && `${item.variant} • `}Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn("text-sm font-medium", styles.text)}>${item.price.toFixed(2)}</p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <div className="flex items-center gap-1 justify-end">
                                <span className={cn("text-xs line-through", styles.textMutedLighter)}>${item.originalPrice.toFixed(2)}</span>
                                <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                                  -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className={cn("text-xs italic", styles.textMutedLighter)}>+ {order.items.length - 2} more items</p>
                      )}
                    </div>
                  </div>

                  <div className={cn("p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleDownloadInvoice}
                        className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", isDark ? "border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]" : "border-gray-200 text-gray-600 hover:bg-gray-100")}
                      >
                        <Download size={13} /> Invoice
                      </button>
                      {order.trackingNumber && (
                        <button
                          onClick={(e) => handleTrackOrder(order.trackingUrl, e)}
                          className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", isDark ? "border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]" : "border-gray-200 text-gray-600 hover:bg-gray-100")}
                        >
                          <ExternalLink size={13} /> Track
                        </button>
                      )}
                    </div>
                    <Link
                      href={`/my-profile/order-history/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg transition-all"
                    >
                      See Details
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}