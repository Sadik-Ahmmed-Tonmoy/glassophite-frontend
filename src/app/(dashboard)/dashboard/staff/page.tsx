import StaffView from "@/components/pages/dashboard/StaffView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management | Glassophite - Admin Portal",
  description: "Browse team directory profiles and modify role configuration settings.",
  robots: "noindex, nofollow",
};

export default function DashboardStaffPage() {
  return <StaffView />;
}
