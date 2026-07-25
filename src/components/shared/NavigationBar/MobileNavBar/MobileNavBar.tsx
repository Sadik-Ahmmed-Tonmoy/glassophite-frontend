"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Link from "next/link";
import {
  Heart,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Sun,
  Glasses,
  Tag,
  Flame,
  BookOpen,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import CartButton from "../cart/CartButton";
import CartDrawer from "../cart/CartDrawer";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useGetAllNavbarMenusQuery } from "@/redux/features/navbar/navbarApi";
import { useGetWishlistQuery } from "@/redux/features/wishlist/wishlistApi";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import LogoutDialog from "@/components/shared/LogoutDialog";
import { useRouter } from "next/navigation";

const SEARCH_PLACEHOLDERS = [
  "polarized sunglasses",
  "UV protection glasses",
  "blue light blocking glasses",
  "aviator sunglasses",
  "sports sunglasses",
  "prescription sunglasses",
  "designer sunglasses",
  "mirrored sunglasses",
  "round frame sunglasses",
  "retro style sunglasses",
];

interface SubCategoryChild {
  chieldMenuTitle: string;
  href?: string;
}

interface SubCategory {
  subMenuTitle: string;
  href?: string;
  chieldMenu?: SubCategoryChild[];
}

interface MenuItemData {
  id: string | number;
  menu: string;
  href?: string | null;
  subMenu?: SubCategory[];
}

// Icon helper mapping for eye-catching categories
const getCategoryIcon = (menuName: string) => {
  const name = menuName.toLowerCase();
  if (name.includes("sunglass")) return <Sun className="w-4 h-4 text-[#007C74]" />;
  if (name.includes("optical") || name.includes("glasses")) return <Glasses className="w-4 h-4 text-[#3C55A5]" />;
  if (name.includes("brand")) return <Tag className="w-4 h-4 text-[#00A693]" />;
  if (name.includes("blog")) return <BookOpen className="w-4 h-4 text-purple-500" />;
  if (name.includes("sale") || name.includes("clearance")) return <Flame className="w-4 h-4 text-red-500 animate-pulse" />;
  return <Sparkles className="w-4 h-4 text-[#007C74]" />;
};

export default function MobileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const router = useRouter();
  const token = useAppSelector((state) => state.auth.access_token);
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: meData } = useGetMeQuery(undefined, { skip: !token });
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !token });

  const user = meData?.data || meData || authUser;
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const wishlistCount = wishlistData?.data?.items?.length || 0;

  const { data: navbarData } = useGetAllNavbarMenusQuery(undefined);
  const navbarMenus: MenuItemData[] = navbarData?.data || [];

  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setIsMenuOpen(false);
      router.push(`/product-filter?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const toggleExpand = (menuName: string) => {
    setExpandedMenu((prev) => (prev === menuName ? null : menuName));
  };

  const getMenuHref = (item: MenuItemData) => {
    if (item.href) return item.href;
    if (item.menu === "Brands") return "/brands";
    if (item.menu === "Blogs") return "/blogs";
    return `/product-filter?category=${encodeURIComponent(item.menu)}`;
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-white/85 dark:bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 px-2 sm:px-4"
    >
      {/* Top Left: Hamburger Menu & Glassophite Logo */}
      <NavbarContent justify="start" className="gap-2.5 sm:gap-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-5 w-5 text-[#007C74]" /> : <Menu className="h-5 w-5" />}
        </button>
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#007C74] dark:text-white transition-colors">
              Glassophite
            </span>
            <span className="w-2 h-2 rounded-full bg-[#007C74] inline-block animate-pulse" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Top Right: Wishlist (with badge), Cart Drawer, Theme Switcher */}
      <NavbarContent justify="end" className="gap-1 sm:gap-2">
        {/* Wishlist Link */}
        <Link
          href="/wishlist"
          className="relative p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all flex items-center justify-center active:scale-95"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 rounded-full h-4 w-4 bg-[#007C74] text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Shopping Bag / Cart Drawer Button */}
        <CartButton onClick={() => setIsCartOpen(true)} />

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </NavbarContent>

      {/* Modern Slide-down Mobile Menu Drawer */}
      <NavbarMenu className="bg-white/95 dark:bg-neutral-950/95 backdrop-blur-2xl pt-4 px-4 sm:px-6 flex flex-col gap-4 overflow-y-auto max-h-[90vh] slim-scroll">
        {/* Search Bar Container */}
        <div className="w-full">
          <PlaceholdersAndVanishInput
            placeholders={SEARCH_PLACEHOLDERS}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>


        {/* Main Categories Navigation */}
        <div className="flex flex-col gap-1 border-t border-neutral-200/50 dark:border-neutral-800/50 pt-3">
          {/* Home Link */}
          <NavbarMenuItem>
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#007C74]" />
                <span>Home</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 opacity-60" />
            </Link>
          </NavbarMenuItem>

          {/* Dynamic Categories Accordion */}
          {navbarMenus.map((item) => {
            const hasSubMenu = Array.isArray(item.subMenu) && item.subMenu.length > 0;
            const isExpanded = expandedMenu === item.menu;
            const menuHref = getMenuHref(item);
            const isSale = item.menu.toLowerCase().includes("sale");

            return (
              <NavbarMenuItem key={item.id || item.menu} className="flex flex-col">
                <div className="flex items-center justify-between w-full py-0.5">
                  <Link
                    href={menuHref}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex-1 py-2.5 px-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                      isSale
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                        : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(item.menu)}
                      <span>{item.menu}</span>
                    </div>

                    {isSale && (
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-red-500 text-white shadow-sm">
                        HOT SALE
                      </span>
                    )}
                  </Link>

                  {hasSubMenu && (
                    <button
                      onClick={() => toggleExpand(item.menu)}
                      className="p-2.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer ml-1"
                      aria-label={`Toggle ${item.menu} subcategories`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[#007C74]" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Sub-menu accordion */}
                {hasSubMenu && isExpanded && (
                  <div className="ml-5 pl-3 border-l-2 border-[#007C74]/40 flex flex-col gap-2 py-2 my-1">
                    {item.subMenu?.map((sub, sIdx) => {
                      const subHref =
                        sub.href ||
                        `/product-filter?category=${encodeURIComponent(
                          item.menu
                        )}&subCategory=${encodeURIComponent(sub.subMenuTitle)}`;

                      return (
                        <div key={sIdx} className="flex flex-col gap-1">
                          <Link
                            href={subHref}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-[#007C74] dark:hover:text-[#007C74] py-1 block transition-colors"
                          >
                            {sub.subMenuTitle}
                          </Link>

                          {/* Children options */}
                          {sub.chieldMenu && sub.chieldMenu.length > 0 && (
                            <div className="ml-2 flex flex-wrap gap-1.5 py-0.5">
                              {sub.chieldMenu.map(
                                (child, cIdx) =>
                                  child.chieldMenuTitle && (
                                    <Link
                                      key={cIdx}
                                      href={
                                        child.href ||
                                        `/product-filter?category=${encodeURIComponent(
                                          item.menu
                                        )}&subCategory=${encodeURIComponent(
                                          sub.subMenuTitle
                                        )}&type=${encodeURIComponent(
                                          child.chieldMenuTitle
                                        )}`
                                      }
                                      onClick={() => setIsMenuOpen(false)}
                                      className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#007C74] dark:hover:text-[#007C74] transition-colors"
                                    >
                                      {child.chieldMenuTitle}
                                    </Link>
                                  )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </NavbarMenuItem>
            );
          })}
        </div>

        {/* Micro Trust Banner */}
        <div className="my-1 p-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-[10px] font-medium text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#007C74]" />
            <span>UV400 Protection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#007C74]" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-[#007C74]" />
            <span>7 Days Return</span>
          </div>
        </div>

        {/* Profile / Authentication Section */}
        <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 pb-6">
          {isLoggedIn ? (
            <div className="flex flex-col gap-2.5">
              <div className="p-3 bg-gradient-to-r from-[#007C74]/10 via-[#3C55A5]/10 to-transparent border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#007C74] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-neutral-900 dark:text-white truncate">
                    {user?.fullName || "My Account"}
                  </p>
                  <p className="text-[10px] text-neutral-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/my-profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all active:scale-98"
                >
                  <User className="h-3.5 w-3.5 text-[#007C74]" />
                  <span>Profile</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all active:scale-98"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#007C74]" />
                    <span>Dashboard</span>
                  </Link>
                )}
              </div>

              <LogoutDialog>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-98"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </LogoutDialog>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all active:scale-98"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-3 px-4 rounded-xl bg-gradient-to-r from-[#007C74] to-[#3C55A5] text-white text-xs font-bold hover:opacity-90 transition-all shadow-md active:scale-98"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </NavbarMenu>

      {/* Shopping Cart Side Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Navbar>
  );
}
