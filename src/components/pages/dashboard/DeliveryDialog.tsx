/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useUpdateOrderStatusMutation, useGetOrderItemsStockQuery } from "@/redux/features/order/orderApi";

interface OrderItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  deliveredQuantity?: number;
  price: number;
  variant?: string;
  image?: string;
}

const getItemImage = (image?: string) => {
  if (!image) return "/placeholder.svg?height=40&width=40";
  try {
    const parsed = JSON.parse(image);
    return parsed?.image || image;
  } catch {
    return image;
  }
};

interface DeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    orderNumber: string;
    items: OrderItem[];
  };
  status: "SHIPPED" | "DELIVERED";
}

export default function DeliveryDialog({ open, onOpenChange, order, status }: DeliveryDialogProps) {
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [deliveries, setDeliveries] = useState<Record<string, number>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");

  const itemIds = order.items.map((i) => i.id);
  const { data: stockData } = useGetOrderItemsStockQuery(itemIds, { skip: !open || itemIds.length === 0 });
  const stockMap = (stockData as any)?.data ?? {};

  useEffect(() => {
    if (open) {
      const initial: Record<string, number> = {};
      for (const item of order.items) {
        const remaining = item.quantity - (item.deliveredQuantity ?? 0);
        initial[item.id] = remaining;
      }
      setDeliveries(initial);
      setWarnings([]);
      setTrackingNumber("");
    }
  }, [open, order.items]);

  const handleQuantityChange = (itemId: string, value: number) => {
    setDeliveries((prev) => ({ ...prev, [itemId]: Math.max(0, value) }));
  };

  const handleConfirm = async () => {
    const deliveredItems = Object.entries(deliveries)
      .filter(([, qty]) => qty > 0)
      .map(([orderItemId, quantity]) => ({ orderItemId, quantity }));

    if (deliveredItems.length === 0) {
      toast.error("No items to deliver");
      return;
    }

    try {
      const result = await updateOrderStatus({
        id: order.id,
        status,
        ...(status === "SHIPPED" && trackingNumber ? { trackingNumber } : {}),
        ...(status === "DELIVERED" ? { deliveredItems } : {}),
      }).unwrap();

      const data = result as any;
      const ws = data?._warnings || [];
      const isPartial = data?._partialDelivery;

      if (ws.length > 0) {
        setWarnings(ws);
        toast.warning("Partial delivery processed with stock issues", {
          description: ws.join(". "),
          duration: 8000,
        });
      } else if (isPartial) {
        toast.success("Partial delivery processed");
      } else {
        toast.success(`Order ${status === "SHIPPED" ? "shipped" : "delivered"} successfully`);
      }

      if (!ws.length) {
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update order status");
    }
  };

  // Check if any delivery quantity exceeds available stock
  const hasStockWarning = Object.entries(deliveries).some(([itemId, qty]) => {
    const stock = stockMap[itemId]?.available ?? 0;
    return qty > stock;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {status === "SHIPPED" ? "Ship Order" : "Deliver Order"} — {order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            {status === "SHIPPED"
              ? "Set tracking info and mark items as shipped."
              : "Specify quantity to deliver for each item. Stock will be checked and deducted."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {order.items.map((item) => {
            // ✅ Correct calculations
            const availableStock = stockMap[item.id]?.available ?? 0;
            const afterDelivery = availableStock- item.quantity
            const currentDelivery = deliveries[item.id] ?? afterDelivery;
            const isStockShort = currentDelivery > availableStock && availableStock !== undefined;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                  isStockShort ? "border-yellow-500/50 bg-yellow-500/5" : "bg-muted/10"
                }`}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <Image src={getItemImage(item.image)} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">{item.sku || "—"}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>Ordered: {item.quantity} </span>
                    <span>| Stock: {availableStock !== undefined ? availableStock : "?"}</span>
                    <span>| After Delivery: {afterDelivery}</span>
                    {item.variant && <span>| {item.variant}</span>}
                  </div>
                  {isStockShort && (
                    <div className="flex items-center gap-1 mt-1 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-3 h-3" />
                      <span className="text-[10px] font-medium">Exceeds available stock</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={availableStock}
                    value={currentDelivery}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                    className={`w-16 px-2 py-1.5 text-sm text-center rounded-lg border ${
                      isStockShort ? "border-yellow-500/50" : "border-border"
                    } bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  />
                  <span className="text-xs text-muted-foreground">/ {availableStock}</span>
                </div>
              </div>
            );
          })}

          {status === "SHIPPED" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Tracking Number (optional)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}

          {warnings.length > 0 && (
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                    Stock Shortages
                  </p>
                  {warnings.map((w, i) => (
                    <p key={i} className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                      {w}
                    </p>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">
                    Adjust quantities above and confirm again, or close to cancel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasStockWarning && !warnings.length && (
            <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ Some delivery quantities exceed available stock. The system will warn you on confirmation.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {status === "SHIPPED" ? "Confirm Shipped" : "Confirm Delivery"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}