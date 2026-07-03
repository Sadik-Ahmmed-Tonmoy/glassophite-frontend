"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAppSelector } from "@/redux/hooks";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "@/redux/features/cart/cartApi";
import { toast } from "sonner";

export interface CartItem {
  id: string
  name: string
  brand: string
  size: string
  price: number
  discountPrice?: number
  image?: string
  quantity: number
  maxQuantity: number
  color?: string
  colorName?: string
  productId?: string
  variantId?: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  saveForLater: (id: string) => void
  moveToCart: (id: string) => void
  savedItems: CartItem[]
  recentlyViewed: CartItem[]
  addToRecentlyViewed: (item: CartItem) => void
  isLoading: boolean
  isFetching: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const token = useAppSelector((state) => state.auth.access_token);
  
  const { data: dbCartData, refetch, isLoading: isCartLoading, isFetching: isCartFetching } = useGetCartQuery(undefined, { skip: !token });
  const [apiAddToCart] = useAddToCartMutation();
  const [apiUpdateCartItem] = useUpdateCartItemMutation();
  const [apiRemoveFromCart] = useRemoveFromCartMutation();
  const [apiClearCart] = useClearCartMutation();

  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [savedItems, setSavedItems] = useState<CartItem[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<CartItem[]>([])

  // Initialize cart from localStorage (only runs for guests or initial mount)
  useEffect(() => {
    setMounted(true)
    const storedCart = localStorage.getItem("cart")
    if (storedCart && !token) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setItems([])
      }
    }
  }, [token])

  // Sync DB cart items to local state for authenticated users
  useEffect(() => {
    if (token && dbCartData?.data?.items) {
      const mappedItems = dbCartData.data.items.map((backendItem: any) => {
        const variant = backendItem.variant || backendItem.product?.variants?.[0];
        return {
          id: backendItem.id, // the cartItem ID (used for update and delete)
          productId: backendItem.productId,
          variantId: backendItem.variantId || variant?.id,
          name: backendItem.product?.title || "Unnamed Frame",
          brand: backendItem.product?.brand || "Glassophite",
          size: backendItem.product?.dimensions || "Standard",
          price: variant?.priceAfterDiscount || variant?.mainPrice || 0,
          discountPrice: variant?.priceAfterDiscount,
          image: variant?.imgList?.[0]?.image || backendItem.product?.variants?.[0]?.imgList?.[0]?.image || "/placeholder.svg",
          quantity: backendItem.quantity,
          maxQuantity: variant?.quantity || 99,
          color: backendItem.color || variant?.color,
          colorName: backendItem.colorName || variant?.title,
        };
      });
      setItems(mappedItems);
    }
  }, [dbCartData, token]);

  // Update localStorage when cart changes (only for guests)
  useEffect(() => {
    if (mounted && !token) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted, token])

  // Merge local guest cart to DB upon login
  const [prevToken, setPrevToken] = useState<string | null | undefined>(token);
  useEffect(() => {
    const handleLoginSync = async () => {
      if (!prevToken && token) {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          try {
            const guestItems: CartItem[] = JSON.parse(storedCart);
            if (guestItems.length > 0) {
              for (const item of guestItems) {
                await apiAddToCart({
                  productId: item.productId || "",
                  variantId: item.variantId,
                  quantity: item.quantity,
                  color: item.color,
                  colorName: item.colorName,
                }).unwrap();
              }
              // Clear guest cart once synced
              localStorage.removeItem("cart");
              refetch();
            }
          } catch (error) {
            console.error("Failed to merge guest cart to DB:", error);
          }
        }
      }
      setPrevToken(token);
    };
    handleLoginSync();
  }, [token, prevToken, apiAddToCart, refetch]);

  // Saved items and recently viewed storage configuration (stays local)
  useEffect(() => {
    if (mounted) {
      const storedSavedItems = localStorage.getItem("savedItems")
      const storedRecentlyViewed = localStorage.getItem("recentlyViewed")

      if (storedSavedItems) {
        try {
          setSavedItems(JSON.parse(storedSavedItems))
        } catch (error) {
          console.error("Failed to parse saved items from localStorage:", error)
          setSavedItems([])
        }
      }

      if (storedRecentlyViewed) {
        try {
          setRecentlyViewed(JSON.parse(storedRecentlyViewed))
        } catch (error) {
          console.error("Failed to parse recently viewed from localStorage:", error)
          setRecentlyViewed([])
        }
      }
    }
  }, [mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("savedItems", JSON.stringify(savedItems))
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
    }
  }, [savedItems, recentlyViewed, mounted])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = items.reduce((total, item) => {
    const itemPrice = item.discountPrice || item.price
    return total + itemPrice * item.quantity
  }, 0)

  const addItem = async (newItem: CartItem) => {
    if (token) {
      try {
        await apiAddToCart({
          productId: newItem.productId || "",
          variantId: newItem.variantId || undefined,
          quantity: newItem.quantity,
          color: newItem.color,
          colorName: newItem.colorName,
        }).unwrap();
      } catch (error: any) {
        toast.error("Failed to add to cart", {
          description: error?.data?.message || "Something went wrong.",
        });
        throw error;
      }
    } else {
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems]
          const existingItem = updatedItems[existingItemIndex]
          const newQuantity = existingItem.quantity + newItem.quantity

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: Math.min(newQuantity, existingItem.maxQuantity),
          }

          return updatedItems
        } else {
          return [...prevItems, newItem]
        }
      })
    }
  }

  const removeItem = async (id: string) => {
    if (token) {
      const previousItems = [...items];
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      try {
        await apiRemoveFromCart(id).unwrap();
      } catch (error: any) {
        setItems(previousItems);
        toast.error("Failed to remove item", {
          description: error?.data?.message || "Something went wrong.",
        });
      }
    } else {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }
  }

  const updateItemQuantity = async (id: string | number, quantity: number) => {
    if (token) {
      const previousItems = [...items];
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      try {
        await apiUpdateCartItem({ itemId: id as string, quantity }).unwrap();
      } catch (error: any) {
        setItems(previousItems);
        toast.error("Failed to update quantity", {
          description: error?.data?.message || "Something went wrong.",
        });
      }
    } else {
      setItems((prevItems) => prevItems.map((item) => (item.id == id ? { ...item, quantity } : item)))
    }
  }

  const clearCart = async () => {
    if (token) {
      try {
        await apiClearCart(undefined).unwrap();
      } catch (error: any) {
        toast.error("Failed to clear cart", {
          description: error?.data?.message || "Something went wrong.",
        });
      }
    } else {
      setItems([])
    }
  }

  const saveForLater = (id: string) => {
    setItems((prevItems) => {
      const itemToSave = prevItems.find((item) => item.id === id)
      if (itemToSave) {
        setSavedItems((prev) => [...prev, itemToSave])
        return prevItems.filter((item) => item.id !== id)
      }
      return prevItems
    })
  }

  const moveToCart = (id: string) => {
    setSavedItems((prevItems) => {
      const itemToMove = prevItems.find((item) => item.id === id)
      if (itemToMove) {
        addItem(itemToMove)
        return prevItems.filter((item) => item.id !== id)
      }
      return prevItems
    })
  }

  const addToRecentlyViewed = useCallback(
    (item: CartItem) => {
      if (recentlyViewed.some((i) => i.id === item.id)) {
        return
      }

      setRecentlyViewed((prev) => {
        const newItems = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 5)
        return newItems
      })
    },
    [recentlyViewed],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        savedItems,
        recentlyViewed,
        addToRecentlyViewed,
        isLoading: token ? isCartLoading : false,
        isFetching: token ? isCartFetching : false,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
