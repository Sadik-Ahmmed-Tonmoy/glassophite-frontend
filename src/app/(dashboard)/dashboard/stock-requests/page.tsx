import StockRequestsView from "@/components/pages/dashboard/StockRequestsView";

export const metadata = {
  title: "Stock Requests | Glassophite Control Center",
  description: "View and manage user requests for out-of-stock items.",
};

export default function DashboardStockRequestsPage() {
  return <StockRequestsView />;
}
