"use client";

import type React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileTheme } from "@/hooks/useProfileTheme";

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface AddressDisplayProps {
  title: string;
  address: Address;
  icon?: React.ReactNode;
}

export default function AddressDisplay({
  title,
  address,
  icon = <MapPin size={20} className="text-[#007C74]" />,
}: AddressDisplayProps) {
  const { theme: styles } = useProfileTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("rounded-2xl border shadow-sm p-4 sm:p-6 transition-all duration-500", styles.card, styles.cardGlow)}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-[#007C74]">{icon}</div>}
        <h3 className={cn("text-base font-semibold", styles.text)}>{title}</h3>
      </div>
      <div className={cn("space-y-0.5 text-sm leading-relaxed", styles.textMuted)}>
        <p className="font-semibold">{address.name}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2">{address.phone}</p>}
      </div>
    </motion.div>
  );
}