"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";

export default function CustomersView() {
  const { data, isLoading } = useGetAllUsersQuery({ limit: 50 });
  const customers = data?.data || [];

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
              <th className="p-4">Phone</th>
              <th className="p-4">Registration</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-400">No customers registered yet.</td>
              </tr>
            ) : (
              customers.map((cust: any) => (
                <tr key={cust.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-bold text-neutral-900 dark:text-white">{cust.fullName || "—"}</td>
                  <td className="p-4 text-neutral-500">{cust.email}</td>
                  <td className="p-4 text-neutral-500">{cust.phoneNumber || "—"}</td>
                  <td className="p-4 text-neutral-500">{new Date(cust.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      cust.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {cust.status}
                    </span>
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
