import FaqPage from "@/components/pages/faq/FaqPage";
import type { Metadata } from "next";

export const dynamic = "force-static";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://glassophite-backend.vercel.app/api/v1";

async function getActiveFAQs() {
  try {
    const res = await fetch(`${API_BASE}/faqs?status=Active&limit=100`, {
      cache: "force-cache",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const faqs = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
    return faqs;
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "FAQs & Help Center | Glassophite - Premium Eyewear Support",
  description:
    "Find answers to frequently asked questions about shipping, returns, virtual try-on, frame sizes, and warranty coverage at Glassophite.",
  keywords: "faqs, help center, support, shipping glassophite, returns, virtual try-on help",
  openGraph: {
    title: "FAQs & Help Center | Glassophite - Premium Eyewear Support",
    description: "Find answers to frequently asked questions about shipping, returns, virtual try-on, and warranty coverage.",
    url: "https://www.glassophite.com/faq",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Help Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs & Help Center | Glassophite - Premium Eyewear Support",
    description: "Find answers to frequently asked questions about shipping, returns, virtual try-on, and warranty coverage.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/faq",
  },
};

export default async function FAQ() {
  const initialFAQs = await getActiveFAQs();
  return <FaqPage initialFAQs={initialFAQs} />;
}
