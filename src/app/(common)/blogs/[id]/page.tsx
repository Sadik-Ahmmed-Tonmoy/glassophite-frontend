import BlogDetailPage from "@/components/pages/blog/BlogDetailPage";
import type { Metadata } from "next";
import Script from "next/script";

type Props = {
  params: Promise<{ id: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5016/api/v1";

async function getBlogPost(idOrSlug: string) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${idOrSlug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    return {
      title: "Blog Article Not Found | Glassophite Editorial",
      description: "The requested blog post could not be found or has been moved.",
      robots: { index: false, follow: true },
    };
  }

  const title = `${post.title} | Glassophite Editorial`;
  const rawDescription = post.excerpt || post.content?.replace(/<[^>]*>/g, "").slice(0, 160) || "Read full blog post on premium eyewear, style trends, and lens technology.";
  const description = rawDescription.replace(/\s+/g, " ").trim();
  const imgUrl =
    post.imageUrl ||
    post.coverImage ||
    post.image ||
    "https://www.glassophite.com/images/og-image.jpg";
  const canonicalUrl = `https://www.glassophite.com/blogs/${post.slug || post.id || id}`;

  return {
    title,
    description,
    keywords: [
      post.category,
      ...(post.tags || []),
      "eyewear editorial",
      "sunglasses guide",
      "lens technology",
      "Glassophite journal",
    ].filter(Boolean),
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      images: [{ url: imgUrl, alt: post.title }],
      url: canonicalUrl,
      siteName: "Glassophite",
      type: "article",
      publishedTime: post.date || post.createdAt,
      authors: post.author ? [post.author] : ["Glassophite Editorial Team"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imgUrl],
    },
  };
}

export default async function BlogSinglePage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);

  const articleUrl = `https://www.glassophite.com/blogs/${post?.slug || post?.id || id}`;

  const jsonLdData = post
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description:
            post.excerpt ||
            post.content?.replace(/<[^>]*>/g, "").slice(0, 160) ||
            "Blog article by Glassophite.",
          image:
            post.imageUrl ||
            post.coverImage ||
            post.image ||
            "https://www.glassophite.com/images/og-image.jpg",
          datePublished: post.date || post.createdAt,
          dateModified: post.updatedAt || post.date || post.createdAt,
          author: {
            "@type": "Person",
            name: post.author || "Glassophite Editorial Team",
          },
          publisher: {
            "@type": "Organization",
            name: "Glassophite",
            url: "https://www.glassophite.com",
            logo: {
              "@type": "ImageObject",
              url: "https://www.glassophite.com/images/og-image.jpg",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
          },
          articleSection: post.category || "Eyewear",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.glassophite.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blogs",
              item: "https://www.glassophite.com/blogs",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: articleUrl,
            },
          ],
        },
      ]
    : null;

  return (
    <>
      {jsonLdData && (
        <Script
          id={`blog-jsonld-${post?.id || id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}
      <BlogDetailPage slugOrId={id} initialPost={post} />
    </>
  );
}

