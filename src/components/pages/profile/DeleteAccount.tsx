"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeleteAccountMutation } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { fadeInUp } from "@/lib/profileAnimations";

export default function DeleteAccount() {
  const { isDark, theme: styles } = useProfileTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    if (confirmText !== "DELETE") return;
    try {
      await deleteAccount(undefined).unwrap();
      toast.success("Account deleted permanently");
      dispatch(logout());
      router.push("/");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl border shadow-sm p-6 transition-all duration-500", styles.card)}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 rounded-lg bg-red-500/10">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <h2 className={cn("text-lg font-semibold", styles.text)}>Delete Account</h2>
      </div>

      <AnimatePresence mode="wait">
        {!showConfirmation ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={cn("p-4 rounded-xl border mb-5", isDark ? "border-red-500/10 bg-red-500/5" : "border-red-100 bg-red-50")}>
              <p className={cn("text-sm leading-relaxed", isDark ? "text-red-300" : "text-red-700")}>
                Once you delete your account, there is no going back. This action is permanent and all your data will be erased.
              </p>
            </div>
            <motion.button
              onClick={() => setShowConfirmation(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-red-500/80 hover:bg-red-500 text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 size={16} />
              Delete Account
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={cn("rounded-xl border p-5", isDark ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50")}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="p-2 rounded-full bg-red-500/20 shrink-0">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <div>
                <h3 className={cn("text-base font-semibold", isDark ? "text-red-400" : "text-red-700")}>Warning: This action cannot be undone</h3>
                <p className={cn("text-sm mt-1", isDark ? "text-red-300/80" : "text-red-600/80")}>
                  This will permanently delete your account, all your data, and remove your access to all services.
                </p>
              </div>
            </div>

            <div className="mb-5">
              <label className={cn("block text-sm font-medium mb-1.5", styles.label)}>
                To confirm, type <span className="font-bold text-red-500">&quot;DELETE&quot;</span> in the field below:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={cn(
                  "w-full px-3 py-2.5 rounded-xl transition-all outline-none",
                  "focus:ring-2 focus:ring-red-500/30",
                  isDark
                    ? "bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 focus:border-red-500/50"
                    : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-red-500/50"
                )}
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={handleDeleteConfirm}
                disabled={confirmText !== "DELETE" || isDeleting}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all",
                  "bg-red-500/80 hover:bg-red-500 text-white",
                  (confirmText !== "DELETE" || isDeleting) && "opacity-40 cursor-not-allowed"
                )}
                whileHover={confirmText === "DELETE" && !isDeleting ? { scale: 1.02 } : {}}
                whileTap={confirmText === "DELETE" && !isDeleting ? { scale: 0.98 } : {}}
              >
                {isDeleting ? (
                  <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> Deleting...</>
                ) : (
                  <><Trash2 size={16} /> Permanently Delete Account</>
                )}
              </motion.button>

              <motion.button
                onClick={() => { setShowConfirmation(false); setConfirmText(""); }}
                disabled={isDeleting}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-medium text-sm transition-all border",
                  isDark ? "border-white/[0.08] text-white hover:bg-white/[0.06]" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
