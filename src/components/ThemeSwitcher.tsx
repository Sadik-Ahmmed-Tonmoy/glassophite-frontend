// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-neutral-700 dark:text-neutral-300", className)}>
        <IoSunnyOutline className="w-5 h-5" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <IoSunnyOutline className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <IoMoonOutline className="w-5 h-5 text-neutral-700 dark:text-neutral-300 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

