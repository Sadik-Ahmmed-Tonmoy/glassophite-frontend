import CareersPage from "@/components/pages/careers/CareersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Glassophite - Join the Eyewear Revolution",
  description:
    "Explore open job positions at Glassophite. Join our creative teams in frame designing, e-commerce development, and premium customer operations in Dhaka.",
  keywords: "careers, jobs, eyewear design, developer jobs Bangladesh, retail careers, join team",
  openGraph: {
    title: "Careers | Glassophite - Join the Eyewear Revolution",
    description: "Explore open job positions at Glassophite. Join our creative teams.",
    url: "https://www.glassophite.com/careers",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Careers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Glassophite - Join the Eyewear Revolution",
    description: "Explore open job positions at Glassophite. Join our creative teams.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/careers",
  },
};

export default function Careers() {
  return <CareersPage />;
}
