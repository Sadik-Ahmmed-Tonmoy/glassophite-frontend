/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useValidateCouponMutation } from "@/redux/features/coupon/couponApi"
import { useCreateOrderMutation, useCreateStripeSessionMutation } from "@/redux/features/order/orderApi"

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
  const [validateCoupon] = useValidateCouponMutation()
  const [createOrder] = useCreateOrderMutation()
  const [createStripeSession] = useCreateStripeSessionMutation()
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
      if (paymentMethod === "stripe") {
        // Stripe checkout session
        const session = await createStripeSession({
          items: items.map((item) => ({
            name: item.name,
            price: item.discountPrice || item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          couponCode: couponCode || undefined,
          shippingAddress: shippingDetails,
          shippingMethod,
        }).unwrap()
        // Redirect to Stripe
        if (session?.data?.url) {
          window.location.href = session.data.url
          return
        }
      } else {
        // COD / Bank Transfer order
        const res = await createOrder({
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            sku: `${item.name.replace(/\s+/g, "-").toUpperCase()}-${item.size || "STD"}`,
            price: item.discountPrice || item.price,
            originalPrice: item.price,
            quantity: item.quantity,
            variant: item.colorName || item.color || undefined,
            image: item.image || undefined,
          })),
          couponCode: couponCode || undefined,
          shippingAddress: {
            name: `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim(),
            street: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country,
            phone: shippingDetails.phone,
          },
          shippingMethod,
          paymentMethod:
            paymentMethod === "cod"
              ? "CASH_ON_DELIVERY"
              : paymentMethod === "stripe"
              ? "STRIPE"
              : "CREDIT_CARD",
          subtotal,
          shipping: shippingCost,
          tax,
          discount,
          total: grandTotal,
        }).unwrap()
        const newOrderId = res?.data?.orderNumber || `ORD-${Date.now()}`
        setOrderId(newOrderId)
        clearCart()
        toast({ title: "Order placed successfully!", description: `Your order #${newOrderId} has been placed.`, type: "success" })
        setOrderComplete(true)
        setCurrentStep(4)
      }
    } catch (error: any) {
      console.error("Error placing order:", error)
      toast({ title: "Error placing order", description: error?.data?.message || "There was an error processing your order. Please try again.", type: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle coupon application
  const applyCoupon = async (code: string) => {
    try {
      const result = await validateCoupon({ code: code.toUpperCase().trim() }).unwrap()
      const couponData = result?.data
      if (couponData) {
        const discountAmount = subtotal * (couponData.discount / 100)
        setDiscount(discountAmount)
        setCouponCode(couponData.code)
        toast({ title: "Coupon applied", description: `${couponData.discount}% discount has been applied.`, type: "success" })
      }
    } catch (err: any) {
      toast({ title: "Invalid coupon", description: err?.data?.message || "The coupon code you entered is invalid or expired.", type: "destructive" })
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
