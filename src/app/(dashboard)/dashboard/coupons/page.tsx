import CouponsView from "@/components/pages/dashboard/CouponsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promo Coupons | Glassophite - Admin Portal",
  description: "Configure discount codes, rate values, and active expiries.",
  robots: "noindex, nofollow",
};

export default function DashboardCouponsPage() {
  return <CouponsView />;
}
