"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, Trash2, ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/features/user/userApi"
import { toast } from "sonner"
import { useProfileTheme } from "@/hooks/useProfileTheme"
import { fadeInUp } from "@/lib/profileAnimations"
import { uploadImageToImgBB } from "@/lib/uploadImageToImgBB"

export default function ProfilePicture() {
  const { theme: styles } = useProfileTheme()
  // RTK Query — always reflects the latest server value after invalidation
  const { data: meData } = useGetMeQuery(undefined)
  const [updateMe] = useUpdateMeMutation()
  const user = meData?.data || meData

  // Optimistic local state — only used to immediately reflect the new image
  // while the mutation & cache invalidation are in flight.
  // Falls back to server value when null (normal idle state).
  const [optimisticImage, setOptimisticImage] = useState<string | null>(null)

  // The image we actually display: optimistic override first, then server value
  const profileImage = optimisticImage ?? user?.profileImage ?? null

  const [isHovering, setIsHovering] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { isDark } = useProfileTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading("Uploading profile picture...")

    try {
      // 1. Upload to ImgBB CDN → get permanent URL
      const imageUrl = await uploadImageToImgBB(file)

      // 2. Optimistically show the new image immediately
      setOptimisticImage(imageUrl)

      // 3. Persist the URL to the backend; RTK invalidates ["user"] tag
      //    so useGetMeQuery refetches and server value becomes the source of truth
      await updateMe({ profileImage: imageUrl }).unwrap()

      toast.success("Profile picture updated", { id: toastId })
    } catch (err) {
      // Revert optimistic update on failure
      setOptimisticImage(null)
      const error = err as { data?: { message?: string }; message?: string }
      toast.error(error?.data?.message || error?.message || "Failed to upload image", { id: toastId })
    } finally {
      setIsUploading(false)
      // Clear optimistic override — server data is now authoritative
      setOptimisticImage(null)
    }
  }, [updateMe])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset input so same file can be re-selected
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleRemoveImage = async () => {
    try {
      // Optimistically clear the image
      setOptimisticImage("")
      await updateMe({ profileImage: null }).unwrap()
      toast.success("Profile picture removed")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message || "Failed to remove image")
    } finally {
      // Server data is now authoritative again
      setOptimisticImage(null)
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl border shadow-sm p-6 transition-all duration-500 hover:shadow-md", styles.card, styles.cardGlow)}
    >
      <h2 className={cn("text-lg font-semibold mb-6", styles.text)}>
        Profile Picture
      </h2>

      <div className="flex flex-col items-center gap-4">
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cn(
            "relative w-40 h-40 rounded-full overflow-hidden ring-4 transition-all duration-300 cursor-pointer group",
            isDragOver
              ? "ring-[#007C74] scale-105"
              : profileImage
                ? "ring-[#007C74]/20"
                : isDark
                  ? "ring-white/[0.06]"
                  : "ring-gray-200"
          )}>
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                sizes="160px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#007C74]/10 to-[#3C55A5]/10">
                <Camera size={44} className="text-neutral-400" />
              </div>
            )}

            {/* Uploading overlay */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm"
                >
                  <Loader2 size={28} className="text-white animate-spin" />
                  <span className="text-white text-xs font-semibold">Uploading…</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover overlay (only when not uploading) */}
            <AnimatePresence>
              {!isUploading && (isHovering || isDragOver) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm"
                >
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-all shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                  >
                    <Camera size={20} />
                  </motion.button>
                  {profileImage && (
                    <motion.button
                      onClick={handleRemoveImage}
                      className="p-2.5 bg-white/90 rounded-full text-red-500 hover:bg-white transition-all shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isDragOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -inset-4 rounded-full border-2 border-dashed border-[#007C74] bg-[#007C74]/5 pointer-events-none"
            />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <motion.button
            onClick={() => !isUploading && fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed",
              styles.buttonPrimary
            )}
            whileHover={isUploading ? {} : { scale: 1.02 }}
            whileTap={isUploading ? {} : { scale: 0.98 }}
            type="button"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload size={16} />
                {profileImage ? "Change Picture" : "Upload Picture"}
              </>
            )}
          </motion.button>

          {profileImage && !isUploading && (
            <motion.button
              onClick={handleRemoveImage}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              type="button"
            >
              Remove Picture
            </motion.button>
          )}
        </div>

        <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl w-full border border-dashed", isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-gray-50")}>
          <ImageIcon size={14} className="text-neutral-500 shrink-0" />
          <p className={cn("text-xs", styles.textMutedLighter)}>
            Drop an image here or click to browse. Square, min 300×300px, max 5MB.
            Uploaded via ImgBB CDN.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
