"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Tag, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/redux/features/coupon/couponApi";

export default function CouponsView() {
  const { data, isLoading } = useGetAllCouponsQuery(undefined);
  const coupons = data?.data || [];
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<{ id: string; code: string; discount: number; expiry: string; status: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; code: string }>({ isOpen: false, id: "", code: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [status, setStatus] = useState<"Active" | "Expired">("Active");

  const couponSchema = z.object({
    code: z
      .string()
      .min(4, "Coupon code must be at least 4 characters.")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Code must contain only uppercase letters, numbers, hyphens, and underscores."
      ),
    discount: z
      .number()
      .min(1, "Discount rate must be at least 1%.")
      .max(99, "Discount rate cannot exceed 99%."),
    expiry: z.string().min(10, "Expiry date is required."),
    status: z.enum(["Active", "Expired"]),
  });

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscount("");
    setExpiry("");
    setStatus("Active");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: TCoupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscount(c.discount.toString());
    setExpiry(c.expiry);
    setStatus(c.status);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToValidate = {
      code: code.toUpperCase().trim(),
      discount: Number(discount),
      expiry,
      status,
    };

    const validationResult = couponSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      toast.error("Form Validation Error", {
        description: "Please correct the coupon form errors.",
      });
      return;
    }

    if (editingCoupon) {
      try {
        await updateCoupon({ id: editingCoupon.id, code: code.toUpperCase().trim(), discount: Number(discount), expiry, status }).unwrap();
        toast.success("Coupon Updated", { description: `${code.toUpperCase()} coupon has been updated successfully.` });
      } catch {
        toast.error("Failed to update coupon");
      }
    } else {
      try {
        await createCoupon({ code: code.toUpperCase().trim(), discount: Number(discount), expiry, status }).unwrap();
        toast.success("Coupon Created!", { description: `${code.toUpperCase()} is now active at checkout.` });
      } catch (err: any) {
        toast.error("Failed to create coupon", { description: err?.data?.message || "Something went wrong" });
      }
    }
    setIsModalOpen(false);
  };

  const triggerDeleteCoupon = (id: string, codeStr: string) => {
    setDeleteConfirm({
      isOpen: true,
      id,
      code: codeStr,
    });
  };

  const executeDelete = async () => {
    try {
      await deleteCoupon(deleteConfirm.id).unwrap();
      toast.success("Coupon Deleted", { description: `"${deleteConfirm.code}" promo code has been deleted.` });
    } catch {
      toast.error("Failed to delete coupon");
    }
    setDeleteConfirm({ isOpen: false, id: "", code: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-foreground"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Promo Coupons
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure discount codes, rate percentages, expiration checkouts, and logic.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-primary/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Rate</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground bg-card/25">
                  No coupons configured. Click &quot;New Coupon&quot; to get started.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-foreground flex items-center gap-2">
                    <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                      <Tag className="w-3.5 h-3.5" />
                    </span>
                    <span>{c.code}</span>
                  </td>
                  <td className="p-4 font-bold text-primary">
                    {c.discount}% Off
                  </td>
                  <td className="p-4 text-muted-foreground font-semibold">{c.expiry}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        c.status === "Active"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                      title="Edit coupon"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDeleteCoupon(c.id, c.code)}
                      className="p-1.5 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Coupon Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card text-card-foreground p-6 rounded-2xl relative z-10 space-y-4 border border-border shadow-2xl max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Tag className="w-4 h-4" />
                </span>
                <span>{editingCoupon ? "Modify Discount Coupon" : "Create Discount Coupon"}</span>
              </h3>

              <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
                {/* Code Name */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">
                    Promo Code Name
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. EXTRA25"
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                  />
                  {formErrors.code && (
                    <span className="text-red-500 text-[10px] block mt-0.5">
                      {formErrors.code}
                    </span>
                  )}
                </div>

                {/* Discount and Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">
                      Rate (% Off)
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {formErrors.discount && (
                      <span className="text-red-500 text-[10px] block mt-0.5">
                        {formErrors.discount}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {formErrors.expiry && (
                      <span className="text-red-500 text-[10px] block mt-0.5">
                        {formErrors.expiry}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Expired")}
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="Active">Active & Acceptable</option>
                    <option value="Expired">Expired / Disabled</option>
                  </select>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/15"
                  >
                    {editingCoupon ? "Save Changes" : "Save Coupon"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm({ isOpen: false, id: "", code: "" })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card text-card-foreground border border-border p-6 rounded-2xl relative z-10 max-w-sm w-full space-y-4 shadow-xl text-xs"
            >
              <h3 className="text-base font-bold text-foreground">Confirm Deletion</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete the coupon code &quot;{deleteConfirm.code}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, id: "", code: "" })}
                  className="px-3 py-2 bg-background hover:bg-muted text-foreground font-semibold rounded-lg border border-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-red-650/10"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
