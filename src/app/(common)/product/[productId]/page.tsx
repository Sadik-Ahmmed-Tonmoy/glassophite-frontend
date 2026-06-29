/* eslint-disable @typescript-eslint/no-explicit-any */

import ProductDetails from "@/components/pages/productDetails/productDetails";
import { mockProducts, productMockData } from "@/lib/productMockData";
import { Metadata } from "next";

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

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </main>
  );
}

