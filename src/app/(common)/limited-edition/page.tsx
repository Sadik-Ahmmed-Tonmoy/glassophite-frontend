import ProductFilterPage from "@/components/pages/ProductFilter/ProductFilterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Limited Edition | Glassophite Exclusive Eyewear",
  description:
    "Explore Glassophite's Limited Edition sunglasses. Handcrafted in highly restricted quantities with bespoke titanium details and customized numbering.",
  keywords: "limited edition, exclusive sunglasses, rare eyewear, collector frames, customized design sunglasses",
  openGraph: {
    title: "Limited Edition | Glassophite Exclusive Eyewear",
    description: "Explore Glassophite's Limited Edition sunglasses. Handcrafted in highly restricted quantities.",
    url: "https://www.glassophite.com/limited-edition",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Limited Edition",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Limited Edition | Glassophite Exclusive Eyewear",
    description: "Explore Glassophite's Limited Edition sunglasses. Handcrafted in highly restricted quantities.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/limited-edition",
  },
};

export default function LimitedEdition() {
  return <ProductFilterPage />;
}
