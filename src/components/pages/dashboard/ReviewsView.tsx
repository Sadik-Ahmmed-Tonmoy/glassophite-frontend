"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader2, Trash2, Check, AlertCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useGetAllReviewsQuery, useDeleteReviewMutation, useApproveReviewMutation } from "@/redux/features/review/reviewApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

export default function ReviewsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterApproved, setFilterApproved] = useState("all");
  const limit = 20;

  const { data, isLoading, isFetching } = useGetAllReviewsQuery({
    page: currentPage,
    limit,
    sortBy,
    isApproved: filterApproved === "approved" ? "true" : filterApproved === "pending" ? "false" : undefined
  });

  const reviews = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const [deleteReview] = useDeleteReviewMutation();
  const [approveReview] = useApproveReviewMutation();

  const handleStatusChange = async (id: string, isApproved: boolean) => {
    try {
      await approveReview({ id, isApproved }).unwrap();
      toast.success(
        isApproved ? "Review Approved" : "Review marked as Pending",
        { description: isApproved ? "Review has been approved and is now visible on the storefront." : "Review status is pending moderation." }
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleHideReview = async (id: string) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review Deleted", { description: "Review has been permanently deleted." });
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Customer Reviews Moderation</h1>
          <p className="text-xs text-neutral-500">Approve or hide feedback submitted on active sunglasses collections.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex flex-col gap-1 w-[140px]">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Filter Status</span>
            <Select value={filterApproved} onValueChange={(val) => { setFilterApproved(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full text-xs h-9 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 text-xs">
                <SelectItem value="all" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">All Reviews</SelectItem>
                <SelectItem value="approved" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">Approved</SelectItem>
                <SelectItem value="pending" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1 w-[160px]">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Sort By</span>
            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full text-xs h-9 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 text-xs">
                <SelectItem value="newest" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">Newest Reviews</SelectItem>
                <SelectItem value="highest" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">Highest Rating</SelectItem>
                <SelectItem value="lowest" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">Lowest Rating</SelectItem>
                <SelectItem value="helpful" className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y divide-neutral-200 dark:divide-neutral-800 transition-opacity duration-200",
              isFetching ? "opacity-60 pointer-events-none" : ""
            )}
          >
            {isLoading || (isFetching && reviews.length === 0) ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400">No reviews yet.</td>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/20 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer outline-none">
                        <span className={r.isApproved ? "text-emerald-600" : "text-amber-600"}>
                          {r.isApproved ? "Approved" : "Pending"}
                        </span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 text-xs">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(r.id, true)}
                          className="flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Review
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(r.id, false)}
                          className="flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-amber-600"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Mark as Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleHideReview(r.id)}
                        className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
