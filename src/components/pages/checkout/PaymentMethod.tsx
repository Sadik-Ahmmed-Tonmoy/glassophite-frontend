/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet, Banknote } from "lucide-react"

interface PaymentMethodProps {
  onSubmit: (method: string, details: any) => void
  initialMethod: string
  initialDetails: any
  onBack: () => void
}

const paymentOptions = [
  {
    value: "SSLCO",
    label: "SSL Commerz",
    description: "Pay online with Visa, Mastercard, bKash, Nagad, Rocket, Upay & more",
    badges: ["Visa", "Mastercard", "bKash", "Nagad"],
    icon: Wallet,
  },
  {
    value: "CASH_ON_DELIVERY",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives at your doorstep",
    badges: [],
    icon: Banknote,
  },
]

export default function PaymentMethod({
  onSubmit,
  onBack,
}: PaymentMethodProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selected, setSelected] = useState("SSLCO")

  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      border: "border-white/10",
      radioSelected: "border-[#007C74] bg-[#007C74]/10",
      primary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      infoBox: "bg-blue-500/10 border-blue-500/20",
      infoText: "text-blue-300",
      infoTitle: "text-blue-200",
    },
    light: {
      card: "bg-white border-neutral-200",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      border: "border-neutral-200",
      radioSelected: "border-[#007C74] bg-[#007C74]/5",
      primary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      infoBox: "bg-blue-50 border-blue-100",
      infoText: "text-blue-600",
      infoTitle: "text-blue-800",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    requestAnimationFrame(() => {
      onSubmit(selected, {})
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl border ${styles.card} backdrop-blur-sm p-6 transition-colors duration-500`}
    >
      <h2 className={`text-xl font-semibold ${styles.text} mb-6`}>
        Payment Method
      </h2>

      <form onSubmit={handleFormSubmit}>
        <div className="space-y-4 mb-8">
          {paymentOptions.map((option) => {
            const isSelected = selected === option.value
            const Icon = option.icon
            return (
              <motion.div
                key={option.value}
                variants={itemVariants}
                onClick={() => setSelected(option.value)}
                className={`relative flex items-start p-5 border rounded-xl transition-all cursor-pointer ${
                  isSelected ? styles.radioSelected : styles.card
                }`}
              >
                <div className="flex items-center h-5 mt-1">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#007C74]" : "border-gray-400"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-[#007C74]" />
                    )}
                  </div>
                </div>
                <div className="ml-4 flex justify-between w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className={isSelected ? "text-[#007C74]" : styles.textMuted} />
                      <span className={`font-semibold ${styles.text}`}>
                        {option.label}
                      </span>
                    </div>
                    <span className={`text-sm ${styles.textMuted} mt-1`}>
                      {option.description}
                    </span>
                  </div>
                  {option.badges.length > 0 && (
                    <div className="flex space-x-2 items-center ml-4 flex-wrap gap-1">
                      {option.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-opacity-10"
                          style={{
                            backgroundColor:
                              badge === "bKash"
                                ? "rgba(226, 18, 93, 0.1)"
                                : badge === "Nagad"
                                  ? "rgba(248, 86, 6, 0.1)"
                                  : "rgba(59, 130, 246, 0.1)",
                            color:
                              badge === "bKash"
                                ? "#E2125D"
                                : badge === "Nagad"
                                  ? "#F85606"
                                  : "#3B82F6",
                            borderColor:
                              badge === "bKash"
                                ? "rgba(226, 18, 93, 0.2)"
                                : badge === "Nagad"
                                  ? "rgba(248, 86, 6, 0.2)"
                                  : "rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {selected === "SSLCO" && (
          <motion.div variants={itemVariants} className={`p-5 rounded-xl border ${styles.infoBox} mb-8`}>
            <div className="flex items-start">
              <Wallet className={`${styles.infoText} mr-3 flex-shrink-0 mt-0.5`} size={22} />
              <div>
                <p className={`text-sm font-semibold ${styles.infoTitle}`}>
                  Secure Gateway Redirection
                </p>
                <p className={`text-sm ${styles.infoText} mt-2 leading-relaxed`}>
                  After placing your order, you will be redirected to the secure SSL Commerz payment
                  gateway. Once your transaction is completed, you will return automatically to see your
                  order confirmation.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {selected === "CASH_ON_DELIVERY" && (
          <motion.div variants={itemVariants} className={`p-5 rounded-xl border ${styles.infoBox} mb-8`}>
            <div className="flex items-start">
              <Banknote className={`${styles.infoText} mr-3 flex-shrink-0 mt-0.5`} size={22} />
              <div>
                <p className={`text-sm font-semibold ${styles.infoTitle}`}>
                  Pay When You Receive
                </p>
                <p className={`text-sm ${styles.infoText} mt-2 leading-relaxed`}>
                  No online payment needed. Simply pay in cash when your order is delivered to your
                  doorstep. Please ensure you have the exact amount ready.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className={`flex items-center border ${
              isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Shipping</span>
          </Button>

          <Button
            type="submit"
            className={`${styles.primary} text-white hover:shadow-lg transition-all px-8`}
            disabled={isSubmitting}
          >
            <span>Continue to Review</span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
