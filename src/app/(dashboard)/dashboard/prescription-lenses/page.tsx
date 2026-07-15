import PrescriptionLensesView from "@/components/pages/dashboard/PrescriptionLensesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prescription Lenses | Glassophite - Admin Portal",
  description: "Create, edit, price, and delete prescription lens packages.",
  robots: "noindex, nofollow",
};

export default function DashboardPrescriptionLensesPage() {
  return <PrescriptionLensesView />;
}
