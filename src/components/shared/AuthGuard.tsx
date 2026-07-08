"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useCurrentToken } from "@/redux/features/auth/authSlice"
import { Loader2 } from "lucide-react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useSelector(useCurrentToken)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!token) {
      router.replace("/auth/login")
    } else {
      setChecked(true)
    }
  }, [token, router])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#007C74]" />
      </div>
    )
  }

  return <>{children}</>
}
