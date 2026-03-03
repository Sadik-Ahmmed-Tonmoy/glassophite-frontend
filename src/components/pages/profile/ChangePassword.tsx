"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Save, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChangePassword() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      icon: "text-neutral-400",
      error: "text-red-400",
      helper: "text-neutral-500",
      button: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
    },
    light: {
      card: "bg-white border-neutral-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      input: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
      label: "text-gray-700",
      icon: "text-gray-500",
      error: "text-red-600",
      helper: "text-gray-500",
      button: "bg-primary text-white hover:bg-primary/90",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Password change request:", formData);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    }
  };

  // Animation variants
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
        <Lock size={20} className={cn("mr-2", styles.icon)} />
        <h2 className={cn("text-lg font-semibold", styles.text)} data-translate="profile.changePassword.title">
          Change Password
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className={cn("block text-sm font-medium mb-1", styles.label)} data-translate="profile.changePassword.current">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                  styles.input,
                  errors.currentPassword ? "border-red-500" : styles.border
                )}
              />
              <button
                type="button"
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", styles.icon)}
                onClick={() => togglePasswordVisibility("currentPassword")}
              >
                {showPasswords.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className={cn("mt-1 text-sm", styles.error)} data-translate="profile.changePassword.error.current">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className={cn("block text-sm font-medium mb-1", styles.label)} data-translate="profile.changePassword.new">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                  styles.input,
                  errors.newPassword ? "border-red-500" : styles.border
                )}
              />
              <button
                type="button"
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", styles.icon)}
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showPasswords.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className={cn("mt-1 text-sm", styles.error)} data-translate="profile.changePassword.error.new">
                {errors.newPassword}
              </p>
            )}
            <p className={cn("mt-1 text-xs", styles.helper)} data-translate="profile.changePassword.helper">
              Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={cn("block text-sm font-medium mb-1", styles.label)} data-translate="profile.changePassword.confirm">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                  styles.input,
                  errors.confirmPassword ? "border-red-500" : styles.border
                )}
              />
              <button
                type="button"
                className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", styles.icon)}
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showPasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={cn("mt-1 text-sm", styles.error)} data-translate="profile.changePassword.error.confirm">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            type="submit"
            className={cn("inline-flex items-center px-4 py-2 rounded-md transition-colors", styles.button)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-translate="profile.changePassword.submit"
          >
            <Save size={16} className="mr-1.5" />
            Update Password
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}