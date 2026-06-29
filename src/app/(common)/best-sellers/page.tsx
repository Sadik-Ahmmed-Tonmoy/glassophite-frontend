import ProductFilterPage from "@/components/pages/ProductFilter/ProductFilterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Sellers | Glassophite Most Loved Eyewear",
  description:
    "Shop our best-selling luxury sunglasses and optical frames. Discover the frames most loved by Bangladeshi trendsetters and fashion icons.",
  keywords: "best sellers, popular sunglasses, top-selling glasses, glassophite best sellers, favorite eyewear",
  openGraph: {
    title: "Best Sellers | Glassophite Most Loved Eyewear",
    description: "Shop our best-selling luxury sunglasses and optical frames.",
    url: "https://www.glassophite.com/best-sellers",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Best Sellers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Sellers | Glassophite Most Loved Eyewear",
    description: "Shop our best-selling luxury sunglasses and optical frames.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/best-sellers",
  },
};

export default function BestSellers() {
  return <ProductFilterPage />;
}
