"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  title: string
  description: string
  showBackButton?: boolean
  backUrl?: string
}

export default function ProfileHeader({
  title,
  description,
  showBackButton = false,
  backUrl = "/my-profile",
}: ProfileHeaderProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const pathname = usePathname()
  const isSubpage = pathname !== "/my-profile"

  // Theme styles
  const themeStyles = {
    dark: {
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      link: "text-neutral-400 hover:text-[#007C74]",
    },
    light: {
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      link: "text-gray-600 hover:text-[#007C74]",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col space-y-2"
    >
      {(showBackButton || isSubpage) && (
        <Link href={backUrl}>
          <motion.div
            className={cn("inline-flex items-center text-sm mb-2", styles.link)}
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ArrowLeft size={16} className="mr-1" />
            <span data-translate="profile.back">Back</span>
          </motion.div>
        </Link>
      )}
      <h1 className={cn("text-2xl font-bold", styles.text)} data-translate="profile.header.title">
        {title}
      </h1>
      <p className={cn("text-sm", styles.textMutedLighter)} data-translate="profile.header.description">
        {description}
      </p>
    </motion.div>
  )
}