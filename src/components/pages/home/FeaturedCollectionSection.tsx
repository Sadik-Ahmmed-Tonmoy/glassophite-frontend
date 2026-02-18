"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Eye, ShoppingBag, Award, AlertCircle } from "lucide-react";
import { mockProducts } from "@/lib/productMockData";
import ProductCard from "@/components/ui/ProductCard/ProductCard";


// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Categories configuration
const CATEGORIES = [
  { id: "all", label: "All Premium", icon: Sparkles },
  { id: "aviator", label: "Aviator", icon: Eye },
  { id: "wayfarer", label: "Wayfarer", icon: ShoppingBag },
  { id: "luxury", label: "Limited", icon: Award },
] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Loading Skeleton Component
const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-800 rounded-2xl aspect-[3/4] w-full" />
    <div className="mt-4 space-y-3">
      <div className="h-4 bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-800 rounded w-1/2" />
      <div className="h-4 bg-gray-800 rounded w-2/3" />
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ category }: { category: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full text-center py-16 px-4"
  >
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
      <AlertCircle className="w-10 h-10 text-neutral-400" />
    </div>
    <h3 className="text-2xl font-semibold text-white mb-3">
      No products found
    </h3>
    <p className="text-neutral-400 mb-8 max-w-md mx-auto">
      We couldn't find any products in the "{category}" category. 
      Please check other categories or try again later.
    </p>
    <button
    //   onClick={() => setActiveCategory("all")}
      className="px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors"
    >
      View All Products
    </button>
  </motion.div>
);

// Error Fallback Component
const ErrorFallback = () => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
      <AlertCircle className="w-10 h-10 text-red-500" />
    </div>
    <h3 className="text-2xl font-semibold text-white mb-3">
      Something went wrong
    </h3>
    <p className="text-neutral-400 mb-8">
      We're having trouble loading the products. Please try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
    >
      Refresh Page
    </button>
  </div>
);

export default function FeaturedCollectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Memoized filtered products for performance
  const featuredProducts = useMemo(() => {
    try {
      // Ensure mockProducts exists and is an array
      if (!Array.isArray(mockProducts)) {
        console.error("mockProducts is not an array");
        return [];
      }

      // Filter featured products and limit to 4
      const filtered = mockProducts
        .filter(p => p?.isFeatured === true)
        .slice(0, 4);
      
      return filtered;
    } catch (error) {
      console.error("Error filtering products:", error);
      return [];
    }
  }, []);

  // Category filter handler with error handling
  const handleCategoryChange = useCallback((categoryId: string) => {
    try {
      setIsLoading(true);
      setActiveCategory(categoryId);
      
      // Simulate loading state for smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error changing category:", error);
      setIsLoading(false);
    }
  }, []);



  // Get current category label
  const currentCategoryLabel = useMemo(() => {
    return CATEGORIES.find(c => c.id === activeCategory)?.label || "All Premium";
  }, [activeCategory]);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <section
        ref={sectionRef}
        className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-black to-gray-900"
        aria-label="Featured Premium Sunglasses Collection"
      >
        {/* Background Elements with reduced motion preference */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Pattern - Responsive sizing */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:24px_24px]" />
          
          {/* Animated Orbs - Only animate if user doesn't prefer reduced motion */}
          {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-20 right-20 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]"
              />
              
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-20 left-20 w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] bg-blue-primary/10 rounded-full blur-[100px] sm:blur-[120px] lg:blur-[150px]"
              />
            </>
          )}
        </div>

        <div className="container relative z-10 px-4 sm:px-6 mx-auto">
          {/* Section Header */}
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center mb-12 sm:mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4 sm:mb-6"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm text-neutral-300">Curated Collection</span>
            </motion.div>

            {/* Title - Responsive text sizes */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Featured 
              </span>
              <span className="relative ml-2 sm:ml-3">
                <span className="text-primary">Premium</span>
                {/* Animated underline */}
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-transparent"
                />
              </span>
            </h2>

            {/* Description - Responsive max-width */}
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl sm:max-w-2xl mx-auto px-4">
              Discover our handpicked selection of luxury sunglasses, 
              each piece crafted for the discerning individual.
            </p>
          </motion.div>

          {/* Category Filter Tabs - Scrollable on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2 overflow-x-auto pb-2 scrollbar-hide"
          >
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`group relative flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${category.label}`}
                >
                  {/* Background with glass morphism */}
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      isActive
                        ? "bg-primary/20 backdrop-blur-sm border border-primary/50"
                        : "bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10"
                    }`}
                  />
                  
                  {/* Hover/Active effect - Only on non-touch devices */}
                  {!('ontouchstart' in window) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive ? "text-primary" : ""}`} />
                    {category.label}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group relative h-full"
                >
                  {/* Product Card with error handling */}
                  {!imageErrors.has(product.id) ? (
                    <ProductCard 
                      product={product} 
                    //   onImageError={() => handleImageError(product.id)}
                    />
                  ) : (
                    <div className="bg-gray-800 rounded-2xl p-4 text-center h-full flex items-center justify-center">
                      <p className="text-neutral-400">Image unavailable</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState category={currentCategoryLabel} />
          )}

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12 sm:mt-16"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              aria-label="View complete collection"
            >
              <span className="text-sm sm:text-base text-white font-medium">View Complete Collection</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:translate-x-1 transition-transform" />
              
              {/* Animated ring - Only on non-touch devices */}
              {!('ontouchstart' in window) && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/30"
                  initial={{ scale: 1, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          </motion.div>

          {/* Floating Trust Badge - Hidden on mobile/tablet */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute right-6 top-20 hidden xl:block"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white whitespace-nowrap">Authenticity</div>
                  <div className="text-xs text-neutral-400 whitespace-nowrap">Guaranteed</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>
    </ErrorBoundary>
  );
}

// Add scrollbar hiding CSS
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}