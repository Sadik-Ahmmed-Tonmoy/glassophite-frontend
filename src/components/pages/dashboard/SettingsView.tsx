"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsView() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);
  const [tryOnModelEnabled, setTryOnModelEnabled] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl space-y-6"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Store Settings</h1>
        <p className="text-xs text-neutral-500">Configure global parameters and options.</p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-6">
        
        {/* Try On Toggler */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Try-On Model Meshes</h3>
            <p className="text-xs text-neutral-500">Enable or disable 3D face alignment previews for catalog pages.</p>
          </div>
          <button 
            onClick={() => {
              setTryOnModelEnabled(!tryOnModelEnabled);
              toast.success(`Try-On Model ${!tryOnModelEnabled ? "Enabled" : "Disabled"}`);
            }}
            className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
              tryOnModelEnabled ? "bg-[#007C74]" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <motion.div 
              layout 
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={{ x: tryOnModelEnabled ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Maintenance Mode Toggler */}
        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Storefront Maintenance</h3>
            <p className="text-xs text-neutral-500">Redirect users to a temporary maintenance page during database tasks.</p>
          </div>
          <button 
            onClick={() => {
              setMaintenanceMode(!maintenanceMode);
              toast.info(`Maintenance Mode ${!maintenanceMode ? "Enabled" : "Disabled"}`);
            }}
            className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
              maintenanceMode ? "bg-[#007C74]" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          >
            <motion.div 
              layout 
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={{ x: maintenanceMode ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Shipping Limit Threshold Slider */}
        <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <div className="flex justify-between items-center text-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Free Shipping Threshold</h3>
            <span className="font-extrabold text-[#007C74]">৳{freeShippingThreshold} BDT</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
            className="w-full accent-[#007C74] h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-neutral-500">Free delivery threshold triggers inside cart summary sheets automatically.</p>
        </div>


      </div>
    </motion.div>
  );
}
