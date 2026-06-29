"use client";

import { motion } from "framer-motion";
import { Briefcase, Heart, Users, Sparkles } from "lucide-react";

const departments = [
  {
    icon: Sparkles,
    name: "Eyewear Design & Art",
    translateNameKey: "careers.dept1_name",
    spots: "1 Open Position",
    translateSpotsKey: "careers.dept1_spots",
    description: "Creating the next generation of luxury frame geometries, collaborating with titanium and acetate master craftsmen globally.",
    translateDescKey: "careers.dept1_desc",
  },
  {
    icon: Briefcase,
    name: "Digital Commerce & Tech",
    translateNameKey: "careers.dept2_name",
    spots: "2 Open Positions",
    translateSpotsKey: "careers.dept2_spots",
    description: "Refining our Next.js frontend, integrating 3D camera mapping meshes, and building robust inventory pipelines.",
    translateDescKey: "careers.dept2_desc",
  },
  {
    icon: Users,
    name: "Customer Experience & Retail",
    translateNameKey: "careers.dept3_name",
    spots: "1 Open Position",
    translateSpotsKey: "careers.dept3_spots",
    description: "Managing our luxury showrooms in Gulshan, providing personal consultations, and addressing support queries.",
    translateDescKey: "careers.dept3_desc",
  },
];

export default function CareersPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="careers.title">Join Glassophite</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="careers.subtitle">
            Help us redefine luxury eyewear. We are looking for designers, developers, and writers obsessed with perfection.
          </p>
        </div>

        {/* Story Intro */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[#007C74] flex-shrink-0">
            <Heart className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold" data-translate="careers.intro_title">Work That Inspires</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed" data-translate="careers.intro_desc">
              At Glassophite, we foster a culture of creative autonomy, visual experimentation, and technological innovation. Whether you are cutting lenses, compiling layouts, or assisting showroom guests, you will be part of a premium, fashion-forward vision.
            </p>
          </div>
        </div>

        {/* Departments List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#007C74] dark:text-white text-center" data-translate="careers.departments_title">Our Departments</h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {departments.map((dept, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-[#007C74]/30 hover:shadow-lg transition-all duration-300 group h-64"
              >
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-[#007C74] rounded-lg w-fit group-hover:scale-105 transition-transform duration-300">
                    <dept.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white" data-translate={dept.translateNameKey}>
                    {dept.name}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3" data-translate={dept.translateDescKey}>
                    {dept.description}
                  </p>
                </div>
                <div className="text-[10px] font-extrabold uppercase text-[#007C74] pt-2" data-translate={dept.translateSpotsKey}>
                  {dept.spots}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Application CTA */}
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto border border-[#007C74]/20 relative overflow-hidden bg-gradient-to-r from-[#007c74]/10 via-transparent to-[#3c55a5]/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#007C74]/10 blur-xl rounded-full" />
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white" data-translate="careers.cta_title">Submit an Inquiry</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto" data-translate="careers.cta_desc">
            Even if we don&apos;t have an exact matching position, send your portfolio or CV to our recruitment team at:
          </p>
          <p className="text-base font-bold text-[#007C74]">
            <a href="mailto:careers@glassophite.com" className="hover:underline">careers@glassophite.com</a>
          </p>
        </div>

      </div>
    </div>
  );
}
