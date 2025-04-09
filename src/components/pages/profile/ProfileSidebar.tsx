"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle, Settings, ShoppingBag, Bell, ChevronRight, Menu, X, LogOut } from "lucide-react"

const sidebarItems = [
  {
    title: "My Profile",
    icon: UserCircle,
    href: "/my-profile",
  },
  {
    title: "Account Settings",
    icon: Settings,
    href: "/my-profile/account-settings",
  },
  {
    title: "Order History",
    icon: ShoppingBag,
    href: "/my-profile/order-history",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/my-profile/notifications",
  },
]

export default function ProfileSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-20 left-4 z-40 p-2 rounded-md bg-white shadow-md lg:hidden"
        aria-label="Toggle profile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:w-64 lg:flex-shrink-0 pt-16 lg:pt-0`}
      >
        <div className="flex flex-col h-full">
          {/* Profile Summary */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                <img src="/placeholder.svg?height=48&width=48" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">John Doe</h2>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`/${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight size={16} className={isActive ? "opacity-70" : "opacity-40"} />
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </>
  )
}
