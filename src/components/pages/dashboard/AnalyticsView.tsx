"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Percent, 
  PackageCheck,
  Eye
} from "lucide-react";

export default function AnalyticsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Business Analytics</h1>
        <p className="text-xs text-neutral-500">In-depth statistical breakdown of sales, views, and item performances.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Average Order Value</span>
            <h3 className="text-xl font-black text-neutral-900 dark:text-white">৳12,280 BDT</h3>
          </div>
          <div className="p-3 bg-[#007C74]/10 text-[#007C74] rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Total Page Views</span>
            <h3 className="text-xl font-black text-neutral-900 dark:text-white">45,820</h3>
          </div>
          <div className="p-3 bg-[#3C55A5]/10 text-[#3C55A5] rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Purchase Rate</span>
            <h3 className="text-xl font-black text-neutral-900 dark:text-white">3.1%</h3>
          </div>
          <div className="p-3 bg-[#00A693]/10 text-[#00A693] rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Delivered Packages</span>
            <h3 className="text-xl font-black text-neutral-900 dark:text-white">128 / 142</h3>
          </div>
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-550 dark:text-neutral-400 rounded-xl">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown visual */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold tracking-wide text-neutral-900 dark:text-white">Sales Category Distribution</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Sunglasses Collection</span>
                <span className="text-[#007C74]">65%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#007C74] rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Optical Eyewear</span>
                <span className="text-[#3C55A5]">25%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#3C55A5] rounded-full" style={{ width: "25%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Limited Edition Frames</span>
                <span className="text-[#00A693]">10%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00A693] rounded-full" style={{ width: "10%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Product Performers list */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold tracking-wide text-neutral-900 dark:text-white">Top Frame Performers</h3>
          
          <div className="space-y-3 divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="space-y-0.5">
                <p className="font-bold">Titanium Aviator (Gold)</p>
                <p className="text-[10px] text-neutral-500">Sunglasses Category</p>
              </div>
              <span className="font-bold text-[#007C74]">৳92,400 BDT</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-3">
              <div className="space-y-0.5">
                <p className="font-bold">Acetate Round (Black)</p>
                <p className="text-[10px] text-neutral-500">Optical Category</p>
              </div>
              <span className="font-bold text-[#007C74]">৳58,800 BDT</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-3">
              <div className="space-y-0.5">
                <p className="font-bold">Classic Square (Tortoise)</p>
                <p className="text-[10px] text-neutral-500">Sunglasses Category</p>
              </div>
              <span className="font-bold text-[#007C74]">৳50,000 BDT</span>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
