import BlogsView from "@/components/pages/dashboard/BlogsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Glassophite - Admin Portal",
  description: "Create, edit, publish, feature, and delete blog posts.",
  robots: "noindex, nofollow",
};

export default function DashboardBlogsPage() {
  return <BlogsView />;
}
