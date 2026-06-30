/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle, Settings, ShoppingBag, Bell, ChevronRight, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const sidebarItems = [
  {
    title: "My Profile",
    icon: UserCircle,
    href: "/my-profile",
    translateKey: "profile.sidebar.myProfile",
  },
  {
    title: "Account Settings",
    icon: Settings,
    href: "/my-profile/account-settings",
    translateKey: "profile.sidebar.accountSettings",
  },
  {
    title: "Order History",
    icon: ShoppingBag,
    href: "/my-profile/order-history",
    translateKey: "profile.sidebar.orderHistory",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/my-profile/notifications",
    translateKey: "profile.sidebar.notifications",
  },
]

export default function ProfileSidebar() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      borderHover: "hover:border-white/20",
      button: "bg-white/10 hover:bg-white/20 text-white",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white",
      buttonSecondary: "border-white/20 text-white hover:bg-white/10",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      active: "bg-[#007C74] text-white",
      inactive: "text-neutral-400 hover:bg-white/10",
      logout: "text-red-400 hover:bg-red-500/10",
      overlay: "bg-black/50",
      icon: "text-neutral-400",
    },
    light: {
      bg: "bg-white",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      borderHover: "hover:border-gray-300",
      button: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
      buttonPrimary: "bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white",
      buttonSecondary: "border-gray-300 text-gray-700 hover:bg-gray-100",
      input: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
      label: "text-gray-700",
      active: "bg-[#007C74] text-white",
      inactive: "text-gray-700 hover:bg-gray-100",
      logout: "text-red-600 hover:bg-red-50",
      overlay: "bg-black/20",
      icon: "text-gray-500",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Animation variants
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
    exit: { x: "-100%", transition: { duration: 0.2 } },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={toggleMobileMenu}
        className={cn(
          "fixed top-20 left-4 z-40 p-2 rounded-md shadow-md lg:hidden transition-colors duration-300",
          styles.card,
          styles.text
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle profile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar - Desktop always visible, mobile animated */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen ? (
          // Mobile version (animated)
          <motion.aside
            key="mobile-sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed inset-y-0 left-0 z-30 w-64 shadow-lg lg:hidden",
              styles.card,
              styles.border
            )}
          >
            <SidebarContent
              pathname={pathname}
              styles={styles}
              onLinkClick={closeMenu}
            />
          </motion.aside>
        ) : (
          // Desktop version (always visible)
          <aside
            className={cn(
              "hidden lg:block w-64 flex-shrink-0 rounded-xl border shadow-sm",
              styles.card,
              styles.border
            )}
          >
            <SidebarContent
              pathname={pathname}
              styles={styles}
              onLinkClick={() => {}} // no-op on desktop
            />
          </aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn("fixed inset-0 z-20 lg:hidden", styles.overlay)}
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Separate component to avoid code duplication
function SidebarContent({
  pathname,
  styles,
  onLinkClick,
}: {
  pathname: string
  styles: any
  onLinkClick: () => void
}) {

    const { theme } = useTheme()
  const isDark = theme === "dark"
  return (
    <div className="flex flex-col h-full">
      {/* Profile Summary */}
      <div className={cn("p-6 border-b", styles.border)}>
        <div className="flex items-center space-x-3">
          <div className={cn("relative w-12 h-12 rounded-full overflow-hidden", isDark ? "bg-white/10" : "bg-primary/10")}>
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Profile"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className={cn("font-semibold", styles.text)} data-translate="profile.name">John Doe</h2>
            <p className={cn("text-sm", styles.textMutedLighter)} data-translate="profile.email">john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300",
                isActive ? styles.active : cn(styles.inactive, "hover:translate-x-1")
              )}
              onClick={onLinkClick}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className={isActive ? "text-white" : styles.icon} />
                <span data-translate={item.translateKey}>{item.title}</span>
              </div>
              <ChevronRight size={16} className={cn(isActive ? "text-white/70" : styles.icon)} />
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className={cn("p-4 border-t", styles.border)}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-300",
            styles.logout
          )}
          data-translate="profile.logout"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  )
}
