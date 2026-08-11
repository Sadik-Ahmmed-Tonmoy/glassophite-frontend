import PressPage from "@/components/pages/press/PressPage";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Press Room | Glassophite - Premium Eyewear Label",
  description:
    "Find official press releases, brand asset download files, media contact details, and current news articles about Glassophite luxury sunglasses.",
  keywords: "press room, press releases, media kit, glassophite news, brand guidelines, buy glasses online",
  openGraph: {
    title: "Press Room | Glassophite - Premium Eyewear Label",
    description: "Find official press releases and media kits from Glassophite.",
    url: "https://www.glassophite.com/press",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Press Room",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Room | Glassophite - Premium Eyewear Label",
    description: "Find official press releases and media kits from Glassophite.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/press",
  },
};

export default function Press() {
  return <PressPage />;
}
