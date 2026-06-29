"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, X } from "lucide-react";
import { toast } from "sonner";

// Mock Reviews
const initialReviews = [
  { id: "REV-901", customer: "Sadik Tonmoy", rating: 5, frame: "Titanium Aviator (Gold)", comment: "Unbelievable build quality. The gold titanium plating feels very premium, and the lenses are exceptionally clear.", status: "Pending" },
  { id: "REV-902", customer: "Ishrat Jahan", rating: 4, frame: "Acetate Round (Black)", comment: "Love the frame size. It fits comfortably on square face structures. Slightly heavy but looks gorgeous.", status: "Pending" },
  { id: "REV-903", customer: "Muntasir Billah", rating: 2, frame: "Geometric Metal (Silver)", comment: "The design is very modern, but the nose pads are slightly loose. Had to consult the showroom to align them.", status: "Approved" },
];

export default function ReviewsView() {
  const [reviews, setReviews] = useState(initialReviews);

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Hidden") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    toast.success(`Review ${newStatus}`, {
      description: `Review is now set to ${newStatus}.`,
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
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Customer Reviews Moderation</h1>
        <p className="text-xs text-neutral-500">Approve or hide feedback submitted on active sunglasses collections.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Client</th>
              <th className="p-4">Product Details</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review Message</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-bold text-neutral-900 dark:text-white">{r.customer}</td>
                <td className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">{r.frame}</td>
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
                  {r.status === "Pending" ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(r.id, "Approved")}
                        className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-lg border border-green-500/20 transition-all cursor-pointer"
                        title="Approve public visibility"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, "Hidden")}
                        className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all cursor-pointer"
                        title="Hide/Reject review"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center font-bold text-[10px] uppercase">
                      <span className={r.status === "Approved" ? "text-green-500" : "text-neutral-400"}>
                        {r.status}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
