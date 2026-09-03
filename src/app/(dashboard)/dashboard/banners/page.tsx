import { Metadata } from "next";
import BannersView from "@/components/pages/dashboard/BannersView";

export const metadata: Metadata = {
  title: "Promotional Banners | Glassophite Control Center",
  description: "Manage landing page hero banners, promotional cards, and flash drops.",
};

export default function BannersPage() {
  return <BannersView />;
}
