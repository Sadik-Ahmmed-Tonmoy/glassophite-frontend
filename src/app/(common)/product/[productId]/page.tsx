/* eslint-disable @typescript-eslint/no-explicit-any */

import ProductDetails from "@/components/pages/productDetails/productDetails";
import { mockProducts, productMockData } from "@/lib/productMockData";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { productId } = await params;
  const product = mockProducts.find((p) => p.id === productId) || productMockData;
  const title = `${product.title} | Glassophite Luxury Sunglasses`;
  const desc = product.shortDescription || product.longDescription || "Discover luxury sunglasses by Glassophite.";
  const imgUrl = product.img || (product.variants?.[0]?.imgList?.[0]?.image) || "https://www.glassophite.com/images/og-image.jpg";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [{ url: imgUrl, alt: product.title }],
      url: `https://www.glassophite.com/product/${product.id}`,
      siteName: "Glassophite",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [imgUrl],
    },
  };
}

export default async function ProductPage({ params }: any) {
  const { productId } = await params;
  const product = mockProducts.find((p) => p.id === productId) || productMockData;

  // JSON-LD Product Schema for SEO
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.img || (product.variants?.[0]?.imgList?.[0]?.image) || "https://www.glassophite.com/images/og-image.jpg",
    "description": product.shortDescription || product.longDescription || "Premium eyewear handcrafted for perfection.",
    "sku": product.variants?.[0]?.productCode || `GP-${product.id}`,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Glassophite",
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.glassophite.com/product/${product.id}`,
      "priceCurrency": "BDT",
      "price": product.priceAfterDiscount || (product.variants?.[0]?.priceAfterDiscount) || 0,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Glassophite",
      },
    },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Script
        id={`product-jsonld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetails product={product} />
    </main>
  );
}
