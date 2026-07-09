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
import { Heart, Menu, X, LogOut, User } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import CartButton from "../cart/CartButton";
import {
  LanguageSwitcher,
  TranslateInitializer,
} from "@/lib/GoogleTranslateProvider";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useGetAllNavbarMenusQuery } from "@/redux/features/navbar/navbarApi";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetMeQuery, useLogoutMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MobileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.access_token);
  const { data: meData } = useGetMeQuery(undefined, { skip: !token });
  const [logoutApi] = useLogoutMutation();

  const user = meData?.data || meData;
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
    } catch {
      // safe fallback
    }
    dispatch(logout());
    setIsMenuOpen(false);
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const { data: navbarData } = useGetAllNavbarMenusQuery(undefined);
  const navbarMenus = navbarData?.data || [];

  const dynamicItems = navbarMenus.map((item: { menu: string; href?: string | null }) => ({
    label: item.menu,
    href: item.href || `/product-filter?category=${item.menu.toLowerCase()}`,
  }));

  const menuItems = [
    { label: "Home", href: "/" },
    ...dynamicItems,
    ...(isLoggedIn ? [{ label: "My Profile", href: "/my-profile" }] : []),
    ...(isAdmin ? [{ label: "Admin Dashboard", href: "/dashboard" }] : []),
  ];

  const [searchValue, setSearchValue] = useState("");

  const placeholders = [
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/product-filter?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-neutral-250/50 dark:border-neutral-800/50"
    >
      <NavbarContent justify="start" className="gap-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <NavbarBrand>
          <Link href="/">
            <span className="text-xl font-bold tracking-wider text-[#007C74] dark:text-white cursor-pointer">
              Glassophite
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {/* Wishlist Link */}
        <Link
          href="/wishlist"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
        >
          <Heart className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        </Link>

        {/* Shopping Drawer Button */}
        <CartButton />

        {/* Theme Switcher Toggle */}
        <ThemeSwitcher />
      </NavbarContent>

      <NavbarMenu className="bg-white/95 dark:bg-black/95 backdrop-blur-md pt-4 flex flex-col gap-4 overflow-y-auto max-h-[85vh] slim-scroll">
        {/* Mobile Search input */}
        <div className="w-full py-2">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-1 border-t border-neutral-200/30 dark:border-neutral-850/30 pt-3">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className={`w-full text-base py-2 block border-b border-neutral-100 dark:border-neutral-900 hover:text-[#007C74] dark:hover:text-[#007C74] transition-colors font-semibold ${
                  item.label.toLowerCase().includes("sale") ? "text-red-500 dark:text-red-400 font-extrabold" : "text-neutral-800 dark:text-neutral-200"
                }`}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>

        {/* Dynamic Auth & Dashboard Quick Actions */}
        <div className="mt-4 pt-4 border-t border-neutral-200/30 dark:border-neutral-850/30">
          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-[#007C74]/15 text-[#007C74] rounded-lg">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {user?.fullName || "Profile"}
                  </p>
                  <p className="text-[10px] text-neutral-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2 px-4 rounded-xl border border-neutral-300 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2 px-4 rounded-xl bg-[#007C74] text-white text-xs font-bold hover:bg-[#006059] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <div className="border-t border-neutral-200/30 dark:border-neutral-850/30 pt-4 flex flex-col gap-2 mt-auto pb-6">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">
            Language Settings
          </span>
          <LanguageSwitcher />
          <TranslateInitializer />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
