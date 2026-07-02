/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import Button from "@/components/ui/buttons/Button/Button";
import BottomGradient from "@/components/ui/BottomGradient";
import { FiArrowLeft } from "react-icons/fi";

const validationSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const handleSubmit = async (data: FieldValues) => {
    if (!email || !token) {
      toast.error("Invalid reset link. Please start again.");
      router.push("/auth/forgot-password");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        token,
        password: data.password,
      }).unwrap();

      if (res?.success) {
        toast.success("Password reset successfully! Please login.");
        router.push("/auth/login");
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  if (!email || !token) {
    return (
      <div className="max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 bg-white dark:bg-black relative z-10 my-5 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">Invalid or expired reset link.</p>
        <Button onClick={() => router.push("/auth/forgot-password")} className="mt-4">
          Request New Reset
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{ boxShadow: "0px 0px 16px 0px rgba(228, 237, 240, 0.80)" }}
      className="max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative z-10 my-5"
    >
      <button
        onClick={() => router.push("/auth/login")}
        className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#00a76b] transition-colors mb-6"
      >
        <FiArrowLeft /> Back to login
      </button>

      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Set New Password
      </h2>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-400 text-center max-w-sm mx-auto">
        Enter your new password for <strong className="text-[#00a76b]">{email}</strong>
      </p>

      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="flex flex-col gap-3 my-8"
      >
        <div className="flex flex-col gap-6 mb-4">
          <MyFormInputAceternity
            name="password"
            label="New Password"
            placeholder="Enter new password"
            type="password"
          />
          <MyFormInputAceternity
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-type new password"
            type="password"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-[#00a76b] dark:from-zinc-900 dark:to-zinc-900 to-[#187c57] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {isLoading ? "Resetting..." : "Reset Password \u2192"}
          <BottomGradient />
        </Button>
      </MyFormWrapper>
    </div>
  );
}
