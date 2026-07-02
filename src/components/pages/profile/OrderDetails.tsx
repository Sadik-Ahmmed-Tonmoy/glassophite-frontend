"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
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
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
  order: TOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme styles
  const themeStyles = {
    dark: {
      buttonOutline: "border-white/20 text-white hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
    },
    light: {
      buttonOutline: "border-gray-300 text-gray-700 hover:bg-gray-50",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  // Handle invoice download
  const handleDownloadInvoice = () => {
    console.log("Downloading invoice for order:", order.id);
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Order Status */}
      <motion.div variants={itemVariants}>
        <OrderStatusBadge
          status={order.status as any}
          deliveryDate={order.deliveryDate}
          estimatedDelivery={order.estimatedDelivery}
        />
      </motion.div>

      {/* Order Timeline */}
      <motion.div variants={itemVariants}>
        <OrderTimeline
          status={order.status as any}
          orderDate={order.orderDate ?? order.createdAt ?? ""}
          processingDate={order.processingDate}
          shippingDate={order.shippingDate}
          deliveryDate={order.deliveryDate}
          estimatedDelivery={order.estimatedDelivery}
        />
      </motion.div>

      {/* Order Items */}
      <motion.div variants={itemVariants}>
        <OrderItemsList
          items={order.items}
          subtotal={order.subtotal}
          shipping={order.shipping}
          tax={order.tax}
          discount={order.discount}
          total={order.total}
          status={order.status as any}
        />
      </motion.div>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AddressDisplay
            title="Shipping Address"
            address={order.shippingAddress as any}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <PaymentInformation
            paymentMethod={order.paymentMethod}
            paymentDetails={order.paymentDetails as any}
            shippingAddress={order.shippingAddress as any}
          />
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-4 justify-between"
      >
        <Link
          href="/my-profile/order-history"
          className={cn(
            "inline-flex items-center px-4 py-2 border rounded-md transition-colors",
            styles.buttonOutline
          )}
        >
          <ArrowLeft size={16} className="mr-1.5" />
          <span data-translate="order.backToOrders">Back to Orders</span>
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
            className={cn("flex items-center", styles.buttonOutline)}
            onClick={handleDownloadInvoice}
          >
            <Download size={16} className="mr-1.5" />
            <span data-translate="order.downloadInvoice">Download Invoice</span>
          </Button>

          <ContactSupportDialog
            orderId={order.id}
            orderNumber={order.orderNumber}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}