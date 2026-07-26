import BlogDetailPage from "@/components/pages/blog/BlogDetailPage";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Blog Article | Glassophite Editorial`,
    description: "Read full blog post on premium eyewear, style trends, and lens technology.",
  };
}

export default async function BlogSinglePage({ params }: Props) {
  const { id } = await params;
  return <BlogDetailPage slugOrId={id} />;
}
