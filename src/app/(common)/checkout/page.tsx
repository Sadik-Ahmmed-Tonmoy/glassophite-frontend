import CheckoutPageClient from "@/components/pages/checkout/CheckoutPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  robots: "noindex, nofollow",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
