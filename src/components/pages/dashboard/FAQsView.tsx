/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useCreateFAQMutation,
  useDeleteFAQMutation,
  useGetFAQsQuery,
  useUpdateFAQMutation,
} from "@/redux/features/faq/faqApi";
import { motion } from "framer-motion";
import { Check, Edit, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function FAQsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Dialog / Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [faqToDeleteId, setFaqToDeleteId] = useState<string | null>(null);

  // Form State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("Active");
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries and Mutations
  const { data, isLoading, isFetching } = useGetFAQsQuery({
    search: searchQuery || undefined,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const faqs = data?.data || [];

  // Extract unique categories for filter
  const uniqueCategories: string[] = [
    "all",
    ...Array.from(
      new Set<string>(
        faqs.map((f: any) => (f.category || "General") as string),
      ),
    ),
  ];

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setStatus("Active");
    setOrder(0);
    setEditingFAQ(null);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (faq: any) => {
    setEditingFAQ(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || "General");
    setStatus(faq.status || "Active");
    setOrder(faq.order || 0);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill in both the question and answer fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFAQ) {
        await updateFAQ({
          id: editingFAQ.id,
          question,
          answer,
          category,
          status,
          order: Number(order),
        }).unwrap();
        toast.success("FAQ updated successfully.");
      } else {
        await createFAQ({
          question,
          answer,
          category,
          status,
          order: Number(order),
        }).unwrap();
        toast.success("FAQ created successfully.");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save FAQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id).unwrap();
      toast.success("FAQ deleted successfully.");
      setFaqToDeleteId(null);
    } catch {
      toast.error("Failed to delete FAQ.");
    }
  };

  const handleToggleStatus = async (faq: any) => {
    const nextStatus = faq.status === "Active" ? "Inactive" : "Active";
    try {
      await updateFAQ({
        id: faq.id,
        status: nextStatus,
      }).unwrap();
      toast.success(`FAQ marked as ${nextStatus}.`);
    } catch {
      toast.error("Failed to toggle FAQ status.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-neutral-900 dark:text-neutral-100"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-950 to-neutral-700 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            FAQ Moderation
          </h1>
          <p className="text-xs text-neutral-500">
            Manage, create, and organize frequently asked questions for
            customers.
          </p>
        </div>

        <button
          onClick={handleOpenAddDialog}
          className="flex items-center gap-2 px-4 py-2 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007C74]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
            Category:
          </span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full text-xs h-9 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
              {uniqueCategories.map((cat: string) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer capitalize"
                >
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
            Status:
          </span>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full text-xs h-9 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
              <SelectItem
                value="all"
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                All Statuses
              </SelectItem>
              <SelectItem
                value="Active"
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Active
              </SelectItem>
              <SelectItem
                value="Inactive"
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FAQs Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-900 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4 w-12 text-center">Order</th>
              <th className="p-4 w-1/3">Question</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y divide-neutral-200 dark:divide-neutral-800 transition-opacity duration-200",
              isFetching ? "opacity-60 pointer-events-none" : "",
            )}
          >
            {isLoading || (isFetching && faqs.length === 0) ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                </td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400">
                  No FAQs found.
                </td>
              </tr>
            ) : (
              faqs.map((faq: any) => (
                <tr
                  key={faq.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="p-4 text-center font-bold text-neutral-500">
                    {faq.order}
                  </td>
                  <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-200 max-w-xs truncate">
                    {faq.question}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full font-semibold capitalize text-neutral-600 dark:text-neutral-400 text-[10px]">
                      {faq.category || "General"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(faq)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all",
                        faq.status === "Active"
                          ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700",
                      )}
                    >
                      {faq.status === "Active" ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      <span>{faq.status || "Active"}</span>
                    </button>
                  </td>
                  <td className="p-4 text-neutral-500">
                    {faq.createdAt
                      ? new Date(faq.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditDialog(faq)}
                        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#007C74] rounded-lg transition-colors cursor-pointer"
                        title="Edit FAQ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setFaqToDeleteId(faq.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-850 p-6 rounded-2xl shadow-xl text-neutral-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Category & Order in row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shipping"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007C74]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007C74]"
                  min="0"
                />
              </div>
            </div>

            {/* Question */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                Question
              </label>
              <input
                type="text"
                placeholder="Enter FAQ question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007C74]"
                required
              />
            </div>

            {/* Answer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                Answer
              </label>
              <textarea
                placeholder="Enter FAQ answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                className="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007C74] resize-none"
                required
              />
            </div>

            {/* Status Option */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full text-xs h-9 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                  <SelectItem
                    value="Active"
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Active (Visible to public)
                  </SelectItem>
                  <SelectItem
                    value="Inactive"
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Inactive (Hidden from public)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-xs font-bold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg text-xs shadow-md transition-all disabled:opacity-55 cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>{editingFAQ ? "Save Changes" : "Create FAQ"}</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!faqToDeleteId}
        onOpenChange={(open) => !open && setFaqToDeleteId(null)}
      >
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#0c0c0c] border border-neutral-250 dark:border-neutral-850 p-6 rounded-2xl shadow-xl text-neutral-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-650 dark:text-red-500 flex items-center gap-2">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Are you sure you want to permanently delete this FAQ? This action is
            irreversible.
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <button
              onClick={() => setFaqToDeleteId(null)}
              className="px-4 py-2 border border-neutral-250 dark:border-neutral-800 text-xs font-bold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (faqToDeleteId) {
                  handleDelete(faqToDeleteId);
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
