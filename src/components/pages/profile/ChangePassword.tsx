"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Save, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChangePasswordMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { fadeInUp } from "@/lib/profileAnimations";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export default function ChangePassword() {
  const { isDark, theme: styles } = useProfileTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [errors, setErrors] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const passwordStrength = useMemo(() => getPasswordStrength(formData.newPassword), [formData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

    if (!formData.currentPassword) { newErrors.currentPassword = "Current password is required"; isValid = false; }
    if (!formData.newPassword) { newErrors.newPassword = "New password is required"; isValid = false; }
    else if (formData.newPassword.length < 8) { newErrors.newPassword = "Password must be at least 8 characters"; isValid = false; }
    if (!formData.confirmPassword) { newErrors.confirmPassword = "Please confirm your new password"; isValid = false; }
    else if (formData.newPassword !== formData.confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await changePassword({ oldPassword: formData.currentPassword, newPassword: formData.newPassword }).unwrap();
      toast.success("Password changed successfully. Please login again.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      dispatch(logout());
      router.push("/auth/login");
    } catch {
      toast.error("Failed to change password");
    }
  };

  const inputClass = (field: string) => cn(
    "w-full px-3 py-2.5 border rounded-xl bg-transparent transition-all duration-300 outline-none",
    "focus:ring-2 focus:ring-[#007C74]/20",
    isDark
      ? "border-white/[0.08] text-white placeholder:text-neutral-600 focus:border-[#007C74]/50"
      : "border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#007C74]/50",
    errors[field as keyof typeof errors] && "border-red-500 focus:ring-red-500/20"
  );

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl border shadow-sm p-6 transition-all duration-500 hover:shadow-md", styles.card, styles.cardGlow)}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className={cn("p-2 rounded-lg", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
          <Lock size={18} className="text-[#007C74]" />
        </div>
        <h2 className={cn("text-lg font-semibold", styles.text)}>Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
          const labels: Record<string, string> = {
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm New Password",
          };
          return (
            <div key={field}>
              <label htmlFor={field} className={cn("block text-sm font-medium mb-1.5", styles.label)}>{labels[field]}</label>
              <div className="relative">
                <input
                  type={showPasswords[field] ? "text" : "password"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={inputClass(field)}
                />
                <button
                  type="button"
                  className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", styles.icon)}
                  onClick={() => toggleVisibility(field)}
                >
                  {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors[field] && <p className={cn("mt-1 text-sm", styles.error)}>{errors[field]}</p>}
              {field === "newPassword" && formData.newPassword.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= passwordStrength.score ? passwordStrength.color : isDark ? "bg-white/[0.06]" : "bg-gray-200")} />
                    ))}
                  </div>
                  <p className={cn("text-xs font-medium", passwordStrength.color === "bg-red-500" ? "text-red-400" : passwordStrength.color === "bg-yellow-500" ? "text-yellow-400" : passwordStrength.color === "bg-blue-500" ? "text-blue-400" : "text-green-400")}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex justify-end pt-2">
          <motion.button
            type="submit"
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all",
              styles.buttonPrimary,
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" /> Updating...</>
            ) : (
              <><Save size={16} /> Update Password</>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
