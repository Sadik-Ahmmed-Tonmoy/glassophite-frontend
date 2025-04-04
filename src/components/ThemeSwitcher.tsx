// app/components/ThemeSwitcher.tsx
"use client";


import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // if(!mounted) return <Switch/>
  if (!mounted) return <IoSunnyOutline size={25} className="cursor-pointer" />;

  return (
    <div>
      {theme === "dark" ? (
        <IoSunnyOutline size={25} onClick={() => setTheme("light")} className="cursor-pointer" />
      ) : (
        <IoMoonOutline size={20} onClick={() => setTheme("dark")} className="cursor-pointer" />
      )}

      {/* <Switch isSelected={theme === "dark" ? true : false}
      onValueChange={(e) => setTheme(theme === "dark" ? "light" : "dark")}
      /> */}
    </div>
  );
}
