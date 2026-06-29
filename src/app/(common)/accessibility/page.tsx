import AccessibilityPage from "@/components/pages/accessibility/AccessibilityPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement | Glassophite - Premium Eyewear Label",
  description:
    "Review Glassophite's accessibility statement, compliance with WCAG 2.1 guidelines, visual contrast ratios, keyboard navigability, and screen reader configurations.",
  keywords: "accessibility, wcag compliance, keyboard friendly, screen reader, buy glasses online",
  openGraph: {
    title: "Accessibility Statement | Glassophite - Premium Eyewear Label",
    description: "Review Glassophite's accessibility statement and WCAG 2.1 compliance parameters.",
    url: "https://www.glassophite.com/accessibility",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Accessibility Statement",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Statement | Glassophite - Premium Eyewear Label",
    description: "Review Glassophite's accessibility statement and WCAG 2.1 compliance parameters.",
    images: ["https://www.gemini.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/accessibility",
  },
};

export default function Accessibility() {
  return <AccessibilityPage />;
}
