"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Bell, Mail, Smartphone, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationPreferences() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [emailPreferences, setEmailPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    accountAlerts: true,
  });

  const [pushPreferences, setPushPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    accountAlerts: true,
  });

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-black border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      bgMuted: "bg-white/5",
      toggleBg: "bg-white/20",
      toggleChecked: "bg-primary",
      toggleThumb: "bg-white",
      icon: "text-primary",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white",
    },
    light: {
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      bgMuted: "bg-gray-50",
      toggleBg: "bg-gray-200",
      toggleChecked: "bg-primary",
      toggleThumb: "bg-white",
      icon: "text-primary",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const handleEmailToggle = (key: keyof typeof emailPreferences) => {
    setEmailPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePushToggle = (key: keyof typeof pushPreferences) => {
    setPushPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated notification preferences:", {
      email: emailPreferences,
      push: pushPreferences,
    });
    alert("Notification preferences updated successfully!");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Email Notifications */}
        <motion.div
          variants={itemVariants}
          className={cn("rounded-xl border shadow-sm p-6 transition-colors duration-500", styles.card)}
        >
          <div className="flex items-center mb-6">
            <Mail size={20} className={cn("mr-2", styles.icon)} />
            <h2 className={cn("text-lg font-semibold", styles.text)} data-translate="notifications.email.title">
              Email Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "orderUpdates",
                title: "Order Updates",
                desc: "Receive updates about your orders",
                checked: emailPreferences.orderUpdates,
                toggle: () => handleEmailToggle("orderUpdates"),
              },
              {
                key: "promotions",
                title: "Promotions & Discounts",
                desc: "Receive special offers and discounts",
                checked: emailPreferences.promotions,
                toggle: () => handleEmailToggle("promotions"),
              },
              {
                key: "newsletter",
                title: "Newsletter",
                desc: "Receive our weekly newsletter",
                checked: emailPreferences.newsletter,
                toggle: () => handleEmailToggle("newsletter"),
              },
              {
                key: "accountAlerts",
                title: "Account Alerts",
                desc: "Receive security and account-related alerts",
                checked: emailPreferences.accountAlerts,
                toggle: () => handleEmailToggle("accountAlerts"),
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <h3 className={cn("text-md font-medium", styles.textMuted)}>
                    {item.title}
                  </h3>
                  <p className={cn("text-sm", styles.textMutedLighter)}>
                    {item.desc}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.toggle}
                    className="sr-only peer"
                  />
                  <div
                    className={cn(
                      "w-11 h-6 rounded-full peer transition-colors",
                      "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20",
                      "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all",
                      "peer-checked:after:translate-x-full peer-checked:after:border-white",
                      item.checked ? styles.toggleChecked : styles.toggleBg
                    )}
                  />
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Push Notifications */}
        <motion.div
          variants={itemVariants}
          className={cn("rounded-xl border shadow-sm p-6 transition-colors duration-500", styles.card)}
        >
          <div className="flex items-center mb-6">
            <Bell size={20} className={cn("mr-2", styles.icon)} />
            <h2 className={cn("text-lg font-semibold", styles.text)} data-translate="notifications.push.title">
              Push Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "orderUpdates",
                title: "Order Updates",
                desc: "Receive updates about your orders",
                checked: pushPreferences.orderUpdates,
                toggle: () => handlePushToggle("orderUpdates"),
              },
              {
                key: "promotions",
                title: "Promotions & Discounts",
                desc: "Receive special offers and discounts",
                checked: pushPreferences.promotions,
                toggle: () => handlePushToggle("promotions"),
              },
              {
                key: "accountAlerts",
                title: "Account Alerts",
                desc: "Receive security and account-related alerts",
                checked: pushPreferences.accountAlerts,
                toggle: () => handlePushToggle("accountAlerts"),
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <h3 className={cn("text-md font-medium", styles.textMuted)}>
                    {item.title}
                  </h3>
                  <p className={cn("text-sm", styles.textMutedLighter)}>
                    {item.desc}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.toggle}
                    className="sr-only peer"
                  />
                  <div
                    className={cn(
                      "w-11 h-6 rounded-full peer transition-colors",
                      "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20",
                      "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all",
                      "peer-checked:after:translate-x-full peer-checked:after:border-white",
                      item.checked ? styles.toggleChecked : styles.toggleBg
                    )}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className={cn("mt-6 flex items-center p-4 rounded-lg", styles.bgMuted)}>
            <Smartphone size={20} className={cn("mr-3", styles.textMutedLighter)} />
            <p className={cn("text-sm", styles.textMuted)}>
              <span data-translate="notifications.push.deviceInfo">
                Push notifications will be sent to all devices where you&apos;re logged in.
                You can manage device‑specific settings in your device settings.
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end">
          <button
            type="submit"
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-md transition-colors",
              styles.buttonPrimary
            )}
            data-translate="notifications.save"
          >
            <Save size={16} className="mr-1.5" />
            Save Preferences
          </button>
        </motion.div>
      </motion.div>
    </form>
  );
}