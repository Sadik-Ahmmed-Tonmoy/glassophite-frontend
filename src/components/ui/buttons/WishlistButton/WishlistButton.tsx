"use client";
import "./WishlistButton.css"; // Import your CSS file here
import { useAppSelector } from "@/redux/hooks";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/redux/features/wishlist/wishlistApi";
import { toast } from "sonner";
import { useMemo } from "react";
import { Heart, Loader2 } from "lucide-react";

interface WishlistButtonProps {
  productId?: string;
  productName?: string;
  className?: string;
}

const WishlistButton = ({ productId, productName, className }: WishlistButtonProps) => {
  const token = useAppSelector((state) => state.auth.access_token);
  const { data: wishlistData, isFetching } = useGetWishlistQuery(undefined, { skip: !token });
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  const isLoading = isAdding || isRemoving;

  const isWishlisted = useMemo(() => {
    if (!wishlistData?.data?.items || !productId) return false;
    return wishlistData.data.items.some((item: { productId: string }) => item.productId === productId);
  }, [wishlistData, productId]);

  const handleWishlistClick = async () => {
    if (!productId) return;
    if (!token) {
      toast.error("Please log in", {
        description: "You must be logged in to save items to your wishlist.",
      });
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId).unwrap();
        toast.success("Removed from Wishlist", {
          description: productName ? `${productName} has been removed from your saved items.` : "Product removed from wishlist.",
        });
      } else {
        await addToWishlist(productId).unwrap();
        toast.success("Added to Wishlist", {
          description: productName ? `${productName} has been saved to your items.` : "Product saved to wishlist.",
        });
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error("Wishlist action failed", {
        description: error?.data?.message || "Something went wrong.",
      });
    }
  };

  const isPending = isLoading;

  return (
    <button 
      onClick={handleWishlistClick}
      disabled={isPending}
      className={`WishBtn w-full flex justify-center items-center gap-1.5 py-3 rounded-md transition-all duration-300 font-bold border cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
        isWishlisted 
          ? "bg-red-500 hover:bg-red-650 border-red-500 text-white" 
          : "bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
      } ${className || ""}`}
    >
      <span className="flex items-center justify-center gap-2">
        {isPending || isFetching ? (
          <Loader2 className="w-4 h-4 animate-spin text-current max-sm:hidden" />
        ) : (
          <Heart className={`w-4 h-4 max-sm:hidden ${isWishlisted ? "fill-white text-white" : "text-red-500"}`} />
        )}
        <p className="font-semibold text-sm">
          {isPending || isFetching ? (
            <>
              <span className="max-sm:hidden">Updating Wishlist...</span>
              <span className="sm:hidden">Updating</span>
            </>
          ) : isWishlisted ? (
            <>
              <span className="max-sm:hidden">Remove from Wishlist</span>
              <span className="sm:hidden">Remove</span>
            </>
          ) : (
            <>
              <span className="max-sm:hidden">Add to Wishlist</span>
              <span className="sm:hidden">Wishlist</span>
            </>
          )}
        </p>
      </span>
    </button>
  );
};

export default WishlistButton;

