"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Save, Edit, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormDatePickerAceternity from "@/components/ui/MyForm/MyFormDatePickerAceternity/MyFormDatePickerAceternity";
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  dateOfBirth: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export default function PersonalInformation() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const { data: meData, isLoading: isMeLoading, isFetching: isMeFetching } = useGetMeQuery(undefined);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const user = meData?.data || meData;

  const [formData, setFormData] = useState<PersonalInfoValues>({
    fullName: "",
    email: "",
    dateOfBirth: "",
  });

  const themeStyles = {
    dark: {
      card: "bg-white/5 border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      label: "text-neutral-300",
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
      editButton: "bg-primary/10 text-primary hover:bg-primary/20",
      cancelButton: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      saveButton: "bg-primary text-white hover:bg-primary/90",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

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
      <div className={cn("rounded-xl border shadow-sm p-6 animate-pulse", styles.card)}>
        <div className="h-6 bg-neutral-300 dark:bg-neutral-800 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
          </div>
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

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, type: "spring" as const, stiffness: 100 },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-xl border shadow-sm p-6 transition-colors duration-500",
        styles.card,
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn("text-lg font-semibold", styles.text)}>Personal Information</h2>
        <motion.button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors",
            isEditing ? styles.cancelButton : styles.editButton,
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
              resolver={zodResolver(personalInfoSchema)}
              defaultValues={formData}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MyFormInputAceternity
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                />
                <MyFormInputAceternity
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  disabled
                />
                <MyFormDatePickerAceternity
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="yyyy-mm-dd"
                />
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: "Full Name", value: formData.fullName || "Not set", key: "fullName" },
              { label: "Email Address", value: formData.email, key: "email" },
              {
                label: "Date of Birth",
                value: formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toLocaleDateString()
                  : "Not provided",
                key: "dateOfBirth",
              },
            ].map((field, index) => (
              <motion.div
                key={field.key}
                custom={index}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <p className={cn("text-sm font-medium mb-1", styles.label)}>{field.label}</p>
                <p className={cn("text-base", styles.text)}>{field.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
