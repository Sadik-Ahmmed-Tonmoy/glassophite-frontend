"use client";

import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getBlogPosts, TBlogPost } from "@/lib/contentMockData";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<TBlogPost[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    setBlogPosts(getBlogPosts());
    const params = new URLSearchParams(window.location.search);
    setCategoryFilter(params.get("category"));
  }, []);

  const publishedPosts = useMemo(() => {
    return blogPosts
      .filter((post) => post.status === "Published")
      .filter((post) => !categoryFilter || post.category.toLowerCase() === categoryFilter.toLowerCase())
      .sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [blogPosts, categoryFilter]);

  const featuredPost = publishedPosts.find((post) => post.featured) || publishedPosts[0];
  const standardPosts = publishedPosts.filter((post) => post.id !== featuredPost?.id);

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
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#007C74] via-[#00A693] to-[#3C55A5] bg-clip-text text-transparent">
            <span data-translate="blog.title">Glassophite Editorial</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium" data-translate="blog.subtitle">
            Curated articles on styling secrets, material craftsmanship, lens innovations, and fashion trends.
          </p>
        </div>

        {featuredPost && (
          <div className="glass-panel rounded-2xl bg-gradient-to-r from-[#007c74]/10 via-transparent to-[#3c55a5]/10 border border-[#007c74]/15 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch overflow-hidden">
            <div className="md:col-span-7 p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-[#007C74]">
                <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                  Featured Article
                </span>
                <span>/</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white leading-snug">
                {featuredPost.title}
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                {featuredPost.excerpt}
              </p>
              <div className="pt-2">
                <a
                  href={`/blogs?category=${encodeURIComponent(featuredPost.category)}`}
                  className="px-4 py-2 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-[#007c74]/10 transition-colors inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            <div className="md:col-span-5 relative min-h-[240px] bg-neutral-100 dark:bg-neutral-850">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {standardPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="glass-panel rounded-xl flex flex-col justify-between hover:border-[#007C74]/30 hover:shadow-lg transition-all duration-300 group min-h-[360px] overflow-hidden"
            >
              <div className="relative h-32 bg-neutral-100 dark:bg-neutral-850">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 pb-0 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#007C74]">
                  <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-3 group-hover:text-[#007C74] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="m-6 mt-4 pt-3 border-t border-neutral-150 dark:border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-neutral-450" />
                  <span>{post.author}</span>
                </div>
                <a
                  href={`/blogs?category=${encodeURIComponent(post.category)}`}
                  className="flex items-center gap-1 font-semibold text-[#007C74]"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {publishedPosts.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 p-10 text-center text-sm text-neutral-500">
            No published blogs found.
          </div>
        )}
      </div>
    </div>
  );
}
