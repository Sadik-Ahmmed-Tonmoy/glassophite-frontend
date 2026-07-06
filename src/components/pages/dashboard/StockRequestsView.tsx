/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetAllStockRequestsQuery,
  useUpdateStockRequestStatusMutation,
} from "@/redux/features/stockRequest/stockRequestApi";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type TStockRequest = {
  id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
  };
  productId: string;
  product: {
    id: string;
    title: string;
    brand: string;
    variants: Array<{
      id: string;
      title: string;
      color: string;
      productCode: string;
      inStock: boolean;
      quantity: number;
      imgList: Array<{ image: string }>;
    }>;
  };
  variantId: string;
  variant: {
    id: string;
    title: string;
    color: string;
    productCode: string;
    inStock: boolean;
    quantity: number;
    mainPrice: number;
    priceAfterDiscount: number;
    imgList: Array<{ image: string }>;
  };
  status: "PENDING" | "NOTIFIED" | string;
  createdAt: string;
};

export default function StockRequestsView() {
  const { data, isLoading, isFetching, refetch } =
    useGetAllStockRequestsQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateStockRequestStatusMutation();

  const requests: TStockRequest[] = data?.data || [];

  const handleResolve = async (id: string, email: string) => {
    try {
      await updateStatus({ id, status: "NOTIFIED" }).unwrap();
      toast.success("Notification marked as sent", {
        description: `Request for user ${email} is marked as resolved/notified.`,
      });
    } catch (err: any) {
      toast.error("Failed to update status", {
        description: err?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-foreground"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <span className="p-2 bg-[#007C74]/10 rounded-xl text-[#007C74]">
              <Bell className="w-6 h-6" />
            </span>
            <span>Stock Requests</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor and resolve out-of-stock notification requests submitted by
            customers.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          disabled={isLoading || isFetching}
        >
          {isFetching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-border flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">
              Pending Requests
            </p>
            <h3 className="text-xl font-black">
              {requests.filter((r) => r.status === "PENDING").length}
            </h3>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-border flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">
              Notified / Resolved
            </p>
            <h3 className="text-xl font-black">
              {requests.filter((r) => r.status === "NOTIFIED").length}
            </h3>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-border flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">
              Ready to Notify
            </p>
            <h3 className="text-xl font-black">
              {
                requests.filter(
                  (r) =>
                    r.status === "PENDING" &&
                    r.variant?.inStock &&
                    r.variant?.quantity > 0,
                ).length
              }
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Customer</th>
              <th className="p-4">Requested Frame (Variant)</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Date Requested</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading || isFetching ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-12 text-center text-muted-foreground"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#007C74]" />
                  <p className="text-xs mt-2">Loading stock requests...</p>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-12 text-center text-muted-foreground bg-card/25"
                >
                  <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="font-bold">No Stock Requests found</p>
                  <p className="text-[11px] text-neutral-450 mt-1">
                    When users request restocks of out-of-stock items, they will
                    list here.
                  </p>
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const isReadyToNotify =
                  req.variant?.inStock && req.variant?.quantity > 0;
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">
                            {req.user?.fullName || "Guest User"}
                          </p>
                          <span className="text-[10px] text-neutral-500 flex items-center gap-0.5 mt-0.5">
                            <Mail className="w-2.5 h-2.5" />
                            {req.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Target Frame / Variant */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-border overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              req.variant?.imgList?.[0]?.image ||
                              "/placeholder.svg"
                            }
                            alt={req.variant?.title || "Frame"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            <Link
                              href={`/product/${req.productId}`}
                              className="hover:text-[#007C74] hover:underline"
                            >
                              {req.product?.title}
                            </Link>
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Color:{" "}
                            <span className="font-semibold">
                              {req.variant?.color}
                            </span>{" "}
                            | SKU:{" "}
                            <span className="font-mono">
                              {req.variant?.productCode}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Stock Status */}
                    <td className="p-4">
                      {req.variant?.inStock && req.variant?.quantity > 0 ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-600 rounded">
                          IN STOCK ({req.variant.quantity})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-red-500/10 text-red-650 rounded">
                          OUT OF STOCK
                        </span>
                      )}
                    </td>

                    {/* Requested At */}
                    <td className="p-4 text-muted-foreground font-medium">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Request Status */}
                    <td className="p-4">
                      {req.status === "PENDING" ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 rounded">
                          PENDING
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-600 rounded">
                          RESOLVED
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {req.status === "PENDING" ? (
                          <button
                            onClick={() =>
                              handleResolve(req.id, req.user?.email)
                            }
                            disabled={isUpdating}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isReadyToNotify
                                ? "bg-[#007C74] hover:bg-[#006059] text-white shadow-sm"
                                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500"
                            }`}
                          >
                            <Bell className="w-3 h-3" />
                            <span>
                              {isReadyToNotify
                                ? "Notify Customer"
                                : "Mark Notified"}
                            </span>
                          </button>
                        ) : (
                          <span className="text-green-500 flex items-center gap-1 font-bold text-[10px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
