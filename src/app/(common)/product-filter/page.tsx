import ProductFilterPage from "@/components/pages/ProductFilter/ProductFilterPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Premium Eyewear Collection | Glassophite Shop",
  description:
    "Browse Glassophite's premium collection of luxury sunglasses and designer frames. Find the perfect glasses for your personal style and protection.",
  keywords: "eyewear, glasses, sunglasses, designer frames, luxury sunglasses, glassophite shop",
  openGraph: {
    title: "Premium Eyewear Collection | Glassophite Shop",
    description: "Browse Glassophite's premium collection of luxury sunglasses and designer frames.",
    url: "https://www.glassophite.com/product-filter",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Eyewear Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Eyewear Collection | Glassophite Shop",
    description: "Browse Glassophite's premium collection of luxury sunglasses and designer frames.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/product-filter",
  },
}

export default function ProductFilter() {
  return <ProductFilterPage />
}

