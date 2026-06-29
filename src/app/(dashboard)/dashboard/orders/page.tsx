import OrdersView from "@/components/pages/dashboard/OrdersView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Order Pipeline | Glassophite - Admin Portal",
  description: "Track shipment deliveries and update order fulfillment milestones.",
  robots: "noindex, nofollow",
};

export default function DashboardOrdersPage() {
  return <OrdersView />;
}
