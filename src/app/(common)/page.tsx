import HomeComponent from "@/components/pages/home/HomeComponent";
import { Metadata, Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007C74",
};

export const metadata: Metadata = {
  title:
    "Glassophite - Elegance in Every Frame. | Luxury Sunglasses for Trendsetters",
  description:
    "Glassophite is a statement of modern sophistication and refined luxury, crafted exclusively for the discerning eyes of Bangladeshi trendsetters. Born from a passion for style, precision, and identity, Glassophite stands at the intersection of premium craftsmanship and contemporary fashion. Whether you're in Dhaka’s bustling streets or the coastlines of Cox’s Bazar, Glassophite adds that extra layer of polish to your personality.",
  robots: "index, follow",
  keywords: [
    "luxury sunglasses",
    "premium eyewear",
    "Bangladesh fashion",
    "timeless eyewear designs",
    "luxury sunglasses brand",
    "designer sunglasses",
    "eyewear for trendsetters",
    "sunglasses Bangladesh",
    "modern elegance eyewear",
    "sophisticated eyewear",
    "fashion accessories",
    "luxury fashion",
    "sunglasses for men",
    "sunglasses for women",
    "high-end sunglasses",
    "exclusive eyewear",
    "premium sunglasses for men",
    "premium sunglasses for women",
    "stylish sunglasses",
    "best sunglasses for fashion",
    "custom sunglasses",
    "exclusive sunglasses Bangladesh",
    "affordable luxury sunglasses",
    "sunglasses online Bangladesh",
    "luxury eyewear collection",
    "top sunglasses brands",
    "high-quality sunglasses",
    "designer eyewear Bangladesh",
    "fashion eyewear",
    "luxury eyewear for women",
    "luxury eyewear for men",
    "fashion eyewear Bangladesh",
    "trendy sunglasses",
    "trendy eyewear",
    "luxury fashion accessories Bangladesh",
    "Bangladeshi sunglasses",
    "modern sunglasses",
    "elegant sunglasses",
    "eyewear accessories",
    "sun protection eyewear",
    "sunglasses for luxury lovers",
    "sunglasses for everyday wear",
    "designer glasses Bangladesh",
    "high-end eyewear Bangladesh",
    "sunglasses for every occasion",
    "exclusive eyewear collections",
  ],

  openGraph: {
    title: "Glassophite - Redefining Elegance in Eyewear",
    description:
      "Explore Glassophite's premium eyewear collection, combining luxury, style, and craftsmanship. Designed for those who demand excellence and sophistication, our eyewear is made for those who lead and not follow.",
    url: "https://www.glassophite.com",
    siteName: "Glassophite",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.glassophite.com/images/og-image.jpg", // Replace with actual image URL
        width: 1200,
        height: 630,
        alt: "Glassophite Luxury Sunglasses",
      },
      {
        url: "https://www.glassophite.com/images/og-image2.jpg", // Add secondary images for social media
        width: 1200,
        height: 630,
        alt: "Glassophite Eyewear Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // Best for visual content
    site: "@Glassophite", // Your Twitter handle
    title: "Glassophite - Luxury Eyewear for Trendsetters",
    description:
      "Elevate your style with Glassophite, where premium materials meet timeless design in luxury sunglasses. Crafted with precision for the modern individual.",
    images: ["https://www.glassophite.com/images/twitter-image.jpg"], // Use a relevant image for Twitter preview
  },
  appleWebApp: {
    capable: true,
    title: "Glassophite",
    statusBarStyle: "black-translucent",
  },
};

const page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Glassophite",
    "url": "https://www.glassophite.com",
    "description": "Glassophite is a statement of modern sophistication and refined luxury, crafted exclusively for the discerning eyes of Bangladeshi trendsetters.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.glassophite.com/product-filter?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Glassophite",
    "url": "https://www.glassophite.com",
    "logo": "https://www.glassophite.com/images/logo.png",
    "sameAs": [
      "https://facebook.com/glassophite",
      "https://instagram.com/glassophite",
      "https://twitter.com/glassophite"
    ]
  };

  return (
    <div className="relative">
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeComponent />
    </div>
  );
};

export default page;
