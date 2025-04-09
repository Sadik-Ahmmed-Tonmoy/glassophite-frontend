"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, Trash2 } from "lucide-react"

export default function ProfilePicture() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Picture</h2>

      <div className="flex flex-col items-center">
        <div
          className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {profileImage ? (
            <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <Camera size={40} className="text-gray-400" />
            </div>
          )}

          {isHovering && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <button
                onClick={handleUploadClick}
                className="p-2 bg-white rounded-full text-primary hover:bg-gray-100 transition-colors"
                aria-label="Change profile picture"
              >
                <Camera size={24} />
              </button>
              {profileImage && (
                <button
                  onClick={handleRemoveImage}
                  className="p-2 bg-white rounded-full text-red-500 hover:bg-gray-100 transition-colors ml-2"
                  aria-label="Remove profile picture"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          )}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

        <button
          onClick={handleUploadClick}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Upload size={16} className="mr-1.5" />
          {profileImage ? "Change Picture" : "Upload Picture"}
        </button>

        {profileImage && (
          <button
            onClick={handleRemoveImage}
            className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Remove Picture
          </button>
        )}

        <p className="mt-4 text-xs text-gray-500 text-center">
          Recommended: Square image, at least 300x300 pixels, maximum 5MB.
        </p>
      </div>
    </div>
  )
}
