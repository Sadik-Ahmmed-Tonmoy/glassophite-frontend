/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useValidateCouponMutation } from "@/redux/features/coupon/couponApi"
import { useCreateOrderMutation, useCreateSslSessionMutation } from "@/redux/features/order/orderApi"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setCoupon } from "@/redux/features/checkout/checkoutSlice"

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
  const { items, totalPrice, clearCart, updateItemQuantity } = useCart()
  const { toast } = useToast()
  const [validateCoupon] = useValidateCouponMutation()
  const [createOrder] = useCreateOrderMutation()
  const [createSslSession] = useCreateSslSessionMutation()
  const dispatch = useAppDispatch()
  const reduxCoupon = useAppSelector((state) => state.checkout.coupon)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  const getCartContext = () => {
    if (typeof window === "undefined") return null
    try {
      const raw = sessionStorage.getItem("cart_checkout_context")
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }
  const cartCtx = getCartContext()

  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    saveAddress: false,
  })

  const [paymentMethod, setPaymentMethod] = useState("SSLCO")
  const [paymentDetails, setPaymentDetails] = useState<any>({})

  const [shippingMethod, setShippingMethod] = useState("standard")
  const shippingCost = shippingMethod === "express" ? 120 : 60

  const subtotal = totalPrice
  const initialCode = reduxCoupon?.code ?? cartCtx?.couponCode ?? ""
  const [couponCode, setCouponCode] = useState(initialCode)
  const initialDiscount = reduxCoupon
    ? subtotal * (reduxCoupon.discount / 100)
    : (cartCtx?.couponDiscountRate
      ? subtotal * (cartCtx.couponDiscountRate / 100)
      : (cartCtx?.couponDiscount ?? 0))
  const [discount, setDiscount] = useState(initialDiscount)

  const [rewardPointsUsed] = useState<number>(cartCtx?.rewardPointsUsed ?? 0)
  const [rewardDiscount] = useState<number>(cartCtx?.rewardDiscount ?? 0)

  const tax = 0
  const grandTotal = subtotal + shippingCost - discount - rewardDiscount
  const displayTotal = subtotal + shippingCost - discount - rewardDiscount

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

  const handleShippingSubmit = (data: any) => {
    setShippingDetails((prev) => ({
      ...prev,
      ...data,
      country: data.country || prev.country || "Bangladesh",
    }))
    nextStep()
  }

  const handlePaymentSubmit = (method: string, details: typeof paymentDetails) => {
    setPaymentMethod(method)
    setPaymentDetails(details)
    nextStep()
  }

  const orderPayload = {
    paymentMethod,
    couponCode: couponCode || undefined,
    shippingAddress: {
      name: `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim(),
      street: shippingDetails.address,
      city: shippingDetails.city,
      state: shippingDetails.state,
      zipCode: shippingDetails.zipCode,
      country: shippingDetails.country || "Bangladesh",
      phone: shippingDetails.phone,
      // Pass original fields for backend compatibility
      firstName: shippingDetails.firstName,
      lastName: shippingDetails.lastName,
      address: shippingDetails.address,
    },
    shippingMethod,
    saveAddress: shippingDetails.saveAddress,
    rewardPointsUsed: rewardPointsUsed || undefined,
  }

  const placeOrder = async () => {
    let adjusted = false
    for (const item of items) {
      if (item.quantity > item.maxQuantity) {
        await updateItemQuantity(item.id, item.maxQuantity)
        adjusted = true
      }
    }

    if (adjusted) {
      toast({
        title: "Stock levels adjusted",
        description: "Some items in your cart exceeded the available stock and have been adjusted to the maximum available quantity. Please review your total.",
        type: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (paymentMethod === "CASH_ON_DELIVERY") {
        const result = await createOrder(orderPayload).unwrap()
        const newOrder = result?.data?.order || result?.data
        setOrderData(newOrder)
        setOrderComplete(true)
        clearCart()
        sessionStorage.removeItem("cart_checkout_context")
        return
      }

      // SSL Commerz
      const response = await createSslSession(orderPayload).unwrap()
      const paymentUrl = response?.data?.url || response?.url
      if (paymentUrl) {
        window.location.href = paymentUrl
        return
      }

      throw new Error("No payment URL returned from server")
    } catch (error: any) {
      console.error("Error placing order:", error)
      const errorMsg = error?.data?.errorMessages?.[0]?.message
        ? `${error.data.message}: ${error.data.errorMessages[0].path} - ${error.data.errorMessages[0].message}`
        : error?.data?.message || error?.message || "There was an error processing your order. Please try again."
      toast({
        title: "Error placing order",
        description: errorMsg,
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyCoupon = async (code: string) => {
    try {
      const result = await validateCoupon({ code: code.toUpperCase().trim() }).unwrap()
      const couponData = result?.data
      if (couponData) {
        const discountAmount = subtotal * (couponData.discount / 100)
        setDiscount(discountAmount)
        setCouponCode(couponData.code)
        dispatch(setCoupon({ code: couponData.code, discount: couponData.discount }))
        toast({ title: "Coupon applied", description: `${couponData.discount}% discount has been applied.`, type: "success" })
      }
    } catch (err: any) {
      toast({ title: "Invalid coupon", description: err?.data?.message || "The coupon code you entered is invalid or expired.", type: "destructive" })
    }
  }

  const removeCoupon = () => {
    setCouponCode("")
    setDiscount(0)
    dispatch(setCoupon(null))
    toast({ title: "Coupon removed", description: "Coupon has been removed from your order.", type: "success" })
  }

  if (orderComplete) {
    return (
      <OrderConfirmation
        orderData={orderData}
        items={items}
      />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/product-filter" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to proceed with checkout.</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/product-filter">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutStepper currentStep={currentStep} />

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
                  discount={discount}
                  total={displayTotal}
                  onBack={prevStep}
                  onPlaceOrder={placeOrder}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shippingCost}
              discount={discount}
              total={displayTotal}
  couponCode={couponCode}
  onApplyCoupon={applyCoupon}
  onRemoveCoupon={removeCoupon}
            />
          </div>
        </div>
      )}
    </div>
  )
}
