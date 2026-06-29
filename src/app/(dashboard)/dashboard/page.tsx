import OverviewView from "@/components/pages/dashboard/OverviewView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Overview | Glassophite - Control Center",
  description: "Live sales metrics, transactions feed, and revenue progress statistics.",
  robots: "noindex, nofollow",
};

export default function DashboardOverviewPage() {
  return <OverviewView />;
}