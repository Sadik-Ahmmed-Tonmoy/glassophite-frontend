import BrandsPage from "@/components/pages/brands/BrandsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands | Glassophite - Curated Eyewear Houses",
  description:
    "Explore Glassophite eyewear brands, featured labels, origins, and product collections.",
  keywords: "eyewear brands, sunglasses brands, premium optical brands, Glassophite brands",
  openGraph: {
    title: "Brands | Glassophite - Curated Eyewear Houses",
    description: "Explore Glassophite eyewear brands and featured labels.",
    url: "https://www.glassophite.com/brands",
    siteName: "Glassophite",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.glassophite.com/brands",
  },
};

export default function Brands() {
  return <BrandsPage />;
}
