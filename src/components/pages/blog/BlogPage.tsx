"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useGetAllPostsQuery } from "@/redux/features/blog/blogApi";

export default function BlogPage() {
  const { data: blogData, isLoading } = useGetAllPostsQuery({});
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategoryFilter(params.get("category"));
  }, []);

  const publishedPosts = useMemo(() => {
    const blogPosts = blogData?.data || [];
    return blogPosts
      .filter((post: any) => post.status === "Published")
      .filter((post: any) => !categoryFilter || post.category?.toLowerCase() === categoryFilter.toLowerCase())
      .sort((a: any, b: any) => Number(b.featured) - Number(a.featured) || new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [blogData, categoryFilter]);

  const featuredPost = publishedPosts[0];
  const standardPosts = publishedPosts.filter((post: any) => post.id !== featuredPost?.id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007C74]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] text-neutral-900 dark:text-neutral-100 transition-colors duration-500">
      <section className="px-4 md:px-6 pt-12 pb-8 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007C74]/10 text-[#007C74] text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007C74]" />
              Our Journal
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">Blog & Stories</h1>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Discover the latest trends in premium eyewear, style guides, expert tips, and brand stories.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.section variants={containerVariants} initial="hidden" animate="visible" className="px-4 md:px-6 py-16">
        <div className="container mx-auto max-w-6xl space-y-12">
          {featuredPost && (
            <motion.article variants={itemVariants} className="group cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white dark:bg-black rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-500">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
                  <Image src={featuredPost.imageUrl || "/placeholder.svg"} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 text-xs font-bold backdrop-blur-sm">
                    {featuredPost.category}
                  </div>
                </div>
                <div className="p-8 lg:py-12 lg:pr-12 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{featuredPost.author}</span>
                    <span>{new Date(featuredPost.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span className="px-2 py-0.5 rounded bg-[#007C74]/10 text-[#007C74] text-[10px] font-bold uppercase">{featuredPost.readTime}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight group-hover:text-[#007C74] transition-colors">{featuredPost.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#007C74] group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardPosts.map((post: any) => (
              <motion.article key={post.id} variants={itemVariants} className="group cursor-pointer bg-white dark:bg-black rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/80 text-[10px] font-bold backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" />{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#007C74]/10 text-[#007C74] text-[9px] font-bold uppercase">{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold leading-snug group-hover:text-[#007C74] transition-colors">{post.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{post.excerpt}</p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007C74] group-hover:gap-2.5 transition-all">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {publishedPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-500 dark:text-neutral-400">No blog posts found.</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
