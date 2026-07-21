"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

// Optimized matchMedia hook for 1024px (lg) breakpoint
function useLargeScreen() {
  const [isLarge, setIsLarge] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsLarge(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsLarge(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
  return isLarge;
}

const FOOTER_SECTIONS = {
  company: {
    title: "Glassophite",
    translateKey: "footer.company",
    items: [
      { label: "About Us", href: "/about", translateKey: "footer.about" },
      { label: "Careers", href: "/careers", translateKey: "footer.careers" },
      { label: "Press", href: "/press", translateKey: "footer.press" },
      { label: "Blogs", href: "/blogs", translateKey: "footer.blog" },
    ],
  },
  quickLinks: {
    title: "Quick Links",
    translateKey: "footer.quickLinks",
    items: [
      { label: "Shop All", href: "/product-filter", translateKey: "footer.shopAll" },
      { label: "Brands", href: "/brands", translateKey: "footer.brands" },
      { label: "New Arrivals", href: "/product-filter?category=new+arrivals", translateKey: "footer.newArrivals" },
      { label: "Best Sellers", href: "/product-filter?category=best+sellers", translateKey: "footer.bestSellers" },
      { label: "Featured", href: "/product-filter?category=featured+picks", translateKey: "footer.limited" },
    ],
  },
  customerService: {
    title: "Customer Service",
    translateKey: "footer.customerService",
    items: [
      { label: "Contact Us", href: "/contact", translateKey: "footer.contact" },
      { label: "FAQs", href: "/faq", translateKey: "footer.faq" },
      { label: "Shipping & Returns", href: "/shipping-returns", translateKey: "footer.shipping" },
      { label: "Track Order", href: "/track-order", translateKey: "footer.track" },
    ],
  },
  legal: {
    title: "Legal",
    translateKey: "footer.legal",
    items: [
      { label: "Privacy Policy", href: "/privacy", translateKey: "footer.privacy" },
      { label: "Terms of Service", href: "/terms", translateKey: "footer.terms" },
      { label: "Cookie Policy", href: "/cookies", translateKey: "footer.cookies" },
      { label: "Accessibility", href: "/accessibility", translateKey: "footer.accessibility" },
    ],
  },
} as const;

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com/glassophite", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/glassophite", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/glassophite", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/glassophite", label: "Youtube" },
] as const;

// Deterministic particles to avoid hydration mismatches
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${15 + i * 14}%`,
  top: `${20 + (i % 3) * 30}%`,
  duration: 10 + i * 2,
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
};

const linkVariants = {
  hover: { x: 4, transition: { type: "spring" as const, stiffness: 300 } },
};

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isLarge = useLargeScreen();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailSchema = z.string().email("Please enter a valid email address.");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      const errorMsg = result.error.errors[0].message;
      setEmailError(errorMsg);
      toast.error(errorMsg);
    } else {
      setEmailError(null);
      toast.success("Subscribed Successfully!", {
        description: "You have been added to our newsletter list.",
      });
      setEmail("");
    }
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const styles = useMemo(
    () =>
      isDark
        ? {
            bg: "bg-black border-white/10",
            text: "text-white",
            textMuted: "text-neutral-400",
            textMutedLighter: "text-neutral-500",
            border: "border-white/10",
            hover: "hover:text-white",
            inputBg: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
            button: "bg-primary text-white hover:bg-primary/90 shadow-md",
            socialBg: "bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white",
          }
        : {
            bg: "bg-white border-neutral-200/80",
            text: "text-neutral-900",
            textMuted: "text-neutral-600",
            textMutedLighter: "text-neutral-500",
            border: "border-neutral-200",
            hover: "hover:text-neutral-900",
            inputBg: "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400",
            button: "bg-primary text-white hover:bg-primary/90 shadow-md",
            socialBg: "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900",
          },
    [isDark]
  );

  return (
    <footer
      ref={ref}
      className={`relative border-t ${styles.bg} ${styles.border} transition-colors duration-500 overflow-hidden`}
    >
      {/* Decorative background effects on large screens */}
      {isLarge && (
        <motion.div className="absolute inset-0 pointer-events-none select-none" style={{ y }}>
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{ left: p.left, top: p.top }}
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-20"
      >
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <motion.div
                whileHover={isLarge ? { rotate: 180, scale: 1.1 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <span className={`text-xl font-bold ${styles.text} group-hover:text-primary transition-colors`}>
                Glassophite
              </span>
            </Link>
            <p className={`text-xs sm:text-sm ${styles.textMuted} max-w-sm leading-relaxed`} data-translate="footer.tagline">
              A statement of modern sophistication and refined luxury, crafted exclusively for the discerning eyes of Bangladeshi trendsetters.
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center space-x-2.5">
                <MapPin size={16} className={`${styles.textMutedLighter} shrink-0`} />
                <span className={styles.textMuted}>
                  123 Luxury Lane, Fashion District, Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone size={16} className={`${styles.textMutedLighter} shrink-0`} />
                <a href="tel:+880123456789" className={`${styles.textMuted} ${styles.hover} transition-colors font-medium`}>
                  +880 1234 56789
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail size={16} className={`${styles.textMutedLighter} shrink-0`} />
                <a href="mailto:support.glassophite@gmail.com" className={`${styles.textMuted} ${styles.hover} transition-colors font-medium`}>
                  support.glassophite@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Navigation sections */}
          {Object.entries(FOOTER_SECTIONS).map(([key, section]) => (
            <motion.div key={key} variants={itemVariants} className="space-y-3.5">
              <h3 className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${styles.text}`} data-translate={section.translateKey}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <motion.li key={item.href} variants={linkVariants} whileHover={isLarge ? "hover" : {}}>
                    <Link
                      href={item.href}
                      className={`text-xs sm:text-sm ${styles.textMuted} ${styles.hover} transition-colors inline-flex items-center group font-medium`}
                    >
                      <ChevronRight size={12} className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                      <span data-translate={item.translateKey}>{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter & Social */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t flex flex-col lg:flex-row justify-between items-center gap-6"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        >
          <div className="w-full lg:w-auto">
            <h4 className={`text-sm font-bold ${styles.text} mb-1`} data-translate="footer.newsletter.title">
              Subscribe to our newsletter
            </h4>
            <p className={`text-xs ${styles.textMutedLighter} mb-3`} data-translate="footer.newsletter.desc">
              Get the latest updates on new arrivals and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-start" onSubmit={handleSubscribe} noValidate>
              <div className="flex flex-col w-full sm:w-64">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm ${styles.inputBg} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full border`}
                  data-translate="footer.newsletter.placeholder"
                />
                {emailError && (
                  <span className="text-red-500 text-[10px] sm:text-xs mt-1 block font-medium">
                    {emailError}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${styles.button} transition-all cursor-pointer shrink-0`}
                data-translate="footer.newsletter.subscribe"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            {SOCIAL_LINKS.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-full ${styles.socialBg} transition-colors cursor-pointer`}
                whileHover={isLarge ? { y: -3, scale: 1.1 } : {}}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-6 text-center text-xs border-t"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        >
          <p className={`${styles.textMutedLighter} font-medium`}>
            © {new Date().getFullYear()} Glassophite. <span data-translate="footer.rights">All rights reserved.</span>
          </p>
          <p className={`mt-1 ${styles.textMutedLighter}`} data-translate="footer.designed">
            Designed with precision in Bangladesh.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
