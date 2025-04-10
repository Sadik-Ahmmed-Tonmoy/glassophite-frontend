"use client";
import { useCart } from "@/hooks/use-cart";
import "./AddToCartButton.css"; // Import your CSS file here
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


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
  cartQuantity?: number
  className?: string
}

const AddToCartButton = ({ product, cartQuantity, className = "" }: AddToCartButtonProps) => {

    // Add the toast function
    const { addItem } = useCart()
    const { toast } = useToast()
    const [isAdded, setIsAdded] = useState(false)
  
    const handleAddToCart = () => {
      if (!product.inStock) return
  
      const cartItem = {
        id: product.id || `product-${Date.now()}`, // Fallback ID if none provided
        name: product.title || "Unnamed Product",
        brand: product.brand || "EyeStyle",
        size: product.size || "Standard",
        price: product.price || 0,
        discountPrice: product.priceAfterDiscount,
        image: product.img || "/placeholder.svg?height=80&width=80",
        quantity: cartQuantity || 1,
        maxQuantity: product.quantity || 0,
        color: product.color,
        colorName: product.colorName || "Default",
      }
  
      addItem(cartItem)
  
      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
        type: "success",
      })
  
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }

    
  return (
    <button
    onClick={handleAddToCart}
    disabled={!product.inStock}
    
    className="CartBtn w-full bg-gradient-to-br from-green-secondary via-green-800 to-green-secondary hover:from-green-primary hover:via-green-600 hover:to-green-secondary transition-colors text-white flex justify-center items-center gap-1 py-3 rounded-md">
      <span className="IconContainer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 576 512"
          fill="white"
          className="cart"
        >
          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
        </svg>
      </span>
      <p className="text text-white">Add to Cart</p>
    </button>
  );
};

export default AddToCartButton;
