"use client"

import { LogOut, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useProfileTheme } from "@/hooks/useProfileTheme"
import { useLogoutMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { logout as logoutAction } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LogoutDialogProps {
  children: React.ReactNode
  className?: string
}

export default function LogoutDialog({ children, className }: LogoutDialogProps) {
  const { isDark } = useProfileTheme()
  const [logoutApi, { isLoading }] = useLogoutMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try { await logoutApi(undefined).unwrap() } catch { /* proceed */ }
    dispatch(logoutAction())
    toast.success("Logged out successfully")
    router.push("/auth/login")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-md", isDark ? "bg-[#0a0a0a] border-white/[0.08]" : "bg-white")}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2.5 rounded-full", isDark ? "bg-red-500/10" : "bg-red-50")}>
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <DialogTitle className={cn("text-lg", isDark ? "text-white" : "text-gray-900")}>
              Logout
            </DialogTitle>
          </div>
          <DialogDescription className={cn("text-sm", isDark ? "text-neutral-400" : "text-gray-500")}>
            Are you sure you want to log out? You&apos;ll need to sign in again to access your profile and orders.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
              isDark ? "border-white/[0.08] text-white hover:bg-white/[0.06]" : "border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              "bg-red-500/80 hover:bg-red-500 text-white",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Logging out...</>
            ) : (
              <><LogOut size={16} /> Logout</>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
