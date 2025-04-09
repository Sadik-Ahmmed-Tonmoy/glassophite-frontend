"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  const isSubpage = pathname !== "/my-profile"

  return (
    <div className="flex flex-col space-y-2">
      {(showBackButton || isSubpage) && (
        <Link href={backUrl} className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2">
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Link>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}
