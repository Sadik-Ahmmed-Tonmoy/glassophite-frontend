import OrderInvoice from "@/components/pages/profile/OrderInvoice";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice",
  robots: "noindex, nofollow",
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderInvoice orderId={id} />;
}
