"use client";

import { useProfileTheme } from "@/hooks/useProfileTheme";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CreditCard } from "lucide-react";

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
  PIPRAPAY: "PipraPay",
  SSLCO: "SSL Commerz (Card, bKash, Nagad)",
  STRIPE: "Credit/Debit Card",
  CREDIT_CARD: "Credit Card",
  PAYPAL: "PayPal",
};

export default function PaymentInformation({ paymentMethod, paymentDetails }: PaymentInformationProps) {
  const { isDark, theme: styles } = useProfileTheme();

  
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

 

   

      {paymentDetails ? (
        <div className={cn("rounded-xl p-4 border", isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100")}>
          <div className="flex items-start gap-4">
            <div className={cn("p-2.5 rounded-xl", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
              <CreditCard size={22} className="text-[#007C74]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={cn("font-semibold", styles.text)}>{paymentDetails.cardType}</p>
                {paymentDetails.lastFourDigits && (
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", isDark ? "bg-white/[0.06] text-neutral-400" : "bg-gray-200 text-gray-600")}>
                    •••• {paymentDetails.lastFourDigits}
                  </span>
                )}
              </div>
              {paymentDetails.expiryDate && (
                <p className={cn("text-sm mt-0.5", styles.textMutedLighter)}>Expires {paymentDetails.expiryDate}</p>
              )}
              <div className="flex items-center gap-1 mt-1.5 text-xs font-medium text-green-500">
                <Check size={13} /> Payment successful
              </div>
            </div>
          </div>
          <div className={cn("mt-3 pt-3 border-t text-xs", isDark ? "border-white/[0.06] text-neutral-400" : "border-gray-200 text-gray-500")}>
            Billing address: Same as shipping
          </div>
        </div>
      ) : (
        <div className={cn("p-4 rounded-xl border", isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100")}>
          <p className={cn("font-semibold text-sm", styles.text)}>{paymentLabels[paymentMethod] || paymentMethod}</p>
          <p className={cn("text-xs mt-1", styles.textMutedLighter)}>
            Billing address: Same as shipping
          </p>
        </div>
      )}

    
    </motion.div>
  );
}