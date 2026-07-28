"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfileTheme } from "@/hooks/useProfileTheme"
import { useGetMeQuery } from "@/redux/features/user/userApi"
import LogoutDialog from "@/components/shared/LogoutDialog"

const pageTitles: Record<string, string> = {
  "/my-profile": "My Profile",
  "/my-profile/account-settings": "Account Settings",
  "/my-profile/order-history": "Order History",
  // "/my-profile/notifications": "Notifications",
}

export default function Navbar() {
  const pathname = usePathname()
  const { isDark } = useProfileTheme()
  const { data: meData } = useGetMeQuery(undefined)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const user = meData?.data || meData

  const currentPage = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] || "Profile"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? cn(isDark ? "bg-black/80 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl", "shadow-sm")
          : isDark ? "bg-black" : "bg-white"
      )}
    >
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Current Page */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-300",
                isDark ? "hover:bg-white/[0.06]" : "hover:bg-gray-100"
              )}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#007C74] to-[#3C55A5] flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className={cn("font-semibold text-sm hidden sm:inline", isDark ? "text-white" : "text-gray-900")}>
                Glassophite
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className={cn("text-lg", isDark ? "text-neutral-700" : "text-gray-300")}>/</span>
              <span className={cn("text-sm font-medium", isDark ? "text-neutral-400" : "text-gray-500")}>
                {currentPage}
              </span>
            </div>
          </div>

          {/* Right: Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                isDark ? "text-neutral-400 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Home size={14} />
              Back to Site
            </Link>

            <div className={cn("w-px h-5", isDark ? "bg-white/[0.08]" : "bg-gray-200")} />

            {user && (
              <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl", isDark ? "bg-white/[0.04]" : "bg-gray-100")}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#007C74] to-[#3C55A5] flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className={cn("text-xs font-medium max-w-[100px] truncate", isDark ? "text-neutral-300" : "text-gray-700")}>
                  {user.fullName || "User"}
                </span>
              </div>
            )}

            <LogoutDialog>
              <button
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  isDark ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/10" : "text-red-500/70 hover:text-red-600 hover:bg-red-50"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </LogoutDialog>
          </div>

          {/* Mobile: Right Actions */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                "p-2 rounded-xl transition-all",
                isDark ? "text-white hover:bg-white/[0.06]" : "text-gray-900 hover:bg-gray-100"
              )}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "md:hidden border-t px-4 py-4 space-y-2",
            isDark ? "bg-black border-white/[0.06]" : "bg-white border-gray-200"
          )}
        >
          <div className={cn("flex items-center gap-3 p-3 rounded-xl mb-3", isDark ? "bg-white/[0.04]" : "bg-gray-100")}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#007C74] to-[#3C55A5] flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-gray-900")}>
                {user?.fullName || "User"}
              </p>
              <p className={cn("text-xs truncate", isDark ? "text-neutral-500" : "text-gray-500")}>
                {user?.email || ""}
              </p>
            </div>
          </div>

          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all",
              isDark ? "text-neutral-400 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Home size={16} />
            Back to Site
          </Link>

          <LogoutDialog>
            <button
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl text-sm w-full transition-all",
                isDark ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/10" : "text-red-500/70 hover:text-red-600 hover:bg-red-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </LogoutDialog>
        </motion.div>
      )}
    </header>
  )
}
