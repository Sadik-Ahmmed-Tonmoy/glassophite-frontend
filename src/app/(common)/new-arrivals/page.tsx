import ProductFilterPage from "@/components/pages/ProductFilter/ProductFilterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals | Glassophite Luxury Eyewear",
  description:
    "Discover the latest additions to Glassophite's premium sunglasses and eyewear collection. Step into the season with our newest handcrafted designer frames.",
  keywords: "new arrivals, new sunglasses, latest eyewear, trendsetting sunglasses, designer frames 2026",
  openGraph: {
    title: "New Arrivals | Glassophite Luxury Eyewear",
    description: "Discover the latest additions to Glassophite's premium sunglasses and eyewear collection.",
    url: "https://www.glassophite.com/new-arrivals",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite New Arrivals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals | Glassophite Luxury Eyewear",
    description: "Discover the latest additions to Glassophite's premium sunglasses and eyewear collection.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/new-arrivals",
  },
};

export default function NewArrivals() {
  return <ProductFilterPage />;
}
