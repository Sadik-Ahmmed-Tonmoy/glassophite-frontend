"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: "processing" | "shipped" | "delivered" | "cancelled";
  deliveryDate?: string;
  estimatedDelivery?: string;
}

export default function OrderStatusBadge({
  status,
  deliveryDate,
  estimatedDelivery,
}: OrderStatusBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-black border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
    },
    light: {
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Get status icon with theme‑aware color
  const getStatusIcon = () => {
    const iconClass = cn(
      status === "delivered" && "text-green-500 dark:text-green-400",
      status === "shipped" && "text-blue-500 dark:text-blue-400",
      status === "processing" && "text-yellow-500 dark:text-yellow-400",
      status === "cancelled" && "text-red-500 dark:text-red-400"
    );
    switch (status) {
      case "delivered":
        return <CheckCircle size={20} className={iconClass} />;
      case "shipped":
        return <Truck size={20} className={iconClass} />;
      case "processing":
        return <Clock size={20} className={iconClass} />;
      case "cancelled":
        return <XCircle size={20} className={iconClass} />;
    }
  };

  // Get status badge color classes (already include dark variants)
  const getStatusColor = () => {
    switch (status) {
      case "delivered":
        return cn(
          "bg-green-100 text-green-800 border-green-200",
          "dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
        );
      case "shipped":
        return cn(
          "bg-blue-100 text-blue-800 border-blue-200",
          "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
        );
      case "processing":
        return cn(
          "bg-yellow-100 text-yellow-800 border-yellow-200",
          "dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
        );
      case "cancelled":
        return cn(
          "bg-red-100 text-red-800 border-red-200",
          "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
        );
      default:
        return cn(
          "bg-gray-100 text-gray-800 border-gray-200",
          "dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700"
        );
    }
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className={cn("text-lg font-medium", styles.text)} data-translate={`order.status.${status}`}>
              Your order is {status}
            </h3>
            <p className={cn("text-sm", styles.textMutedLighter)} data-translate={`order.status.${status}Message`}>
              {status === "delivered"
                ? `Delivered on ${formatDate(deliveryDate)}`
                : status === "shipped"
                ? `Expected delivery by ${formatDate(estimatedDelivery)}`
                : status === "processing"
                ? "Your order is being processed"
                : "Your order has been cancelled"}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}