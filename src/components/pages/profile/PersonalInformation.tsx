"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Edit2, X, User, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormDatePickerAceternity from "@/components/ui/MyForm/MyFormDatePickerAceternity/MyFormDatePickerAceternity";
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import { fadeInUp } from "@/lib/profileAnimations";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  dateOfBirth: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export default function PersonalInformation() {
  const { isDark, theme: styles } = useProfileTheme();
  const [isEditing, setIsEditing] = useState(false);
  const { data: meData, isLoading: isMeLoading, isFetching: isMeFetching } = useGetMeQuery(undefined);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const user = meData?.data || meData;

  const [formData, setFormData] = useState<PersonalInfoValues>({
    fullName: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  }, [user]);

  if (isMeLoading || isMeFetching) {
    return (
      <div className={cn("rounded-2xl border shadow-sm p-6 animate-pulse", styles.card)}>
        <div className={cn("h-6 rounded w-1/3 mb-6", styles.skeleton)}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className={cn("h-4 rounded w-1/3", styles.skeleton)}></div>
              <div className={cn("h-5 rounded w-2/3", styles.skeleton)}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: PersonalInfoValues) => {
    try {
      await updateMe({
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth || undefined,
      }).unwrap();
      toast.success("Personal information updated");
      setFormData(data);
      setIsEditing(false);
    } catch {
      toast.error("Failed to update");
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.05, type: "spring", stiffness: 100 },
    }),
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
            <User size={18} className="text-[#007C74]" />
          </div>
          <h2 className={cn("text-lg font-semibold", styles.text)}>Personal Information</h2>
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
              resolver={zodResolver(personalInfoSchema)}
              defaultValues={formData}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <MyFormInputAceternity name="fullName" label="Full Name" placeholder="Enter your full name" />
                <MyFormInputAceternity name="email" label="Email Address" placeholder="Enter your email" type="email" disabled />
                <MyFormDatePickerAceternity name="dateOfBirth" label="Date of Birth" placeholder="yyyy-mm-dd" />
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: "Full Name", value: formData.fullName || "Not set", icon: User, key: "fullName" },
              { label: "Email Address", value: formData.email, icon: Mail, key: "email" },
              {
                label: "Date of Birth",
                value: formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : "Not provided",
                icon: Calendar,
                key: "dateOfBirth",
              },
            ].map((field, index) => (
              <motion.div
                key={field.key}
                custom={index}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className={cn("p-4 rounded-xl border", isDark ? "border-white/[0.04] bg-white/[0.02]" : "border-gray-100 bg-gray-50/50")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <field.icon size={14} className="text-[#007C74]" />
                  <p className={cn("text-xs font-medium uppercase tracking-wider", styles.label)}>{field.label}</p>
                </div>
                <p className={cn("text-base font-medium", styles.text)}>{field.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
