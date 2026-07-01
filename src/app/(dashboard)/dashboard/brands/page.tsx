import BrandsView from "@/components/pages/dashboard/BrandsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands | Glassophite - Admin Portal",
  description: "Create, edit, feature, and delete brand profiles.",
  robots: "noindex, nofollow",
};

export default function DashboardBrandsPage() {
  return <BrandsView />;
}
