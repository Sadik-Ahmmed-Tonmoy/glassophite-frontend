import BlogPage from "@/components/pages/blog/BlogPage";
import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5016/api/v1";

export const dynamic = "force-static";

async function getAllBlogs() {
  try {
    const res = await fetch(`${API_BASE}/blogs?limit=100`, {
      cache: "force-cache",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Blogs & Editorial | Glassophite - Premium Eyewear Insights",
  description:
    "Read Glassophite blogs on eyewear styling, lens technology, frame materials, and seasonal picks.",
  keywords: "eyewear blogs, styling guides, polarized lenses, titanium frames, fashion trends",
  openGraph: {
    title: "Blogs & Editorial | Glassophite - Premium Eyewear Insights",
    description: "Read Glassophite blogs on styling, lenses, frame materials, and eyewear care.",
    url: "https://www.glassophite.com/blogs",
    siteName: "Glassophite",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.glassophite.com/blogs",
  },
};

export default async function Blogs() {
  const initialBlogs = await getAllBlogs();
  return <BlogPage initialBlogs={initialBlogs} />;
}
