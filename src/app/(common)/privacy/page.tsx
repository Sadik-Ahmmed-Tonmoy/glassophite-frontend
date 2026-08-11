import PrivacyPage from "@/components/pages/privacy/PrivacyPage";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy | Glassophite - Premium Eyewear Label",
  description:
    "Review Glassophite's privacy guidelines, detailing how we process billing addresses, NextAuth accounts, cookies, and local webcam try-on stream parameters.",
  keywords: "privacy policy, cookies data, camera try-on privacy, data security, buy glasses online",
  openGraph: {
    title: "Privacy Policy | Glassophite - Premium Eyewear Label",
    description: "Review Glassophite's privacy guidelines and data security parameters.",
    url: "https://www.glassophite.com/privacy",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Glassophite - Premium Eyewear Label",
    description: "Review Glassophite's privacy guidelines and data security parameters.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/privacy",
  },
};

export default function Privacy() {
  return <PrivacyPage />;
}
