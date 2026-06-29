import CustomersView from "@/components/pages/dashboard/CustomersView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Directory | Glassophite - Admin Portal",
  description: "Browse registered customer profiles and client metrics logs.",
  robots: "noindex, nofollow",
};

export default function DashboardCustomersPage() {
  return <CustomersView />;
}
