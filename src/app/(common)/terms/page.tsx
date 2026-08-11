import TermsPage from "@/components/pages/terms/TermsPage";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service | Glassophite - Premium Eyewear Label",
  description:
    "Review Glassophite's terms of service, billing verification steps, pricing structures, custom prescription lens assembly terms, and legal governing laws.",
  keywords: "terms of service, shopping rules, user account terms, glassophite guidelines, buy glasses online",
  openGraph: {
    title: "Terms of Service | Glassophite - Premium Eyewear Label",
    description: "Review Glassophite's terms of service and billing guidelines.",
    url: "https://www.glassophite.com/terms",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Terms of Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Glassophite - Premium Eyewear Label",
    description: "Review Glassophite's terms of service and billing guidelines.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/terms",
  },
};

export default function Terms() {
  return <TermsPage />;
}
