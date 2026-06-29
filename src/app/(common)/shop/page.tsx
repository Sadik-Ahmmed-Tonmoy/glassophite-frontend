import ProductFilterPage from "@/components/pages/ProductFilter/ProductFilterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Eyewear | Glassophite Luxury Collection",
  description:
    "Explore our complete range of luxury polarized sunglasses, prescription frames, and blue-light blocking lenses. Handcrafted with Japanese titanium and Italian acetate.",
  keywords: "shop all, luxury sunglasses, premium eyewear, designer sunglasses, buy glasses online",
  openGraph: {
    title: "Shop All Eyewear | Glassophite Luxury Collection",
    description: "Explore our complete range of luxury polarized sunglasses and designer frames.",
    url: "https://www.glassophite.com/shop",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Shop Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Eyewear | Glassophite Luxury Collection",
    description: "Explore our complete range of luxury polarized sunglasses and designer frames.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/shop",
  },
};

export default function ShopAll() {
  return <ProductFilterPage />;
}
