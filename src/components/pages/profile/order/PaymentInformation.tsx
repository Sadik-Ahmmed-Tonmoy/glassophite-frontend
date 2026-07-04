"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useProfileTheme } from "@/hooks/useProfileTheme";

interface BillingAddress {
  name: string; street: string; city: string; state: string; zipCode: string; country: string; phone?: string;
}

interface PaymentDetails {
  cardType: string; lastFourDigits: string; expiryDate: string;
}

interface PaymentInformationProps {
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
  shippingAddress: BillingAddress;
}

const paymentLabels: Record<string, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  SSLCO: "SSL Commerz (Card, bKash, Nagad)",
  STRIPE: "Credit/Debit Card",
  CREDIT_CARD: "Credit Card",
  PAYPAL: "PayPal",
};

export default function PaymentInformation({ paymentMethod, paymentDetails, shippingAddress }: PaymentInformationProps) {
  const { isDark, theme: styles } = useProfileTheme();
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({ ...shippingAddress });

  const handleBillingSameToggle = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) setBillingAddress({ ...shippingAddress });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("rounded-2xl border shadow-sm p-4 sm:p-6 transition-all duration-500", styles.card, styles.cardGlow)}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-2 rounded-lg", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
          <CreditCard size={18} className="text-[#007C74]" />
        </div>
        <h3 className={cn("text-base font-semibold", styles.text)}>Payment Information</h3>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={sameAsShipping}
            onCheckedChange={handleBillingSameToggle}
            className={cn(isDark ? "border-white/30 bg-white/5" : "border-gray-300 bg-white", "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#007C74] data-[state=checked]:to-[#3C55A5] data-[state=checked]:border-transparent")}
          />
          <span className={cn("text-sm", styles.textMuted)}>Billing address same as shipping address</span>
        </label>
      </div>

      {!sameAsShipping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={cn("mb-5 p-4 rounded-xl border", isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100")}
        >
          <h4 className={cn("text-sm font-semibold mb-3", styles.text)}>Billing Address</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "name", label: "Full Name", placeholder: "John Doe" },
              { name: "street", label: "Street Address", placeholder: "123 Main St", colSpan: true },
              { name: "city", label: "City", placeholder: "New York" },
              { name: "state", label: "State", placeholder: "NY" },
              { name: "zipCode", label: "ZIP Code", placeholder: "10001" },
              { name: "country", label: "Country", placeholder: "United States" },
            ].map((f) => (
              <div key={f.name} className={f.colSpan ? "sm:col-span-2" : ""}>
                <label className={cn("block text-xs mb-1", styles.label)}>{f.label}</label>
                <input
                  type="text"
                  name={f.name}
                  value={billingAddress[f.name as keyof BillingAddress] || ""}
                  onChange={(e) => setBillingAddress(p => ({ ...p, [f.name]: e.target.value }))}
                  className={cn("w-full px-3 py-2 text-sm rounded-xl outline-none transition-all", "focus:ring-2 focus:ring-[#007C74]/20", isDark ? "bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-neutral-600 focus:border-[#007C74]/50" : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#007C74]/50")}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {paymentDetails ? (
        <div className={cn("rounded-xl p-4 border", isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100")}>
          <div className="flex items-start gap-4">
            <div className={cn("p-2.5 rounded-xl", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
              <CreditCard size={22} className="text-[#007C74]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={cn("font-semibold", styles.text)}>{paymentDetails.cardType}</p>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", isDark ? "bg-white/[0.06] text-neutral-400" : "bg-gray-200 text-gray-600")}>
                  •••• {paymentDetails.lastFourDigits}
                </span>
              </div>
              <p className={cn("text-sm mt-0.5", styles.textMutedLighter)}>Expires {paymentDetails.expiryDate}</p>
              <div className="flex items-center gap-1 mt-1.5 text-xs font-medium text-green-500">
                <Check size={13} /> Payment successful
              </div>
            </div>
          </div>
          <div className={cn("mt-3 pt-3 border-t text-xs", isDark ? "border-white/[0.06] text-neutral-400" : "border-gray-200 text-gray-500")}>
            Billing address: {sameAsShipping ? "Same as shipping" : "Different from shipping"}
          </div>
        </div>
      ) : (
        <div className={cn("p-4 rounded-xl border", isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100")}>
          <p className={cn("font-semibold text-sm", styles.text)}>{paymentLabels[paymentMethod] || paymentMethod}</p>
          <p className={cn("text-xs mt-1", styles.textMutedLighter)}>
            Billing address: {sameAsShipping ? "Same as shipping" : "Different from shipping"}
          </p>
        </div>
      )}

      {!sameAsShipping && (
        <div className={cn("mt-4 p-4 rounded-xl border text-sm", isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100")}>
          <h4 className={cn("text-sm font-semibold mb-2", styles.text)}>Billing Address</h4>
          <div className={cn("space-y-0.5", styles.textMuted)}>
            <p className="font-medium">{billingAddress.name}</p>
            <p>{billingAddress.street}</p>
            <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
            <p>{billingAddress.country}</p>
            {billingAddress.phone && <p className="mt-1">{billingAddress.phone}</p>}
          </div>
        </div>
      )}
    </motion.div>
  );
}