/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import { AiOutlineHeart } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { MdOutlineShoppingBag } from "react-icons/md";
import { PiShoppingBagOpenFill } from "react-icons/pi";
import DropDownMenus from "../DropDownMenus/DropDownMenus";
import styles from "./PCNavBar.module.css";
import CartButton from "../cart/CartButton";
import { LanguageSwitcher, TranslateInitializer } from "@/lib/GoogleTranslateProvider";

const PCNavBar = () => {
  const [shakeCartFloatingButton, setShakeCartFloatingButton] = useState(false);
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
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
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
                <span data-translate>Account</span>
                <span className={styles.text} data-translate>Account</span>
              </span>
            </button>
            
            {/* Account Dropdown Menu */}
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 text-xs">
                <Link href="/my-profile" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                  My Profile
                </Link>
                <Link href="/dashboard" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                  Admin Dashboard
                </Link>
                <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />
                <Link href="/auth/login" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                  Login / Sign In
                </Link>
                <Link href="/auth/register" className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-200 font-bold transition-colors">
                  Register Account
                </Link>
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
              <p className="absolute -top-[6px] right-[0px] rounded-full bg-primary-color h-[18px] w-[18px] text-white flex items-center justify-center bg-[#00a76b] text-xs">
                0
              </p>
            </button>
          </Link>
          <button
            className={`${styles.accountButton} ${styles.textHoverEffect}`}
          >
            <MdOutlineShoppingBag className="w-6 h-6 " />

            <span className="relative"   >
             <span data-translate> My Bag</span>
              <span className={styles.text} data-translate>My Bag</span>
            </span>
            <p className="absolute -top-[6px] right-[1px] rounded-full h-[18px] w-[18px] text-white flex items-center justify-center bg-[#00a76b] text-xs">
              0
            </p>
          </button>
           <CartButton />

          <ThemeSwitcher />

          {/* cart floating button start */}
          <div
            className={cn(
              shakeCartFloatingButton ? `${styles.addToBagCartShake}` : "",
              "absolute top-[200%] w-[80px] right-0 rounded-ss-lg rounded-es-lg overflow-hidden hover:cursor-pointer"
            )}
          >
            <div className="bg-[#192038]  py-3 px-4 flex flex-col items-center">
              <PiShoppingBagOpenFill size={35} className="text-white" />
              <p className="text-white font-Inter text-sm font-medium leading-normal tracking-[-0.42px] whitespace-nowrap">
                5 Items
              </p>
            </div>
            <div className="bg-green-primary  py-3 px-4 flex flex-col items-center">
              <p className="text-white font-Inter text-sm font-medium leading-normal tracking-[-0.42px] whitespace-nowrap">
                ৳
                {5 > 0 ? (
                  <span className="ms-1">
                    {/* <CountUp
                      enableScrollSpy={true}
                      duration={3}
                      start={100}
                      end={5 > 0 ? 2500 : 0}
                    /> */}
                  </span>
                ) : (
                  <span className="ms-1">0</span>
                )}
              </p>
            </div>
          </div>
          <TranslateInitializer />
           <LanguageSwitcher  />
          {/* floating button end*/}
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
