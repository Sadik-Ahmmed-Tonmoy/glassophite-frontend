"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { motion } from "framer-motion";
import { Copy, Loader2, Truck, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "@/redux/features/order/orderApi";
import DeliveryDialog from "./DeliveryDialog";

const STATUS_COLORS: Record<string, string> = {
  PROCESSING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  SHIPPED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  DELIVERED: "bg-green-500/10 text-green-600 dark:text-green-400",
  CANCELLED: "bg-red-500/10 text-red-500",
};

export default function OrdersView() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching } = useGetAllOrdersQuery({ page: currentPage, limit });
  const orders = (data?.data || []) as any[];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      await deleteOrder(orderId).unwrap();
      toast.success("Order Deleted", { description: "Order has been permanently deleted." });
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delivery dialog state
  const [dialogOrder, setDialogOrder] = useState<any>(null);
  const [dialogStatus, setDialogStatus] = useState<"SHIPPED" | "DELIVERED">("DELIVERED");

  const handleStatusChange = (order: any, newStatus: string) => {
    if (newStatus === "SHIPPED" || newStatus === "DELIVERED") {
      setDialogOrder(order);
      setDialogStatus(newStatus);
      return;
    }
    commitStatusUpdate(order.id, newStatus, "");
  };

  const commitStatusUpdate = async (
    orderId: string,
    newStatus: string,
    trackingNumber: string
  ) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus.toUpperCase(),
        ...(trackingNumber ? { trackingNumber } : {}),
      }).unwrap();
      toast.success("Order Status Updated", {
        description: `Order status set to ${newStatus}.`,
      });
    } catch {
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Orders</h1>
          <p className="text-xs text-muted-foreground">
            Manage client purchases and courier status settings.
          </p>
        </div>
        <div className="glass-panel rounded-2xl border border-border px-5 py-3 text-right">
          <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-extrabold text-foreground">
            {isLoading || isFetching ? "—" : data?.meta?.total ?? orders.length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((ord: any) => (
                <React.Fragment key={ord.id}>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{ord.orderNumber}</td>
                    <td className="p-4 font-semibold text-foreground">
                      {ord.user?.fullName || ord.shippingAddress?.name || (ord.shippingAddress?.firstName && `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName}`) || "—"}
                      {ord.user?.email && (
                        <p className="text-[10px] text-muted-foreground font-normal">
                          {ord.user.email}
                        </p>
                      )}
                      {ord.shippingAddress?.phone && (
                        <p className="text-[10px] text-muted-foreground font-normal flex items-center gap-1 mt-0.5">
                          {ord.shippingAddress.phone}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(ord.shippingAddress.phone);
                              toast.success("Phone number copied");
                            }}
                            className="p-0.5 rounded hover:bg-muted transition-colors"
                            title="Copy phone number"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">{ord.items?.length || 0} item(s)</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      ৳{ord.total?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          STATUS_COLORS[ord.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {ord.status}
                      </span>
                      {ord.trackingNumber && (
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {ord.trackingNumber}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {updatingId === ord.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord, e.target.value)}
                            className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg border border-border bg-background text-foreground focus:outline-none cursor-pointer focus:ring-1 focus:ring-primary/50"
                          >
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all cursor-pointer"
                          title="Delete order"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>


                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages} ({totalItems} total)
            </p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p - 1)); }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <PaginationItem>
                          <span className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === p}
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p); }}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p + 1)); }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <DeliveryDialog
        open={!!dialogOrder}
        onOpenChange={(open) => { if (!open) setDialogOrder(null); }}
        order={dialogOrder || { id: "", orderNumber: "", items: [] }}
        status={dialogStatus}
      />
    </motion.div>
  );
}
