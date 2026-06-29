import FaqPage from "@/components/pages/faq/FaqPage";
import type { Metadata } from "next";

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

export default function FAQ() {
  return <FaqPage />;
}
