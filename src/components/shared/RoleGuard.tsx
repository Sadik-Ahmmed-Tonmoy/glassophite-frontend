"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/redux/features/auth/authSlice"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  roles: string[]
  fallback?: string
}

export default function RoleGuard({ children, roles, fallback = "/" }: RoleGuardProps) {
  const router = useRouter()
  const user = useSelector(selectCurrentUser)
  const [checked, setChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  const rolesKey = roles.join(",");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const role = (user as { role?: string } | null)?.role
    if (!role || !roles.includes(role)) {
      router.replace(fallback)
    } else {
      setAuthorized(true)
    }
    setChecked(true)
  }, [user, rolesKey, router, fallback])

  if (!checked || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#007C74]" />
      </div>
    )
  }

  return <>{children}</>
}
