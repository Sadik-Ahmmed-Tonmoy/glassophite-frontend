/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  MapPin,
  Calendar,
  FileText,
  User,
  ShieldCheck,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import { useLazyTrackOrderQuery } from "@/redux/features/order/orderApi";

interface Step {
  title: string;
  translateTitleKey: string;
  description: string;
  translateDescKey: string;
  date: string;
}

interface MappedOrder {
  orderId: string;
  email: string;
  status: "placed" | "processing" | "transit" | "delivered";
  statusText: string;
  estimatedDelivery: string;
  shippingAddress: string;
  item: string;
  price: string;
  steps: Step[];
}

const DEFAULT_FORM_VALUES = {
  orderId: "",
  email: "",
};

export default function TrackOrderPage() {
  const [triggerTrackOrder, { data: trackResponse, isFetching }] =
    useLazyTrackOrderQuery();
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const defaultValues = useMemo(() => DEFAULT_FORM_VALUES, []);

  const handleFormSubmit = async (
    data: { orderId: string; email: string },
    reset: () => void
  ) => {
    const formattedId = data.orderId.trim();
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await triggerTrackOrder({
        orderNumber: formattedId,
        email: data.email.trim(),
      }).unwrap();

      if (res?.success && res.data) {
        toast.success("Order Located", {
          description: `Order ${formattedId} tracking data updated.`,
        });
        reset();
      } else {
        setErrorMsg("Order not found. Please verify your order number and email.");
        toast.error("Tracking Failed", {
          description: "No order matched this ID and email combination.",
        });
      }
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || "Verify your Order ID and billing email address."
      );
      toast.error("Tracking Failed", {
        description: err?.data?.message || "Verify your Order ID and email address.",
      });
    }
  };

  const mapDbOrderToMappedOrder = useCallback(
    (order: any, searchedEmail: string): MappedOrder => {
      const shippingAddressObj = order.shippingAddress || {};
      const street = shippingAddressObj.street || "";
      const city = shippingAddressObj.city || "";
      const country = shippingAddressObj.country || "";
      const addressStr =
        [street, city, country].filter(Boolean).join(", ") || "No address provided";

      const itemNames =
        order.items
          ?.map((item: any) => `${item.name} (x${item.quantity})`)
          .join(", ") || "Eyewear Collection Item";

      const formatDate = (dateStr: string | null | undefined, placeholder: string) => {
        if (!dateStr) return placeholder;
        return new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const formatEstDate = (dateStr: string | null | undefined) => {
        if (!dateStr) {
          const d = new Date(order.createdAt);
          d.setDate(d.getDate() + 5);
          return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        return new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      let stepStatus: "placed" | "processing" | "transit" | "delivered" = "placed";
      let statusText = "Order Placed";
      if (order.status === "DELIVERED") {
        stepStatus = "delivered";
        statusText = "Delivered";
      } else if (order.status === "SHIPPED") {
        stepStatus = "transit";
        statusText = "In Transit";
      } else if (order.status === "PROCESSING") {
        stepStatus = "processing";
        statusText = "Processing & Assembly";
      } else if (order.status === "CANCELLED") {
        statusText = "Cancelled";
      }

      const steps: Step[] = [
        {
          title: "Order Placed",
          translateTitleKey: "track.step1_title",
          description: "Your order was successfully received.",
          translateDescKey: "track.step1_desc",
          date: formatDate(order.createdAt, "Order Placed"),
        },
        {
          title: "Processing & Assembly",
          translateTitleKey: "track.step2_title",
          description:
            order.status === "PROCESSING"
              ? "Our lab technicians are mounting lenses to the frames."
              : "Lenses custom cut and frame quality-inspected.",
          translateDescKey:
            order.status === "PROCESSING"
              ? "track.step2_desc_active"
              : "track.step2_desc",
          date: order.processingDate
            ? formatDate(order.processingDate, "")
            : order.status !== "PROCESSING" && order.status !== "CANCELLED"
            ? formatDate(order.createdAt, "")
            : "In Progress",
        },
        {
          title: "In Transit",
          translateTitleKey: "track.step3_title",
          description:
            order.status === "SHIPPED"
              ? "Dispatched from warehouse via courier."
              : "Awaiting dispatch.",
          translateDescKey:
            order.status === "SHIPPED" ? "track.step3_desc" : "track.step3_desc_pending",
          date: order.shippingDate
            ? formatDate(order.shippingDate, "")
            : order.status === "DELIVERED"
            ? formatDate(order.createdAt, "")
            : order.status === "SHIPPED"
            ? "In Transit"
            : "Awaiting Shipment",
        },
        {
          title: "Delivered",
          translateTitleKey: "track.step4_title",
          description:
            order.status === "DELIVERED"
              ? "Package signed and received by recipient."
              : "Pending delivery.",
          translateDescKey:
            order.status === "DELIVERED" ? "track.step4_desc" : "track.step4_desc_pending",
          date: order.deliveryDate
            ? formatDate(order.deliveryDate, "")
            : "Pending Delivery",
        },
      ];

      return {
        orderId: order.orderNumber,
        email: searchedEmail,
        status: stepStatus,
        statusText,
        estimatedDelivery: formatEstDate(order.estimatedDelivery),
        shippingAddress: addressStr,
        item: itemNames,
        price: `৳ ${order.total?.toLocaleString() || "0"}`,
        steps,
      };
    },
    []
  );

  const getStatusIndex = (status: string) => {
    switch (status) {
      case "placed":
        return 0;
      case "processing":
        return 1;
      case "transit":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const dbOrder = trackResponse?.data;
  const mappedOrder = useMemo(
    () => (dbOrder ? mapDbOrderToMappedOrder(dbOrder, defaultValues.email) : null),
    [dbOrder, mapDbOrderToMappedOrder, defaultValues.email]
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 space-y-10 sm:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3 pt-4 sm:pt-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="track.title">Track Your Order</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed"
            data-translate="track.subtitle"
          >
            Enter your Order ID (e.g. ORD-XXXXXX) and your billing email address to
            check the live delivery progress.
          </p>
        </motion.div>

        {/* Form panel */}
        <div className="max-w-xl mx-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg border border-[#007C74]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#007C74]/15 to-transparent blur-2xl rounded-full pointer-events-none" />
            <MyFormWrapper
              onSubmit={handleFormSubmit}
              defaultValues={defaultValues}
              className="space-y-4 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MyFormInputAceternity
                  name="orderId"
                  label="Order ID"
                  placeholder="ORD-XXXXXX"
                  required
                />
                <MyFormInputAceternity
                  name="email"
                  label="Billing Email"
                  placeholder="test@example.com"
                  type="email"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isFetching}
                  className="w-full py-3 bg-[#007C74] hover:bg-[#006059] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-[#007c74]/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  {isFetching ? (
                    <>
                      <span>Tracking...</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span data-translate="track.search_btn">Track Progress</span>
                      <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </MyFormWrapper>
          </div>
        </div>

        {/* Tracking Results Animation */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {isFetching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 glass-panel rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-md"
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#007C74] mb-3" />
                <p className="text-xs sm:text-sm text-neutral-500 font-semibold">
                  Fetching live delivery progress...
                </p>
              </motion.div>
            )}

            {!isFetching && !hasSearched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 glass-panel rounded-3xl space-y-3.5 border border-neutral-200/80 dark:border-white/10 shadow-md"
              >
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit mx-auto text-neutral-400 dark:text-neutral-500">
                  <Package className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3
                  className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
                  data-translate="track.empty_title"
                >
                  Awaiting Search
                </h3>
                <p
                  className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed"
                  data-translate="track.empty_desc"
                >
                  Provide your details above to pull current assembly, inspection, and
                  dispatch metrics.
                </p>
              </motion.div>
            )}

            {!isFetching && hasSearched && errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 glass-panel rounded-3xl space-y-3.5 border border-neutral-200/80 dark:border-white/10 shadow-md"
              >
                <div className="p-4 bg-red-100 dark:bg-red-950/30 rounded-full w-fit mx-auto text-red-500">
                  <X className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  Order Not Found
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  {errorMsg}
                </p>
              </motion.div>
            )}

            {!isFetching && hasSearched && mappedOrder && (
              <motion.div
                key={mappedOrder.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Meta details banner */}
                <div className="glass-panel p-6 sm:p-7 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-5 border border-neutral-200/80 dark:border-white/10 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[#007C74] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className="text-[10px] uppercase font-extrabold text-neutral-400"
                        data-translate="track.meta_id"
                      >
                        Order Number
                      </h4>
                      <p className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white">
                        {mappedOrder.orderId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[#007C74] shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className="text-[10px] uppercase font-extrabold text-neutral-400"
                        data-translate="track.meta_est"
                      >
                        Est. Arrival
                      </h4>
                      <p className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white">
                        {mappedOrder.estimatedDelivery}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[#007C74] shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className="text-[10px] uppercase font-extrabold text-neutral-400"
                        data-translate="track.meta_status"
                      >
                        Current Status
                      </h4>
                      <p className="text-xs sm:text-sm font-extrabold text-[#00a76b]">
                        {mappedOrder.statusText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Stepper Section */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-md">
                  <h3
                    className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-6 sm:mb-8"
                    data-translate="track.timeline_title"
                  >
                    Package Journey Timeline
                  </h3>

                  {/* Horizontal / Vertical Stepper */}
                  <div className="relative flex flex-col md:flex-row justify-between items-start gap-6 md:gap-4 pl-2 md:pl-0">
                    {/* Background Progress bar line (only on desktop) */}
                    <div className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-neutral-200 dark:bg-neutral-800 hidden md:block z-0">
                      <div
                        className="h-full bg-gradient-to-r from-[#00a76b] to-[#007C74] transition-all duration-500"
                        style={{
                          width: `${(getStatusIndex(mappedOrder.status) / 3) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Background line (only on mobile) */}
                    <div className="absolute top-5 bottom-5 left-[18px] w-[2px] bg-neutral-200 dark:bg-neutral-800 block md:hidden z-0">
                      <div
                        className="w-full bg-[#00a76b] transition-all duration-500"
                        style={{
                          height: `${(getStatusIndex(mappedOrder.status) / 3) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Stepper items */}
                    {mappedOrder.steps.map((step, idx) => {
                      const isActive = getStatusIndex(mappedOrder.status) === idx;
                      const isCompleted = getStatusIndex(mappedOrder.status) >= idx;

                      return (
                        <div
                          key={idx}
                          className="relative z-10 flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full gap-3.5 md:gap-2"
                        >
                          {/* Circle Dot wrapper */}
                          <div className="flex justify-center items-center shrink-0">
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white ${
                                  isActive
                                    ? "bg-[#007C74] shadow-[0_0_15px_rgba(0,124,116,0.5)] border-2 border-white dark:border-black"
                                    : "bg-[#00a76b]"
                                }`}
                              >
                                {isActive ? (
                                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                              </motion.div>
                            ) : (
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs sm:text-sm font-bold text-neutral-400 dark:text-neutral-600">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          {/* Details text */}
                          <div className="space-y-0.5 mt-0 md:mt-2">
                            <h4
                              className={`font-bold text-xs sm:text-sm ${
                                isCompleted
                                  ? "text-neutral-900 dark:text-white"
                                  : "text-neutral-400 dark:text-neutral-600"
                              }`}
                              data-translate={step.translateTitleKey}
                            >
                              {step.title}
                            </h4>
                            <p
                              className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 max-w-[150px] mx-auto hidden md:block leading-relaxed"
                              data-translate={step.translateDescKey}
                            >
                              {step.description}
                            </p>
                            <p className="text-[10px] font-bold text-[#007C74] dark:text-[#00A693]">
                              {step.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Package Details info */}
                <div className="glass-panel p-6 sm:p-7 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 border border-neutral-200/80 dark:border-white/10 shadow-md">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#007C74] shrink-0" />
                      <span data-translate="track.recipient_title">
                        Recipient Information
                      </span>
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      <div>
                        <span
                          className="font-bold text-neutral-800 dark:text-neutral-200"
                          data-translate="track.recipient_addr_lbl"
                        >
                          Delivery Address:
                        </span>
                        <p className="mt-1 flex items-start gap-2 leading-relaxed">
                          <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{mappedOrder.shippingAddress}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#007C74] shrink-0" />
                      <span data-translate="track.items_title">
                        Items in Shipment
                      </span>
                    </h3>
                    <div className="p-4 bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {mappedOrder.item}
                          </p>
                          <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">
                            Quantity: 1
                          </p>
                        </div>
                        <span className="font-extrabold text-neutral-900 dark:text-white">
                          {mappedOrder.price}
                        </span>
                      </div>
                      <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800" />
                      <div className="flex justify-between items-center text-xs text-neutral-500">
                        <span data-translate="track.shipping_method">
                          Shipping Method:
                        </span>
                        <span className="font-bold text-[#007C74]">
                          Glassophite Premium Courier
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
