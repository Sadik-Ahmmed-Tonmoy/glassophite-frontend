"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useGetAllPostsQuery } from "@/redux/features/blog/blogApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function BlogPage() {
  const { data: blogData, isLoading } = useGetAllPostsQuery({});
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCategoryFilter(params.get("category"));
    }
  }, []);

  const publishedPosts = useMemo(() => {
    const blogPosts = blogData?.data || [];
    return blogPosts
      .filter((post: any) => post.status === "Published")
      .filter(
        (post: any) =>
          !categoryFilter ||
          post.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
      .sort(
        (a: any, b: any) =>
          Number(b.featured) - Number(a.featured) ||
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [blogData, categoryFilter]);

  const featuredPost = publishedPosts[0];
  const standardPosts = useMemo(
    () => publishedPosts.filter((post: any) => post.id !== featuredPost?.id),
    [publishedPosts, featuredPost]
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007C74]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      {/* Header Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 pb-8 sm:pb-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 sm:space-y-4 pt-4 sm:pt-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007C74]/10 text-[#007C74] text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007C74]" />
              Our Journal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Blog & Stories
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Discover the latest trends in premium eyewear, style guides, expert
              tips, and brand stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Posts Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16"
      >
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          {featuredPost && (
            <motion.article variants={itemVariants} className="group cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center bg-white dark:bg-black rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[320px] overflow-hidden">
                  <Image
                    src={featuredPost.imageUrl || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 text-xs font-bold backdrop-blur-sm shadow-xs">
                    {featuredPost.category}
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:py-12 lg:pr-12 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <User className="w-3 h-3 text-[#007C74]" />
                      {featuredPost.author}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(featuredPost.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#007C74]/10 text-[#007C74] text-[10px] font-extrabold uppercase">
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight group-hover:text-[#007C74] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#007C74] group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardPosts.map((post: any) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group cursor-pointer bg-white dark:bg-black rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/80 text-[10px] font-extrabold backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1 font-semibold">
                        <User className="w-3 h-3 text-[#007C74]" />
                        {post.author}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#007C74]/10 text-[#007C74] text-[9px] font-extrabold uppercase">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold leading-snug group-hover:text-[#007C74] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007C74] group-hover:gap-2.5 transition-all">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {publishedPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-semibold">
                No blog posts found.
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
