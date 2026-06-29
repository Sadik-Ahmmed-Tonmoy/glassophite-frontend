import OrderDetailsPageClient from "@/components/pages/profile/OrderDetailsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
  robots: "noindex, nofollow",
};

export default function OrderDetailsPage() {
  return <OrderDetailsPageClient />;
}
