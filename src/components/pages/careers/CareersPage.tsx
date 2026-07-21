"use client";

import { motion } from "framer-motion";
import { Briefcase, Heart, Users, Sparkles } from "lucide-react";

const DEPARTMENTS = [
  {
    icon: Sparkles,
    name: "Eyewear Design & Art",
    translateNameKey: "careers.dept1_name",
    spots: "1 Open Position",
    translateSpotsKey: "careers.dept1_spots",
    description:
      "Creating the next generation of luxury frame geometries, collaborating with titanium and acetate master craftsmen globally.",
    translateDescKey: "careers.dept1_desc",
  },
  {
    icon: Briefcase,
    name: "Digital Commerce & Tech",
    translateNameKey: "careers.dept2_name",
    spots: "2 Open Positions",
    translateSpotsKey: "careers.dept2_spots",
    description:
      "Refining our Next.js frontend, integrating 3D camera mapping meshes, and building robust inventory pipelines.",
    translateDescKey: "careers.dept2_desc",
  },
  {
    icon: Users,
    name: "Customer Experience & Retail",
    translateNameKey: "careers.dept3_name",
    spots: "1 Open Position",
    translateSpotsKey: "careers.dept3_spots",
    description:
      "Managing our luxury showrooms in Gulshan, providing personal consultations, and addressing support queries.",
    translateDescKey: "careers.dept3_desc",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CareersPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 space-y-10 sm:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 pt-4 sm:pt-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="careers.title">Join Glassophite</span>
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed"
            data-translate="careers.subtitle"
          >
            Help us redefine luxury eyewear. We are looking for designers,
            developers, and writers obsessed with perfection.
          </p>
        </motion.div>

        {/* Story Intro */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-5 sm:gap-6 border border-neutral-200/80 dark:border-white/10 shadow-md">
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[#007C74] shrink-0">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3
              className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white"
              data-translate="careers.intro_title"
            >
              Work That Inspires
            </h3>
            <p
              className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
              data-translate="careers.intro_desc"
            >
              At Glassophite, we foster a culture of creative autonomy, visual
              experimentation, and technological innovation. Whether you are cutting
              lenses, compiling layouts, or assisting showroom guests, you will be
              part of a premium, fashion-forward vision.
            </p>
          </div>
        </div>

        {/* Departments List */}
        <div className="space-y-6">
          <h2
            className="text-xl sm:text-2xl font-extrabold text-[#007C74] dark:text-white text-center"
            data-translate="careers.departments_title"
          >
            Our Departments
          </h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6"
          >
            {DEPARTMENTS.map((dept, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between border border-neutral-200/80 dark:border-white/10 hover:border-[#007C74]/40 hover:shadow-lg transition-all duration-300 group min-h-[220px] sm:min-h-[240px]"
              >
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-xl w-fit group-hover:scale-105 transition-transform duration-300">
                    <dept.icon className="w-5 h-5" />
                  </div>
                  <h3
                    className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white"
                    data-translate={dept.translateNameKey}
                  >
                    {dept.name}
                  </h3>
                  <p
                    className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3"
                    data-translate={dept.translateDescKey}
                  >
                    {dept.description}
                  </p>
                </div>
                <div
                  className="text-[10px] sm:text-xs font-extrabold uppercase text-[#007C74] pt-3"
                  data-translate={dept.translateSpotsKey}
                >
                  {dept.spots}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Application CTA */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-3.5 max-w-xl mx-auto border border-[#007C74]/20 relative overflow-hidden bg-gradient-to-r from-[#007c74]/10 via-transparent to-[#3c55a5]/10 shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#007C74]/10 blur-xl rounded-full pointer-events-none" />
          <h3
            className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white"
            data-translate="careers.cta_title"
          >
            Submit an Inquiry
          </h3>
          <p
            className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed"
            data-translate="careers.cta_desc"
          >
            Even if we don&apos;t have an exact matching position, send your
            portfolio or CV to our recruitment team at:
          </p>
          <p className="text-sm sm:text-base font-bold text-[#007C74]">
            <a href="mailto:glassophite@gmail.com" className="hover:underline">
              glassophite@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
