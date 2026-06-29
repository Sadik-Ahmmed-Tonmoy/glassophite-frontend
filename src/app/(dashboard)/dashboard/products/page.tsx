import ProductsView from "@/components/pages/dashboard/ProductsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Catalog | Glassophite - Admin Portal",
  description: "Configure product metadata listings, prices, catalog details, and stocks.",
  robots: "noindex, nofollow",
};

export default function DashboardProductsPage() {
  return <ProductsView />;
}
