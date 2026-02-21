import HomeComponent from "@/components/pages/home/HomeComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Glassophite - Elegance in Every Frame. | Luxury Sunglasses for Trendsetters",
  description:
    "Glassophite offers a curated collection of luxury sunglasses, designed with precision and a commitment to timeless style. Each pair is crafted with the finest materials, seamlessly blending sophistication, durability, and modern flair. Born in Bangladesh, Glassophite represents a new wave of fashion for the discerning trendsetter. Our eyewear empowers confidence and adds a touch of elegance to every moment, whether in the bustling streets of Dhaka or the serene coasts of Cox’s Bazar. Discover eyewear that not only enhances your style but also defines your personality.",
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  themeColor: "#007C74",
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
  return (
    <div className="relative">
      <HomeComponent />
    </div>
  );
};

export default page;
