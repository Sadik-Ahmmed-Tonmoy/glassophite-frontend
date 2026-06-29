/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

export default function MobileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Sunglasses", href: "/product-filter" },
    { label: "Optical Glasses", href: "/product-filter" },
    { label: "My Profile", href: "/my-profile" },
    { label: "Admin Dashboard", href: "/dashboard" },
    { label: "Login", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50">
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent justify="center" className="pr-10">
        <NavbarBrand>
          <Link href="/">
            <span className="text-xl font-bold tracking-wider text-[#007C74] dark:text-white cursor-pointer">
              Glassophite
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarMenu className="bg-white/95 dark:bg-black/95 backdrop-blur-md pt-6 flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full text-lg py-2 block border-b border-neutral-100 dark:border-neutral-900 text-neutral-800 dark:text-neutral-200 hover:text-[#007C74] dark:hover:text-[#007C74] transition-colors"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
