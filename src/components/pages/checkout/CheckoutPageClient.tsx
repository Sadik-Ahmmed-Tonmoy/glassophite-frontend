/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

import CheckoutStepper from "@/components/pages/checkout/CheckoutStepper"
import CheckoutSummary from "@/components/pages/checkout/CheckoutSummary"
import OrderConfirmation from "@/components/pages/checkout/OrderConfirmation"
import OrderReview from "@/components/pages/checkout/OrderReview"
import PaymentMethod from "@/components/pages/checkout/PaymentMethod"
import ShippingForm from "@/components/pages/checkout/ShippingForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CheckoutPageClient() {
  const { items, totalPrice, clearCart } = useCart()

  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Form data states
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  })

  // Shipping options
  const [shippingMethod, setShippingMethod] = useState("standard")
  const shippingCost = shippingMethod === "express" ? 15 : shippingMethod === "standard" ? 5 : 0

  // Coupon and discount
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  // Calculate totals
  const subtotal = totalPrice
  const tax = subtotal * 0.08 // 8% tax
  const grandTotal = subtotal + tax + shippingCost - discount

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle form submissions
  const handleShippingSubmit = (data: any) => {
    console.log(data);
    setShippingDetails(data)
    nextStep()
  }

  const handlePaymentSubmit = (method: string, details: typeof paymentDetails) => {
    setPaymentMethod(method)
    setPaymentDetails(details)
    nextStep()
  }

  // Handle order placement
  const placeOrder = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call to process order
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random order ID
      const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`
      setOrderId(newOrderId)

      // Clear cart after successful order
      clearCart()

      // Show success message
      toast({
        title: "Order placed successfully!",
        description: `Your order #${newOrderId} has been placed.`,
        type: "success",
      })

      // Set order as complete and move to confirmation
      setOrderComplete(true)
      setCurrentStep(4)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "There was an error processing your order. Please try again.",
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle coupon application
  const applyCoupon = (code: string) => {
    // Simple coupon validation
    if (code.toUpperCase() === "SAVE10") {
      const discountAmount = subtotal * 0.1 // 10% discount
      setDiscount(discountAmount)
      setCouponCode(code)
      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order.",
        type: "success",
      })
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        type: "destructive",
      })
    }
  }

  // If order is complete, show confirmation
  if (orderComplete) {
    return (
      <OrderConfirmation
        orderId={orderId}
        orderDate={new Date().toISOString()}
        shippingDetails={shippingDetails}
        items={items}
        subtotal={subtotal}
        shipping={shippingCost}
        tax={tax}
        discount={discount}
        total={grandTotal}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/products" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Empty cart message */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to proceed with checkout.</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            {/* Checkout steps */}
            <CheckoutStepper currentStep={currentStep} />

            {/* Step content */}
            <div className="mt-8">
              {currentStep === 1 && (
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  shippingMethod={shippingMethod}
                  onShippingMethodChange={setShippingMethod}
                />
              )}

              {currentStep === 2 && (
                <PaymentMethod
                  onSubmit={handlePaymentSubmit}
                  initialMethod={paymentMethod}
                  initialDetails={paymentDetails}
                  onBack={prevStep}
                />
              )}

              {currentStep === 3 && (
                <OrderReview
                  items={items}
                  shippingDetails={shippingDetails}
                  paymentMethod={paymentMethod}
                  paymentDetails={paymentDetails}
                  shippingMethod={shippingMethod}
                  subtotal={subtotal}
                  shipping={shippingCost}
                  tax={tax}
                  discount={discount}
                  total={grandTotal}
                  onBack={prevStep}
                  onPlaceOrder={placeOrder}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shippingCost}
              tax={tax}
              discount={discount}
              total={grandTotal}
              couponCode={couponCode}
              onApplyCoupon={applyCoupon}
            />
          </div>
        </div>
      )}
    </div>
  )
}
