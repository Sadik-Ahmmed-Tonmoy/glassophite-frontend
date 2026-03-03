"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CreditCard, CreditCardIcon, CheckIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface BillingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface PaymentDetails {
  cardType: string;
  lastFourDigits: string;
  expiryDate: string;
}

interface PaymentInformationProps {
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
}

export default function PaymentInformation({
  paymentMethod,
  paymentDetails,
  shippingAddress,
}: PaymentInformationProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: shippingAddress.name,
    street: shippingAddress.street,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zipCode: shippingAddress.zipCode,
    country: shippingAddress.country,
    phone: shippingAddress.phone,
  });

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-black border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      icon: "text-primary",
      bgMuted: "bg-white/5",
      badge: "bg-white/10 text-neutral-400",
      success: "text-green-400",
      checkbox: "border-white/30 bg-white/5 data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    },
    light: {
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      input: "bg-white border-gray-300 text-gray-900",
      label: "text-gray-700",
      icon: "text-primary",
      bgMuted: "bg-gray-50",
      badge: "bg-gray-200 text-gray-700",
      success: "text-green-600",
      checkbox: "border-gray-300 bg-white data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Handle billing address change
  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle billing address same as shipping toggle
  const handleBillingAddressSameAsShipping = (checked: boolean) => {
    setBillingAddressSameAsShipping(checked);
    if (checked) {
      setBillingAddress({
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("rounded-xl border shadow-sm p-4 sm:p-6 transition-colors duration-500", styles.card)}
    >
      <div className="flex items-center mb-4">
        <CreditCard size={20} className={cn("mr-2", styles.icon)} />
        <h3 className={cn("text-lg font-medium", styles.text)} data-translate="payment.title">
          Payment Information
        </h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Checkbox
            id="billing-same-as-shipping"
            checked={billingAddressSameAsShipping}
            onCheckedChange={handleBillingAddressSameAsShipping}
            className={styles.checkbox}
          />
          <label htmlFor="billing-same-as-shipping" className={cn("ml-2 text-sm", styles.textMuted)} data-translate="payment.billingSameAsShipping">
            Billing address same as shipping address
          </label>
        </div>
      </div>

      {!billingAddressSameAsShipping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("mb-6 p-4 rounded-lg", styles.bgMuted)}
        >
          <h4 className={cn("text-sm font-medium mb-3", styles.text)} data-translate="payment.billingAddressTitle">
            Billing Address
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "billing-name", name: "name", label: "Full Name", value: billingAddress.name, placeholder: "John Doe" },
              { id: "billing-street", name: "street", label: "Street Address", value: billingAddress.street, placeholder: "123 Main St", colSpan: true },
              { id: "billing-city", name: "city", label: "City", value: billingAddress.city, placeholder: "New York" },
              { id: "billing-state", name: "state", label: "State / Province", value: billingAddress.state, placeholder: "NY" },
              { id: "billing-zipCode", name: "zipCode", label: "ZIP / Postal Code", value: billingAddress.zipCode, placeholder: "10001" },
              { id: "billing-country", name: "country", label: "Country", value: billingAddress.country, placeholder: "United States" },
            ].map((field) => (
              <div key={field.id} className={field.colSpan ? "sm:col-span-2" : ""}>
                <label htmlFor={field.id} className={cn("block text-xs mb-1", styles.label)} data-translate={`payment.billing.${field.name}`}>
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  onChange={handleBillingAddressChange}
                  className={cn("w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors", styles.input)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {paymentDetails ? (
        <div className={cn("rounded-lg p-4 border", styles.bgMuted, styles.border)}>
          <div className="flex items-start">
            <div className={cn("mr-4 p-2 rounded-md", isDark ? "bg-primary/20" : "bg-primary/10")}>
              <CreditCardIcon size={24} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center">
                <p className={cn("font-medium", styles.text)}>{paymentDetails.cardType}</p>
                <span className={cn("ml-2 px-2 py-0.5 rounded-full text-xs", styles.badge)}>
                  •••• {paymentDetails.lastFourDigits}
                </span>
              </div>
              <p className={cn("text-sm mt-1", styles.textMutedLighter)}>
                <span data-translate="payment.expires">Expires</span> {paymentDetails.expiryDate}
              </p>
              <div className="flex items-center mt-2 text-xs">
                <CheckIcon size={14} className={cn("mr-1", styles.success)} />
                <span className={styles.success} data-translate="payment.successful">Payment successful</span>
              </div>
            </div>
          </div>
          <div className={cn("mt-3 pt-3 border-t", styles.border)}>
            <p className={cn("text-sm", styles.textMuted)} data-translate="payment.billingAddressStatus">
              Billing address: {billingAddressSameAsShipping ? "Same as shipping address" : "Different from shipping address"}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.text}>
          <p className="font-medium">{paymentMethod}</p>
          <p className="mt-2">
            <span data-translate="payment.billingAddressStatus">Billing address:</span>{" "}
            {billingAddressSameAsShipping ? "Same as shipping address" : "Different from shipping address"}
          </p>
        </div>
      )}

      {!billingAddressSameAsShipping && (
        <div className={cn("mt-4 p-4 rounded-lg border", styles.bgMuted, styles.border)}>
          <h4 className={cn("text-sm font-medium mb-2", styles.text)} data-translate="payment.billingAddressTitle">
            Billing Address
          </h4>
          <div className={cn("text-sm", styles.textMuted)}>
            <p>{billingAddress.name}</p>
            <p>{billingAddress.street}</p>
            <p>
              {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
            </p>
            <p>{billingAddress.country}</p>
            {billingAddress.phone && <p className="mt-1">{billingAddress.phone}</p>}
          </div>
        </div>
      )}
    </motion.div>
  );
}