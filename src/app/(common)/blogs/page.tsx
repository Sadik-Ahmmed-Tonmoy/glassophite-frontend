import BlogPage from "@/components/pages/blog/BlogPage";
import type { Metadata } from "next";

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

export default function Blogs() {
  return <BlogPage />;
}
