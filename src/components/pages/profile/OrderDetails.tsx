"use client";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import ReturnDialog from "./order/ReturnDialog";
import ContactSupportDialog from "./order/ContactSupportDialog";
import AddressDisplay from "./order/AddressDisplay";
import OrderTimeline from "./order/OrderTimeline";
import OrderItemsList from "./order/OrderItemsList";
import PaymentInformation from "./order/PaymentInformation";
import OrderStatusBadge from "./order/OrderStatusBadge";
import { TOrder } from "@/types/types";

interface OrderDetailsProps {
  order: TOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  // Handle invoice download
  const handleDownloadInvoice = () => {
    // In a real application, this would generate and download a PDF
    console.log("Downloading invoice for order:", order.id);

    // Create a simulated download delay
    const link = document.createElement("a");
    link.href = "#";
    link.download = `Invoice-${order.orderNumber}.pdf`;
    link.onclick = (e) => {
      e.preventDefault();
      alert(
        "Invoice download started. In a real application, this would download a PDF file."
      );
    };
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <OrderStatusBadge
        status={order.status}
        deliveryDate={order.deliveryDate}
        estimatedDelivery={order.estimatedDelivery}
      />

      {/* Order Timeline */}
      <OrderTimeline
        status={order.status}
        orderDate={order.orderDate}
        processingDate={order.processingDate}
        shippingDate={order.shippingDate}
        deliveryDate={order.deliveryDate}
        estimatedDelivery={order.estimatedDelivery}
      />

      {/* Order Items */}
      <OrderItemsList
        items={order.items}
        subtotal={order.subtotal}
        shipping={order.shipping}
        tax={order.tax}
        discount={order.discount}
        total={order.total}
        status={order.status}
      />

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <AddressDisplay
          title="Shipping Address"
          address={order.shippingAddress}
        />

        {/* Payment Information */}
        <PaymentInformation
          paymentMethod={order.paymentMethod}
          paymentDetails={order.paymentDetails}
          shippingAddress={order.shippingAddress}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-between">
        <Link
          href="/my-profile/order-history"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Orders
        </Link>

        <div className="flex flex-wrap gap-3">
          {order.status === "delivered" && (
            <ReturnDialog
              orderId={order.id}
              orderNumber={order.orderNumber}
              orderItems={order.items}
              isDelivered={order.status === "delivered"}
            />
          )}

          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleDownloadInvoice}
          >
            <Download size={16} className="mr-1.5" />
            Download Invoice
          </Button>

          <ContactSupportDialog
            orderId={order.id}
            orderNumber={order.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}
