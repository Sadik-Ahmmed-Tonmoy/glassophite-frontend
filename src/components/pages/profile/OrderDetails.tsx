"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";

import { useProfileTheme } from "@/hooks/useProfileTheme";
import { staggerContainer, staggerItems } from "@/lib/profileAnimations";
import { Button } from "@/components/ui/button";
import ReturnDialog from "./order/ReturnDialog";
import ContactSupportDialog from "./order/ContactSupportDialog";
import AddressDisplay from "./order/AddressDisplay";
import OrderTimeline from "./order/OrderTimeline";
import OrderItemsList from "./order/OrderItemsList";
import PaymentInformation from "./order/PaymentInformation";
import OrderStatusBadge from "./order/OrderStatusBadge";
import type { TOrder } from "@/types/types";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
  order: TOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter();
  const { isDark } = useProfileTheme();

  const handleDownloadInvoice = () => {
    router.push(`/my-profile/order-history/${order.id}/invoice`);
  };

  const statusLower = order.status.toLowerCase() as "processing" | "shipped" | "delivered" | "cancelled";

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItems}>
        <OrderStatusBadge status={statusLower} deliveryDate={order.deliveryDate} estimatedDelivery={order.estimatedDelivery} />
      </motion.div>

      <motion.div variants={staggerItems}>
        <OrderTimeline status={statusLower} orderDate={order.orderDate ?? order.createdAt ?? ""} processingDate={order.processingDate} shippingDate={order.shippingDate} deliveryDate={order.deliveryDate} estimatedDelivery={order.estimatedDelivery} />
      </motion.div>

      <motion.div variants={staggerItems}>
        <OrderItemsList items={order.items} subtotal={order.subtotal} shipping={order.shipping} discount={order.discount} total={order.total} status={statusLower} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={staggerItems}>
          <AddressDisplay title="Shipping Address" address={order.shippingAddress as any} />
        </motion.div>
        <motion.div variants={staggerItems}>
          <PaymentInformation paymentMethod={order.paymentMethod} paymentDetails={order.paymentDetails as any} shippingAddress={order.shippingAddress as any} />
        </motion.div>
      </div>

      <motion.div variants={staggerItems} className="flex flex-wrap gap-4 justify-between">
        <Link
          href="/my-profile/order-history"
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
            isDark ? "border-white/[0.08] text-white hover:bg-white/[0.06]" : "border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="flex flex-wrap gap-3">
          {order.status.toLowerCase() === "delivered" && (
            <ReturnDialog orderId={order.id} orderNumber={order.orderNumber} orderItems={order.items} isDelivered={true} />
          )}

          <Button
            variant="outline"
            className={cn("inline-flex items-center gap-2 rounded-xl", isDark ? "border-white/[0.08] text-white hover:bg-white/[0.06]" : "border-gray-200 text-gray-700 hover:bg-gray-50")}
            onClick={handleDownloadInvoice}
          >
            <Download size={16} />
            Download Invoice
          </Button>

          <ContactSupportDialog orderId={order.id} orderNumber={order.orderNumber} />
        </div>
      </motion.div>
    </motion.div>
  );
}