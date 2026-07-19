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
  PrescriptionLens,
  useCreatePrescriptionLensMutation,
  useDeletePrescriptionLensMutation,
  useGetPrescriptionLensesQuery,
  useUpdatePrescriptionLensMutation,
} from "@/redux/features/lens/lensApi";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Edit,
  Glasses,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function PrescriptionLensesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: lensesData,
    isLoading,
    refetch,
  } = useGetPrescriptionLensesQuery();
  const lenses = lensesData?.data || [];

  const [createLens, { isLoading: isCreating }] =
    useCreatePrescriptionLensMutation();
  const [updateLens, { isLoading: isUpdating }] =
    useUpdatePrescriptionLensMutation();
  const [deleteLens, { isLoading: isDeleting }] =
    useDeletePrescriptionLensMutation();

  // Modal Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<PrescriptionLens | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Delete Confirm Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingLensId, setDeletingLensId] = useState<string | null>(null);

  const handleOpenForm = (lens: PrescriptionLens | null = null) => {
    if (lens) {
      setEditingLens(lens);
      setName(lens.name);
      setDescription(lens.description || "");
      setPrice(lens.price.toString());
      setIsAvailable(lens.isAvailable);
    } else {
      setEditingLens(null);
      setName("");
      setDescription("");
      setPrice("");
      setIsAvailable(true);
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Please fill in name and price");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Price must be a valid positive number");
      return;
    }

    const payload = {
      name,
      description: description || undefined,
      price: priceNum,
      isAvailable,
    };

    try {
      if (editingLens) {
        await updateLens({ id: editingLens.id, ...payload }).unwrap();
        toast.success("Prescription lens updated successfully");
      } else {
        await createLens(payload).unwrap();
        toast.success("Prescription lens added successfully");
      }
      setIsFormOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save prescription lens");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLensId) return;
    try {
      await deleteLens(deletingLensId).unwrap();
      toast.success("Prescription lens deleted successfully");
      setIsDeleteOpen(false);
      setDeletingLensId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete prescription lens");
    }
  };

  const filteredLenses = lenses.filter(
    (lens) =>
      lens.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lens.description &&
        lens.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#007C74] to-[#3C55A5] bg-clip-text text-transparent">
            Custom Prescription Lenses
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage premium protective lens packages and additional pricing
            details
          </p>
        </div>

        <button
          onClick={() => handleOpenForm(null)}
          className="flex items-center gap-2 px-4 py-2 bg-[#007C74] hover:bg-[#007C74]/90 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lens Package</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-sm">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search lens packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow bg-transparent text-sm outline-none border-none placeholder-neutral-400"
        />
      </div>

      {/* Main Table view */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#007C74] animate-spin" />
            <span className="text-xs text-neutral-500">
              Retrieving lens details...
            </span>
          </div>
        ) : filteredLenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Glasses className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              No Lens Packages Found
            </span>
            <span className="text-xs text-neutral-400">
              Add a new package using the button above.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10 text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Additional Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <AnimatePresence>
                  {filteredLenses.map((lens) => (
                    <motion.tr
                      key={lens.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors text-sm"
                    >
                      <td className="py-4 px-6 font-semibold">{lens.name}</td>
                      <td className="py-4 px-6 text-neutral-500 dark:text-neutral-400 text-xs max-w-xs truncate">
                        {lens.description || (
                          <span className="italic text-neutral-300 dark:text-neutral-700">
                            None
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium text-[#007C74]">
                        ৳{lens.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {lens.isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-green-500/15 border border-green-500/30 text-green-600">
                            <Check className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-red-500/15 border border-red-500/30 text-red-500">
                            <X className="w-3 h-3" /> Unavailable
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenForm(lens)}
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingLensId(lens.id);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] text-neutral-900 dark:text-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingLens ? "Edit Lens Package" : "Add Lens Package"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">
                Package Name
              </label>
              <input
                type="text"
                placeholder="e.g. Blue Cut Lenses"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm outline-none focus:ring-1 focus:ring-[#007C74]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">
                Description
              </label>
              <textarea
                placeholder="e.g. Protects eyes from digital screen blue light"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm outline-none focus:ring-1 focus:ring-[#007C74] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">
                Additional Price (৳)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 1500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm outline-none focus:ring-1 focus:ring-[#007C74]"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">
                  Available for Order
                </span>
                <span className="text-[10px] text-neutral-400">
                  Toggle whether users can select this package
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  isAvailable
                    ? "bg-[#007C74]"
                    : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                    isAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#007C74] hover:bg-[#007C74]/90 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Save Package</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] text-neutral-900 dark:text-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-500">
              Delete Prescription Lens Package?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
            Are you sure you want to delete this prescription lens package? This
            action is permanent and cannot be undone.
          </div>
          <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Delete Package</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
