/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import Button from "@/components/ui/buttons/Button/Button";
import BottomGradient from "@/components/ui/BottomGradient";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const validationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
});

export function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (data: FieldValues) => {
    try {
      const res = await forgotPassword({ email: data.email }).unwrap();

      if (res?.success) {
        toast.success("Password reset OTP sent to your email");
        router.push(`/auth/verify-otp?email=${data.email}&purpose=PASSWORD_RESET`);
      } else {
        toast.error(res?.message || "Failed to send OTP");
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
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#00a76b] transition-colors mb-6"
      >
        <FiArrowLeft /> Back to login
      </Link>

      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Forgot Password?
      </h2>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-400 text-center max-w-sm mx-auto">
        Enter your email address and we&apos;ll send you a code to reset your password.
      </p>

      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="flex flex-col gap-3 my-8"
      >
        <MyFormInputAceternity
          name="email"
          label="Email Address"
          placeholder="Enter Your Email Address"
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-[#00a76b] dark:from-zinc-900 dark:to-zinc-900 to-[#187c57] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {isLoading ? "Sending..." : "Send Reset Code \u2192"}
          <BottomGradient />
        </Button>
      </MyFormWrapper>
    </div>
  );
}
