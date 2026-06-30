import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.glassophite.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",     // Prevent indexing administrative panels
        "/my-profile/",    // Prevent indexing user profile sheets
        "/checkout/",      // Prevent indexing checkout forms
        "/auth/",          // Prevent indexing login/register/reset screens
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
