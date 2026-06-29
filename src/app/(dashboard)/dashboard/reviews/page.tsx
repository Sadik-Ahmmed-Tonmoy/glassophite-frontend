import ReviewsView from "@/components/pages/dashboard/ReviewsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews Moderation | Glassophite - Admin Portal",
  description: "Approve or reject customer review feedback.",
  robots: "noindex, nofollow",
};

export default function DashboardReviewsPage() {
  return <ReviewsView />;
}
