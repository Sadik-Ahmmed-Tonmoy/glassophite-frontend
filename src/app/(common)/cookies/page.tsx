import CookiesPage from "@/components/pages/cookies/CookiesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Glassophite - Premium Eyewear Label",
  description:
    "Learn about Glassophite's cookie usage, session storage trackers, user preferences preservation, and instructions on modifying cookie parameters in browsers.",
  keywords: "cookie policy, cookies usage, site preferences, web security, buy glasses online",
  openGraph: {
    title: "Cookie Policy | Glassophite - Premium Eyewear Label",
    description: "Learn about Glassophite's cookie usage and session storage trackers.",
    url: "https://www.glassophite.com/cookies",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Cookie Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | Glassophite - Premium Eyewear Label",
    description: "Learn about Glassophite's cookie usage and session storage trackers.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/cookies",
  },
};

export default function Cookies() {
  return <CookiesPage />;
}
