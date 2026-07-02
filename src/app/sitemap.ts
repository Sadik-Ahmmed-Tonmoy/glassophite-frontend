import { MetadataRoute } from "next";

const baseUrl = "https://www.glassophite.com";

export default function sitemap(): MetadataRoute.Sitemap {
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
    "/best-sellers",
    "/new-arrivals",
    "/limited-edition",
    "/shop",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticRoutes];
}
