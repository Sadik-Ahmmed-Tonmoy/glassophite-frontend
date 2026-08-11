import ShippingReturnsPage from "@/components/pages/shipping-returns/ShippingReturnsPage";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy | Glassophite",
  description:
    "Find details about delivery times within Dhaka (24-48 hours), outside Dhaka couriers, open-box inspection policies, and our 7-day returns & exchanges policy.",
  keywords: "shipping returns, glassophite returns, open box delivery, refund policies, exchange sunglasses Bangladesh",
  openGraph: {
    title: "Shipping & Returns Policy | Glassophite",
    description: "Find details about delivery times, open-box inspection, and return policies at Glassophite.",
    url: "https://www.glassophite.com/shipping-returns",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glassophite Shipping & Returns Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Returns Policy | Glassophite",
    description: "Find details about delivery times, open-box inspection, and return policies at Glassophite.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/shipping-returns",
  },
};

export default function ShippingReturns() {
  return <ShippingReturnsPage />;
}
