"use client"

import type { ReactNode } from "react"
import { CartProvider as CartContextProvider } from "@/hooks/use-cart"

export default function CartProvider({ children }: { children: ReactNode }) {
  // Remove the initialization state which might be causing re-renders
  return <CartContextProvider>{children}</CartContextProvider>
}
