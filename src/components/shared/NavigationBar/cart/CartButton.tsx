"use client"
 
import { useCart } from "@/hooks/use-cart"
import { MdOutlineShoppingBag } from "react-icons/md"
import { Loader2 } from "lucide-react"
import styles from "../PCNavBar/PCNavBar.module.css"
import { cn } from "@/lib/utils"

interface CartButtonProps {
  onClick?: () => void;
  className?: string;
  isMobile?: boolean;
}

export default function CartButton({ onClick, className, isMobile }: CartButtonProps) {
  const { totalItems, isLoading, isFetching } = useCart()
  const showLoader = isLoading || isFetching;

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer",
          className
        )}
        aria-label="Open shopping bag"
      >
        <MdOutlineShoppingBag className="w-5 h-5" />
        {showLoader ? (
          <span className="absolute -top-0.5 -right-0.5 rounded-full h-4 w-4 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] shadow-sm">
            <Loader2 className="w-2.5 h-2.5 animate-spin text-[#007C74]" />
          </span>
        ) : totalItems > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 rounded-full h-4 w-4 min-w-[16px] text-white flex items-center justify-center bg-[#007C74] text-[10px] font-extrabold shadow-sm">
            {totalItems}
          </span>
        ) : null}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(`${styles.accountButton} ${styles.textHoverEffect} relative cursor-pointer`, className)}
      aria-label="Open cart"
    >
      <MdOutlineShoppingBag className="w-6 h-6" />
      <span className="relative">
        <span data-translate className="hidden lg:block">My Bag</span>
        <span className={cn(styles.text, "hidden lg:block")} data-translate>My Bag</span>
      </span>
      {showLoader ? (
        <span className="absolute -top-[6px] right-[1px] rounded-full h-[18px] w-[18px] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">
          <Loader2 className="w-3 h-3 animate-spin text-[#00a76b]" />
        </span>
      ) : totalItems > 0 ? (
        <span className="absolute -top-[6px] right-[1px] rounded-full h-[18px] w-[18px] text-white flex items-center justify-center bg-[#00a76b] text-xs font-bold">
          {totalItems}
        </span>
      ) : null}
    </button>
  )
}

