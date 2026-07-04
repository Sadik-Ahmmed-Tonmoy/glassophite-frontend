"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Edit2, X, Phone, MapPin, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { fadeInUp } from "@/lib/profileAnimations";

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
  const { isDark, theme: styles } = useProfileTheme();
  const [isEditing, setIsEditing] = useState(false);
  const { data: meData, isLoading: isMeLoading, isFetching: isMeFetching } = useGetMeQuery(undefined);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const user = meData?.data || meData;

  const [formData, setFormData] = useState<ContactInfoValues>({
    phoneNumber: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
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

  if (isMeLoading || isMeFetching) {
    return (
      <div className={cn("rounded-2xl border shadow-sm p-6 animate-pulse", styles.card)}>
        <div className={cn("h-6 rounded w-1/3 mb-6", styles.skeleton)}></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="space-y-2">
              <div className={cn("h-4 rounded w-1/4", styles.skeleton)}></div>
              <div className={cn("h-5 rounded w-1/2", styles.skeleton)}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: ContactInfoValues) => {
    try {
      await updateMe({ phoneNumber: data.phoneNumber, address: data.address }).unwrap();
      toast.success("Contact information updated");
      setFormData(data);
      setIsEditing(false);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl border shadow-sm p-6 transition-all duration-500 hover:shadow-md", styles.card, styles.cardGlow)}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-2 rounded-lg", isDark ? "bg-white/[0.06]" : "bg-primary/5")}>
            <MapPin size={18} className="text-[#007C74]" />
          </div>
          <h2 className={cn("text-lg font-semibold", styles.text)}>Contact Information</h2>
        </div>
        <motion.button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
            isEditing
              ? cn(isDark ? "bg-white/[0.06] text-white hover:bg-white/[0.10]" : "bg-gray-100 text-gray-700 hover:bg-gray-200")
              : cn(isDark ? "bg-[#007C74]/15 text-[#007C74] hover:bg-[#007C74]/25" : "bg-[#007C74]/10 text-[#007C74] hover:bg-[#007C74]/20")
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isEditing ? <X size={15} /> : <Edit2 size={15} />}
          {isEditing ? "Cancel" : "Edit"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <MyFormWrapper
              onSubmit={handleSubmit}
              resolver={zodResolver(contactInfoSchema)}
              defaultValues={formData}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Phone size={16} className="text-[#007C74]" />
                  <h3 className={cn("text-sm font-medium", styles.textMuted)}>Phone Number</h3>
                </div>
                <MyFormInputAceternity name="phoneNumber" label="" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Home size={16} className="text-[#007C74]" />
                  <h3 className={cn("text-sm font-medium", styles.textMuted)}>Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <MyFormInputAceternity name="address.street" label="Street Address" placeholder="123 Main Street" />
                  </div>
                  <MyFormInputAceternity name="address.city" label="City" placeholder="New York" />
                  <MyFormInputAceternity name="address.state" label="State / Province" placeholder="NY" />
                  <MyFormInputAceternity name="address.zipCode" label="ZIP / Postal Code" placeholder="10001" />
                  <MyFormInputAceternity name="address.country" label="Country" placeholder="United States" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all",
                    styles.buttonPrimary,
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Save size={16} />
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
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className={cn("p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
              <div className="flex items-center gap-2 mb-2">
                <Phone size={14} className="text-[#007C74]" />
                <p className={cn("text-xs font-medium uppercase tracking-wider", styles.label)}>Phone Number</p>
              </div>
              <p className={cn("text-base font-medium", styles.text)}>{formData.phoneNumber || "Not provided"}</p>
            </div>

            <div className={cn("p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-[#007C74]" />
                <p className={cn("text-xs font-medium uppercase tracking-wider", styles.label)}>Address</p>
              </div>
              <div className={cn("text-base", styles.text)}>
                {formData.address.street ? (
                  <>
                    <p className="font-medium">{formData.address.street}</p>
                    <p className={styles.textMutedLighter}>{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
                    <p className={styles.textMutedLighter}>{formData.address.country}</p>
                  </>
                ) : (
                  <p className={styles.textMutedLighter}>Not provided</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
