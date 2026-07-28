"use client";

import React, { useState, useMemo } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Controller, useFormContext } from "react-hook-form";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import { cn } from "@/lib/utils";

const DEFAULT_FORM_VALUES = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// Custom Textarea with Aceternity Hover effect matching MyFormInputAceternity style
const ContactTextareaAceternity = ({
  name,
  label,
  placeholder,
  rows = 4,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
}) => {
  const { control } = useFormContext();
  const radius = 100;
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const backgroundStyle = useMotionTemplate`
    radial-gradient(
      ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
      #00a76b,
      transparent 80%
    )
  `;

  return (
    <div className="w-full">
      {label && (
        <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white leading-none mb-2 ms-1">
          {label}
        </p>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <motion.div
              style={{ background: backgroundStyle }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              className="p-[2px] rounded-xl transition duration-300 group/input relative"
            >
              <textarea
                rows={rows}
                className={cn(
                  `flex w-full border-none bg-neutral-100/80 dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-xs rounded-xl px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 
                  focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                  group-hover/input:shadow-none transition duration-400 resize-none`,
                )}
                placeholder={placeholder}
                {...field}
                value={field.value ?? ""}
              />
            </motion.div>
            {error && (
              <small className="mt-1 block text-xs text-red-500 font-semibold">
                {error.message}
              </small>
            )}
          </>
        )}
      />
    </div>
  );
};

export default function ContactPage() {
  const defaultValues = useMemo(() => DEFAULT_FORM_VALUES, []);

  const handleFormSubmit = (
    data: Record<string, string>,
    reset: () => void,
  ) => {
    toast.success("Message Sent Successfully!", {
      description:
        "Thank you for reaching out. We will get back to you within 24 hours.",
      duration: 5000,
    });

    reset();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      <div className="container space-y-10 sm:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3 pt-4 sm:pt-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="contact.title">Get In Touch</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed"
            data-translate="contact.subtitle"
          >
            Have a question about our collections, customized lenses, or need
            assistance? Reach out, and our team will provide personalized
            assistance.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Info Panel - Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 sm:space-y-8 relative overflow-hidden border border-neutral-200/80 dark:border-white/10 shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#007C74]/10 to-transparent blur-2xl rounded-full pointer-events-none" />

              <div className="space-y-1.5">
                <span
                  className="text-[10px] uppercase font-extrabold tracking-widest text-[#007C74]"
                  data-translate="contact.info_tag"
                >
                  Showroom & Headquarters
                </span>
                <h3
                  className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white"
                  data-translate="contact.info_title"
                >
                  Glassophite Flagship
                </h3>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white"
                      data-translate="contact.address_label"
                    >
                      Flagship Showroom
                    </h4>
                    <p
                      className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed"
                      data-translate="contact.address_detail"
                    >
                      123 Luxury Lane, Block E, Gulshan-2, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white"
                      data-translate="contact.phone_label"
                    >
                      Call Us
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 font-semibold">
                      <a
                        href="tel:+880123456789"
                        className="hover:text-[#007C74] transition-colors"
                      >
                        +880 1234 56789
                      </a>
                    </p>
                    <p
                      className="text-[10px] sm:text-xs text-neutral-500 mt-0.5"
                      data-translate="contact.phone_hours"
                    >
                      Mon - Sat, 10 AM to 9 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white"
                      data-translate="contact.email_label"
                    >
                      Email Support
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 font-semibold">
                      <a
                        href="mailto:support.glassophite@gmail.com"
                        className="hover:text-[#007C74] transition-colors"
                      >
                        support.glassophite@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white"
                      data-translate="contact.hours_label"
                    >
                      Operating Hours
                    </h4>
                    <p
                      className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5"
                      data-translate="contact.hours_days"
                    >
                      Sunday - Friday: 10:00 AM - 9:00 PM
                    </p>
                    <p
                      className="text-[10px] sm:text-xs text-red-500 font-bold mt-0.5"
                      data-translate="contact.hours_closed"
                    >
                      Closed on Saturdays
                    </p>
                  </div>
                </div>
              </div>

              {/* Styled Mock Map Card */}
              <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 flex flex-col justify-center items-center text-center p-4">
                <div
                  className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#007C74 1.5px, transparent 1.5px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <div className="relative z-10 space-y-2">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-full w-fit mx-auto shadow-md">
                    <Sparkles className="w-5 h-5 text-[#007C74]" />
                  </div>
                  <h4
                    className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white"
                    data-translate="contact.map_title"
                  >
                    Dhaka Interactive Map
                  </h4>
                  <p
                    className="text-[10px] sm:text-xs text-neutral-500 max-w-[200px] leading-relaxed"
                    data-translate="contact.map_desc"
                  >
                    Visit us in Gulshan-2 for interactive virtual try-on and
                    customization consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel - Right */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 relative border border-neutral-200/80 dark:border-white/10 shadow-md">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#3C55A5]/10 to-transparent blur-2xl rounded-full pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[#007C74]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3
                  className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white"
                  data-translate="contact.form_title"
                >
                  Send a Message
                </h3>
              </div>

              <MyFormWrapper
                onSubmit={handleFormSubmit}
                defaultValues={defaultValues}
                className="space-y-4 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MyFormInputAceternity
                    name="name"
                    label="Your Name"
                    placeholder="John Doe"
                    required
                  />
                  <MyFormInputAceternity
                    name="email"
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                </div>

                <MyFormInputAceternity
                  name="subject"
                  label="Subject"
                  placeholder="How can we assist you?"
                  required
                />

                <ContactTextareaAceternity
                  name="message"
                  label="Message"
                  placeholder="Tell us details about your inquiry..."
                  rows={5}
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#007C74] hover:bg-[#006059] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg hover:shadow-[#007c74]/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span data-translate="contact.submit_btn">
                      Submit Message
                    </span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </button>
                </div>
              </MyFormWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
