"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  status: "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  processingDate?: string;
  shippingDate?: string;
  deliveryDate?: string;
  estimatedDelivery?: string;
}

export default function OrderTimeline({
  status,
  orderDate,
  processingDate,
  shippingDate,
  deliveryDate,
  estimatedDelivery,
}: OrderTimelineProps) {
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
      timelineBg: "bg-white/10",
      timelineProgress: "bg-primary",
      iconBg: "bg-white/20",
      iconCompleted: "bg-primary text-white",
      iconPending: "bg-white/10 text-neutral-500",
      infoBox: "bg-blue-500/10 border-blue-500/20",
      infoTitle: "text-blue-400",
      infoText: "text-blue-300",
    },
    light: {
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      timelineBg: "bg-gray-200",
      timelineProgress: "bg-primary",
      iconBg: "bg-gray-300",
      iconCompleted: "bg-primary text-white",
      iconPending: "bg-gray-300 text-gray-500",
      infoBox: "bg-blue-50 border-blue-200",
      infoTitle: "text-blue-800",
      infoText: "text-blue-600",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (width: string) => ({
      width,
      transition: { duration: 0.6, ease: "easeOut" as const },
    }),
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-xl border shadow-sm p-4 sm:p-6 transition-colors duration-500 overflow-hidden",
        styles.card
      )}
    >
      <h3 className={cn("text-lg font-medium mb-6", styles.text)} data-translate="order.timeline">
        Order Timeline
      </h3>

      {/* Mobile Timeline (Vertical) */}
      <div
        className={cn(
          "md:hidden relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:h-full before:w-0.5 before:transition-colors",
          isDark ? "before:bg-white/10" : "before:bg-gray-200"
        )}
      >
        {[
          {
            key: "placed",
            icon: Package,
            label: "Order Placed",
            date: orderDate,
            completed: status !== "cancelled",
            active: true,
          },
          {
            key: "processing",
            icon: Clock,
            label: "Processing",
            date: processingDate,
            completed:
              status !== "cancelled" && (!!processingDate || status !== "processing"),
            active: status !== "cancelled" && (status === "processing" || status === "shipped" || status === "delivered"),
          },
          {
            key: "shipped",
            icon: Truck,
            label: "Shipped",
            date: shippingDate,
            completed: status === "shipped" || status === "delivered",
            active: status === "shipped" || status === "delivered",
          },
          {
            key: "delivered",
            icon: CheckCircle,
            label: "Delivered",
            date: deliveryDate,
            completed: status === "delivered",
            active: status === "delivered",
          },
        ].map((step) => (
          <div key={step.key} className="relative">
            <div
              className={cn(
                "absolute -left-8 h-6 w-6 rounded-full flex items-center justify-center transition-colors",
                step.completed ? styles.iconCompleted : styles.iconPending
              )}
            >
              <step.icon size={14} />
            </div>
            <div>
              <h4 className={cn("font-medium text-sm", styles.text)} data-translate={`order.timeline.${step.key}`}>
                {step.label}
              </h4>
              <p className={cn("text-xs mt-1", styles.textMutedLighter)}>
                {step.key === "shipped" && !step.date && status === "shipped" && estimatedDelivery
                  ? `Est. ${formatDate(estimatedDelivery)}`
                  : step.key === "delivered" && !step.date && status === "shipped" && estimatedDelivery
                  ? `Est. ${formatDate(estimatedDelivery)}`
                  : step.date
                  ? formatDate(step.date)
                  : step.key === "processing" && status === "cancelled"
                  ? "Cancelled"
                  : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Timeline (Horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background Timeline Bar */}
          <div className={cn("absolute top-5 left-0 h-0.5 w-full transition-colors", styles.timelineBg)} />

          {/* Animated Progress Bars */}
          {[
            {
              width: status !== "cancelled" ? "100%" : "0%",
              left: "50%",
              condition: status !== "cancelled",
            },
            {
              width: status === "shipped" || status === "delivered" ? "100%" : "0%",
              left: "50%",
              condition: status === "shipped" || status === "delivered",
            },
            {
              width: status === "delivered" ? "100%" : "0%",
              left: "50%",
              condition: status === "delivered",
            },
          ].map((bar, idx) => (
            bar.condition && (
              <motion.div
                key={idx}
                className={cn("absolute top-5 h-0.5 transition-colors", styles.timelineProgress)}
                style={{ left: bar.left }}
                variants={progressBarVariants}
                custom={bar.width}
                initial="hidden"
                animate="visible"
              />
            )
          ))}

          <div className="flex justify-between">
            {[
              {
                key: "placed",
                icon: Package,
                label: "Order Placed",
                date: orderDate,
                completed: status !== "cancelled",
                active: true,
              },
              {
                key: "processing",
                icon: Clock,
                label: "Processing",
                date: processingDate,
                completed:
                  status !== "cancelled" && (status === "processing" || status === "shipped" || status === "delivered"),
                active: status !== "cancelled" && (status === "processing" || status === "shipped" || status === "delivered"),
              },
              {
                key: "shipped",
                icon: Truck,
                label: "Shipped",
                date: shippingDate,
                completed: status === "shipped" || status === "delivered",
                active: status === "shipped" || status === "delivered",
              },
              {
                key: "delivered",
                icon: CheckCircle,
                label: "Delivered",
                date: deliveryDate,
                completed: status === "delivered",
                active: status === "delivered",
              },
            ].map((step) => (
              <div key={step.key} className="relative flex flex-col items-center text-center w-1/4">
                <div
                  className={cn(
                    "z-10 h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                    step.completed ? styles.iconCompleted : styles.iconPending
                  )}
                >
                  <step.icon size={18} />
                </div>
                <h4 className={cn("font-medium text-sm mt-2", styles.text)} data-translate={`order.timeline.${step.key}`}>
                  {step.label}
                </h4>
                <p className={cn("text-xs mt-1", styles.textMutedLighter)}>
                  {step.key === "shipped" && !step.date && status === "shipped" && estimatedDelivery
                    ? `Est. ${formatDate(estimatedDelivery)}`
                    : step.key === "delivered" && !step.date && status === "shipped" && estimatedDelivery
                    ? `Est. ${formatDate(estimatedDelivery)}`
                    : step.date
                    ? formatDate(step.date)
                    : step.key === "processing" && status === "cancelled"
                    ? "Cancelled"
                    : "Pending"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracking Information */}
      {status === "shipped" && estimatedDelivery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn("mt-6 p-4 rounded-lg border flex items-start", styles.infoBox)}
        >
          <Truck size={20} className={cn("mr-3 flex-shrink-0 mt-0.5", styles.infoTitle)} />
          <div>
            <p className={cn("text-sm font-medium", styles.infoTitle)} data-translate="order.trackingTitle">
              Your order is on its way!
            </p>
            <p className={cn("text-xs mt-1", styles.infoText)} data-translate="order.estimatedDelivery">
              Estimated delivery: {formatDate(estimatedDelivery)}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}