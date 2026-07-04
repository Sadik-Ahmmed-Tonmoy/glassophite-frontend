"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileTheme } from "@/hooks/useProfileTheme";

interface OrderStatusBadgeProps {
  status: "processing" | "shipped" | "delivered" | "cancelled";
  deliveryDate?: string;
  estimatedDelivery?: string;
}

const statusConfig = {
  delivered: { icon: CheckCircle, label: "Delivered", color: "green" },
  shipped: { icon: Truck, label: "Shipped", color: "blue" },
  processing: { icon: Clock, label: "Processing", color: "yellow" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "red" },
};

export default function OrderStatusBadge({ status, deliveryDate, estimatedDelivery }: OrderStatusBadgeProps) {
  const { isDark, theme: styles } = useProfileTheme();
  const config = statusConfig[status] || statusConfig.processing;
  const Icon = config.icon;

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString() : "";

  const colorMap: Record<string, string> = {
    green: cn("bg-green-100 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/20"),
    blue: cn("bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20"),
    yellow: cn("bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/20"),
    red: cn("bg-red-100 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20"),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("rounded-2xl border shadow-sm p-4 sm:p-6 transition-all duration-500", styles.card, styles.cardGlow)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl", isDark ? "bg-white/[0.04]" : "bg-gray-100")}>
            <Icon size={22} className={cn(
              status === "delivered" && "text-green-500",
              status === "shipped" && "text-blue-500",
              status === "processing" && "text-yellow-500",
              status === "cancelled" && "text-red-500",
            )} />
          </div>
          <div>
            <h3 className={cn("text-lg font-semibold", styles.text)}>Your order is {config.label.toLowerCase()}</h3>
            <p className={cn("text-sm", styles.textMutedLighter)}>
              {status === "delivered" ? `Delivered on ${formatDate(deliveryDate)}` :
               status === "shipped" ? `Expected delivery by ${formatDate(estimatedDelivery)}` :
               status === "processing" ? "Your order is being processed" :
               "Your order has been cancelled"}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border ${colorMap[config.color]}`}>
          {config.label}
        </span>
      </div>
    </motion.div>
  );
}