import AnalyticsView from "@/components/pages/dashboard/AnalyticsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Statistics | Glassophite - Admin Portal",
  description: "Review conversions, category sales, and product performance logs.",
  robots: "noindex, nofollow",
};

export default function DashboardAnalyticsPage() {
  return <AnalyticsView />;
}
