"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeleteAccountMutation } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      warningBorder: "border-red-500/30",
      warningBg: "bg-red-500/10",
      warningTitle: "text-red-400",
      warningText: "text-red-300",
      buttonDanger: "bg-red-500 hover:bg-red-600 text-white",
      buttonSecondary: "border-white/20 text-white hover:bg-white/10",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
    },
    light: {
      card: "bg-white border-neutral-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      warningBorder: "border-red-200",
      warningBg: "bg-red-50",
      warningTitle: "text-red-700",
      warningText: "text-red-600",
      buttonDanger: "bg-red-500 hover:bg-red-600 text-white",
      buttonSecondary: "border-gray-300 text-gray-700 hover:bg-gray-50",
      input: "bg-white border-gray-300 text-gray-900",
      label: "text-gray-700",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmText("");
  };

  const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
  };

  const handleDeleteConfirm = async () => {
    if (confirmText !== "DELETE") return;
    try {
      await deleteAccount(undefined).unwrap();
      toast.success("Account deleted permanently");
      dispatch(logout());
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete account");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-xl border shadow-sm p-6 transition-colors duration-500",
        styles.card
      )}
    >
      <div className="flex items-center mb-6">
        <Trash2 size={20} className="text-red-500 mr-2" />
        <h2 className={cn("text-lg font-semibold", styles.text)}>Delete Account</h2>
      </div>

      {!showConfirmation ? (
        <div>
          <p className={cn("mb-4", styles.textMuted)}>
            Once you delete your account, there is no going back. This action is permanent and cannot be undone.
          </p>
          <motion.button
            onClick={handleDeleteRequest}
            className={cn("inline-flex items-center px-4 py-2 rounded-md transition-colors", styles.buttonDanger)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} className="mr-1.5" />
            Delete Account
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("border rounded-lg p-4", styles.warningBorder, styles.warningBg)}
        >
          <div className="flex items-start mb-4">
            <AlertTriangle size={24} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className={cn("text-md font-semibold", styles.warningTitle)}>Warning: This action cannot be undone</h3>
              <p className={cn("text-sm mt-1", styles.warningText)}>
                This will permanently delete your account, all your data, and remove your access to all services.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className={cn("block text-sm font-medium mb-1", styles.label)}>
              To confirm, type &quot;DELETE&quot; in the field below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={handleConfirmTextChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors",
                styles.input
              )}
              placeholder="DELETE"
            />
          </div>

          <div className="flex space-x-3">
            <motion.button
              onClick={handleDeleteConfirm}
              disabled={confirmText !== "DELETE" || isDeleting}
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-md transition-colors",
                styles.buttonDanger,
                (confirmText !== "DELETE" || isDeleting) && "opacity-50 cursor-not-allowed"
              )}
              whileHover={confirmText === "DELETE" && !isDeleting ? { scale: 1.05 } : {}}
              whileTap={confirmText === "DELETE" && !isDeleting ? { scale: 0.95 } : {}}
            >
              {isDeleting ? (
                <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> Deleting...</>
              ) : (
                <><Trash2 size={16} className="mr-1.5" /> Permanently Delete Account</>
              )}
            </motion.button>

            <motion.button
              onClick={handleCancel}
              disabled={isDeleting}
              className={cn("px-4 py-2 border rounded-md transition-colors", styles.buttonSecondary)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
