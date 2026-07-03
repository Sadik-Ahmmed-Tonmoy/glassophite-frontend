/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useCart } from "@/hooks/use-cart";
import "./AddToCartButton.css"; // Import your CSS file here
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    brand?: string
    size?: string
    color?: string
    colorName?: string
    price: number
    priceAfterDiscount?: number
    inStock: boolean
    quantity: number
    img?: string
  }
  productId?: string
  cartQuantity?: number
  className?: string
}

const AddToCartButton = ({ product, productId, cartQuantity, className }: AddToCartButtonProps) => {
  const { addItem, items } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!product.inStock || product.quantity < 1) {
      toast.error("Out of Stock", {
        description: "This product variant is currently out of stock.",
      })
      return
    }

    const currentCartItem = items.find(
      (item) => item.productId === productId && item.variantId === product.id
    )
    const currentQtyInCart = currentCartItem ? currentCartItem.quantity : 0
    const qtyToAdd = cartQuantity || 1

    if (currentQtyInCart + qtyToAdd > product.quantity) {
      toast.error("Stock limit reached", {
        description: `Cannot add more items. You have ${currentQtyInCart} in your cart, and only ${product.quantity} are in stock.`,
      })
      return
    }

    setIsAdding(true)

    const cartItem = {
      id: product.id || `product-${Date.now()}`, // Fallback ID if none provided
      productId: productId || "",
      variantId: product.id,
      name: product.title || "Unnamed Product",
      brand: product.brand || "EyeStyle",
      size: product.size || "Standard",
      price: product.price || 0,
      discountPrice: product.priceAfterDiscount,
      image: product.img || "/placeholder.svg?height=80&width=80",
      quantity: qtyToAdd,
      maxQuantity: product.quantity || 0,
      color: product.color,
      colorName: product.colorName || "Default",
    }

    try {
      await addItem(cartItem)

      // Show toast notification
      toast.success("Added to cart", {
        description: `${product.title} has been added to your cart`,
      })

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (err) {
      // Error toast is handled globally in use-cart.tsx
    } finally {
      setIsAdding(false)
    }
  }

  const isOutOfStock = !product.inStock || product.quantity < 1;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`CartBtn w-full bg-gradient-to-br from-green-secondary via-green-800 to-green-secondary hover:from-green-primary hover:via-green-600 hover:to-green-secondary transition-colors text-white flex justify-center items-center gap-1.5 py-3 rounded-md disabled:opacity-75 ${
        isOutOfStock ? "opacity-50 cursor-pointer" : ""
      } ${className || ""}`}
    >
      <span className="IconContainer">
        {isAdding ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 576 512"
            fill="white"
            className="cart"
          >
            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
          </svg>
        )}
      </span>
      <p className="text text-white">
        {isAdding ? "Adding..." : isOutOfStock ? "Out of Stock" : isAdded ? "Added!" : "Add to Cart"}
      </p>
    </button>
  );
};

export default AddToCartButton;
