"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Sparkles,
  BarChart3,
  Tag,
  Star,
  MessageSquare,
  Shield,
  BookOpen,
  Store,
  Menu,
  ClipboardList,
  HelpCircle
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Stock Requests", href: "/dashboard/stock-requests", icon: ClipboardList },
    { label: "Brands", href: "/dashboard/brands", icon: Store },
    { label: "Blogs", href: "/dashboard/blogs", icon: BookOpen },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { label: "Customers", href: "/dashboard/customers", icon: Users },
    { label: "Promo Coupons", href: "/dashboard/coupons", icon: Tag },
    { label: "Reviews Moderation", href: "/dashboard/reviews", icon: Star },
    { label: "FAQ Moderation", href: "/dashboard/faqs", icon: HelpCircle },
    { label: "Support Tickets", href: "/dashboard/support", icon: MessageSquare },
    { label: "Staff Directory", href: "/dashboard/staff", icon: Shield },
    { label: "Navbar Menus", href: "/dashboard/navigation", icon: Menu },
    { label: "Store Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:from-[#080808] dark:via-neutral-900 dark:to-[#080808] dark:bg-gradient-to-b text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row transition-colors duration-500">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#0c0c0c] border-r border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#007C74]/15 rounded-lg text-[#007C74]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-widest uppercase bg-gradient-to-r from-[#007C74] to-[#3C55A5] bg-clip-text text-transparent">
                Glassophite
              </h2>
              <p className="text-[10px] text-neutral-500 font-medium">Control Center</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#007C74]/10 text-[#007C74] border-l-4 border-[#007C74]"
                      : "text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Exit link back to storefront */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 rounded-xl text-[10px] uppercase font-extrabold tracking-wider transition-colors"
          >
            <span>Exit To Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
