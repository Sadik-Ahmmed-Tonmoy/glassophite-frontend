"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Shield, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecuritySettings() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  });

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      icon: "text-neutral-400",
      toggleBg: "bg-white/20",
      toggleChecked: "bg-[#007C74]",
      toggleThumb: "bg-white",
      select: "bg-white/5 border-white/10 text-white",
      button: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg",
    },
    light: {
      card: "bg-white border-neutral-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      icon: "text-gray-500",
      toggleBg: "bg-gray-200",
      toggleChecked: "bg-primary",
      toggleThumb: "bg-white",
      select: "bg-white border-gray-300 text-gray-900",
      button: "bg-primary text-white hover:bg-primary/90",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated security settings:", settings);
    alert("Security settings updated successfully!");
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
        <Shield size={20} className={cn("mr-2", styles.icon)} />
        <h2 className={cn("text-lg font-semibold", styles.text)} data-translate="profile.security.title">
          Security Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={cn("text-md font-medium", styles.textMuted)} data-translate="profile.security.twoFactorTitle">
                Two-Factor Authentication
              </h3>
              <p className={cn("text-sm mt-1", styles.textMutedLighter)} data-translate="profile.security.twoFactorDesc">
                Add an extra layer of security to your account by requiring a verification code.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "w-11 h-6 rounded-full peer transition-colors",
                  "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20",
                  "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all",
                  "peer-checked:after:translate-x-full peer-checked:after:border-white",
                  settings.twoFactorAuth ? styles.toggleChecked : styles.toggleBg
                )}
              />
            </label>
          </div>

          {/* Login Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={cn("text-md font-medium", styles.textMuted)} data-translate="profile.security.notificationsTitle">
                Login Notifications
              </h3>
              <p className={cn("text-sm mt-1", styles.textMutedLighter)} data-translate="profile.security.notificationsDesc">
                Receive email notifications when someone logs into your account.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="loginNotifications"
                checked={settings.loginNotifications}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "w-11 h-6 rounded-full peer transition-colors",
                  "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20",
                  "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all",
                  "peer-checked:after:translate-x-full peer-checked:after:border-white",
                  settings.loginNotifications ? styles.toggleChecked : styles.toggleBg
                )}
              />
            </label>
          </div>

          {/* Session Timeout */}
          <div>
            <h3 className={cn("text-md font-medium", styles.textMuted)} data-translate="profile.security.timeoutTitle">
              Session Timeout
            </h3>
            <p className={cn("text-sm mb-3", styles.textMutedLighter)} data-translate="profile.security.timeoutDesc">
              Automatically log out after a period of inactivity.
            </p>
            <select
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleSelectChange}
              className={cn(
                "w-full md:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors",
                styles.select
              )}
            >
              <option value="15" data-translate="profile.security.timeout15">15 minutes</option>
              <option value="30" data-translate="profile.security.timeout30">30 minutes</option>
              <option value="60" data-translate="profile.security.timeout60">1 hour</option>
              <option value="120" data-translate="profile.security.timeout120">2 hours</option>
              <option value="never" data-translate="profile.security.timeoutNever">Never</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            type="submit"
            className={cn("inline-flex items-center px-4 py-2 rounded-md transition-colors", styles.button)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-translate="profile.security.save"
          >
            <Save size={16} className="mr-1.5" />
            Save Settings
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}