/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { AiOutlineHeart } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { MdOutlineShoppingBag } from "react-icons/md";
import { PiShoppingBagOpenFill } from "react-icons/pi";
import DropDownMenus from "../DropDownMenus/DropDownMenus";
import styles from "./PCNavBar.module.css";
import CartButton from "../cart/CartButton";
import { LanguageSwitcher, TranslateInitializer } from "@/lib/GoogleTranslateProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetMeQuery, useLogoutMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetWishlistQuery } from "@/redux/features/wishlist/wishlistApi";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "../cart/CartDrawer";
import { Loader2 } from "lucide-react";

const PCNavBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.access_token);
  const { data: meData } = useGetMeQuery(undefined, { skip: !token });
  const { data: wishlistData, isLoading: isWishlistLoading, isFetching: isWishlistFetching } = useGetWishlistQuery(undefined, { skip: !token });
  const [logoutApi] = useLogoutMutation();
  const { totalItems, totalPrice, isLoading: isCartLoading, isFetching: isCartFetching } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const user = meData?.data || meData;
  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
    } catch {
      // safe fallback
    }
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };
  const [shakeCartFloatingButton, setShakeCartFloatingButton] = useState(false);
  const prevTotalItemsRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip on initial load (when prevTotalItemsRef is null) or while loading
    if (isCartLoading || isCartFetching) return;
    if (prevTotalItemsRef.current === null) {
      prevTotalItemsRef.current = totalItems;
      return;
    }
    if (totalItems > prevTotalItemsRef.current) {
      setShakeCartFloatingButton(true);
      const timer = setTimeout(() => setShakeCartFloatingButton(false), 1200);
      prevTotalItemsRef.current = totalItems;
      return () => clearTimeout(timer);
    }
    prevTotalItemsRef.current = totalItems;
  }, [totalItems, isCartLoading, isCartFetching]);
  const [searchValue, setSearchValue] = useState("");
  // search bar start
  const placeholders = [
    "polarized sunglasses",
    "UV protection glasses",
    "blue light blocking glasses",
    "aviator sunglasses",
    "sports sunglasses",
    "prescription sunglasses",
    "designer sunglasses",
    "mirrored sunglasses",
    "round frame sunglasses",
    "retro style sunglasses",
    "wayfarer sunglasses",
    "oversized sunglasses",
    "kids sunglasses",
    "foldable sunglasses",
    "photochromic lenses",
    "gradient lenses",
    "cat eye sunglasses",
    "square frame sunglasses",
    "vintage sunglasses",
    "bamboo frame sunglasses",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/product-filter?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };
  // search bar end
  return (
    <div className={`${styles.navbar} w-full dark:bg-[#1f2020 dark:`}>
      {/* first row start */}
      <div className=" w-full container mx-auto flex justify-between items-center py-3">
        <Link href={"/"}>
          <h3 className="text-2xl me-32 font-bold tracking-wider text-[#007C74] dark:text-white">
            Glassophite
          </h3>
        </Link>

        <div className="  w-[40%]">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>

        <div className=" flex items-center gap-5 text-xs whitespace-nowrap">
          <div className="relative group">
            <button
              className={`${styles.accountButton} ${styles.textHoverEffect} flex items-center gap-2 cursor-pointer`}
            >
              <BsPerson className="w-6 h-6" />
              <span className="relative">
                <span data-translate>{isLoggedIn ? (user?.fullName || "Profile") : "Account"}</span>
                <span className={styles.text} data-translate>{isLoggedIn ? (user?.fullName || "Profile") : "Account"}</span>
              </span>
            </button>
            
            {/* Account Dropdown Menu */}
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 text-xs">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2 border-b border-neutral-150 dark:border-neutral-850 text-[10px] text-neutral-500 font-medium">
                      Signed in as <br />
                      <strong className="text-neutral-900 dark:text-white truncate block">{user?.email}</strong>
                    </div>
                    <Link href="/my-profile" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/dashboard" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-650 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                      Login / Sign In
                    </Link>
                    <Link href="/auth/register" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                      Register Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link href="/wishlist">
            <button
              className={`${styles.accountButton} ${styles.textHoverEffect}`}
            >
              <AiOutlineHeart className="w-6 h-6 " />
              <span className="relative">
               <span data-translate>Wishlist</span>
                <span className={styles.text} data-translate>Wishlist</span>
              </span>
              {isWishlistLoading || isWishlistFetching ? (
                <span className="absolute -top-[6px] right-[0px] rounded-full bg-neutral-200 dark:bg-neutral-800 h-[18px] w-[18px] flex items-center justify-center text-xs">
                  <Loader2 className="w-3 h-3 animate-spin text-[#00a76b]" />
                </span>
              ) : (
                <span className="absolute -top-[6px] right-[0px] rounded-full h-[18px] w-[18px] text-white flex items-center justify-center bg-[#00a76b] text-xs font-bold">
                  {wishlistData?.data?.items?.length || 0}
                </span>
              )}
            </button>
          </Link>
          <CartButton onClick={() => setIsCartOpen(true)} />

          <ThemeSwitcher />

          {/* cart floating button start */}
          <div
            onClick={() => setIsCartOpen(true)}
            className={cn(
              shakeCartFloatingButton ? `${styles.addToBagCartShake}` : "",
              "absolute top-[200%] w-[80px] right-0 rounded-ss-lg rounded-es-lg overflow-hidden hover:cursor-pointer z-50 shadow-lg"
            )}
          >
            <div className="bg-[#192038]  py-3 px-4 flex flex-col items-center">
              <PiShoppingBagOpenFill size={35} className="text-white" />
              <p className="text-white font-Inter text-sm font-medium leading-normal tracking-[-0.42px] whitespace-nowrap min-h-[20px] flex items-center justify-center">
                {isCartLoading || isCartFetching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`
                )}
              </p>
            </div>
            <div className="bg-green-primary  py-3 px-4 flex flex-col items-center">
              <p className="text-white font-Inter text-sm font-medium leading-normal tracking-[-0.42px] whitespace-nowrap min-h-[20px] flex items-center justify-center">
                {isCartLoading || isCartFetching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  `৳${totalPrice}`
                )}
              </p>
            </div>
          </div>
          <TranslateInitializer />
           <LanguageSwitcher  />
          {/* floating button end*/}

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </div>
      {/* first row end */}
      {/* second row start */}
      <div className="border-y-1">
        <div className="w-full container mx-auto flex justify-center items-center ">
          <DropDownMenus />
        </div>
      </div>
      {/* second row end*/}
    </div>
  );
};

export default PCNavBar;
