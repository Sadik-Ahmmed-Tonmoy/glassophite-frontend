"use client"

import { motion } from "framer-motion"
import ProfileNavbar from "@/components/shared/ProfileNavbar/ProfileNavbar"
import ProfileSidebar from "@/components/pages/profile/ProfileSidebar"
import { useProfileTheme } from "@/hooks/useProfileTheme"
import { cn } from "@/lib/utils"
import type React from "react"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useProfileTheme()

  return (
    <div className={cn("min-h-screen transition-colors duration-500 relative", isDark ? "bg-black" : "bg-gray-50")}>
      <div className={cn("absolute inset-0 pointer-events-none overflow-hidden")}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#007C74]/10 to-[#3C55A5]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#3C55A5]/10 to-[#007C74]/10 rounded-full blur-3xl" />
      </div>
      <ProfileNavbar />
      <div className="flex min-h-[calc(100vh-65px)] relative z-10">
        <ProfileSidebar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "flex-1 p-4 sm:p-6 lg:p-8 pt-6 overflow-x-hidden transition-colors duration-500",
            isDark ? "" : ""
          )}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}