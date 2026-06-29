import WishlistPage from "@/components/pages/wishlist/WishlistPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Glassophite - Saved Eyewear",
  description:
    "View your saved Glassophite luxury frames. Add saved polarized sunglasses, computer glasses, or designer collections to your shopping bag.",
  keywords: "wishlist, saved sunglasses, premium eyewear, shopping bag, glassophite favorites",
  openGraph: {
    title: "My Wishlist | Glassophite - Saved Eyewear",
    description: "View your saved Glassophite luxury frames and add them to your shopping bag.",
    url: "https://www.glassophite.com/wishlist",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Wishlist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Wishlist | Glassophite - Saved Eyewear",
    description: "View your saved Glassophite luxury frames and add them to your shopping bag.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/wishlist",
  },
};

export default function Wishlist() {
  return <WishlistPage />;
}
