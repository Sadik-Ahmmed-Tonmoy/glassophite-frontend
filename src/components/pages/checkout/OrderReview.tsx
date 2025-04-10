/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { CartItem } from "@/hooks/use-cart"

interface OrderReviewProps {
  items: CartItem[]
  shippingDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentDetails: any
  shippingMethod: string
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  onBack: () => void
  onPlaceOrder: () => void
  isSubmitting: boolean
}

export default function OrderReview({
  items,
  shippingDetails,
  paymentMethod,
  paymentDetails,
  shippingMethod,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  onBack,
  onPlaceOrder,
  isSubmitting,
}: OrderReviewProps) {
  // Format credit card number for display
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return ""
    const last4 = cardNumber.replace(/\s/g, "").slice(-4)
    return `•••• •••• •••• ${last4}`
  }

  // Get shipping method label
  const getShippingMethodLabel = () => {
    switch (shippingMethod) {
      case "express":
        return "Express Shipping ($15.00)"
      case "standard":
        return "Standard Shipping ($5.00)"
      case "free":
        return "Free Shipping"
      default:
        return "Standard Shipping"
    }
  }

  // Get payment method label
  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case "credit-card":
        return "Credit Card"
      case "paypal":
        return "PayPal"
      case "bank-transfer":
        return "Bank Transfer"
      default:
        return "Credit Card"
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Items in Your Order</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center border-b pb-4">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={item.image || "/placeholder.svg?height=64&width=64"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-xs text-gray-500">
                  {item.colorName && `Color: ${item.colorName}`}
                  {item.size && ` • Size: ${item.size}`}
                  {` • Qty: ${item.quantity}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                </p>
                {item.discountPrice && (
                  <p className="text-xs text-gray-500 line-through">${(item.price * item.quantity).toFixed(2)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Shipping Information</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">
            {shippingDetails.firstName} {shippingDetails.lastName}
          </p>
          <p>{shippingDetails.address}</p>
          <p>
            {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}
          </p>
          <p>{shippingDetails.country}</p>
          <p className="mt-2">{shippingDetails.email}</p>
          <p>{shippingDetails.phone}</p>
          <p className="mt-2 text-sm text-gray-600">Shipping Method: {getShippingMethodLabel()}</p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Payment Information</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">{getPaymentMethodLabel()}</p>
          {paymentMethod === "credit-card" && paymentDetails.cardNumber && (
            <>
              <p>{formatCardNumber(paymentDetails.cardNumber)}</p>
              <p>Expires: {paymentDetails.expiryDate}</p>
            </>
          )}
          {paymentMethod === "paypal" && (
            <p className="text-sm text-gray-600">You will be redirected to PayPal after placing your order.</p>
          )}
          {paymentMethod === "bank-transfer" && (
            <p className="text-sm text-gray-600">Bank details will be sent to your email after placing your order.</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center" disabled={isSubmitting}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Payment
        </Button>

        <Button onClick={onPlaceOrder} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </div>
  )
}
