"use client";

import React from "react";
import { motion } from "framer-motion";

// Mock Customers
const initialCustomers = [
  { name: "Sadik Rahman", email: "sadik.rahman@gmail.com", joined: "2026-01-15", ordersCount: 5, spent: 78500 },
  { name: "Tasnim Sultana", email: "tasnim.s@gmail.com", joined: "2026-02-18", ordersCount: 3, spent: 34200 },
  { name: "Farhan Tanvir", email: "farhan.t@gmail.com", joined: "2026-03-10", ordersCount: 4, spent: 48900 },
  { name: "Nabila Tabassum", email: "nabila.t@gmail.com", joined: "2026-04-05", ordersCount: 2, spent: 28400 },
];

export default function CustomersView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Customers</h1>
        <p className="text-xs text-neutral-500">Detailed list of verified client profiles.</p>
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Client Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Registration</th>
              <th className="p-4 text-center">Total Orders</th>
              <th className="p-4 text-right">Lifetime Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {initialCustomers.map((cust, idx) => (
              <tr key={idx} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-bold text-neutral-900 dark:text-white">{cust.name}</td>
                <td className="p-4 text-neutral-500">{cust.email}</td>
                <td className="p-4 text-neutral-500">{cust.joined}</td>
                <td className="p-4 text-center font-semibold text-neutral-600 dark:text-neutral-300">{cust.ordersCount}</td>
                <td className="p-4 text-right font-bold text-[#007C74]">৳{cust.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
