/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  HelpCircle, 
  Truck, 
  RefreshCcw, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  MessageCircle,
  CreditCard,
  Package,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { useGetFAQsQuery } from "@/redux/features/faq/faqApi";

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("shipping") || cat.includes("deliver")) return Truck;
  if (cat.includes("return") || cat.includes("refund") || cat.includes("exchange")) return RefreshCcw;
  if (cat.includes("try") || cat.includes("size") || cat.includes("camera") || cat.includes("fit")) return Sparkles;
  if (cat.includes("care") || cat.includes("warranty") || cat.includes("safety") || cat.includes("protect")) return ShieldAlert;
  if (cat.includes("payment") || cat.includes("price") || cat.includes("bill") || cat.includes("pay")) return CreditCard;
  if (cat.includes("product") || cat.includes("glass") || cat.includes("frame")) return Package;
  return HelpCircle;
};

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: dbFAQsData, isLoading } = useGetFAQsQuery({ status: "Active" });

  const rawFAQs = dbFAQsData?.data || [];

  // Group FAQs by category dynamically
  const categoriesMap: Record<string, { id: string; title: string; icon: any; items: any[] }> = {};
  
  rawFAQs.forEach((faq: any) => {
    const cat = faq.category || "General";
    const catId = cat.toLowerCase().replace(/\s+/g, "-");
    
    if (!categoriesMap[catId]) {
      categoriesMap[catId] = {
        id: catId,
        title: cat,
        icon: getCategoryIcon(cat),
        items: [],
      };
    }
    
    categoriesMap[catId].items.push({
      id: faq.id,
      q: faq.question,
      a: faq.answer,
    });
  });
  
  const faqCategories = Object.values(categoriesMap);

  // Filter FAQs based on query
  const filteredFaqs = faqCategories
    .map((category) => {
      const items = category.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...category, items };
    })
    .filter((category) => category.items.length > 0);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#007C74]" />
          <p className="text-sm text-neutral-500 font-medium" data-translate="faq.loading">Loading Help Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-12">
      <div className="container mx-auto px-4 md:px-6 space-y-12 max-w-4xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="faq.title">Help Center & FAQs</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="faq.subtitle">
            Find quick answers to queries regarding shipments, returns, virtual camera fittings, and care instructions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800/80 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#007C74] shadow-md transition-all duration-300"
          />
        </div>

        {/* FAQs List */}
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((category) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel p-6 rounded-2xl space-y-4"
                  >
                    <div className="flex items-center gap-3 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3 text-[#007C74]">
                      <IconComponent className="w-5 h-5" />
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                        {category.title}
                      </h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item) => (
                        <AccordionItem key={item.id} value={item.id} className="border-b border-neutral-200/30 dark:border-neutral-800/30 last:border-b-0">
                          <AccordionTrigger className="text-left font-semibold text-neutral-800 dark:text-neutral-200 hover:no-underline hover:text-[#007C74] dark:hover:text-[#007C74]">
                            <span>{item.q}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm pt-1 pb-4">
                            <span>{item.a}</span>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 glass-panel rounded-2xl space-y-4"
              >
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit mx-auto text-neutral-400 dark:text-neutral-500">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="faq.no_results_title">No matching questions found</h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto" data-translate="faq.no_results_desc">
                  Try searching for general keywords like &quot;shipping&quot;, &quot;return&quot;, &quot;warranty&quot;, or contact support.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#007c74]/15 via-transparent to-[#3c55a5]/10 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#007c74]/15">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74] hidden md:block">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white" data-translate="faq.support_title">Still have questions?</h3>
              <p className="text-sm text-neutral-500 mt-1" data-translate="faq.support_desc">
                If you couldn&apos;t find the answers in our help portal, speak to our care executives.
              </p>
            </div>
          </div>
          <div>
            <Link href="/contact">
              <button className="px-6 py-3 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg shadow-md hover:shadow-[#007c74]/10 transition-all duration-300 flex items-center gap-2 group cursor-pointer text-sm">
                <span data-translate="faq.support_btn">Contact Support</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
