import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Maps any URL param or display variant → the exact value stored in DB categories array.
 * DB stores: "sunglasses", "optical glasses", "contact-lens", "accessories"
 * Highlight flags stay as-is (New Arrivals, Best Sellers, etc.) since they use boolean fields.
 */
export const categoryMapToDB: Record<string, string> = {
  // Optical → DB stores "optical glasses"
  "optical glasses": "optical glasses",
  "optical glass":   "optical glasses",
  "optical":         "optical glasses",
  // Contact Lens → DB stores "contact-lens"
  "contact lens":    "contact-lens",
  "contact lenses":  "contact-lens",
  "contact-lens":    "contact-lens",
  // Others → DB stores as-is (lowercase)
  "accessories":     "accessories",
  "sunglasses":      "sunglasses",
  // Highlight flags (handled via boolean API params, kept as-is)
  "new arrivals":    "new arrivals",
  "best sellers":    "best sellers",
  "best seller":     "best sellers",
  "featured picks":  "featured picks",
  "featured":        "featured picks",
  "trending now":    "trending now",
  "trending":        "trending now",
};

export const categoryMapToUI: Record<string, string> = {
  "optical glasses":  "Optical Glasses",
  "optical":          "Optical Glasses",
  "contact-lens":     "Contact Lens",
  "contact lens":     "Contact Lens",
  "accessories":      "Accessories",
  "sunglasses":       "Sunglasses",
  "new arrivals":     "New Arrivals",
  "best sellers":     "Best Sellers",
  "featured picks":   "Featured Picks",
  "trending now":     "Trending Now",
};

export const normalizeCategoryForDB = (cat: string): string => {
  // Also decode any percent-encoded chars (e.g. "optical%20glasses" → "optical glasses")
  const c = decodeURIComponent(cat).toLowerCase().trim();
  return categoryMapToDB[c] || c;
};

export const normalizeCategoryForUI = (cat: string): string => {
  const c = decodeURIComponent(cat).toLowerCase().trim();
  return categoryMapToUI[c] || cat;
};

