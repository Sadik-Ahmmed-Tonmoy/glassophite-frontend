"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Loader2,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

export default function OverviewView() {
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();

  const stats = statsData?.data || {};
  const kpi = stats.kpi || {};
  const last6Months = stats.revenueTrends || [];
  const recentOrders = stats.recentOrders || [];
  const orderStatusBreakdown = stats.orderStatusBreakdown || {};

  const totalRevenue = kpi.totalRevenue || 0;
  const totalOrders = kpi.totalOrders || 0;
  const totalCustomers = kpi.totalCustomers || 0;
  const totalProducts = kpi.totalProducts || 0;
  const maxRevenue = Math.max(...last6Months.map((m: any) => m.revenue), 1);

  const metrics = [
    {
      label: "Total Revenue",
      value: isLoading ? "—" : `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "#007C74",
      bg: "#007C74",
    },
    {
      label: "Orders Processed",
      value: isLoading ? "—" : totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "#3C55A5",
      bg: "#3C55A5",
    },
    {
      label: "Registered Customers",
      value: isLoading ? "—" : totalCustomers.toLocaleString(),
      icon: Users,
      color: "#00A693",
      bg: "#00A693",
    },
    {
      label: "Products in Catalog",
      value: isLoading ? "—" : totalProducts.toLocaleString(),
      icon: Package,
      color: "#8B5CF6",
      bg: "#8B5CF6",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Overview</h1>
        <p className="text-xs text-muted-foreground">Live operational data and sales trends.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-border">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                {m.label}
              </span>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <h3 className="text-2xl font-black text-foreground">{m.value}</h3>
              )}
            </div>
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${m.bg}15`, color: m.color }}
            >
              <m.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart — Revenue by Month */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-4 border border-border">
          <h3 className="text-sm font-bold tracking-wide text-foreground">
            Delivered Revenue (Last 6 Months)
          </h3>
          {isLoading ? (
            <div className="h-56 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-end gap-3 h-56 px-2">
              {last6Months.map((m: any, i: number) => {
                const heightPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-[9px] font-bold text-muted-foreground">
                      {m.revenue > 0 ? `৳${(m.revenue / 1000).toFixed(0)}k` : ""}
                    </div>
                    <div className="w-full flex items-end justify-center" style={{ height: "180px" }}>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, 2)}%`,
                          background:
                            i === last6Months.length - 1
                              ? "linear-gradient(to top, #007C74, #00BFB3)"
                              : "linear-gradient(to top, #007C7440, #007C7480)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] uppercase font-extrabold text-muted-foreground">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl space-y-4 border border-border">
          <h3 className="text-sm font-bold tracking-wide text-foreground">Recent Orders</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((o: any, i: number) => {
                const statusColors: Record<string, string> = {
                  DELIVERED: "bg-green-500",
                  SHIPPED: "bg-blue-500",
                  PROCESSING: "bg-yellow-500",
                  CANCELLED: "bg-red-500",
                };
                return (
                  <div key={o.id} className="flex gap-3 text-xs">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${statusColors[o.status] || "bg-gray-400"} ${i === 0 ? "animate-pulse" : ""}`}
                    />
                    <div>
                      <p className="font-bold text-foreground">
                        {o.orderNumber} — {o.user?.fullName || "Customer"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {o.status} · ৳{o.total?.toLocaleString()} · {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Processing Orders</p>
          <p className="text-2xl font-black text-foreground">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : orderStatusBreakdown["PROCESSING"] || 0}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Shipped Orders</p>
          <p className="text-2xl font-black text-foreground">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : orderStatusBreakdown["SHIPPED"] || 0}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Delivered Orders</p>
          <p className="text-2xl font-black text-foreground">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : orderStatusBreakdown["DELIVERED"] || 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
