"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useVerifySslPaymentQuery } from "@/redux/features/order/orderApi"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()

  const tranId = searchParams.get("tran_id") || ""

  const { data: sessionData, isLoading, isError, error } = useVerifySslPaymentQuery(tranId, {
    skip: !tranId,
  })

  useEffect(() => {
    if (sessionData?.success || sessionData?.verified) {
      clearCart()
      sessionStorage.removeItem("cart_checkout_context")
    }
  }, [sessionData, clearCart])

  if (!tranId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h1>
        <p className="text-gray-600 mb-6">We could not find a valid transaction ID.</p>
        <Button asChild className="bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Loader2 className="w-12 h-12 text-[#007C74] animate-spin mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
        <p className="text-gray-600">Please wait while we confirm your payment with SSL Commerz...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          {(error as any)?.data?.message || "There was an error verifying your payment. Please contact support."}
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white">
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  const order = sessionData?.data?.order || sessionData?.order
  const orderNumber = order?.orderNumber || "N/A"
  const totalAmount = order?.total || 0

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-neutral-50 dark:bg-black transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="max-w-md w-full rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 10 }}
          className="mx-auto w-20 h-20 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Thank you for your purchase. Your payment was verified successfully via SSL Commerz.
        </p>

        <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 rounded-xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Order Number:</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Payment Status:</span>
            <span className="font-bold text-green-500">PAID</span>
          </div>
          <div className="flex justify-between text-sm border-t border-neutral-200/60 dark:border-white/5 pt-3">
            <span className="text-neutral-500 dark:text-neutral-400">Amount Paid:</span>
            <span className="font-bold text-[#007C74] dark:text-[#3C55A5] text-base">৳{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="w-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg transition-all py-6 font-semibold">
            <Link href="/track-order">
              Track Your Order <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full py-6 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
            <Link href="/product-filter">
              <ShoppingBag className="mr-2 w-4 h-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Loader2 className="w-12 h-12 text-[#007C74] animate-spin mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading</h1>
        <p className="text-gray-600">Loading payment success information...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
