"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, User } from "lucide-react";

const blogPosts = [
  {
    id: "blog-1",
    date: "April 20, 2026",
    author: "Nabila Rahman",
    title: "How to Choose the Perfect Eyewear Frame for Your Face Shape",
    excerpt: "Different faces call for distinct lines. Discover how round, oval, square, and heart-shaped facial structures match classic aviators, geometric shapes, or cat-eye curves.",
    tag: "Styling Guides",
    readTime: "5 min read",
  },
  {
    id: "blog-2",
    date: "March 18, 2026",
    author: "Dr. Asif Chowdhury",
    title: "Polarized vs. Non-Polarized Lenses: Complete Optical Guide",
    excerpt: "Glare can impair visual clarity and create eye fatigue. Understand how polarized filters neutralize reflected glare, and when you should opt for prescription blue-light coatings.",
    tag: "Optical Science",
    readTime: "7 min read",
  },
  {
    id: "blog-3",
    date: "January 14, 2026",
    author: "Imran Khan",
    title: "Why Japanese Titanium is the Ultimate Choice for Eyewear",
    excerpt: "Lightweight, resilient, and hypoallergenic. Explore why titanium is considered the gold standard for premium frame design, offering longevity that standard alloys cannot match.",
    tag: "Materials",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-[#0a0a0a] dark:via-neutral-900 dark:to-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="blog.title">Glassophite Editorial</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="blog.subtitle">
            Curated articles on styling secrets, material craftsmanship, lens innovations, and fashion trends.
          </p>
        </div>

        {/* Featured Post Card */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#007c74]/10 via-transparent to-[#3c55a5]/10 border border-[#007c74]/15 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold text-[#007C74]">
              <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">Featured Article</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white leading-snug">
              Behind the Frame: The Immense Craftsmanship of Italian Acetate
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              An inside look into the traditional Italian workshops carving organic cellulose fibers into rich tortoise, gradient, and glossy translucent frames. Read about the multi-stage polishing processes.
            </p>
            <div className="pt-2">
              <button className="px-4 py-2 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-[#007c74]/10 transition-colors flex items-center gap-2 group cursor-pointer">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="md:col-span-4 flex justify-center items-center">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#007C74]/20 flex items-center justify-center p-2 animate-spin-slow">
              <BookOpen className="w-10 h-10 text-[#007C74]" />
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {blogPosts.map((post) => (
            <motion.div 
              key={post.id}
              variants={itemVariants}
              className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-[#007C74]/30 hover:shadow-lg transition-all duration-300 group h-[320px]"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#007C74]">
                  <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">{post.tag}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-3 group-hover:text-[#007C74] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-150 dark:border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-neutral-450" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-[#007C74]">
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
