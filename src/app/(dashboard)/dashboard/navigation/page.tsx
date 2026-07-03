import NavigationView from "@/components/pages/dashboard/NavigationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Navigation Menus | Glassophite - Admin Portal",
  description: "Configure dynamic website navigation bar menus, nested subcategories, links, and visual catalog card imagery.",
  robots: "noindex, nofollow",
};

export default function DashboardNavigationPage() {
  return <NavigationView />;
}
