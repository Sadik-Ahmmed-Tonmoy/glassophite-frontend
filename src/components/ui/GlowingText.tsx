// src/components/ui/GlowingText.tsx
"use client";

import { motion } from "framer-motion";

interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlowingText({ children, className }: GlowingTextProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        textShadow: [
          "0 0 20px rgba(0,124,116,0.3)",
          "0 0 40px rgba(0,124,116,0.5)",
          "0 0 20px rgba(0,124,116,0.3)",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}