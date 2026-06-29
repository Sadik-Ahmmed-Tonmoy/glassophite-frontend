import BlogPage from "@/components/pages/blog/BlogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Editorial | Glassophite - Premium Eyewear Insights",
  description:
    "Explore the Glassophite Editorial. Read sizing tips, lens comparison details (polarized vs blue light), titanium metallurgy summaries, and the latest summer trends.",
  keywords: "eyewear blog, styling guides, polarized vs non polarized, titanium frames guide, fashion trends",
  openGraph: {
    title: "Blog & Editorial | Glassophite - Premium Eyewear Insights",
    description: "Explore the Glassophite Editorial. Read sizing tips and lens comparison details.",
    url: "https://www.glassophite.com/blog",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Editorial | Glassophite - Premium Eyewear Insights",
    description: "Explore the Glassophite Editorial. Read sizing tips and lens comparison details.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/blog",
  },
};

export default function Blog() {
  return <BlogPage />;
}
