/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

import { FlipWords } from "@/components/ui/flip-words";
import { LinkPreview } from "@/components/ui/link-preview";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";

import MyFormCheckBox from "@/components/ui/MyForm/MyFormCheckBox/MyFormCheckBox";
import Link from "next/link";
import { FieldValues } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import Button from "@/components/ui/buttons/Button/Button";
import BottomGradient from "@/components/ui/BottomGradient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const validationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long"),
});

export function LoginWithEmail() {
  const [checked, setChecked] = React.useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (data: FieldValues) => {
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        keepMeLogin: checked,
      }).unwrap();

      if (!res?.success) {
        toast.error(res?.message || "Login failed");
        return;
      }

      if (res.data?.isVerified) {
        dispatch(setUser({
          user: { role: res.data.role, email: data.email },
          access_token: res.data.accessToken,
          refresh_token: res.data.refreshToken,
        }));
        toast.success("Welcome back!");
        router.push(redirect);
      } else {
        toast.info("Please verify your email first");
        router.push(`/auth/verify-otp?email=${data.email}&purpose=EMAIL_VERIFICATION&redirect=${encodeURIComponent(redirect)}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{ boxShadow: "0px 0px 16px 0px rgba(228, 237, 240, 0.80)" }}
      className="max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative z-10 my-5"
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Welcome to Glassophite
      </h2>
      {redirect && redirect.includes("checkout") && (
        <div className="mt-3 p-3 bg-[#007C74]/10 dark:bg-[#007C74]/20 border border-[#007C74]/30 rounded-lg text-[#007C74] text-center text-xs font-semibold">
          Please login to complete your order checkout
        </div>
      )}
      <div className=" flex justify-center items-center px-4">
        <div className="text-neutral-600 text-sm mt-2 dark:text-neutral-300 text-center">
          Are you{" "}
          <FlipWords
            duration={1800}
            className="text-[#00a76b] dark:text-[#00a76b]"
            words={["sharp", "witty", "literate", "smart", "brilliant"]}
          />{" "}
          ? <br />
          Then login now!
        </div>
      </div>

      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="flex flex-col gap-3 my-8"
      >
        <div className="flex flex-col gap-6 mb-4">
          <MyFormInputAceternity
            name="email"
            label="Email Address"
            placeholder="Enter Your Email Address"
          />
          <MyFormInputAceternity
            name="password"
            label="Password"
            placeholder="Enter Your Password"
            type="password"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <MyFormCheckBox
            title="Remember Me"
            handleCheckboxChange={setChecked}
          />

          <Link href={"/auth/forgot-password"}>
            <p className="text-black-80 font-inter text-[14px] font-normal leading-normal tracking-[-0.14px]">
              Forgot Password?
            </p>
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-[#00a76b] dark:from-zinc-900 dark:to-zinc-900 to-[#187c57] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {isLoading ? "Logging in..." : "Log in \u2192"}
          <BottomGradient />
        </Button>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-center ps-2 px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <BsGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-center ps-2 px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <BsGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </MyFormWrapper>

      <div className="mb-2 lg:mb-10 text-center text-neutral-600  dark:text-neutral-300 text-opacity-75 font-inter text-[14px] font-normal leading-normal">
        Don&apos;t have an account?
        <LinkPreview
          url="/auth/register"
          imageSrc="https://i.ibb.co/T8z2p8G/banner-img.webp"
          isStatic
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#00a76b] to-[#00a76b] dark:text-[#00a76b] ps-1"
        >
          Register
        </LinkPreview>
      </div>
    </div>
  );
}
