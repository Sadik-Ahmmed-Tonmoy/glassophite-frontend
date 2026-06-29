import SupportView from "@/components/pages/dashboard/SupportView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Tickets | Glassophite - Admin Portal",
  description: "Monitor and resolve customer support inquiries and ticket issues.",
  robots: "noindex, nofollow",
};

export default function DashboardSupportPage() {
  return <SupportView />;
}
