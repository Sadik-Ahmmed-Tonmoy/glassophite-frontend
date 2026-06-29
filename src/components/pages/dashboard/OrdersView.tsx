"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Mock Orders
const initialOrders = [
  { id: "ORD-9482", customer: "Sadik Rahman", product: "Titanium Aviator (Gold)", date: "2026-06-28", amount: 15400, status: "Processing" },
  { id: "ORD-9481", customer: "Tasnim Sultana", product: "Acetate Round (Black)", date: "2026-06-28", amount: 9800, status: "Shipped" },
  { id: "ORD-9480", customer: "Farhan Tanvir", product: "Classic Square (Tortoise)", date: "2026-06-27", amount: 12500, status: "Delivered" },
  { id: "ORD-9479", customer: "Nabila Tabassum", product: "Geometric Metal (Silver)", date: "2026-06-26", amount: 14200, status: "Delivered" },
];

export default function OrdersView() {
  const [orders, setOrders] = useState(initialOrders);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    toast.success("Order Status Updated", {
      description: `Order ${orderId} has been set to ${newStatus}.`,
    });
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
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Product Details</th>
              <th className="p-4">Date</th>
              <th className="p-4">Bill Amount</th>
              <th className="p-4">Courier Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-[#007C74]">{ord.id}</td>
                <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-200">{ord.customer}</td>
                <td className="p-4 text-neutral-500">{ord.product}</td>
                <td className="p-4 text-neutral-500">{ord.date}</td>
                <td className="p-4 font-bold text-neutral-900 dark:text-white">৳{ord.amount}</td>
                <td className="p-4">
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-neutral-250 dark:border-neutral-850 bg-white dark:bg-[#0c0c0c] text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer focus:ring-1 focus:ring-[#007C74]"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
