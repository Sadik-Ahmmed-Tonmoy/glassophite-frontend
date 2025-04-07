import ProductFilterPage from "@/components/pages/ProductFilter/ProductFilterPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Premium Eyewear Collection | Shop Glasses & Sunglasses",
  description:
    "Browse our premium collection of eyewear including designer sunglasses and prescription glasses. Find the perfect frames for your style and needs.",
  keywords: "eyewear, glasses, sunglasses, prescription glasses, designer frames, optical frames",
  openGraph: {
    title: "Premium Eyewear Collection | Shop Glasses & Sunglasses",
    description: "Browse our premium collection of eyewear including designer sunglasses and prescription glasses.",
    url: "https://yourdomain.com/eyewear",
    siteName: "Your Eyewear Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Premium Eyewear Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Eyewear Collection | Shop Glasses & Sunglasses",
    description: "Browse our premium collection of eyewear including designer sunglasses and prescription glasses.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://yourdomain.com/eyewear",
  },
}

export default function ProductFilter() {
  return <ProductFilterPage />
}

