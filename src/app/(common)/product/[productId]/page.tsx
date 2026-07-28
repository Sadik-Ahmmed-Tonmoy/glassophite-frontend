/* eslint-disable @typescript-eslint/no-explicit-any */

import ProductDetails from "@/components/pages/productDetails/productDetails";
import type { Metadata } from "next";
import Script from "next/script";

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5016/api/v1";

async function getProduct(productId: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      cache: "no-store",
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
    return { title: "Product Not Found" };
  }

  const variant = product.variants?.[0];
  const title = `${product.title} | Glassophite`;
  const desc =
    product.shortDescription ||
    product.longDescription ||
    `Shop ${product.title} at Glassophite. Premium quality eyewear.`;
  const imgUrl =
    variant?.imgList?.[0]?.image ||
    "https://www.glassophite.com/images/og-image.jpg";

  return {
    title,
    description: desc,
    keywords: [
      product.brand,
      ...(product.categories || []),
      ...(product.types || []),
      "luxury sunglasses",
      "premium eyewear",
    ].filter(Boolean),
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.glassophite.com/product/${product.id}`,
    },
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

  if (!product) {
    return (
      <main className="container py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Product Not Found
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          The product you are looking for does not exist or has been removed.
        </p>
      </main>
    );
  }

  const variant = product.variants?.[0];
  const allImages =
    product.variants?.flatMap(
      (v: any) => v.imgList?.map((img: any) => img.image) || [],
    ) || [];
  const uniqueImages = [...new Set(allImages)];

  const offers =
    product.variants?.map((v: any) => ({
      "@type": "Offer",
      url: `https://www.glassophite.com/product/${product.id}`,
      priceCurrency: "BDT",
      price: v.priceAfterDiscount || 0,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: v.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Glassophite" },
    })) || [];

  const productJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image:
      uniqueImages.length > 0
        ? uniqueImages
        : "https://www.glassophite.com/images/og-image.jpg",
    description:
      product.shortDescription ||
      product.longDescription ||
      "Premium eyewear handcrafted for perfection.",
    sku: variant?.productCode || `GP-${product.id}`,
    mpn: product.id,
    brand: { "@type": "Brand", name: product.brand || "Glassophite" },
    category: product.categories?.[0] || "Eyewear",
    offers: offers.length === 1 ? offers[0] : offers,
  };

  if (product.material) productJsonLd.material = product.material;
  if (product.color) productJsonLd.color = product.color;

  if (product.averageRating && product.totalReviews) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (product.reviews?.length) {
    productJsonLd.review = product.reviews.map((r: any) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      author: {
        "@type": "Person",
        name: r.name || r.user?.fullName || "Verified Customer",
      },
      datePublished: r.date || r.createdAt,
      reviewBody: r.comment,
    }));
  }

  return (
    <main className="container mx-auto px-4   py-8 sm:py-12 lg:py-16">
      <Script
        id={`product-jsonld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetails product={product} />
    </main>
  );
}
