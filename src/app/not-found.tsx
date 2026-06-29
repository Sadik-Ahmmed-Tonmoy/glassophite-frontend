"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-500">
      
      {/* Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-8 glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden border border-[#007C74]/20 shadow-2xl"
      >
        {/* Glow elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#007C74]/15 to-transparent blur-2xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#3C55A5]/15 to-transparent blur-2xl rounded-full" />

        {/* Logo/Icon */}
        <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-250 dark:border-neutral-800 text-[#007C74] animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* 404 Text */}
        <div className="space-y-2 relative z-10">
          <h1 className="text-7xl font-black tracking-widest bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white uppercase tracking-wider">
            Page Out of Frame
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
            The page you are looking for has either been moved, deleted, or was never in fashion.
          </p>
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-24 bg-gradient-to-r from-[#007C74] to-[#3C55A5] mx-auto opacity-40 relative z-10" />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
          <Link href="/">
            <button className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-neutral-250 dark:border-neutral-800 cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </button>
          </Link>

          <Link href="/product-filter">
            <button className="w-full sm:w-auto px-5 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md hover:shadow-[#007c74]/10 cursor-pointer group">
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>

      </motion.div>

    </div>
  );
}
