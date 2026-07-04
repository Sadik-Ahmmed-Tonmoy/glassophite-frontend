"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useProfileTheme } from "@/hooks/useProfileTheme"
import { fadeInDown } from "@/lib/profileAnimations"

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
  const { theme: styles } = useProfileTheme()
  const pathname = usePathname()
  const isSubpage = pathname !== "/my-profile"

  return (
    <motion.div
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#007C74] to-[#3C55A5] rounded-full opacity-60" />
      {(showBackButton || isSubpage) && (
        <Link href={backUrl}>
          <motion.div
            className={cn("inline-flex items-center text-sm mb-2", styles.textMutedLighter, "hover:text-[#007C74] transition-colors duration-300")}
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={15} className="mr-1" />
            Back
          </motion.div>
        </Link>
      )}
      <div className="flex items-center gap-3 mb-1">
        <h1 className={cn("text-2xl sm:text-3xl font-bold tracking-tight", styles.text)}>
          {title}
        </h1>
        <Sparkles size={20} className="text-[#007C74] opacity-60 hidden sm:block" />
      </div>
      <p className={cn("text-sm max-w-xl leading-relaxed", styles.textMutedLighter)}>
        {description}
      </p>
    </motion.div>
  )
}