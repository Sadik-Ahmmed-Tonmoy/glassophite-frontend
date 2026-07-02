/* eslint-disable @typescript-eslint/no-explicit-any */

import ProductDetails from "@/components/pages/productDetails/productDetails";
import { Metadata } from "next";
import Script from "next/script";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5016/api/v1";

async function getProduct(productId: string) {
  console.log(API_BASE, productId);
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { productId } = await params;
  const product: any = await getProduct(productId);

  if (!product) {
    return { title: "Product Not Found | Glassophite" };
  }

  const title = `${product.title} | Glassophite Luxury Sunglasses`;
  const desc = product.shortDescription || product.longDescription || "Discover luxury sunglasses by Glassophite.";
  const imgUrl = product.variants?.[0]?.imgList?.[0]?.image || "https://www.glassophite.com/images/og-image.jpg";

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
  const product: any = await getProduct(productId);
console.log("productId", productId);
  if (!product) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="mt-4 text-neutral-500">The product you are looking for does not exist or has been removed.</p>
      </main>
    );
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.variants?.[0]?.imgList?.[0]?.image || "https://www.glassophite.com/images/og-image.jpg",
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
      "price": product.variants?.[0]?.priceAfterDiscount || 0,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.variants?.[0]?.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
