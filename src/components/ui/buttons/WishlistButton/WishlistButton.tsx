"use client";
import { useState } from "react";
import "./WishlistButton.css"; // Import your CSS file here
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const WishlistButton = () => {
    
  const [isWishlistActive, setIsWishlistActive] = useState(false);
    const toggleWishlist = () => {
        setIsWishlistActive(!isWishlistActive);
    };
  return (
    <button className="WishBtn w-full bg-gradient-to-br from-red-800 via-red-500 to-red-700 hover:from-red-500 hover:via-red-600 hover:to-red-500 transition-colors text-white flex justify-center items-center gap-1 py-3 rounded-md">
      <span className="IconContainer p-2 !hidden sm:!block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          fill="white"
          className="heart"
        >
          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
        </svg>
      </span>
       {/* Wishlist Button */}
            <div
            className={cn(
                "!block sm:!hidden",
                isWishlistActive ? "scale-110" : "scale-100")}
            onClick={toggleWishlist}
            aria-label={isWishlistActive ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlistActive ? "fill-white text-red-500 " : "text-white"}`} />
          </div>
      <p className=" text-white hidden sm:block">Add to Wishlist</p>
    </button>
  );
};

export default WishlistButton;
