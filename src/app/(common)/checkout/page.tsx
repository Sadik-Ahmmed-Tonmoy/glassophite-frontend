import CheckoutPageClient from "@/components/pages/checkout/CheckoutPageClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Secure Checkout",
  robots: "noindex, nofollow",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-gray-500">Loading checkout...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
