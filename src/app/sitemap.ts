/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from "next";

const baseUrl = "https://www.glassophite.com";
const rawApiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://glassophite-backend.vercel.app/api/v1/";
const apiBaseUrl = rawApiBaseUrl.endsWith("/") ? rawApiBaseUrl : `${rawApiBaseUrl}/`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const resProducts = await fetch(`${apiBaseUrl}products?limit=250`, { 
      next: { revalidate: 3600 } 
    });
    if (resProducts.ok) {
      const productsData = await resProducts.json();
      const products = productsData?.data || [];
      productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.warn("Sitemap: Failed to retrieve dynamic products:", error);
  }

  try {
    const resNavbar = await fetch(`${apiBaseUrl}navbar-menus`, { 
      next: { revalidate: 3600 } 
    });
    if (resNavbar.ok) {
      const navbarData = await resNavbar.json();
      const navbarMenus = navbarData?.data || [];
      categoryRoutes = navbarMenus.map((item: any) => ({
        url: `${baseUrl}${item.href || `/product-filter?category=${item.menu.toLowerCase()}`}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.warn("Sitemap: Failed to retrieve dynamic navbar categories:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
