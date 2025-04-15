/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, ArrowLeft, Wallet, Landmark } from "lucide-react"
import Image from "next/image"

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
  const [paymentMethod, setPaymentMethod] = useState(initialMethod)

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

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Payment Method Selection */}
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-8">
          <div
            className={`relative flex items-start p-4 border rounded-lg ${paymentMethod === "credit-card" ? "border-primary bg-primary/5" : "border-gray-200"}`}
          >
            <div className="flex items-center h-5">
              <RadioGroupItem value="credit-card" id="credit-card" />
            </div>
            <div className="ml-3 flex justify-between w-full">
              <Label htmlFor="credit-card" className="flex flex-col">
                <span className="font-medium">Credit / Debit Card</span>
                <span className="text-sm text-gray-500 mt-1">Pay securely with your card</span>
              </Label>
              <div className="flex space-x-2">
                <div className="w-10 h-6 relative">
                  <Image src="/placeholder.svg?height=24&width=40" alt="Visa" fill className="object-contain" />
                </div>
                <div className="w-10 h-6 relative">
                  <Image src="/placeholder.svg?height=24&width=40" alt="Mastercard" fill className="object-contain" />
                </div>
                <div className="w-10 h-6 relative">
                  <Image src="/placeholder.svg?height=24&width=40" alt="Amex" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`relative flex items-start p-4 border rounded-lg ${paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-gray-200"}`}
          >
            <div className="flex items-center h-5">
              <RadioGroupItem value="paypal" id="paypal" />
            </div>
            <div className="ml-3 flex justify-between w-full">
              <Label htmlFor="paypal" className="flex flex-col">
                <span className="font-medium">PayPal</span>
                <span className="text-sm text-gray-500 mt-1">Fast, secure payment with PayPal</span>
              </Label>
              <div className="w-16 h-6 relative">
                <Image src="/placeholder.svg?height=24&width=64" alt="PayPal" fill className="object-contain" />
              </div>
            </div>
          </div>

          <div
            className={`relative flex items-start p-4 border rounded-lg ${paymentMethod === "bank-transfer" ? "border-primary bg-primary/5" : "border-gray-200"}`}
          >
            <div className="flex items-center h-5">
              <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            </div>
            <div className="ml-3 flex justify-between w-full">
              <Label htmlFor="bank-transfer" className="flex flex-col">
                <span className="font-medium">Bank Transfer</span>
                <span className="text-sm text-gray-500 mt-1">Pay directly from your bank account</span>
              </Label>
              <Landmark size={24} className="text-gray-500" />
            </div>
          </div>
        </RadioGroup>

        {/* Credit Card Form */}
        {paymentMethod === "credit-card" && (
          <div className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name*
              </label>
              <input
                id="cardName"
                {...register("cardName")}
                placeholder="John Doe"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV*
                </label>
                <input
                  id="cvv"
                  type="password"
                  {...register("cvv")}
                  placeholder="123"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="saveCard"
                type="checkbox"
                {...register("saveCard")}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                Save this card for future purchases
              </label>
            </div>
          </div>
        )}

        {/* PayPal Instructions */}
        {paymentMethod === "paypal" && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Wallet className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-blue-800 font-medium">PayPal Checkout</p>
                <p className="text-sm text-blue-600 mt-1">
                  After clicking &quot;Continue&quot;, you will be redirected to PayPal to complete your purchase securely.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Instructions */}
        {paymentMethod === "bank-transfer" && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Landmark className="text-gray-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-gray-800 font-medium">Bank Transfer Details</p>
                <p className="text-sm text-gray-600 mt-1">
                  After placing your order, you will receive an email with our bank details to complete the transfer.
                </p>
                <p className="text-sm text-gray-600 mt-2">Your order will be processed once we receive the payment.</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
          <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Shipping
          </Button>

          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  )
}
