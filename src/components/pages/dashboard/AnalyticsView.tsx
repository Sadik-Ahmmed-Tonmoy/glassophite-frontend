"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Percent,
  PackageCheck,
  ShoppingCart,
  Users,
  Package,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

export default function AnalyticsView() {
  const { data: statsData, isLoading } = useGetDashboardStatsQuery();

  const stats = statsData?.data || {};
  const kpi = stats.kpi || {};
  const last6Months = stats.revenueTrends || [];
  const orderStatusBreakdown = stats.orderStatusBreakdown || {};
  const topCategories = stats.categoryDistribution || [];
  const topProducts = stats.topProducts || [];


  const avgOrderValue = kpi.avgOrderValue || 0;
  const totalOrders = kpi.totalOrders || 0;
  const deliveredCount = kpi.deliveredCount || 0;
  const purchaseRate = kpi.deliveryRate || 0;
  const totalCustomers = kpi.totalCustomers || 0;

  const maxRevenue = Math.max(...last6Months.map((m: any) => m.revenue), 1);

  const BAR_COLORS = [
    "linear-gradient(to top, #007C74, #00BFB3)",
    "linear-gradient(to top, #007C7440, #007C7480)",
    "linear-gradient(to top, #007C7440, #007C7480)",
    "linear-gradient(to top, #007C7440, #007C7480)",
    "linear-gradient(to top, #007C7440, #007C7480)",
    "linear-gradient(to top, #007C7440, #007C7480)",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Business Analytics</h1>
        <p className="text-xs text-muted-foreground">In-depth statistical breakdown of sales, views, and item performance.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-border">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Avg Order Value</span>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <h3 className="text-xl font-black text-foreground">৳{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            )}
          </div>
          <div className="p-3 bg-[#007C74]/10 text-[#007C74] rounded-xl"><DollarSign className="w-5 h-5" /></div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-border">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Total Customers</span>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <h3 className="text-xl font-black text-foreground">{totalCustomers.toLocaleString()}</h3>
            )}
          </div>
          <div className="p-3 bg-[#3C55A5]/10 text-[#3C55A5] rounded-xl"><Users className="w-5 h-5" /></div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-border">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Delivery Rate</span>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <h3 className="text-xl font-black text-foreground">{purchaseRate}%</h3>
            )}
          </div>
          <div className="p-3 bg-[#00A693]/10 text-[#00A693] rounded-xl"><Percent className="w-5 h-5" /></div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-border">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Delivered / Total</span>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <h3 className="text-xl font-black text-foreground">{deliveredCount} / {totalOrders}</h3>
            )}
          </div>
          <div className="p-3 bg-muted text-muted-foreground rounded-xl"><PackageCheck className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Revenue Chart + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Revenue Bar Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-4 border border-border">
          <h3 className="text-sm font-bold tracking-wide text-foreground">
            Delivered Revenue — Last 6 Months
          </h3>
          {isLoading ? (
            <div className="h-56 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-end gap-3 h-56 px-2">
              {last6Months.map((m: any, i: number) => {
                const heightPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                const isLatest = i === last6Months.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-[9px] font-bold text-muted-foreground">
                      {m.revenue > 0 ? `৳${(m.revenue / 1000).toFixed(0)}k` : "—"}
                    </div>
                    <div className="w-full flex items-end justify-center" style={{ height: "180px" }}>
                      <div
                        className="w-full rounded-t-lg transition-all duration-700"
                        title={`${m.label}: ৳${m.revenue.toLocaleString()}`}
                        style={{
                          height: `${Math.max(heightPct, 2)}%`,
                          background: isLatest ? BAR_COLORS[0] : BAR_COLORS[1],
                        }}
                      />
                    </div>
                    <span className="text-[10px] uppercase font-extrabold text-muted-foreground">{m.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl space-y-4 border border-border">
          <h3 className="text-sm font-bold tracking-wide text-foreground flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Order Status
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Processing", key: "PROCESSING", color: "bg-yellow-500" },
                { label: "Shipped", key: "SHIPPED", color: "bg-blue-500" },
                { label: "Delivered", key: "DELIVERED", color: "bg-green-500" },
                { label: "Cancelled", key: "CANCELLED", color: "bg-red-500" },
              ].map(({ label, key, color }) => {
                const count = orderStatusBreakdown[key] || 0;
                const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">{label}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Category Distribution */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-6 border border-border">
          <h3 className="text-sm font-bold tracking-wide text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Product Category Distribution
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : topCategories.length === 0 ? (
            <p className="text-xs text-muted-foreground">No products yet.</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map((cat: any, i: number) => {
                const COLORS = ["#007C74", "#3C55A5", "#00A693", "#8B5CF6", "#F59E0B"];
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">{cat.name}</span>
                      <span style={{ color: COLORS[i % COLORS.length] }}>{cat.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${cat.pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products by Reviews */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-4 border border-border">
          <h3 className="text-sm font-bold tracking-wide text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Top Products by Reviews
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-xs text-muted-foreground">No products yet.</p>
          ) : (
            <div className="space-y-3 divide-y divide-border">
              {topProducts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-xs pt-3 first:pt-0">
                  <div className="space-y-0.5 flex-1 min-w-0 mr-3">
                    <p className="font-bold text-foreground truncate">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground">{Array.isArray(p.categories) ? p.categories.join(", ") : p.categories} · {p.brand}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="font-bold text-[#007C74]">
                      ★ {(p.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{p.totalReviews || 0} reviews</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
