"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Mock Coupons list
const initialCoupons = [
  { id: "CPN-101", code: "GLASSOPHITE10", discount: 10, expiry: "2026-12-31", status: "Active" },
  { id: "CPN-102", code: "SUMMER20", discount: 20, expiry: "2026-08-31", status: "Active" },
  { id: "CPN-103", code: "PREMIUMVIP", discount: 15, expiry: "2026-10-15", status: "Expired" },
];

export default function CouponsView() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const couponSchema = z.object({
    code: z.string().min(4, "Coupon code must be at least 4 characters.").regex(/^[A-Z0-9]+$/, "Code must contain only capital letters and numbers."),
    discount: z.number().min(1, "Discount rate must be at least 1%.").max(99, "Discount rate cannot exceed 99%."),
    expiry: z.string().min(10, "Expiry date is required."),
  });

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      code: newCode.toUpperCase(),
      discount: Number(newDiscount),
      expiry: newExpiry,
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
        description: "Please correct errors inside active fields.",
      });
      return;
    }

    const newCoupon = {
      id: `CPN-${Math.floor(104 + Math.random() * 900)}`,
      code: newCode.toUpperCase(),
      discount: Number(newDiscount),
      expiry: newExpiry,
      status: "Active",
    };

    setCoupons([newCoupon, ...coupons]);
    toast.success("Coupon Code Created!", {
      description: `${newCoupon.code} is now active at checkout sheets.`,
    });

    setNewCode("");
    setNewDiscount("");
    setNewExpiry("");
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon Deleted", {
      description: `${code} promo code has been deleted.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Promo Coupons</h1>
          <p className="text-xs text-neutral-500">Configure discount code logic and validations.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#007c74]/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Rate</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#007C74]" />
                  <span>{c.code}</span>
                </td>
                <td className="p-4 font-bold text-[#007C74]">{c.discount}% Off</td>
                <td className="p-4 text-neutral-500">{c.expiry}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    c.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-neutral-150 dark:bg-neutral-850 text-neutral-500"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-1.5">
                  <button
                    onClick={() => handleDeleteCoupon(c.id, c.code)}
                    className="p-1.5 bg-neutral-100 hover:bg-red-500/10 dark:bg-neutral-800 dark:hover:bg-red-550/20 text-neutral-500 hover:text-red-550 dark:hover:text-red-400 rounded-lg border border-neutral-200 dark:border-neutral-850 transition-colors cursor-pointer"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coupon Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel max-w-sm w-full p-6 rounded-2xl relative z-10 space-y-4 border border-[#007C74]/25 shadow-2xl bg-white dark:bg-neutral-900"
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#007C74]" />
                <span>Create Discount Coupon</span>
              </h3>
              
              <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                {/* Code Name */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Promo Code Name</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. EXTRA25"
                    className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white uppercase"
                  />
                  {formErrors.code && (
                    <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.code}</span>
                  )}
                </div>

                {/* Discount and Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Rate (% Off)</label>
                    <input
                      type="number"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                    />
                    {formErrors.discount && (
                      <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.discount}</span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Expiry Expiry</label>
                    <input
                      type="date"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                    />
                    {formErrors.expiry && (
                      <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.expiry}</span>
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-[#007c74]/15"
                  >
                    Save Coupon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
