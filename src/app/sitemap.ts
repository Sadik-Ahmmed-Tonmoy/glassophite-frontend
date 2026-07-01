import { MetadataRoute } from "next";
import { mockProducts } from "@/lib/productMockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.glassophite.com";

  // Static routes configuration
  const staticRoutes = [
    "",
    "/product-filter",
    "/wishlist",
    "/my-profile",
    "/about",
    "/contact",
    "/brands",
    "/blogs",
    "/faq",
    "/accessibility",
    "/cookies",
    "/privacy",
    "/terms",
    "/shipping-returns",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic product routes compilation
  const productRoutes = mockProducts.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
