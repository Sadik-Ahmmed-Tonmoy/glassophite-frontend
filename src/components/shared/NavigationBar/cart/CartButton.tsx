"use client"

import { useCart } from "@/hooks/use-cart"
import { MdOutlineShoppingBag } from "react-icons/md"
import { Loader2 } from "lucide-react"
import styles from "../PCNavBar/PCNavBar.module.css"

interface CartButtonProps {
  onClick?: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { totalItems, isLoading, isFetching } = useCart()
  const showLoader = isLoading || isFetching;

  return (
    <button
      onClick={onClick}
      className={`${styles.accountButton} ${styles.textHoverEffect} relative cursor-pointer`}
      aria-label="Open cart"
    >
      <MdOutlineShoppingBag className="w-6 h-6" />
      <span className="relative">
        <span data-translate>My Bag</span>
        <span className={styles.text} data-translate>My Bag</span>
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
