/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, ArrowLeft, Wallet, Landmark } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Create a schema for credit card validation
const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^[0-9\s-]+$/, "Card number must contain only digits, spaces, or hyphens"),
  cardName: z.string().min(2, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
  saveCard: z.boolean().optional(),
})

type CreditCardFormValues = z.infer<typeof creditCardSchema>

interface PaymentMethodProps {
  onSubmit: (method: string, details: any) => void
  initialMethod: string
  initialDetails: any
  onBack: () => void
}

export default function PaymentMethod({
  onSubmit,
  initialMethod = "credit-card",
  initialDetails = {},
  onBack,
}: PaymentMethodProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [paymentMethod, setPaymentMethod] = useState(initialMethod)

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      borderHover: "hover:border-white/20",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      radioBorder: "border-white/20",
      radioSelected: "border-[#007C74] bg-[#007C74]/10",
      checkbox: "border-white/30 bg-white/5",
      primary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      error: "text-red-400",
      infoBox: "bg-blue-500/10 border-blue-500/20",
      infoText: "text-blue-300",
      infoTitle: "text-blue-200",
      grayBox: "bg-white/5 border-white/10",
    },
    light: {
      bg: "bg-white",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      borderHover: "hover:border-neutral-300",
      input: "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400",
      label: "text-neutral-700",
      radioBorder: "border-neutral-300",
      radioSelected: "border-[#007C74] bg-[#007C74]/5",
      checkbox: "border-gray-300 bg-white",
      primary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5]",
      error: "text-red-600",
      infoBox: "bg-blue-50 border-blue-100",
      infoText: "text-blue-600",
      infoTitle: "text-blue-800",
      grayBox: "bg-gray-50 border-gray-200",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: initialDetails.cardNumber || "",
      cardName: initialDetails.cardName || "",
      expiryDate: initialDetails.expiryDate || "",
      cvv: initialDetails.cvv || "",
      saveCard: initialDetails.saveCard || false,
    },
  })

  const onFormSubmit = (data: CreditCardFormValues) => {
    onSubmit(paymentMethod, paymentMethod === "credit-card" ? data : {})
  }

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
  }

  // Format expiry date with slash
  const formatExpiryDate = (value: string) => {
    value = value.replace(/\D/g, "")
    if (value.length > 2) {
      return `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }
    return value
  }

  // Animation variants
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
      <h2 className={`text-xl font-semibold ${styles.text} mb-6`} data-translate="payment.title">
        Payment Method
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Payment Method Selection */}
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-8">
          {[
            {
              value: "credit-card",
              label: "Credit / Debit Card",
              description: "Pay securely with your card",
              icons: [
                { src: "/placeholder.svg?height=24&width=40", alt: "Visa" },
                { src: "/placeholder.svg?height=24&width=40", alt: "Mastercard" },
                { src: "/placeholder.svg?height=24&width=40", alt: "Amex" },
              ],
              iconComponent: null,
            },
            {
              value: "paypal",
              label: "PayPal",
              description: "Fast, secure payment with PayPal",
              icons: [{ src: "/placeholder.svg?height=24&width=64", alt: "PayPal" }],
              iconComponent: null,
            },
            {
              value: "bank-transfer",
              label: "Bank Transfer",
              description: "Pay directly from your bank account",
              icons: [],
              iconComponent: <Landmark size={24} className={styles.textMuted} />,
            },
          ].map((option) => (
            <motion.div
              key={option.value}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "relative flex items-start p-4 border rounded-lg transition-all cursor-pointer",
                paymentMethod === option.value ? styles.radioSelected : styles.border
              )}
              onClick={() => setPaymentMethod(option.value)}
            >
              <div className="flex items-center h-5">
                <RadioGroupItem value={option.value} id={option.value} className="cursor-pointer" />
              </div>
              <div className="ml-3 flex justify-between w-full">
                <Label htmlFor={option.value} className="flex flex-col cursor-pointer">
                  <span className={`font-medium ${styles.text}`} data-translate={`payment.method.${option.value}`}>
                    {option.label}
                  </span>
                  <span className={`text-sm ${styles.textMuted} mt-1`} data-translate={`payment.method.${option.value}Desc`}>
                    {option.description}
                  </span>
                </Label>
                <div className="flex space-x-2 items-center">
                  {option.icons.map((icon, idx) => (
                    <div key={idx} className="w-10 h-6 relative">
                      <Image src={icon.src} alt={icon.alt} fill className="object-contain" />
                    </div>
                  ))}
                  {option.iconComponent}
                </div>
              </div>
            </motion.div>
          ))}
        </RadioGroup>

        {/* Credit Card Form */}
        {paymentMethod === "credit-card" && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className={`block text-sm font-medium ${styles.label} mb-1`} data-translate="payment.cardNumber">
                Card Number*
              </label>
              <div className="relative">
                <input
                  id="cardNumber"
                  {...register("cardNumber", {
                    onChange: (e) => {
                      e.target.value = formatCardNumber(e.target.value)
                    },
                  })}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 transition-colors ${styles.input} ${styles.border}`}
                />
                <CreditCard className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.textMutedLighter}`} size={16} />
              </div>
              {errors.cardNumber && <p className={`mt-1 text-sm ${styles.error}`}>{errors.cardNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="cardName" className={`block text-sm font-medium ${styles.label} mb-1`} data-translate="payment.cardName">
                Cardholder Name*
              </label>
              <input
                id="cardName"
                {...register("cardName")}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 transition-colors ${styles.input} ${styles.border}`}
              />
              {errors.cardName && <p className={`mt-1 text-sm ${styles.error}`}>{errors.cardName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className={`block text-sm font-medium ${styles.label} mb-1`} data-translate="payment.expiryDate">
                  Expiry Date (MM/YY)*
                </label>
                <input
                  id="expiryDate"
                  {...register("expiryDate", {
                    onChange: (e) => {
                      e.target.value = formatExpiryDate(e.target.value)
                    },
                  })}
                  placeholder="MM/YY"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 transition-colors ${styles.input} ${styles.border}`}
                />
                {errors.expiryDate && <p className={`mt-1 text-sm ${styles.error}`}>{errors.expiryDate.message}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className={`block text-sm font-medium ${styles.label} mb-1`} data-translate="payment.cvv">
                  CVV*
                </label>
                <input
                  id="cvv"
                  type="password"
                  {...register("cvv")}
                  placeholder="123"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 transition-colors ${styles.input} ${styles.border}`}
                />
                {errors.cvv && <p className={`mt-1 text-sm ${styles.error}`}>{errors.cvv.message}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="saveCard"
                type="checkbox"
                {...register("saveCard")}
                className={`h-4 w-4 rounded ${styles.checkbox} focus:ring-[#007C74] transition-colors`}
              />
              <label htmlFor="saveCard" className={`ml-2 block text-sm ${styles.label}`} data-translate="payment.saveCard">
                Save this card for future purchases
              </label>
            </div>
          </motion.div>
        )}

        {/* PayPal Instructions */}
        {paymentMethod === "paypal" && (
          <motion.div variants={itemVariants} className={`p-4 rounded-lg border ${styles.infoBox}`}>
            <div className="flex items-start">
              <Wallet className={`${styles.infoText} mr-3 flex-shrink-0 mt-0.5`} size={20} />
              <div>
                <p className={`text-sm font-medium ${styles.infoTitle}`} data-translate="payment.paypalTitle">
                  PayPal Checkout
                </p>
                <p className={`text-sm ${styles.infoText} mt-1`} data-translate="payment.paypalDesc">
                  After clicking &quot;Continue&quot;, you will be redirected to PayPal to complete your purchase securely.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bank Transfer Instructions */}
        {paymentMethod === "bank-transfer" && (
          <motion.div variants={itemVariants} className={`p-4 rounded-lg border ${styles.grayBox}`}>
            <div className="flex items-start">
              <Landmark className={`${styles.textMuted} mr-3 flex-shrink-0 mt-0.5`} size={20} />
              <div>
                <p className={`text-sm font-medium ${styles.text}`} data-translate="payment.bankTitle">
                  Bank Transfer Details
                </p>
                <p className={`text-sm ${styles.textMuted} mt-1`} data-translate="payment.bankDesc1">
                  After placing your order, you will receive an email with our bank details to complete the transfer.
                </p>
                <p className={`text-sm ${styles.textMuted} mt-2`} data-translate="payment.bankDesc2">
                  Your order will be processed once we receive the payment.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className={cn(
              "flex items-center border",
              isDark ? "border-white/20 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            <ArrowLeft size={16} className="mr-2" />
            <span data-translate="payment.back">Back to Shipping</span>
          </Button>

          <Button
            type="submit"
            className={`${styles.primary} text-white hover:shadow-lg transition-all`}
            disabled={isSubmitting}
          >
            <span data-translate="payment.continue">Continue to Review</span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}