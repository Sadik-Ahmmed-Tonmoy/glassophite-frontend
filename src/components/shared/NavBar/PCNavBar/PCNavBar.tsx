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
    <div className={`${styles.navbar} w-full dark:bg-[#1f2020] dark:`}>
      {/* first row start */}
      <div className=" w-full container mx-auto flex justify-between items-center py-3">
        <Link href={"/"}>
          <h3 className="text-2xl me-32 ">LOGO</h3>
        </Link>

        <div className="  w-[40%]">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>

        <div className=" flex items-center gap-5 text-xs whitespace-nowrap">
          <Link href={"/auth/login"}>
            <button
              className={`${styles.accountButton} ${styles.textHoverEffect}`}
            >
              <BsPerson className="w-6 h-6" />

              <span className="relative">
                Account
                <span className={styles.text}>Account</span>
              </span>
            </button>
          </Link>

          <button
            className={`${styles.accountButton} ${styles.textHoverEffect}`}
          >
            <AiOutlineHeart className="w-6 h-6 " />
            <span className="relative">
              Wishlist
              <span className={styles.text}> Wishlist</span>
            </span>
            <p className="absolute -top-[6px] right-[0px] rounded-full bg-primary-color h-[18px] w-[18px] text-white flex items-center justify-center bg-[#00a76b] text-xs">
              0
            </p>
          </button>
          <button
            className={`${styles.accountButton} ${styles.textHoverEffect}`}
          >
            <MdOutlineShoppingBag className="w-6 h-6 " />

            <span className="relative">
              My Bag
              <span className={styles.text}>My Bag</span>
            </span>
            <p className="absolute -top-[6px] right-[1px] rounded-full h-[18px] w-[18px] text-white flex items-center justify-center bg-[#00a76b] text-xs">
              0
            </p>
          </button>

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
                    <CountUp
                      enableScrollSpy={true}
                      duration={3}
                      start={100}
                      end={5 > 0 ? 2500 : 0}
                    />
                  </span>
                ) : (
                  <span className="ms-1">0</span>
                )}
              </p>
            </div>
          </div>
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
