"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import ProfileNavbar from "@/components/shared/ProfileNavbar/ProfileNavbar"
import ProfileSidebar from "@/components/pages/profile/ProfileSidebar"
import { cn } from "@/lib/utils"
import type React from "react"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      contentBg: "bg-black/50",
    },
    light: {
      bg: "bg-gray-50",
      contentBg: "bg-white",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  return (
    <div className={cn("min-h-screen transition-colors duration-500", styles.bg)}>
      <ProfileNavbar />
      <div
        className={cn(
          "flex min-h-[calc(100vh-65px)] transition-colors duration-500",
          styles.bg
        )}
      >
        <ProfileSidebar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("flex-1 p-6 lg:p-8 pt-6 transition-colors duration-500", styles.contentBg)}
          data-translate="profile.content"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}