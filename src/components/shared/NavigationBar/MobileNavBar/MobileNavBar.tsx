"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import CartButton from "../cart/CartButton";
import {
  LanguageSwitcher,
  TranslateInitializer,
} from "@/lib/GoogleTranslateProvider";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function MobileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Sunglasses", href: "/product-filter" },
    { label: "Optical Glasses", href: "/product-filter" },
    { label: "My Profile", href: "/my-profile" },
    { label: "Admin Dashboard", href: "/dashboard" },
  ];

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
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted search");
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
                className="w-full text-base py-2 block border-b border-neutral-100 dark:border-neutral-900 text-neutral-800 dark:text-neutral-200 hover:text-[#007C74] dark:hover:text-[#007C74] transition-colors font-semibold"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>

        {/* Dynamic Auth & Dashboard Quick Actions */}
        <div className="flex gap-3 mt-4">
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
