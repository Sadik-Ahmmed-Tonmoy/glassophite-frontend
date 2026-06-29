"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  Activity, 
  TrendingUp 
} from "lucide-react";

export default function OverviewView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Overview</h1>
        <p className="text-xs text-neutral-500">Live operational data and sales trends.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Total revenue</span>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white">৳324,500</h3>
          </div>
          <div className="p-3 bg-[#007C74]/10 text-[#007C74] rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Orders Processed</span>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white">142</h3>
          </div>
          <div className="p-3 bg-[#3C55A5]/10 text-[#3C55A5] rounded-xl">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Active Try-Ons</span>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white">842</h3>
          </div>
          <div className="p-3 bg-[#00A693]/10 text-[#00A693] rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">Conversion Rate</span>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white">3.8%</h3>
          </div>
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SVG Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold tracking-wide text-neutral-900 dark:text-white">Revenue Growth (Last 6 Months)</h3>
          <div className="w-full h-64 relative flex items-end">
            <svg viewBox="0 0 600 200" className="w-full h-full text-[#007C74]">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#007C74" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#007C74" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(128,128,128,0.1)" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(128,128,128,0.1)" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(128,128,128,0.1)" strokeDasharray="5,5" />
              
              {/* Area */}
              <path
                d="M 50 170 C 130 140, 200 130, 280 80 C 360 90, 450 60, 550 30 L 550 190 L 50 190 Z"
                fill="url(#chartGrad)"
              />
              
              {/* Line */}
              <path
                d="M 50 170 C 130 140, 200 130, 280 80 C 360 90, 450 60, 550 30"
                fill="transparent"
                stroke="#007C74"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Dots */}
              <circle cx="50" cy="170" r="5" fill="#007C74" stroke="white" strokeWidth="1.5" />
              <circle cx="150" cy="145" r="5" fill="#007C74" stroke="white" strokeWidth="1.5" />
              <circle cx="280" cy="80" r="5" fill="#007C74" stroke="white" strokeWidth="1.5" />
              <circle cx="410" cy="75" r="5" fill="#3C55A5" stroke="white" strokeWidth="1.5" />
              <circle cx="550" cy="30" r="5" fill="#007C74" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          {/* Chart Legend */}
          <div className="flex justify-between items-center text-[10px] uppercase font-extrabold text-neutral-400 px-4">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold tracking-wide text-neutral-900 dark:text-white">Live Stream Feed</h3>
          <div className="space-y-4">
            <div className="flex gap-3 text-xs">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0 animate-ping" />
              <div>
                <p className="font-bold text-neutral-800 dark:text-white">New subscriber registered</p>
                <p className="text-[10px] text-neutral-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-neutral-800 dark:text-white">ORD-9482 status changed</p>
                <p className="text-[10px] text-neutral-500">12 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="w-2.5 h-2.5 bg-[#007C74] rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-neutral-800 dark:text-white">New product GP-341 created</p>
                <p className="text-[10px] text-neutral-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
