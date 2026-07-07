"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGetOrderByIdQuery } from "@/redux/features/order/orderApi";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";
import type { TOrderItem } from "@/types/types";

const getItemImage = (item: TOrderItem) => {
  if (!item.image) return "/placeholder.svg?height=64&width=64";
  try {
    const parsed = JSON.parse(item.image);
    return parsed?.image || item.image;
  } catch {
    return item.image;
  }
};

export default function OrderInvoice({ orderId }: { orderId: string }) {
  const { isDark } = useProfileTheme();
  const printRef = useRef<HTMLDivElement>(null);
  const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId, { skip: !orderId });

  const order = orderData?.data || orderData;

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#007C74] border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Order not found.</p>
      </div>
    );
  }

  const address = order.shippingAddress;
  const user = order.user;

  return (
    <div>
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white hover:shadow-lg transition-all"
        >
          <Printer size={16} />
          Print / Save as PDF
        </button>
      </div>

      <div
        ref={printRef}
        className={cn(
          "max-w-4xl mx-auto rounded-2xl border shadow-sm p-8 sm:p-12",
          isDark ? "bg-[#0e0e10] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900"
        )}
      >
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">INVOICE</h1>
            <p className={cn("text-sm mt-1", isDark ? "text-neutral-400" : "text-gray-500")}>
              #{order.orderNumber}
            </p>
          </div>
          <div className="text-right">
            <div className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Glassophite</div>
            <p className={cn("text-xs mt-1", isDark ? "text-neutral-400" : "text-gray-500")}>
              Invoice Date: {new Date(order.createdAt ?? 0).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-[#007C74]">Bill To</h3>
            <div className={cn("text-sm space-y-0.5", isDark ? "text-neutral-300" : "text-gray-700")}>
              {user?.fullName && <p className="font-semibold">{user.fullName}</p>}
              {address?.name && <p className="font-semibold">{address.name}</p>}
              <p>{(address?.address || address?.street)}</p>
              <p>{address?.city}, {address?.state} {address?.zipCode}</p>
              <p>{address?.country}</p>
              {address?.phone && <p className="mt-1">{address?.phone}</p>}
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-[#007C74]">Order Details</h3>
            <div className={cn("text-sm space-y-0.5", isDark ? "text-neutral-300" : "text-gray-700")}>
              <p>Status: <span className="font-semibold">{order.status}</span></p>
              <p>Payment: {order.paymentMethod.replace(/_/g, " ")}</p>
              <p>Shipping: {order.shippingMethod ?? "Standard"}</p>
              {order.trackingNumber && <p>Tracking: {order.trackingNumber}</p>}
            </div>
          </div>
        </div>

        <table className="w-full text-sm mb-8">
          <thead>
            <tr className={cn("border-b text-left", isDark ? "border-white/[0.08] text-neutral-400" : "border-gray-200 text-gray-500")}>
              <th className="pb-3 font-medium">Item</th>
              <th className="pb-3 font-medium text-right">Price</th>
              <th className="pb-3 font-medium text-right">Qty</th>
              <th className="pb-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: TOrderItem) => (
              <tr key={item.id} className={cn("border-b", isDark ? "border-white/[0.04]" : "border-gray-100")}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={getItemImage(item)} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.variant && <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-gray-400")}>{item.variant}</p>}
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className={cn("w-64 space-y-2 text-sm", isDark ? "text-neutral-300" : "text-gray-700")}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className={cn("flex justify-between font-bold text-base pt-3 border-t", isDark ? "border-white/[0.08]" : "border-gray-200")}>
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={cn("mt-10 pt-6 border-t text-center text-xs", isDark ? "border-white/[0.08] text-neutral-500" : "border-gray-200 text-gray-400")}>
          <p>Thank you for your purchase!</p>
          <p className="mt-1">Glassophite</p>
        </div>
      </div>
    </div>
  );
}
