import FAQsView from "@/components/pages/dashboard/FAQsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs Moderation | Glassophite - Admin Portal",
  description: "Manage frequently asked questions, add new FAQs, edit answers, configure categories, and control storefront visibility.",
  robots: "noindex, nofollow",
};

export default function DashboardFAQsPage() {
  return <FAQsView />;
}
