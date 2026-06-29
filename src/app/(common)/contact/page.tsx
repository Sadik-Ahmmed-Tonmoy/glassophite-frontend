import ContactPage from "@/components/pages/contact/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Glassophite - Premium Eyewear Support",
  description:
    "Get in touch with Glassophite's support team or visit our flagship showroom in Gulshan-2, Dhaka. Send us a message for customization options, sizing support, or return queries.",
  keywords: "contact us, glassophite showroom, support, customer service, Dhaka showroom, buy sunglasses Bangladesh",
  openGraph: {
    title: "Contact Us | Glassophite - Premium Eyewear Support",
    description: "Get in touch with Glassophite's support team or visit our flagship showroom in Dhaka.",
    url: "https://www.glassophite.com/contact",
    siteName: "Glassophite",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Glassophite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Glassophite - Premium Eyewear Support",
    description: "Get in touch with Glassophite's support team or visit our flagship showroom in Dhaka.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.glassophite.com/contact",
  },
};

export default function Contact() {
  return <ContactPage />;
}
