"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetAllReviewsQuery, useDeleteReviewMutation, useUpdateReviewMutation } from "@/redux/features/review/reviewApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ReviewsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isFetching } = useGetAllReviewsQuery({ page: currentPage, limit });
  const reviews = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const handleApproveReview = async (id: string) => {
    try {
      await updateReview({ id, verified: true }).unwrap();
      toast.success("Review Approved", { description: "Review has been verified and approved." });
    } catch {
      toast.error("Failed to approve review");
    }
  };

  const handleHideReview = async (id: string) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review Hidden", { description: "Review has been removed from the store." });
    } catch {
      toast.error("Failed to remove review");
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
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Customer Reviews Moderation</h1>
        <p className="text-xs text-neutral-500">Approve or hide feedback submitted on active sunglasses collections.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Client</th>
              <th className="p-4">Product</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review Message</th>
              <th className="p-4">Verified</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400">No reviews yet.</td>
              </tr>
            ) : (
              reviews.map((r: any) => (
                <tr key={r.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-bold text-neutral-900 dark:text-white">{r.user?.fullName || "Anonymous"}</td>
                  <td className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">{r.product?.title || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-yellow-500" : "text-neutral-300 dark:text-neutral-700"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs text-neutral-500 leading-relaxed truncate hover:text-clip hover:whitespace-normal" title={r.comment}>
                    {r.comment}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${r.verified ? "bg-green-500/10 text-green-600" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                      {r.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                    <td className="p-4">
                     <div className="flex items-center justify-center gap-1.5">
                       {!r.verified && (
                         <button
                           onClick={() => handleApproveReview(r.id)}
                           className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-lg border border-green-500/20 transition-all cursor-pointer"
                           title="Approve review"
                         >
                           <Star className="w-3.5 h-3.5" />
                         </button>
                       )}
                       <button
                         onClick={() => handleHideReview(r.id)}
                         className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all cursor-pointer"
                         title="Remove review"
                       >
                         <X className="w-3.5 h-3.5" />
                       </button>
                     </div>
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
