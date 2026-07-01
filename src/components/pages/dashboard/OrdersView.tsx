"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/redux/features/order/orderApi";

export default function OrdersView() {
  const { data, isLoading } = useGetAllOrdersQuery({ limit: 50 });
  const orders = data?.data || [];
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus.toUpperCase() }).unwrap();
      toast.success("Order Status Updated", {
        description: `Order ${orderId} has been set to ${newStatus}.`,
      });
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Orders</h1>
        <p className="text-xs text-neutral-500">Manage client purchases and courier status settings.</p>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Courier Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400">No orders yet.</td>
              </tr>
            ) : (
              orders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#007C74]">{ord.orderNumber}</td>
                  <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-200">
                    {ord.user?.fullName || "—"}
                  </td>
                  <td className="p-4 text-neutral-500">{ord.items?.length || 0} item(s)</td>
                  <td className="p-4 text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-neutral-900 dark:text-white">৳{ord.total?.toLocaleString()}</td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-neutral-250 dark:border-neutral-850 bg-white dark:bg-[#0c0c0c] text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer focus:ring-1 focus:ring-[#007C74]"
                    >
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
