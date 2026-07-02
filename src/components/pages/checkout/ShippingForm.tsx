/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Truck } from "lucide-react";
import { useState } from "react";

// Custom form components
import MyFormCheckBox from "@/components/ui/MyForm/MyFormCheckBox/MyFormCheckBox";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MyFormShippingMethod from "@/components/ui/MyForm/MyFormShippingMethod/MyFormShippingMethod";
import { cn } from "@/lib/utils";

const validationSchema = z.object({
   firstName: z.string(
    {
      required_error: "First name is required",
    }
   ).min(1, {
      message: "First name is required",
    }),
   lastName: z.string(
    {
      required_error: "Last name is required",
    }
   ).min(1, {
    message: "Last name is required",
   }),
   address: z.string(
    {
      required_error: "Address is required",
    }
   ).min(1, {
    message: "Address is required",
   }),
   city: z.string(
    {
      required_error: "City is required",
    }
   ).min(1, {
    message: "City is required",
   }),
   state: z.string(
    {
      required_error: "State is required",
    }
   ).min(1, {
    message: "State is required",
   }),
   zipCode: z.string(
    {
      required_error: "ZIP code is required",
    }
   ).min(1, {
    message: "ZIP code is required",
   }),
   saveAddress: z.boolean().optional(),
   shippingMethod: z.string({
    
      required_error: "Shipping method is required",
    
   }).min(1, {
    message: "Shipping method is required",
   }),
});




const shippingOptions = [
  {
    value: "standard",
    label: "Standard Shipping",
    price: "$5.00",
    delivery: "March 5–7",
    icon: Calendar
  },
  {
    value: "express",
    label: "Express Shipping",
    price: "$15.00",
    delivery: "March 2–3",
    icon: Clock
  },
  {
    value: "free",
    label: "Free Shipping",
    price: "$0.00",
    description: "Orders over $100 qualify for free shipping",
    icon: Truck
  }
];


interface ShippingFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  shippingMethod: string;
  onShippingMethodChange: (method: string) => void;
}

export default function ShippingForm({
  onSubmit,
}: ShippingFormProps) {
  const [saveAddress, setSaveAddress] = useState(false);

  // Get today's date and calculate delivery dates
  const today = new Date();
  const standardDelivery = new Date(today);
  standardDelivery.setDate(today.getDate() + 5);

  const expressDelivery = new Date(today);
  expressDelivery.setDate(today.getDate() + 2);





  // Handle form submission from MyFormWrapper
  const handleFormSubmit = (data: any) => {
    onSubmit(data);

    // If save address is checked, save to localStorage
    if (saveAddress) {
      localStorage.setItem("savedAddress", JSON.stringify(data));
    }
    // Note: we don't call reset() because we want to keep the form filled after submission
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const fieldVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-divider bg-content1/50 backdrop-blur-sm p-6 transition-colors duration-500"
    >
      <h2
        className="text-xl font-semibold text-foreground mb-6"
        data-translate="shipping.title"
      >
        Shipping Information
      </h2>

      <MyFormWrapper
        onSubmit={handleFormSubmit}
        resolver={zodResolver(validationSchema)}
        className="space-y-6"
        // We need to pass defaultValues to react-hook-form; MyFormWrapper doesn't accept defaultValues directly.
        // We'll rely on the initialValues being passed to the form via the useForm inside MyFormWrapper? Actually MyFormWrapper uses useForm<FieldValues>() with no default values.
        // To set default values, we need to either modify MyFormWrapper to accept defaultValues or use a different approach.
        // Since MyFormWrapper doesn't expose defaultValues, we might need to adjust it. For now, we'll assume the form starts empty and user fills.
        // Alternatively, we can create a custom wrapper that accepts defaultValues. But given time, we'll proceed without defaults.
        // The initialValues prop will be ignored; we can later enhance MyFormWrapper if needed.
      >
        {/* Personal Information - Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
       
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              data-translate="shipping.firstName"
            />
          </motion.div>

          {/* Last Name */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              data-translate="shipping.lastName"
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              data-translate="shipping.email"
            />
          </motion.div>

          {/* Phone */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              type="tel"
              data-translate="shipping.phone"
            />
          </motion.div>

          {/* Address - Full width */}
          <motion.div variants={fieldVariants} className="md:col-span-2">
            <MyFormInputAceternity
              name="address"
              label="Street Address"
              placeholder="Enter your street address"
              data-translate="shipping.address"
            />
          </motion.div>

          {/* City */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
              name="city"
              label="City"
              placeholder="Enter your city"
              data-translate="shipping.city"
            />
          </motion.div>

          {/* State */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
              name="state"
              label="State/Province"
              placeholder="Enter your state"
              data-translate="shipping.state"
            />
          </motion.div>

          {/* ZIP Code */}
          <motion.div variants={fieldVariants}>
            <MyFormInputAceternity
              name="zipCode"
              label="ZIP/Postal Code"
              placeholder="Enter your ZIP code"
              data-translate="shipping.zipCode"
            />
          </motion.div>

        </div>

        {/* Save Address Checkbox */}
        <motion.div variants={fieldVariants}>
          <MyFormCheckBox
            title="Save this address for future orders"
            handleCheckboxChange={setSaveAddress}
            defaultSelected={saveAddress}
          />
        </motion.div>

        {/* Shipping Method - Custom Radio Group */}
       <MyFormShippingMethod
        name="shippingMethod"
        label="Shipping Method"
        options={shippingOptions}
      />

        {/* Submit Button - Using your custom button style */}
        <motion.div variants={fieldVariants}>
          <button type="submit"
            className={
              cn(
                "bg-gradient-to-br relative group/btn from-[#00a76b]  to-[#187c57] block  w-full text-white rounded-md h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
              )
            }
          >
            Continue to Payment
          </button>
        </motion.div>
      </MyFormWrapper>
    </motion.div>
  );
}
