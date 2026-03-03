"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Camera, Upload, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProfilePicture() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      iconBg: "bg-white/10",
      overlay: "bg-black/70",
      removeButton: "text-red-400 hover:text-red-300",
      placeholderIcon: "text-neutral-600",
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
      iconBg: "bg-primary/10",
      overlay: "bg-black/50",
      removeButton: "text-red-600 hover:text-red-700",
      placeholderIcon: "text-gray-400",
    },
  }

  const styles = isDark ? themeStyles.dark : themeStyles.light

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  const buttonVariants = {
    hover: { scale: 1.05, transition: { type: "spring" as const, stiffness: 400, damping: 25 } },
    tap: { scale: 0.95 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("rounded-xl border shadow-sm p-6 transition-colors duration-500", styles.card)}
    >
      <h2 className={cn("text-lg font-semibold mb-6", styles.text)} data-translate="profile.picture.title">
        Profile Picture
      </h2>

      <div className="flex flex-col items-center">
        <div
          className="relative w-40 h-40 rounded-full overflow-hidden mb-6 cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {profileImage ? (
            <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center", styles.iconBg)}>
              <Camera size={40} className={styles.placeholderIcon} />
            </div>
          )}

          <AnimatePresence>
            {isHovering && (
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn("absolute inset-0 flex items-center justify-center space-x-2", styles.overlay)}
              >
                <motion.button
                  onClick={handleUploadClick}
                  className="p-2 bg-white rounded-full text-primary hover:bg-gray-100 transition-colors"
                  aria-label="Change profile picture"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Camera size={24} />
                </motion.button>
                {profileImage && (
                  <motion.button
                    onClick={handleRemoveImage}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-gray-100 transition-colors"
                    aria-label="Remove profile picture"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Trash2 size={24} />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <motion.button
          onClick={handleUploadClick}
          className={cn("inline-flex items-center px-4 py-2 rounded-md transition-colors", styles.buttonPrimary)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          data-translate={profileImage ? "profile.picture.change" : "profile.picture.upload"}
        >
          <Upload size={16} className="mr-1.5" />
          {profileImage ? "Change Picture" : "Upload Picture"}
        </motion.button>

        {profileImage && (
          <motion.button
            onClick={handleRemoveImage}
            className={cn("mt-2 text-sm transition-colors", styles.removeButton)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            data-translate="profile.picture.remove"
          >
            Remove Picture
          </motion.button>
        )}

        <p className={cn("mt-4 text-xs text-center", styles.textMutedLighter)} data-translate="profile.picture.recommendation">
          Recommended: Square image, at least 300x300 pixels, maximum 5MB.
        </p>
      </div>
    </motion.div>
  )
}