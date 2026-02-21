"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function BackTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const toggleVisible = () => {
        setVisible(window.scrollY > 400);
      };
      
      window.addEventListener("scroll", toggleVisible);
      toggleVisible();
      
      return () => window.removeEventListener("scroll", toggleVisible);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  return (
    // <AnimatePresence mode="wait">
    <>
      {visible && (
        <motion.button
        key="back-top-button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#007C74] text-white shadow-lg transition-colors hover:bg-[#00665f] focus:outline-none focus:ring-2 focus:ring-[#007C74] focus:ring-offset-2"
        aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
      </>
    // </AnimatePresence>
  );
}

export const FloatButton = {
  BackTop,
};