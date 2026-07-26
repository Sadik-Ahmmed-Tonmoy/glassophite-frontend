"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  useGetAllPostsQuery,
  useGetPostBySlugQuery,
} from "@/redux/features/blog/blogApi";
import { toast } from "sonner";

interface BlogDetailPageProps {
  slugOrId: string;
}

export default function BlogDetailPage({ slugOrId }: BlogDetailPageProps) {
  const [copied, setCopied] = React.useState(false);
  const {
    data: postData,
    isLoading,
    isError,
  } = useGetPostBySlugQuery(slugOrId);
  const { data: allPostsData } = useGetAllPostsQuery({});

  const post = postData?.data || postData;

  const relatedPosts = useMemo(() => {
    const allPosts = allPostsData?.data || [];
    if (!post) return [];
    return allPosts
      .filter(
        (p: any) =>
          p.slug !== post.slug && p.id !== post.id && p.status === "Published",
      )
      .slice(0, 3);
  }, [allPostsData, post]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007C74]" />
        <p className="text-xs text-neutral-500 font-semibold">
          Loading article...
        </p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
          Blog Post Not Found
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm">
          The requested blog article may have been removed or updated.
        </p>
        <Link
          href="/blogs"
          className="px-5 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Blogs</span>
        </Link>
      </div>
    );
  }

  // Split content into clean paragraphs if single string
  const paragraphs = post.content
    ? post.content.split("\n\n").filter(Boolean)
    : [post.excerpt];

  return (
    <article className="w-full min-h-screen bg-neutral-50 dark:bg-[#090909] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 py-10 sm:py-14 lg:py-16">
      {/* Breadcrumb & Navigation Header */}
      <div className="px-4 container mx-auto mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-medium">
          <Link href="/" className="hover:text-[#007C74] dark:hover:text-[#00A693] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link
            href="/blogs"
            className="hover:text-[#007C74] dark:hover:text-[#00A693] transition-colors"
          >
            Blogs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">
            {post.title}
          </span>
        </div>

        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#007C74] dark:text-[#00A693] hover:text-[#006059] transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="px-4 container mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#007C74]/10 dark:bg-[#007C74]/20 text-[#007C74] dark:text-[#00A693] text-xs font-extrabold uppercase tracking-wider border border-[#007C74]/20">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider border border-amber-500/20">
                Featured Editorial
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl font-medium">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200">
                <div className="w-8 h-8 rounded-full bg-[#007C74]/10 dark:bg-[#007C74]/20 text-[#007C74] dark:text-[#00A693] flex items-center justify-center border border-[#007C74]/20">
                  <User className="w-4 h-4" />
                </div>
                <span>{post.author}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#007C74] dark:text-[#00A693]" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#007C74] dark:text-[#00A693]" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold transition-colors cursor-pointer shadow-xs"
                title="Share Article"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-[#007C74] dark:text-[#00A693]" />
                )}
                <span>{copied ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Featured Cover Image */}
      {post.imageUrl && (
        <div className="px-4 container mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-xl bg-neutral-100 dark:bg-neutral-900"
          >
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1000px"
              className="object-cover"
            />
          </motion.div>
        </div>
      )}

      {/* Article Content Body */}
      <section className="px-4 container mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 text-base sm:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal"
        >
          {paragraphs.map((para: string, idx: number) => (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Author Bio Footer */}
        <div className="mt-12 p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#007C74]/10 dark:bg-[#007C74]/20 text-[#007C74] dark:text-[#00A693] flex items-center justify-center flex-shrink-0 border border-[#007C74]/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
              Written by {post.author}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Glassophite Editorial Team • Expert insights on eyewear, design &
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="px-4 pt-12 border-t border-neutral-200 dark:border-neutral-800 container mx-auto">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Related Editorial Stories
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  More articles you might enjoy.
                </p>
              </div>
              <Link
                href="/blogs"
                className="text-xs font-bold text-[#007C74] dark:text-[#00A693] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rPost: any) => (
                <Link
                  key={rPost.id}
                  href={`/blogs/${rPost.slug || rPost.id}`}
                  className="group bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <Image
                      src={rPost.imageUrl || "/placeholder.svg"}
                      alt={rPost.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white text-[10px] font-extrabold backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800">
                      {rPost.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">
                        {rPost.date} • {rPost.readTime}
                      </p>
                      <h4 className="text-sm sm:text-base font-bold leading-snug text-neutral-900 dark:text-white group-hover:text-[#007C74] dark:group-hover:text-[#00A693] transition-colors line-clamp-2">
                        {rPost.title}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#007C74] dark:text-[#00A693] group-hover:gap-2 transition-all pt-2">
                      Read Article <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
