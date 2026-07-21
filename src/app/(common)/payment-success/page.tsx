/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useVerifySslPaymentQuery } from "@/redux/features/order/orderApi";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const tranId = useMemo(() => searchParams.get("tran_id") || "", [searchParams]);

  const { data: sessionData, isLoading, isError, error } = useVerifySslPaymentQuery(tranId, {
    skip: !tranId,
  });

  useEffect(() => {
    if (sessionData?.success || sessionData?.verified) {
      clearCart();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("cart_checkout_context");
      }
    }
  }, [sessionData, clearCart]);

  if (!tranId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-neutral-50 dark:bg-black transition-colors duration-500">
        <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 mb-4" />
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">
          Invalid Session
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          We could not find a valid transaction ID.
        </p>
        <Button asChild className="bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white rounded-full px-6 text-xs sm:text-sm font-bold">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-neutral-50 dark:bg-black transition-colors duration-500">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#007C74] animate-spin mb-4" />
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">
          Verifying Payment
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          Please wait while we confirm your payment with SSL Commerz...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-neutral-50 dark:bg-black transition-colors duration-500">
        <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 mb-4" />
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">
          Verification Failed
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mb-6 leading-relaxed">
          {(error as any)?.data?.message ||
            "There was an error verifying your payment. Please contact support."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" className="rounded-full text-xs sm:text-sm font-bold border-neutral-300 dark:border-neutral-700">
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white rounded-full text-xs sm:text-sm font-bold">
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = sessionData?.data?.order || sessionData?.order;
  const orderNumber = order?.orderNumber || "N/A";
  const totalAmount = order?.total || 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-20 bg-neutral-50 dark:bg-black transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="max-w-md w-full rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-xl p-6 sm:p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 10 }}
          className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mb-5 sm:mb-6"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-8 leading-relaxed">
          Thank you for your purchase. Your payment was verified successfully via SSL Commerz.
        </p>

        <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 text-left space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Order Number:</span>
            <span className="font-bold text-neutral-900 dark:text-white">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Payment Status:</span>
            <span className="font-extrabold text-green-500">PAID</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm border-t border-neutral-200/60 dark:border-white/5 pt-3">
            <span className="text-neutral-500 dark:text-neutral-400">Amount Paid:</span>
            <span className="font-extrabold text-[#007C74] dark:text-[#00A693] text-sm sm:text-base">
              ৳{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="w-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg transition-all py-5 sm:py-6 rounded-full text-xs sm:text-sm font-bold cursor-pointer">
            <Link href="/track-order">
              Track Your Order <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full py-5 sm:py-6 rounded-full text-xs sm:text-sm font-bold border-neutral-300 dark:border-white/10 dark:text-white dark:hover:bg-white/10 cursor-pointer">
            <Link href="/product-filter">
              <ShoppingBag className="mr-2 w-4 h-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-neutral-50 dark:bg-black transition-colors duration-500">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#007C74] animate-spin mb-4" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">Loading</h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Loading payment success information...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
