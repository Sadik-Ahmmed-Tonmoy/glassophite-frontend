"use client"

import LogoutDialog from "@/components/shared/LogoutDialog"
import { useProfileTheme, type ProfileTheme } from "@/hooks/useProfileTheme"
import { fadeInUp } from "@/lib/profileAnimations"
import { cn } from "@/lib/utils"
import { useGetMeQuery } from "@/redux/features/user/userApi"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, LogOut, Menu, Settings, ShoppingBag, UserCircle, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const sidebarItems = [
  {
    title: "My Profile",
    icon: UserCircle,
    href: "/my-profile",
  },
  {
    title: "Account Settings",
    icon: Settings,
    href: "/my-profile/account-settings",
  },
  {
    title: "Order History",
    icon: ShoppingBag,
    href: "/my-profile/order-history",
  },
  // {
  //   title: "Notifications",
  //   icon: Bell,
  //   href: "/my-profile/notifications",
  // },
]

export default function ProfileSidebar() {
  const { isDark, theme: styles } = useProfileTheme()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => setIsMobileMenuOpen(p => !p)
  const closeMenu = () => setIsMobileMenuOpen(false)

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
    exit: { x: "-100%", transition: { duration: 0.2 } },
  }

  return (
    <>
      <motion.button
        onClick={toggleMobileMenu}
        className={cn(
          "fixed top-20 left-4 z-50 p-2.5 rounded-xl shadow-lg lg:hidden transition-all duration-300",
          isDark ? "bg-white/[0.06] border border-white/[0.08] text-white backdrop-blur-xl" : "bg-white border border-gray-200 text-gray-900 shadow-lg"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle profile menu"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </motion.button>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.aside
            key="mobile-sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-72 shadow-2xl lg:hidden",
              isDark ? "bg-black/95 backdrop-blur-2xl border-r border-white/[0.06]" : "bg-white border-r border-gray-200"
            )}
          >
            <SidebarContent pathname={pathname} isDark={isDark} styles={styles} onLinkClick={closeMenu} />
          </motion.aside>
        )}
        {!isMobileMenuOpen && (
          <aside
            className={cn(
              "hidden lg:block w-64 flex-shrink-0 rounded-2xl border shadow-sm mx-4 my-4 h-[calc(100vh-7rem)] sticky top-20",
              isDark ? "bg-white/[0.02] backdrop-blur-2xl border-white/[0.06]" : "bg-white/90 backdrop-blur-xl border-gray-200/60"
            )}
          >
            <SidebarContent pathname={pathname} isDark={isDark} styles={styles} onLinkClick={() => { }} />
          </aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarContent({
  pathname,
  isDark,
  styles,
  onLinkClick,
}: {
  pathname: string
  isDark: boolean
  styles: ProfileTheme
  onLinkClick: () => void
}) {
  const { data: meData } = useGetMeQuery(undefined)

  const user = meData?.data || meData
  const fullName = user?.fullName || "User"
  const email = user?.email || ""
  const profileImage = user?.profileImage || "/placeholder.svg?height=48&width=48"

  return (
    <div className="flex flex-col h-full">
      <div className={cn("p-5 border-b", isDark ? "border-white/[0.06]" : "border-gray-200")}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn("relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2", isDark ? "ring-[#007C74]/30 ring-offset-black" : "ring-[#007C74]/20 ring-offset-white")}>
              <Image src={profileImage} alt="Profile" fill sizes="48px" className="object-cover" unoptimized />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={cn("font-semibold truncate", styles.text)}>{fullName}</h2>
            <p className={cn("text-xs truncate", styles.textMutedLighter)}>{email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item, i) => {
          const isActive = item.href === "/my-profile"
            ? pathname === "/my-profile"
            : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <motion.div
              key={item.href}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={i}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 group",
                  isActive
                    ? cn("bg-gradient-to-r from-[#007C74]/15 to-[#3C55A5]/15 border-l-2 border-[#007C74]", isDark ? "text-white" : "text-[#007C74]")
                    : cn(isDark ? "text-neutral-500 hover:text-white hover:bg-white/[0.04]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100")
                )}
                onClick={onLinkClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={19} className={cn("transition-colors duration-300", isActive ? "text-[#007C74]" : styles.icon, !isActive && "group-hover:text-inherit")} />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <ChevronRight size={14} className={cn("transition-all duration-300", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0")} />
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <div className={cn("p-3 border-t", isDark ? "border-white/[0.06]" : "border-gray-200")}>
        <LogoutDialog>
          <button
            className={cn(
              "flex items-center w-full px-3.5 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium",
              isDark ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/10" : "text-red-500/70 hover:text-red-600 hover:bg-red-50"
            )}
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </button>
        </LogoutDialog>
      </div>
    </div>
  )
}
