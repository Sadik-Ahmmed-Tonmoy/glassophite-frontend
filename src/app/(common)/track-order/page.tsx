import TrackOrderPage from "@/components/pages/track-order/TrackOrderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order | Glassophite - Live Shipment Tracking",
  description:
    "Track the live status of your Glassophite luxury eyewear shipment. Check assembly states, quality control status, and real-time courier dispatched metrics.",
  keywords: "track order, shipping status, glassophite order tracking, shipment tracking, order delivery, buy sunglasses Bangladesh",
  openGraph: {
    title: "Track Order | Glassophite - Live Shipment Tracking",
    description: "Track the live status of your Glassophite luxury eyewear shipment.",
    url: "https://www.glassophite.com/track-order",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Track Glassophite Order",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Track Order | Glassophite - Live Shipment Tracking",
    description: "Track the live status of your Glassophite luxury eyewear shipment.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/track-order",
  },
};

export default function TrackOrder() {
  return <TrackOrderPage />;
}
