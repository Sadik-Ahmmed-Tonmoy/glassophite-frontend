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
import { Loader2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from "@/redux/features/user/userApi";

export default function CustomersView() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isFetching } = useGetAllUsersQuery({ page: currentPage, limit, role: "USER" });
  const customers = (data?.data || []) as any[];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setLoadingId(id);
    try {
      await updateUserStatus({ id, status: newStatus }).unwrap();
      toast.success("Status Updated", {
        description: `Customer has been ${newStatus === "ACTIVE" ? "activated" : "blocked"}.`,
      });
    } catch {
      toast.error("Failed to update customer status.");
    } finally {
      setLoadingId(null);
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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Customers</h1>
          <p className="text-xs text-muted-foreground">Detailed list of verified client profiles.</p>
        </div>
        <div className="glass-panel rounded-2xl border border-border px-5 py-3 text-right">
          <p className="text-[10px] uppercase font-extrabold text-muted-foreground">Total</p>
          <p className="text-2xl font-extrabold text-foreground">
             {isLoading || isFetching ? "—" : data?.meta?.total ?? customers.length}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Client Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Registration</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No customers registered yet.
                </td>
              </tr>
            ) : (
              customers.map((cust: any) => (
                <tr key={cust.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-foreground">{cust.fullName || "—"}</td>
                  <td className="p-4 text-muted-foreground">{cust.email}</td>
                  <td className="p-4 text-muted-foreground">{cust.phoneNumber || "—"}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        cust.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(cust.id, cust.status)}
                      disabled={loadingId === cust.id}
                      title={cust.status === "ACTIVE" ? "Block customer" : "Activate customer"}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
                        cust.status === "ACTIVE"
                          ? "bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border-border"
                          : "bg-muted hover:bg-green-500/10 text-muted-foreground hover:text-green-600 border-border"
                      }`}
                    >
                      {loadingId === cust.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : cust.status === "ACTIVE" ? (
                        <UserX className="w-3.5 h-3.5" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
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
    </motion.div>
  );
}
