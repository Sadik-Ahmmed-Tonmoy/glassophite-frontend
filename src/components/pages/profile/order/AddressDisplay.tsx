"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface AddressDisplayProps {
  title: string;
  address: Address;
  icon?: React.ReactNode;
}

export default function AddressDisplay({
  title,
  address,
  icon = <MapPin size={20} className="text-primary" />,
}: AddressDisplayProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-black border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      icon: "text-primary",
    },
    light: {
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      icon: "text-primary",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-xl border shadow-sm p-4 sm:p-6 transition-colors duration-500",
        styles.card
      )}
    >
      <div className="flex items-center mb-4">
        {icon && <div className={cn("mr-2", styles.icon)}>{icon}</div>}
        <h3 className={cn("text-lg font-medium", styles.text)} data-translate={`address.${title.toLowerCase().replace(/\s+/g, "")}`}>
          {title}
        </h3>
      </div>
      <div className={cn("space-y-1", styles.textMuted)}>
        <p className="font-medium">{address.name}</p>
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2">{address.phone}</p>}
      </div>
    </motion.div>
  );
}