"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Gem,
  Globe,
  Heart,
  HelpCircle,
  Info,
  Leaf,
  MessageCircle,
  Newspaper,
  Search,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";

// SEO Content Categories
const CONTENT_TABS = [
  { id: "about", name: "About Glassophite", icon: Info },
  { id: "guides", name: "Buying Guides", icon: BookOpen },
  { id: "faq", name: "FAQs", icon: HelpCircle },
  { id: "articles", name: "Style Articles", icon: Newspaper },
  { id: "comparison", name: "Comparison", icon: FileText },
] as const;

// About Glassophite content
const ABOUT_CONTENT = {
  brand: {
    title: "Glassophite: Redefining Premium Eyewear in Bangladesh",
    description:
      "Founded in 2024, Glassophite has emerged as Bangladesh's premier luxury sunglass brand, combining Swiss precision with Bengali artistry.",
    longDescription:
      "We believe that sunglasses are more than just eye protection—they're an expression of personality and style. Our journey began in the historic Shankhari Bazaar of Old Dhaka, where master artisans and optical engineers came together with a shared dream: to create world-class eyewear that carries the essence of Bengali heritage while competing with global luxury brands.",
    stats: [
      { label: "Founded", value: "2024", icon: Clock },
      { label: "Artisans", value: "23+", icon: Users },
      { label: "Countries", value: "15+", icon: Globe },
      { label: "Happy Customers", value: "10k+", icon: Heart },
    ],
  },
  mission: {
    title: "Our Mission",
    description:
      "To democratize luxury eyewear in Bangladesh while maintaining uncompromising quality and style.",
    points: [
      "Bring world-class eyewear to Bangladesh",
      "Preserve traditional Bengali craftsmanship",
      "Innovate with modern optical technology",
      "Create sustainable luxury products",
    ],
  },
  values: [
    {
      icon: Gem,
      title: "Quality First",
      description: "No compromise on materials or craftsmanship",
    },
    {
      icon: Heart,
      title: "Customer Centric",
      description: "Your satisfaction is our priority",
    },
    {
      icon: Leaf,
      title: "Sustainable",
      description: "Committed to eco-friendly practices",
    },
    {
      icon: Award,
      title: "Authentic",
      description: "100% genuine products, guaranteed",
    },
  ],
} as const;

// Buying Guides
const BUYING_GUIDES = [
  {
    id: "guide-1",
    title: "How to Choose the Perfect Sunglasses",
    description:
      "Complete guide to finding your ideal pair based on face shape, lifestyle, and style preferences.",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
    categories: [
      {
        title: "By Face Shape",
        items: [
          "Round Face: Angular frames add definition",
          "Square Face: Round or oval frames soften features",
          "Oval Face: Most frame shapes work well",
          "Heart Face: Bottom-heavy frames balance proportions",
        ],
      },
      {
        title: "By Lens Type",
        items: [
          "Polarized: Reduces glare, perfect for driving",
          "Mirrored: Reduces light, sporty look",
          "Gradient: Versatile for varying light",
          "Photochromic: Adapts to light conditions",
        ],
      },
    ],
    readTime: "5 min read",
    author: "Sarah Johnson",
  },
  {
    id: "guide-2",
    title: "Understanding UV Protection",
    description:
      "Why UV protection matters and how to ensure your eyes are fully protected.",
    image:
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop",
    categories: [
      {
        title: "UV Protection Levels",
        items: [
          "UV400: Blocks 99.9% of UVA/UVB rays",
          "Polarized: Reduces glare, may include UV",
          "Blue Light Filter: Protects from digital screens",
          "Category 3: High protection, general use",
        ],
      },
      {
        title: "Why It Matters",
        items: [
          "Prevents eye strain and fatigue",
          "Reduces risk of cataracts",
          "Protects sensitive eye area",
          "Prevents photokeratitis (sunburn of eyes)",
        ],
      },
    ],
    readTime: "4 min read",
    author: "Dr. Farhana Islam",
  },
  {
    id: "guide-3",
    title: "Sunglasses Size Guide",
    description: "How to measure and find the perfect fit for your face.",
    image:
      "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=800&auto=format&fit=crop",
    categories: [
      {
        title: "Key Measurements",
        items: [
          "Lens Width: 45-60mm (check current glasses)",
          "Bridge Width: 14-24mm (fits nose bridge)",
          "Temple Length: 120-150mm (ear to frame)",
          "Total Width: Overall frame width",
        ],
      },
      {
        title: "Fit Tips",
        items: [
          "Shouldn't slide down nose when smiling",
          "Temples shouldn't press on temples",
          "Lenses should center on eyes",
          "No pinching on nose bridge",
        ],
      },
    ],
    readTime: "3 min read",
    author: "Rahman Ahmed",
  },
] as const;

// FAQs
const FAQS = [
  {
    id: "faq-1",
    question: "Are Glassophite sunglasses suitable for everyday wear?",
    answer:
      "Absolutely! Our sunglasses are designed for daily use with durable materials, scratch-resistant lenses, and comfortable fits. Whether you're commuting, running errands, or enjoying outdoor activities, Glassophite sunglasses provide both style and protection.",
    category: "product",
  },
  {
    id: "faq-2",
    question: "How do I know which size is right for me?",
    answer:
      "Check the inner temple of your current glasses for measurements (e.g., 52-18-140). The first number is lens width, second is bridge width, third is temple length. If you don't have measurements, our size guide can help you determine your perfect fit based on your face shape and preferences.",
    category: "size",
  },
  {
    id: "faq-3",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return unworn sunglasses in their original packaging for a full refund or exchange. Visit our Returns Center to initiate a return.",
    category: "shipping",
  },
  {
    id: "faq-4",
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship within Bangladesh with free shipping on orders over ৳2000. We're expanding to international shipping soon! Sign up for our newsletter to be notified when we launch worldwide shipping.",
    category: "shipping",
  },
  {
    id: "faq-5",
    question: "How do I clean my Glassophite sunglasses?",
    answer:
      "Use the microfiber cloth included with your purchase. For deeper cleaning, rinse with lukewarm water, apply a drop of mild dish soap, gently clean with fingertips, and dry with a clean microfiber cloth. Never use paper towels or harsh chemicals.",
    category: "care",
  },
  {
    id: "faq-6",
    question: "What is your warranty coverage?",
    answer:
      "All Glassophite sunglasses come with a lifetime warranty against manufacturing defects, including frame issues, hinge problems, and lens imperfections. Damage from accidents or misuse is not covered but can be repaired for a fee.",
    category: "warranty",
  },
] as const;

// Style Articles
const ARTICLES = [
  {
    id: "article-1",
    title: "Top Sunglasses Trends for 2024",
    excerpt:
      "Discover the hottest sunglass styles dominating fashion this year, from retro revivals to futuristic designs.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
    date: "March 15, 2024",
    readTime: "6 min",
    author: "Style Desk",
    category: "Trends",
    likes: 234,
    comments: 45,
  },
  {
    id: "article-2",
    title: "How to Style Sunglasses for Different Occasions",
    excerpt:
      "From beach days to business meetings, learn how to choose the perfect sunglasses for every event.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
    date: "March 10, 2024",
    readTime: "4 min",
    author: "Maya Rahman",
    category: "Styling",
    likes: 189,
    comments: 32,
  },
  {
    id: "article-3",
    title: "The Science Behind Polarized Lenses",
    excerpt:
      "Understanding how polarized lenses work and why they're essential for certain activities.",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
    date: "March 5, 2024",
    readTime: "7 min",
    author: "Dr. Farhana Islam",
    category: "Technology",
    likes: 156,
    comments: 28,
  },
] as const;

// Comparison data
const COMPARISON_DATA = {
  categories: ["Feature", "Glassophite", "Premium Brands", "Standard Brands"],
  rows: [
    { feature: "UV Protection", values: ["100% UV400", "100% UV400", "Varies"] },
    {
      feature: "Lens Material",
      values: ["Crystal/Mineral", "Mineral/Glass", "Polycarbonate"],
    },
    {
      feature: "Frame Material",
      values: ["Japanese Titanium", "Italian Acetate", "Plastic"],
    },
    { feature: "Warranty", values: ["Lifetime", "1-2 Years", "6 Months"] },
    { feature: "Handcrafted", values: ["Yes", "Yes", "No"] },
    {
      feature: "Price Range",
      values: ["৳1,500-5,000", "৳5,000-20,000", "৳500-2,000"],
    },
  ],
} as const;

export default function SEOContentSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("about");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");
  const [activeGuide, setActiveGuide] = useState(0);

  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  // Auto-rotate guides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGuide((prev) => (prev + 1) % BUYING_GUIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const styles = useMemo(
    () =>
      isDark
        ? {
            bg: "from-black via-gray-900 to-black",
            card: "bg-white/5 border-white/10",
            cardHover: "hover:bg-white/10",
            text: "text-white",
            textMuted: "text-neutral-300",
            textMutedLighter: "text-neutral-400",
            border: "border-white/10",
            borderGlow: "border-[#007C74]/30",
            tabActive: "bg-[#007C74] text-white shadow-xs",
            tabInactive: "bg-white/5 text-neutral-400 hover:bg-white/10",
            faqExpanded: "bg-white/10",
          }
        : {
            bg: "from-neutral-50 via-white to-neutral-50",
            card: "bg-white/80 border-neutral-200/80 shadow-xs",
            cardHover: "hover:bg-white",
            text: "text-neutral-900",
            textMuted: "text-neutral-600",
            textMutedLighter: "text-neutral-500",
            border: "border-neutral-200",
            borderGlow: "border-[#007C74]/40",
            tabActive: "bg-[#007C74] text-white shadow-xs",
            tabInactive: "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60",
            faqExpanded: "bg-neutral-100/80",
          },
    [isDark]
  );

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className={`relative w-full overflow-hidden bg-gradient-to-b ${styles.bg} transition-colors duration-500 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20`}
      aria-label="Glassophite Resources and Information"
    >
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${
              isDark ? "#007C74" : "#007C74"
            } 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        style={{ y: y1 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-5 sm:top-20 sm:left-20 w-[clamp(180px,25vw,384px)] h-[clamp(180px,25vw,384px)] bg-[#007C74]/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-[clamp(220px,30vw,500px)] h-[clamp(220px,30vw,500px)] bg-[#3C55A5]/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 mb-4 sm:mb-6 mx-auto w-fit shadow-xs"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007C74]" />
            <span
              className={`text-xs sm:text-sm font-semibold ${styles.textMuted} tracking-wider uppercase`}
              data-translate="seo.badge"
            >
              Learn More
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            <span className={styles.text}>Everything You</span>{" "}
            <span className="bg-gradient-to-r from-[#007C74] via-[#3C55A5] to-[#00A693] bg-clip-text text-transparent">
              Need to Know
            </span>
          </h2>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm md:text-base lg:text-lg ${styles.textMuted} max-w-2xl mx-auto px-2 leading-relaxed`}
            data-translate="seo.description"
          >
            Expert guides, answers, and insights to help you make the perfect choice
          </p>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10 lg:mb-12"
        >
          {CONTENT_TABS.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? styles.tabActive
                  : styles.tabInactive
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span data-translate={`seo.tabs.${tab.id}`}>{tab.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-[380px]"
        >
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Brand Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {ABOUT_CONTENT.brand.stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl text-center backdrop-blur-sm border ${styles.card}`}
                  >
                    <stat.icon className="w-5 h-5 text-[#007C74] mx-auto mb-2" />
                    <div className={`text-lg sm:text-xl font-extrabold ${styles.text}`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs ${styles.textMutedLighter}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Brand Story */}
              <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}>
                <h3 className={`text-lg sm:text-xl font-bold ${styles.text} mb-3`}>
                  {ABOUT_CONTENT.brand.title}
                </h3>
                <p className={`text-xs sm:text-sm ${styles.textMuted} mb-4 leading-relaxed`}>
                  {ABOUT_CONTENT.brand.description}
                </p>
                <p className={`text-xs sm:text-sm ${styles.textMutedLighter} leading-relaxed`}>
                  {ABOUT_CONTENT.brand.longDescription}
                </p>
              </div>

              {/* Mission & Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mission */}
                <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}>
                  <h3 className={`text-base sm:text-lg font-bold ${styles.text} mb-3`}>
                    {ABOUT_CONTENT.mission.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${styles.textMuted} mb-4 leading-relaxed`}>
                    {ABOUT_CONTENT.mission.description}
                  </p>
                  <ul className="space-y-2.5">
                    {ABOUT_CONTENT.mission.points.map((point, index) => (
                      <li key={index} className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <CheckCircle className="w-4 h-4 text-[#007C74] shrink-0" />
                        <span className={`font-semibold ${styles.textMuted}`}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Values */}
                <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}>
                  <h3 className={`text-base sm:text-lg font-bold ${styles.text} mb-4`}>
                    Our Core Values
                  </h3>
                  <div className="space-y-4">
                    {ABOUT_CONTENT.values.map((value, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <value.icon className="w-5 h-5 text-[#007C74] shrink-0 mt-0.5" />
                        <div>
                          <h4 className={`text-xs sm:text-sm font-bold ${styles.text}`}>
                            {value.title}
                          </h4>
                          <p className={`text-xs ${styles.textMutedLighter} mt-0.5`}>
                            {value.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buying Guides Tab */}
          {activeTab === "guides" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Featured Guide */}
              <div
                className={`relative rounded-3xl overflow-hidden backdrop-blur-sm border-2 ${styles.borderGlow}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Guide Image */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[420px]">
                    <Image
                      src={BUYING_GUIDES[activeGuide].image}
                      alt={BUYING_GUIDES[activeGuide].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Guide Meta */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {BUYING_GUIDES[activeGuide].readTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {BUYING_GUIDES[activeGuide].author}
                      </span>
                    </div>
                  </div>

                  {/* Guide Content */}
                  <div className={`p-6 sm:p-8 ${styles.card} flex flex-col justify-between`}>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${styles.text} mb-3`}>
                        {BUYING_GUIDES[activeGuide].title}
                      </h3>
                      <p className={`text-xs sm:text-sm ${styles.textMuted} mb-4 leading-relaxed`}>
                        {BUYING_GUIDES[activeGuide].description}
                      </p>

                      <div className="space-y-3.5">
                        {BUYING_GUIDES[activeGuide].categories.map(
                          (category, idx) => (
                            <div key={idx}>
                              <h4 className={`text-xs sm:text-sm font-bold ${styles.text} mb-1.5`}>
                                {category.title}
                              </h4>
                              <ul className="space-y-1">
                                {category.items.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#007C74] mt-0.5 shrink-0" />
                                    <span className={styles.textMutedLighter}>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <Link href={`/guides/${BUYING_GUIDES[activeGuide].id}`}>
                      <button
                        className={`text-xs sm:text-sm font-bold text-[#007C74] hover:text-[#00A693] transition-colors flex items-center gap-1.5 mt-4 cursor-pointer group`}
                      >
                        <span data-translate="seo.readFullGuide">Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Guide Carousel Dots */}
                <div className="flex justify-center gap-2 p-2.5 bg-black/20 backdrop-blur-sm lg:hidden">
                  {BUYING_GUIDES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveGuide(index)}
                      className={`transition-all duration-300 cursor-pointer ${
                        activeGuide === index
                          ? "w-6 h-1.5 bg-[#007C74] rounded-full"
                          : "w-1.5 h-1.5 bg-white/40 rounded-full"
                      }`}
                      aria-label={`View guide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Guide Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BUYING_GUIDES.map((guide, index) => (
                  <button
                    key={guide.id}
                    onClick={() => setActiveGuide(index)}
                    className={`p-3 sm:p-4 rounded-xl text-center backdrop-blur-sm border transition-all cursor-pointer ${
                      activeGuide === index
                        ? `${styles.card} ${styles.borderGlow}`
                        : styles.card
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#007C74] mx-auto mb-1.5" />
                    <span className={`text-xs font-bold ${styles.text} line-clamp-1`}>
                      {guide.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="space-y-3.5">
              {FAQS.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`rounded-2xl backdrop-blur-sm border ${styles.card} overflow-hidden transition-all duration-200`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className={`text-xs sm:text-sm font-bold ${styles.text} pr-4`}>
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-[#007C74] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#007C74] shrink-0" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`px-4 sm:px-5 pb-4 ${styles.faqExpanded}`}
                    >
                      <p className={`text-xs sm:text-sm ${styles.textMutedLighter} leading-relaxed`}>
                        {faq.answer}
                      </p>
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-200/30 dark:border-white/5">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${styles.card}`}>
                          {faq.category}
                        </span>
                        <span className={`text-[10px] ${styles.textMutedLighter}`}>
                          Was this helpful?
                        </span>
                        <button className="p-1 hover:bg-[#007C74]/10 rounded-full transition-colors cursor-pointer">
                          <ThumbsUp className="w-3 h-3 text-[#007C74]" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              <div className="text-center pt-4">
                <Link href="/faq">
                  <button
                    className={`text-xs sm:text-sm font-bold text-[#007C74] hover:text-[#00A693] transition-colors inline-flex items-center gap-1.5 cursor-pointer group`}
                  >
                    <span data-translate="seo.viewAllFaqs">View All FAQs</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ARTICLES.map((article, index) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl overflow-hidden backdrop-blur-sm border ${styles.card} group shadow-md transition-all duration-300`}
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h3 className={`text-xs sm:text-sm font-bold ${styles.text} mb-2 line-clamp-2`}>
                        {article.title}
                      </h3>
                      <p className={`text-xs ${styles.textMutedLighter} mb-4 line-clamp-2 leading-relaxed`}>
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span>{article.date}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-400" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-bold">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-[#007C74]" />
                            <span>{article.likes}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-[#007C74]" />
                            <span>{article.comments}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Link href="/blog">
                  <button
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <span data-translate="seo.readAllArticles">Read All Articles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Comparison Tab */}
          {activeTab === "comparison" && (
            <div className={`p-5 sm:p-8 rounded-3xl backdrop-blur-sm border ${styles.card}`}>
              <h3 className={`text-lg sm:text-xl font-bold ${styles.text} mb-4`}>
                Glassophite vs. The Competition
              </h3>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${styles.border}`}>
                      {COMPARISON_DATA.categories.map((category, index) => (
                        <th
                          key={index}
                          className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-extrabold ${
                            index === 1 ? "text-[#007C74]" : styles.textMuted
                          }`}
                        >
                          {category}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_DATA.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={`border-b ${styles.border} last:border-0`}>
                        <td className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold ${styles.text}`}>
                          {row.feature}
                        </td>
                        {row.values.map((value, colIndex) => (
                          <td
                            key={colIndex}
                            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm ${
                              colIndex === 0
                                ? "text-[#007C74] font-bold"
                                : styles.textMutedLighter
                            }`}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#007C74]/10 border border-[#007C74]/20">
                <p className={`text-xs sm:text-sm ${styles.textMuted} flex items-center gap-2 font-medium`}>
                  <Info className="w-4 h-4 text-[#007C74] shrink-0" />
                  <span data-translate="seo.comparisonNote">
                    Glassophite offers premium quality at accessible prices, making luxury eyewear available in Bangladesh.
                  </span>
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* SEO Meta Content (Hidden for Search Engines) */}
        <div className="sr-only">
          <h1>Glassophite Premium Sunglasses Bangladesh</h1>
          <h2>Luxury Eyewear in Dhaka</h2>
          <p>
            Glassophite is Bangladesh&apos;s premier luxury sunglass brand, offering premium quality eyewear
            with 100% UV protection, lifetime warranty, and authentic craftsmanship. Shop our collection
            of aviator, wayfarer, and sports sunglasses in Dhaka, Bangladesh.
          </p>
          <ul>
            <li>Premium Sunglasses Bangladesh</li>
            <li>Luxury Eyewear Dhaka</li>
            <li>UV Protection Sunglasses</li>
            <li>Polarized Lenses Bangladesh</li>
            <li>Designer Sunglasses</li>
          </ul>
        </div>

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Glassophite",
              "url": "https://glassophite.com",
              "logo": "https://glassophite.com/logo.png",
              "description": "Premium sunglass brand in Bangladesh offering luxury eyewear with UV protection.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dhaka",
                "addressCountry": "BD",
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+8801234567890",
                "contactType": "customer service",
              },
              "sameAs": [
                "https://facebook.com/glassophite",
                "https://instagram.com/glassophite",
              ],
            }),
          }}
        />
      </div>
    </motion.section>
  );
}
