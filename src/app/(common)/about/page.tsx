import AboutPage from "@/components/pages/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Glassophite - Premium Eyewear Brand",
  description:
    "Learn about the vision, story, and values of Glassophite. Discover our commitment to luxury craftsmanship, Swiss precision lenses, and premium materials.",
  keywords: "about us, glassophite, luxury sunglasses, premium eyewear, brand story, craftsmanship",
  openGraph: {
    title: "About Us | Glassophite - Premium Eyewear Brand",
    description: "Learn about the vision, story, and values of Glassophite.",
    url: "https://www.glassophite.com/about",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Glassophite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Glassophite - Premium Eyewear Brand",
    description: "Learn about the vision, story, and values of Glassophite.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/about",
  },
};

export default function About() {
  return <AboutPage />;
}
