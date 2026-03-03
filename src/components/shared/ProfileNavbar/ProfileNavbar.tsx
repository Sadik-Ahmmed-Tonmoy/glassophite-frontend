"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, User, Search, Heart, CreditCard } from "lucide-react"
import CartButton from "../NavigationBar/cart/CartButton"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      bgScrolled: "bg-black/80 backdrop-blur-md",
      border: "border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      hoverBg: "hover:bg-white/10",
      activeBg: "bg-white/10",
      iconColor: "text-neutral-300",
      overlayBg: "bg-black/50",
    },
    light: {
      bg: "bg-white",
      bgScrolled: "bg-white/80 backdrop-blur-md",
      border: "border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-primary/10",
      iconColor: "text-gray-700",
      overlayBg: "bg-black/50",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
    document.body.style.overflow = !isMenuOpen ? "hidden" : ""
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = ""
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path)
  }

  // Animation variants
  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" as const},
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? styles.bgScrolled : cn(styles.bg, "border-b", styles.border)
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            data-translate="nav.logo"
          >
            <ShoppingBag className={cn("h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110")} />
            <span className={cn("font-bold text-xl group-hover:text-primary transition-colors duration-300", styles.text)}>
              Glassophite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: "/", label: "Home", key: "home" },
              { href: "/products", label: "Products", key: "products" },
              { href: "/about", label: "About", key: "about" },
              { href: "/contact", label: "Contact", key: "contact" },
            ].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300",
                  isActive(item.href)
                    ? "text-primary after:w-full"
                    : styles.textMuted
                )}
                data-translate={`nav.${item.key}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={cn("p-2 rounded-full transition-all duration-300 hover:scale-110", styles.hoverBg)}
              aria-label="Search"
            >
              <Search className={cn("h-5 w-5", styles.iconColor)} />
            </button>
            <Link
              href="/wishlist"
              className={cn("p-2 rounded-full transition-all duration-300 hover:scale-110", styles.hoverBg)}
              aria-label="Wishlist"
            >
              <Heart className={cn("h-5 w-5", styles.iconColor)} />
            </Link>
            <CartButton />
            <Link
              href="/checkout"
              className={cn("p-2 rounded-full transition-all duration-300 hover:scale-110", styles.hoverBg)}
              aria-label="Checkout"
            >
              <CreditCard className={cn("h-5 w-5", styles.iconColor)} />
            </Link>
            <Link
              href="/my-profile"
              className={cn(
                "p-2 rounded-full transition-all duration-300 hover:scale-110",
                isActive("/my-profile")
                  ? cn("bg-primary/10", styles.iconColor)
                  : styles.hoverBg
              )}
              aria-label="My Profile"
            >
              <User className={cn("h-5 w-5", styles.iconColor)} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <CartButton />
            <button
              className={cn("p-2 rounded-md transition-all duration-300", styles.hoverBg)}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={cn(
                    "absolute block w-6 h-0.5 transition-all duration-300 ease-in-out",
                    styles.text,
                    isMenuOpen ? "rotate-45 top-3" : "top-1.5"
                  )}
                ></span>
                <span
                  className={cn(
                    "absolute block w-6 h-0.5 top-3 transition-all duration-300 ease-in-out",
                    styles.text,
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                ></span>
                <span
                  className={cn(
                    "absolute block w-6 h-0.5 transition-all duration-300 ease-in-out",
                    styles.text,
                    isMenuOpen ? "-rotate-45 top-3" : "top-4.5"
                  )}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn("md:hidden border-t overflow-hidden", styles.border, styles.bg)}
            >
              <div className="container mx-auto px-4 py-3">
                <nav className="flex flex-col space-y-3">
                  {[
                    { href: "/", label: "Home", icon: Home, key: "home" },
                    { href: "/products", label: "Products", icon: ShoppingBag, key: "products" },
                    { href: "/wishlist", label: "Wishlist", icon: Heart, key: "wishlist" },
                    { href: "/checkout", label: "Checkout", icon: CreditCard, key: "checkout" },
                    { href: "/my-profile", label: "My Profile", icon: User, key: "profile" },
                  ].map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-md transition-all duration-300",
                        isActive(item.href)
                          ? cn("text-primary translate-x-2", styles.activeBg)
                          : cn(styles.textMuted, styles.hoverBg, "hover:translate-x-2")
                      )}
                      onClick={closeMenu}
                      data-translate={`nav.mobile.${item.key}`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn("fixed inset-0 z-40 md:hidden", styles.overlayBg)}
              onClick={closeMenu}
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </header>
  )
}