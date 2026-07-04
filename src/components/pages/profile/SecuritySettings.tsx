"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Save, Clock, KeyRound, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { fadeInUp, staggerContainer, staggerItems } from "@/lib/profileAnimations";

export default function SecuritySettings() {
  const { isDark, theme: styles } = useProfileTheme();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  });

  const handleToggle = (name: string) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security settings updated");
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007C74]/30",
        checked
          ? "bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
          : isDark ? "bg-white/[0.12]" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-300",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
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
          <Shield size={18} className="text-[#007C74]" />
        </div>
        <h2 className={cn("text-lg font-semibold", styles.text)}>Security Settings</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={staggerItems} className={cn("flex items-center justify-between p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
            <div className="flex items-start gap-3">
              <KeyRound size={18} className="text-[#007C74] mt-0.5 shrink-0" />
              <div>
                <h3 className={cn("text-sm font-medium", styles.text)}>Two-Factor Authentication</h3>
                <p className={cn("text-xs mt-0.5", styles.textMutedLighter)}>Add an extra layer of security by requiring a verification code.</p>
              </div>
            </div>
            <Toggle checked={settings.twoFactorAuth} onChange={() => handleToggle("twoFactorAuth")} />
          </motion.div>

          <motion.div variants={staggerItems} className={cn("flex items-center justify-between p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
            <div className="flex items-start gap-3">
              <Bell size={18} className="text-[#007C74] mt-0.5 shrink-0" />
              <div>
                <h3 className={cn("text-sm font-medium", styles.text)}>Login Notifications</h3>
                <p className={cn("text-xs mt-0.5", styles.textMutedLighter)}>Receive email notifications when someone logs into your account.</p>
              </div>
            </div>
            <Toggle checked={settings.loginNotifications} onChange={() => handleToggle("loginNotifications")} />
          </motion.div>

          <motion.div variants={staggerItems} className={cn("p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
            <div className="flex items-start gap-3 mb-3">
              <Clock size={18} className="text-[#007C74] mt-0.5 shrink-0" />
              <div>
                <h3 className={cn("text-sm font-medium", styles.text)}>Session Timeout</h3>
                <p className={cn("text-xs", styles.textMutedLighter)}>Automatically log out after a period of inactivity.</p>
              </div>
            </div>
            <select
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              className={cn(
                "w-full md:w-64 px-3 py-2.5 rounded-xl transition-all outline-none cursor-pointer",
                "focus:ring-2 focus:ring-[#007C74]/20",
                isDark ? "bg-white/[0.04] border border-white/[0.08] text-white" : "bg-white border border-gray-200 text-gray-900"
              )}
            >
              {[
                { value: "15", label: "15 minutes" },
                { value: "30", label: "30 minutes" },
                { value: "60", label: "1 hour" },
                { value: "120", label: "2 hours" },
                { value: "never", label: "Never" },
              ].map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </motion.div>
        </motion.div>

        <div className="mt-6 flex justify-end">
          <motion.button
            type="submit"
            className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all", styles.buttonPrimary)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            Save Settings
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}