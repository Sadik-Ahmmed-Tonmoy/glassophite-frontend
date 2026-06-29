"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, AlertCircle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const shippingPillars = [
  {
    icon: Truck,
    title: "Dhaka Home Delivery",
    translateTitleKey: "shipping.dhaka_title",
    description: "Enjoy complimentary home delivery inside Dhaka metropolitan areas within 24 to 48 hours. Orders placed before 12:00 PM are often delivered the same day.",
    translateDescKey: "shipping.dhaka_desc",
  },
  {
    icon: Truck,
    title: "Outside Dhaka Shipping",
    translateTitleKey: "shipping.outside_title",
    description: "Delivered via premium local couriers (Pathao, Steadfast) within 3 to 5 business days. Flat courier rate of 120 BDT nationwide.",
    translateDescKey: "shipping.outside_desc",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns Window",
    translateTitleKey: "shipping.return_title",
    description: "Exchange or return your unused frames in their original condition within 7 days of receiving them. Original case and tags must remain intact.",
    translateDescKey: "shipping.return_desc",
  },
];

export default function ShippingReturnsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="shipping.title">Shipping & Returns Policy</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="shipping.subtitle">
            Understand our shipping timelines, delivery costs, open-box verification, and exchange steps.
          </p>
        </div>

        {/* Pillars Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {shippingPillars.map((p, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-panel p-6 rounded-xl space-y-3 hover:border-[#007C74]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit group-hover:scale-105 transition-transform duration-300">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white" data-translate={p.translateTitleKey}>
                {p.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate={p.translateDescKey}>
                {p.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-8 pt-4">
          
          {/* Detailed Delivery Policy */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#007C74]" />
              <span data-translate="shipping.sec1_title">Detailed Shipping Information</span>
            </h2>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p data-translate="shipping.sec1_p1">
                At Glassophite, we believe that premium eyewear deserves premium delivery. All packages are packaged inside a rigid, impact-resistant signature box to ensure your frames reach you in pristine, scratch-free condition.
              </p>
              <h3 className="font-bold text-neutral-900 dark:text-white pt-2" data-translate="shipping.sec1_sub1">Open-Box Verification (Dhaka Only)</h3>
              <p data-translate="shipping.sec1_p2">
                For complete reassurance, we offer open-box deliveries within Dhaka. When the package is delivered to your doorstep, you are encouraged to open it and check the frame size, color, and build quality in front of the delivery executive. If there is any discrepancy, you may hand the package back on the spot with zero cancellation fees.
              </p>
              <h3 className="font-bold text-neutral-900 dark:text-white pt-2" data-translate="shipping.sec1_sub2">Nationwide Couriers</h3>
              <p data-translate="shipping.sec1_p3">
                Deliveries outside Dhaka are shipped via pathao courier services or stead-fast logistics. Once handed over, a tracking URL is texted to you. Full cash-on-delivery is supported nationwide.
              </p>
            </div>
          </div>

          {/* Return & Refund Policy */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#007C74]" />
              <span data-translate="shipping.sec2_title">Returns & Exchanges Policy</span>
            </h2>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p data-translate="shipping.sec2_p1">
                If your frame does not fit your face perfectly or you would like to swap colors, you can request an exchange within 7 calendar days of receipt.
              </p>
              <h3 className="font-bold text-neutral-900 dark:text-white pt-2" data-translate="shipping.sec2_sub1">Exemption for Customized Prescription Lenses</h3>
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-xs" data-translate="shipping.exemption_alert">
                  <strong>Important Notice:</strong> Prescription optical lenses are customized specifically to your focal metrics and cannot be reused. Therefore, while frames can be returned/exchanged, the cost of custom-mounted prescription lenses is non-refundable.
                </p>
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white pt-2" data-translate="shipping.sec2_sub2">How to Request a Return</h3>
              <p data-translate="shipping.sec2_p2">
                1. Please ensure that the tags, cleaning cloth, designer protective case, and packaging box remain in original condition.
              </p>
              <p data-translate="shipping.sec2_p3">
                2. Contact our help desk via <a href="mailto:support.glassophite@gmail.com" className="text-[#007C74] font-medium hover:underline">support.glassophite@gmail.com</a> with your order reference ID (e.g. GP-10002) and photos of the frame.
              </p>
              <p data-translate="shipping.sec2_p4">
                3. Inside Dhaka, we will schedule a pickup. For outer districts, you can courier the frames back to our Gulshan showroom. Once received, our assembly team will issue your refund or dispatch the replacement.
              </p>
            </div>
          </div>

        </div>

        {/* CTA banner */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#007c74]/15 via-transparent to-[#3c55a5]/10 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#007c74]/15">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white" data-translate="shipping.cta_title">Have an active shipment?</h3>
              <p className="text-xs text-neutral-500 mt-1" data-translate="shipping.cta_desc">
                Check the assembly, quality checking, or shipment dispatch progress of your eyewear.
              </p>
            </div>
          </div>
          <div>
            <Link href="/track-order">
              <button className="px-6 py-3 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg shadow-md hover:shadow-[#007c74]/10 transition-all duration-300 flex items-center gap-2 group cursor-pointer text-xs">
                <span data-translate="shipping.cta_btn">Track Order Progress</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
