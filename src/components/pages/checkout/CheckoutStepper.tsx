"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Truck, CreditCard, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepperProps {
  currentStep: number
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const steps = [
    { id: 1, title: "Shipping", icon: Truck, translateKey: "checkout.step.shipping" },
    { id: 2, title: "Review & Pay", icon: CheckCircle, translateKey: "checkout.step.review" },
  ]

  // Theme styles
  const themeStyles = {
    dark: {
      progressBg: "bg-white/20",
      progressFill: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      stepInactive: "border-white/20 bg-black text-white/40",
      stepActive: "border-[#007C74] bg-[#007C74] text-white",
      stepCompleted: "border-[#007C74] bg-[#007C74] text-white",
      textActive: "text-[#007C74]",
      textInactive: "text-white/40",
      mobileTextActive: "text-[#007C74]",
      mobileTextInactive: "text-white/20",
    },
    light: {
      progressBg: "bg-gray-200",
      progressFill: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      stepInactive: "border-gray-300 bg-white text-gray-400",
      stepActive: "border-[#007C74] bg-[#007C74] text-white",
      stepCompleted: "border-[#007C74] bg-[#007C74] text-white",
      textActive: "text-[#007C74]",
      textInactive: "text-gray-500",
      mobileTextActive: "text-[#007C74]",
      mobileTextInactive: "text-gray-400",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Animation variants for the progress bar
  const progressBarVariants = {
    initial: { width: 0 },
    animate: {
      width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" as const },
    },
  }

  const mobileProgressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${(currentStep / steps.length) * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" as const},
    },
  }

  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Background progress bar */}
          <div className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 ${styles.progressBg}`} />

          {/* Animated progress bar */}
          <motion.div
            className={`absolute left-0 top-1/2 h-0.5 -translate-y-1/2 ${styles.progressFill}`}
            variants={progressBarVariants}
            initial="initial"
            animate="animate"
          />

          {/* Steps */}
          {steps.map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep

            return (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.id * 0.1 }}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted || isActive ? styles.stepActive : styles.stepInactive
                  )}
                >
                  <step.icon size={18} />
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    isCompleted || isActive ? styles.textActive : styles.textInactive
                  )}
                  data-translate={step.translateKey}
                >
                  {step.title}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Mobile stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-2">
          {steps.map((step) => {
            const isActive = step.id === currentStep
            return (
              <motion.div
                key={step.id}
                className={cn(
                  "flex flex-col items-center",
                  isActive ? styles.mobileTextActive : styles.mobileTextInactive
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: step.id * 0.1 }}
              >
                <step.icon size={20} />
                <span className="mt-1 text-xs font-medium" data-translate={step.translateKey}>
                  {step.title}
                </span>
              </motion.div>
            )
          })}
        </div>
        <div className={`mt-2 h-1 w-full ${styles.progressBg} rounded-full overflow-hidden`}>
          <motion.div
            className={`h-full ${styles.progressFill}`}
            variants={mobileProgressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </div>
    </div>
  )
}