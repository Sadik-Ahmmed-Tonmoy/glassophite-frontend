"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Smartphone, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { staggerContainer, staggerItems } from "@/lib/profileAnimations";

interface ToggleItem {
  key: string;
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007C74]/30",
        checked ? "bg-gradient-to-r from-[#007C74] to-[#3C55A5]" : "bg-gray-200 dark:bg-white/[0.12]"
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
}

function ToggleItem({ title, desc, checked, onChange }: ToggleItem) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <div className="min-w-0 flex-1 pr-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs mt-0.5 text-gray-500 dark:text-neutral-500">{desc}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

export default function NotificationPreferences() {
  const { isDark, theme: styles } = useProfileTheme();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences updated");
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={staggerItems}
          className={cn("rounded-2xl border shadow-sm p-6 transition-all duration-500", styles.card, styles.cardGlow)}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className={cn("p-2 rounded-lg", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
              <Mail size={18} className="text-[#007C74]" />
            </div>
            <h2 className={cn("text-lg font-semibold", styles.text)}>Email Notifications</h2>
          </div>
          <p className={cn("text-xs mb-4", styles.textMutedLighter)}>Manage what emails you receive from us.</p>
          <div className="divide-y dark:divide-white/[0.04] divide-gray-100">
            {[
              { key: "orderUpdates", title: "Order Updates", desc: "Receive updates about your orders", checked: emailPreferences.orderUpdates, onChange: () => setEmailPreferences(p => ({ ...p, orderUpdates: !p.orderUpdates })) },
              { key: "promotions", title: "Promotions & Discounts", desc: "Receive special offers and discounts", checked: emailPreferences.promotions, onChange: () => setEmailPreferences(p => ({ ...p, promotions: !p.promotions })) },
              { key: "newsletter", title: "Newsletter", desc: "Receive our weekly newsletter", checked: emailPreferences.newsletter, onChange: () => setEmailPreferences(p => ({ ...p, newsletter: !p.newsletter })) },
              { key: "accountAlerts", title: "Account Alerts", desc: "Receive security and account-related alerts", checked: emailPreferences.accountAlerts, onChange: () => setEmailPreferences(p => ({ ...p, accountAlerts: !p.accountAlerts })) },
            ].map(item => <ToggleItem key={item.key} {...item} />)}
          </div>
        </motion.div>

        <motion.div variants={staggerItems}
          className={cn("rounded-2xl border shadow-sm p-6 transition-all duration-500", styles.card, styles.cardGlow)}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className={cn("p-2 rounded-lg", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
              <Bell size={18} className="text-[#007C74]" />
            </div>
            <h2 className={cn("text-lg font-semibold", styles.text)}>Push Notifications</h2>
          </div>
          <p className={cn("text-xs mb-4", styles.textMutedLighter)}>Receive notifications directly in your browser.</p>
          <div className="divide-y dark:divide-white/[0.04] divide-gray-100">
            {[
              { key: "orderUpdates", title: "Order Updates", desc: "Receive updates about your orders", checked: pushPreferences.orderUpdates, onChange: () => setPushPreferences(p => ({ ...p, orderUpdates: !p.orderUpdates })) },
              { key: "promotions", title: "Promotions & Discounts", desc: "Receive special offers and discounts", checked: pushPreferences.promotions, onChange: () => setPushPreferences(p => ({ ...p, promotions: !p.promotions })) },
              { key: "accountAlerts", title: "Account Alerts", desc: "Receive security and account-related alerts", checked: pushPreferences.accountAlerts, onChange: () => setPushPreferences(p => ({ ...p, accountAlerts: !p.accountAlerts })) },
            ].map(item => <ToggleItem key={item.key} {...item} />)}
          </div>

          <div className={cn("mt-5 flex items-center gap-3 p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
            <Smartphone size={18} className="text-neutral-400 shrink-0" />
            <p className={cn("text-xs leading-relaxed", styles.textMutedLighter)}>
              Push notifications will be sent to all devices where you&apos;re logged in. You can manage device-specific settings in your device settings.
            </p>
          </div>
        </motion.div>

        <motion.div variants={staggerItems} className="flex justify-end">
          <button
            type="submit"
            className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all", styles.buttonPrimary)}
          >
            <Save size={16} />
            Save Preferences
          </button>
        </motion.div>
      </motion.div>
    </form>
  );
}