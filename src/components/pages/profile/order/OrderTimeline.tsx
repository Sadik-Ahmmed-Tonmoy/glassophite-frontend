"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileTheme } from "@/hooks/useProfileTheme";

interface OrderTimelineProps {
  status: "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  processingDate?: string;
  shippingDate?: string;
  deliveryDate?: string;
  estimatedDelivery?: string;
}

const steps = ["placed", "processing", "shipped", "delivered"] as const;

const stepIconMap = { placed: Package, processing: Clock, shipped: Truck, delivered: CheckCircle };
const stepLabelMap = { placed: "Order Placed", processing: "Processing", shipped: "Shipped", delivered: "Delivered" };

export default function OrderTimeline({
  status, orderDate, processingDate, shippingDate, deliveryDate, estimatedDelivery,
}: OrderTimelineProps) {
  const { isDark, theme: styles } = useProfileTheme();

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString() : "";

  const isCompleted = (step: string) => {
    if (status === "cancelled") return step === "placed";
    const idx = steps.indexOf(step as typeof steps[number]);
    const statusIdx = steps.indexOf(status as typeof steps[number]);
    return idx <= statusIdx;
  };

  const stepDate = (step: string) => {
    const dates: Record<string, string | undefined> = {
      placed: orderDate, processing: processingDate, shipped: shippingDate, delivered: deliveryDate,
    };
    const d = dates[step];
    if (step === "shipped" && !d && status === "shipped" && estimatedDelivery) return `Est. ${formatDate(estimatedDelivery)}`;
    if (step === "delivered" && !d && status === "shipped" && estimatedDelivery) return `Est. ${formatDate(estimatedDelivery)}`;
    if (d) return formatDate(d);
    if (step === "processing" && status === "cancelled") return "Cancelled";
    return "Pending";
  };

  const progressWidth = () => {
    if (status === "cancelled") return "0%";
    const idx = steps.indexOf(status as typeof steps[number]);
    return `${(idx / (steps.length - 1)) * 100}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("rounded-2xl border shadow-sm p-4 sm:p-6 transition-all duration-500 overflow-hidden", styles.card, styles.cardGlow)}
    >
      <h3 className={cn("text-lg font-semibold mb-6", styles.text)}>Order Timeline</h3>

      {/* Mobile timeline */}
      <div className={cn("md:hidden relative space-y-7 pl-9 before:absolute before:left-[13px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:transition-colors", isDark ? "before:bg-white/[0.06]" : "before:bg-gray-200")}>
        {steps.map((step) => {
          const Icon = stepIconMap[step];
          const completed = isCompleted(step);
          return (
            <div key={step} className="relative">
              <div className={cn(
                "absolute -left-9 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300",
                completed
                  ? "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white shadow-[0_0_10px_rgba(0,124,116,0.3)]"
                  : isDark ? "bg-white/[0.06] text-neutral-500" : "bg-gray-200 text-gray-500"
              )}>
                <Icon size={14} />
              </div>
              <div>
                <h4 className={cn("font-medium text-sm", styles.text)}>{stepLabelMap[step]}</h4>
                <p className={cn("text-xs mt-0.5", styles.textMutedLighter)}>{stepDate(step)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop timeline */}
      <div className="hidden md:block">
        <div className="relative pt-2">
          <div className={cn("absolute top-7 left-0 h-[3px] w-full rounded-full transition-colors", isDark ? "bg-white/[0.06]" : "bg-gray-200")} />
          <motion.div
            className="absolute top-7 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5]"
            initial={{ width: 0 }}
            animate={{ width: progressWidth() }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = stepIconMap[step];
              const completed = isCompleted(step);
              return (
                <div key={step} className="relative flex flex-col items-center text-center w-1/4">
                  <div className={cn(
                    "z-10 h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300",
                    completed
                      ? "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white shadow-[0_0_12px_rgba(0,124,116,0.3)]"
                      : isDark ? "bg-white/[0.06] text-neutral-500" : "bg-gray-200 text-gray-500"
                  )}>
                    <Icon size={18} />
                  </div>
                  <h4 className={cn("font-medium text-sm mt-3", styles.text)}>{stepLabelMap[step]}</h4>
                  <p className={cn("text-xs mt-1", styles.textMutedLighter)}>{stepDate(step)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {status === "shipped" && estimatedDelivery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn("mt-6 p-4 rounded-xl border flex items-start gap-3", isDark ? "bg-blue-500/5 border-blue-500/10" : "bg-blue-50 border-blue-100")}
        >
          <Truck size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className={cn("text-sm font-medium", isDark ? "text-blue-400" : "text-blue-800")}>Your order is on its way!</p>
            <p className={cn("text-xs mt-0.5", isDark ? "text-blue-300/80" : "text-blue-600/80")}>Estimated delivery: {formatDate(estimatedDelivery)}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}