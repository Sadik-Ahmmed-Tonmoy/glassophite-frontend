export type TBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  status: "Published" | "Draft";
  featured: boolean;
};

export type TBrandProfile = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  tagline: string;
  description: string;
  origin: string;
  founded: string;
  category: string;
  status: "Active" | "Draft";
  featured: boolean;
};

const BLOG_STORAGE_KEY = "glassophite_blog_posts";
const BRAND_STORAGE_KEY = "glassophite_brands";

export const initialBlogPosts: TBlogPost[] = [
  {
    id: "BLOG-101",
    slug: "choose-perfect-eyewear-frame",
    date: "2026-04-20",
    author: "Nabila Rahman",
    title: "How to Choose the Perfect Eyewear Frame for Your Face Shape",
    excerpt:
      "Different faces call for distinct frame lines. Match round, oval, square, and heart-shaped facial structures with eyewear that feels balanced and intentional.",
    content:
      "The best frame starts with proportion. Round faces benefit from sharper geometry, square faces soften beautifully with rounded corners, and oval faces can carry most silhouettes with ease. Use bridge width, lens height, and temple length as practical fit checks before choosing color or finish.",
    category: "Styling Guides",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    status: "Published",
    featured: false,
  },
  {
    id: "BLOG-102",
    slug: "polarized-vs-non-polarized-lenses",
    date: "2026-03-18",
    author: "Dr. Asif Chowdhury",
    title: "Polarized vs. Non-Polarized Lenses: Complete Optical Guide",
    excerpt:
      "Glare can impair visual clarity and create eye fatigue. Understand how polarized filters reduce reflected light and when standard lenses make more sense.",
    content:
      "Polarized lenses are useful for driving, water, and high-glare outdoor conditions because they reduce horizontal reflected light. Non-polarized lenses can be preferable for screen-heavy work or activities where reading digital displays matters more than glare reduction.",
    category: "Optical Science",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
    status: "Published",
    featured: false,
  },
  {
    id: "BLOG-103",
    slug: "japanese-titanium-eyewear",
    date: "2026-01-14",
    author: "Imran Khan",
    title: "Why Japanese Titanium is the Ultimate Choice for Eyewear",
    excerpt:
      "Lightweight, resilient, and hypoallergenic. Explore why titanium is considered a premium frame material for daily eyewear.",
    content:
      "Titanium earns its reputation through strength-to-weight performance, corrosion resistance, and skin-friendly wear. For customers who want all-day comfort without sacrificing durability, it remains one of the most reliable premium frame materials.",
    category: "Materials",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80",
    status: "Published",
    featured: false,
  },
  {
    id: "BLOG-104",
    slug: "italian-acetate-craftsmanship",
    date: "2026-05-06",
    author: "Glassophite Studio",
    title: "Behind the Frame: The Craftsmanship of Italian Acetate",
    excerpt:
      "A closer look at polished cellulose acetate, rich color depth, and the frame-finishing process behind premium eyewear.",
    content:
      "Italian acetate gives eyewear its layered color and tactile warmth. Premium frames are cut, tumbled, polished, and hand-finished until the surfaces feel smooth and the color carries depth under changing light.",
    category: "Craftsmanship",
    readTime: "10 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80",
    status: "Published",
    featured: true,
  },
];

export const initialBrands: TBrandProfile[] = [
  {
    id: "BRAND-101",
    slug: "elite-styles",
    name: "Elite Styles",
    logoUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80",
    tagline: "Polished classics for everyday premium wear.",
    description:
      "Elite Styles focuses on refined silhouettes, clean metals, and easy daily comfort for customers who want timeless eyewear.",
    origin: "Dhaka, Bangladesh",
    founded: "2024",
    category: "Premium Frames",
    status: "Active",
    featured: true,
  },
  {
    id: "BRAND-102",
    slug: "shiny-styles",
    name: "Shiny Styles",
    logoUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80",
    tagline: "Gloss finishes and expressive statement lenses.",
    description:
      "Shiny Styles brings bolder lens treatments, polished rims, and standout colors to the Glassophite catalog.",
    origin: "Milan, Italy",
    founded: "2019",
    category: "Fashion Eyewear",
    status: "Active",
    featured: true,
  },
  {
    id: "BRAND-103",
    slug: "golden-vision",
    name: "Golden Vision",
    logoUrl:
      "https://images.unsplash.com/photo-1512099053734-e6767b535838?auto=format&fit=crop&w=500&q=80",
    tagline: "Warm metalwork and luxury detail.",
    description:
      "Golden Vision specializes in metal frames, amber lens tones, and refined hardware for elevated occasion wear.",
    origin: "Tokyo, Japan",
    founded: "2017",
    category: "Luxury Metal",
    status: "Active",
    featured: true,
  },
  {
    id: "BRAND-104",
    slug: "black-knight",
    name: "Black Knight",
    logoUrl:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=500&q=80",
    tagline: "Sharp dark frames with performance lens options.",
    description:
      "Black Knight is built around matte finishes, structured silhouettes, and reliable polarized protection.",
    origin: "Seoul, South Korea",
    founded: "2021",
    category: "Performance Sunglasses",
    status: "Active",
    featured: false,
  },
  {
    id: "BRAND-105",
    slug: "clear-vision",
    name: "Clear Vision",
    logoUrl:
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80",
    tagline: "Minimal optical frames for precise everyday clarity.",
    description:
      "Clear Vision keeps frames light, simple, and comfortable for prescription-ready optical collections.",
    origin: "Singapore",
    founded: "2020",
    category: "Optical Essentials",
    status: "Active",
    featured: false,
  },
  {
    id: "BRAND-106",
    slug: "silver-mirage",
    name: "Silver Mirage",
    logoUrl:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=500&q=80",
    tagline: "Lightweight silver-tone frames with modern edges.",
    description:
      "Silver Mirage offers lightweight builds, cool-toned finishes, and sleek frame geometry for contemporary styling.",
    origin: "Paris, France",
    founded: "2018",
    category: "Designer Frames",
    status: "Active",
    featured: false,
  },
  {
    id: "BRAND-107",
    slug: "black-ace",
    name: "Black Ace",
    logoUrl:
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=500&q=80",
    tagline: "Compact dark frames for confident daily styling.",
    description:
      "Black Ace focuses on versatile black and smoke-tone eyewear that works across casual and formal looks.",
    origin: "Barcelona, Spain",
    founded: "2022",
    category: "Urban Eyewear",
    status: "Active",
    featured: false,
  },
];

const readCollection = <T,>(key: string, initialData: T[]): T[] => {
  if (typeof window === "undefined") return initialData;

  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }

  try {
    return JSON.parse(stored) as T[];
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return initialData;
  }
};

const saveCollection = <T,>(key: string, collection: T[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(collection));
  }
};

export const getBlogPosts = (): TBlogPost[] => {
  return readCollection(BLOG_STORAGE_KEY, initialBlogPosts);
};

export const saveBlogPosts = (posts: TBlogPost[]) => {
  saveCollection(BLOG_STORAGE_KEY, posts);
};

export const getBrandProfiles = (): TBrandProfile[] => {
  return readCollection(BRAND_STORAGE_KEY, initialBrands);
};

export const saveBrandProfiles = (brands: TBrandProfile[]) => {
  saveCollection(BRAND_STORAGE_KEY, brands);
};

export const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
