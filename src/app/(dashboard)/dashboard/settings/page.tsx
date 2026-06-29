import SettingsView from "@/components/pages/dashboard/SettingsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fulfillment Settings | Glassophite - Admin Portal",
  description: "Configure system maintenance status, free shipping threshold margins, try-on options, and local VAT rates.",
  robots: "noindex, nofollow",
};

export default function DashboardSettingsPage() {
  return <SettingsView />;
}
