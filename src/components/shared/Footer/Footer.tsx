"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
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

// Hook to detect large screen (lg breakpoint 1024px)
function useLargeScreen() {
  const [isLarge, setIsLarge] = useState(false);
  useEffect(() => {
    const check = () => setIsLarge(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isLarge;
}

const footerSections = {
  company: {
    title: "Glassophite",
    translateKey: "footer.company",
    items: [
      { label: "About Us", href: "/about", translateKey: "footer.about" },
      { label: "Careers", href: "/careers", translateKey: "footer.careers" },
      { label: "Press", href: "/press", translateKey: "footer.press" },
      { label: "Blog", href: "/blog", translateKey: "footer.blog" },
    ],
  },
  quickLinks: {
    title: "Quick Links",
    translateKey: "footer.quickLinks",
    items: [
      { label: "Shop All", href: "/shop", translateKey: "footer.shopAll" },
      { label: "New Arrivals", href: "/new-arrivals", translateKey: "footer.newArrivals" },
      { label: "Best Sellers", href: "/best-sellers", translateKey: "footer.bestSellers" },
      { label: "Limited Edition", href: "/limited-edition", translateKey: "footer.limited" },
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
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/glassophite", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/glassophite", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/glassophite", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/glassophite", label: "Youtube" },
];

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isLarge = useLargeScreen();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const themeStyles = {
    dark: {
      bg: "bg-black border-white/10",
      text: "text-white",
      textMuted: "text-neutral-400",
      textMutedLighter: "text-neutral-500",
      border: "border-white/10",
      hover: "hover:text-white",
      inputBg: "bg-white/5 border-white/10 text-white placeholder:text-neutral-600",
      button: "bg-primary text-white hover:bg-primary/90",
      socialBg: "bg-white/5 hover:bg-white/10",
      accent: "bg-primary/20",
    },
    light: {
      bg: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      hover: "hover:text-gray-900",
      inputBg: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
      button: "bg-primary text-white hover:bg-primary/90",
      socialBg: "bg-gray-100 hover:bg-gray-200",
      accent: "bg-primary/10",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  const linkVariants = {
    hover: { x: 5, transition: { type: "spring" as const, stiffness: 300 } },
  };

  return (
    <footer
      ref={ref}
      className={`relative border-t ${styles.bg} ${styles.border} transition-colors duration-500 overflow-hidden`}
    >
      {/* Decorative animated background – only on large screens */}
      {isLarge && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y }}
          >
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full animate-spin-slow" />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * 400,
                }}
                animate={{
                  y: [null, -30, 30, -30, 30, -30],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        </>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative z-10 mx-auto px-4 sm:px-6 py-12 lg:py-16"
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
            <p className={`text-sm ${styles.textMuted} max-w-sm`} data-translate="footer.tagline">
              Redefining vision with premium sunglasses crafted for the discerning individual.
            </p>
            <div className="space-y-2 text-sm">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={isLarge ? { x: 5 } : {}}
              >
                <MapPin size={16} className={styles.textMutedLighter} />
                <span className={styles.textMuted}>
                  123 Luxury Lane, Fashion District, Dhaka, Bangladesh
                </span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                whileHover={isLarge ? { x: 5 } : {}}
              >
                <Phone size={16} className={styles.textMutedLighter} />
                <a href="tel:+880123456789" className={`${styles.textMuted} ${styles.hover} transition-colors`}>
                  +880 1234 56789
                </a>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                whileHover={isLarge ? { x: 5 } : {}}
              >
                <Mail size={16} className={styles.textMutedLighter} />
                <a href="mailto:support@glassophite.com" className={`${styles.textMuted} ${styles.hover} transition-colors`}>
                  support@glassophite.com
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <motion.div key={key} variants={itemVariants} className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${styles.text}`} data-translate={section.translateKey}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <motion.li key={item.href} variants={linkVariants} whileHover={isLarge ? "hover" : {}}>
                    <Link
                      href={item.href}
                      className={`text-sm ${styles.textMuted} ${styles.hover} transition-colors inline-flex items-center group`}
                    >
                      <ChevronRight size={12} className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <h4 className={`text-sm font-semibold ${styles.text} mb-2`} data-translate="footer.newsletter.title">
              Subscribe to our newsletter
            </h4>
            <p className={`text-xs ${styles.textMutedLighter} mb-3`} data-translate="footer.newsletter.desc">
              Get the latest updates on new arrivals and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className={`px-4 py-2 rounded-md text-sm ${styles.inputBg} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                data-translate="footer.newsletter.placeholder"
              />
              <motion.button
                type="submit"
                className={`px-6 py-2 rounded-md text-sm font-medium ${styles.button} transition-all`}
                whileHover={isLarge ? { scale: 1.05 } : {}}
                whileTap={isLarge ? { scale: 0.95 } : {}}
                data-translate="footer.newsletter.subscribe"
              >
                Subscribe
              </motion.button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${styles.socialBg} transition-colors`}
                whileHover={isLarge ? { y: -5, rotate: 5, scale: 1.1 } : {}}
                whileTap={isLarge ? { scale: 0.95 } : {}}
                aria-label={social.label}
              >
                <social.icon size={20} className={styles.textMuted} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-4 text-center text-xs border-t"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        >
          <p className={styles.textMutedLighter}>
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