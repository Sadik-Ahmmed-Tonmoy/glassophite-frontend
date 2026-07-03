/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
  className,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
  className?: string;
}) => {
  const hasChildren = !!children;

  const labelContent = (
    <span
      className={`${active === item ? "text-[#00a76b]" : ""} ${
        item.toLowerCase().includes("sale") ? "text-red-500 font-extrabold" : ""
      } relative group font-medium`}
      onClick={() => setActive("")}
    >
      {item}
      <span className="absolute left-0 -bottom-5 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </span>
  );

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {/* Items without children → full Link navigation */}
        {/* Items with children → span label (hover opens dropdown, no accidental navigation) */}
        {href && !hasChildren ? (
          <Link href={href}>{labelContent}</Link>
        ) : href && hasChildren ? (
          <Link href={href} onClick={(e) => e.stopPropagation()}>{labelContent}</Link>
        ) : (
          <span>{labelContent}</span>
        )}
      </motion.p>
      {active !== null && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div
              className={cn(
                "absolute top-[calc(100%_+_1rem)] left-1/2 transform -translate-x-1/2 pt-4",
                className
              )}
            >
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={cn(
        "relative border-transparent dark:bg-transparent dark:border-white/[0.2]  flex justify-center space-x-4 px-8 py-6 z-40",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({ title, description, href, src }: { title: string; description: string; href: string; src: string }) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image src={src} width={150} height={150} alt={title} className="flex-shrink-0 rounded-md shadow-2xl" />
      <div>
        <h4 className="text-xl whitespace-nowrap mb-1 text-black dark:text-white hover:text-[#00a76b] w-min  font-bold relative group cursor-pointer">
          {title}
          <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#00a76b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">{description}</p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link {...rest} className="text-neutral-700 dark:text-neutral-200 hover:text-black ">
      {children}
    </Link>
  );
};
