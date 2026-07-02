"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Save, Edit, Phone, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";

const contactInfoSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.object({
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(4, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
  }),
});

type ContactInfoValues = z.infer<typeof contactInfoSchema>;

export default function ContactInformation() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const { data: meData } = useGetMeQuery(undefined);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const user = meData?.data || meData;

  const [formData, setFormData] = useState<ContactInfoValues>({
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        phoneNumber: user.phoneNumber || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      label: "text-neutral-300",
      icon: "text-neutral-400",
      editButton: "bg-white/10 text-white hover:bg-white/20",
      cancelButton: "bg-white/10 text-white hover:bg-white/20",
      saveButton: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white",
    },
    light: {
      card: "bg-white border-neutral-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      label: "text-gray-700",
      icon: "text-gray-500",
      editButton: "bg-primary/10 text-primary hover:bg-primary/20",
      cancelButton: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      saveButton: "bg-primary text-white hover:bg-primary/90",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const handleSubmit = async (data: ContactInfoValues) => {
    try {
      await updateMe({
        phoneNumber: data.phoneNumber,
        address: data.address,
      }).unwrap();
      toast.success("Contact information updated");
      setFormData(data);
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-xl border shadow-sm p-6 transition-colors duration-500",
        styles.card
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn("text-lg font-semibold", styles.text)}>Contact Information</h2>
        <motion.button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors",
            isEditing ? styles.cancelButton : styles.editButton
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEditing ? (
            <><X size={16} className="mr-1.5" /> Cancel</>
          ) : (
            <><Edit size={16} className="mr-1.5" /> Edit</>
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <MyFormWrapper
              onSubmit={handleSubmit}
              resolver={zodResolver(contactInfoSchema)}
              defaultValues={formData}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center mb-4">
                  <Phone size={18} className={cn("mr-2", styles.icon)} />
                  <h3 className={cn("text-md font-medium", styles.textMuted)}>Phone Number</h3>
                </div>
                <MyFormInputAceternity
                  name="phoneNumber"
                  label=""
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <MapPin size={18} className={cn("mr-2", styles.icon)} />
                  <h3 className={cn("text-md font-medium", styles.textMuted)}>Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <MyFormInputAceternity
                      name="address.street"
                      label="Street Address"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <MyFormInputAceternity
                    name="address.city"
                    label="City"
                    placeholder="New York"
                  />
                  <MyFormInputAceternity
                    name="address.state"
                    label="State / Province"
                    placeholder="NY"
                  />
                  <MyFormInputAceternity
                    name="address.zipCode"
                    label="ZIP / Postal Code"
                    placeholder="10001"
                  />
                  <MyFormInputAceternity
                    name="address.country"
                    label="Country"
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "inline-flex items-center px-4 py-2 rounded-md transition-colors",
                    styles.saveButton,
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Save size={16} className="mr-1.5" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </MyFormWrapper>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center mb-4">
                <Phone size={18} className={cn("mr-2", styles.icon)} />
                <h3 className={cn("text-md font-medium", styles.textMuted)}>Phone Number</h3>
              </div>
              <p className={cn("text-base", styles.text)}>{formData.phoneNumber || "Not provided"}</p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <MapPin size={18} className={cn("mr-2", styles.icon)} />
                <h3 className={cn("text-md font-medium", styles.textMuted)}>Address</h3>
              </div>
              <div className={cn("text-base", styles.text)}>
                {formData.address.street ? (
                  <>
                    <p>{formData.address.street}</p>
                    <p>{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
                    <p>{formData.address.country}</p>
                  </>
                ) : (
                  <p>Not provided</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
