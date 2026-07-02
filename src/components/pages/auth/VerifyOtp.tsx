/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { useOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import Button from "@/components/ui/buttons/Button/Button";
import BottomGradient from "@/components/ui/BottomGradient";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";

const validationSchema = z.object({
  code: z
    .string({ required_error: "Verification code is required" })
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be numeric"),
});

export function VerifyOtp() {
  const [verifyOtp, { isLoading }] = useOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const purpose = (searchParams.get("purpose") as "EMAIL_VERIFICATION" | "PASSWORD_RESET") || "EMAIL_VERIFICATION";

  const handleSubmit = async (data: FieldValues) => {
    if (!email) {
      toast.error("No email provided. Please start again.");
      router.push("/auth/login");
      return;
    }

    try {
      const res = await verifyOtp({
        email,
        code: data.code,
        purpose,
      }).unwrap();

      if (!res?.success) {
        toast.error(res?.message || "Verification failed");
        return;
      }

      if (purpose === "EMAIL_VERIFICATION") {
        dispatch(setUser({
          user: null,
          access_token: res.data.accessToken,
          refresh_token: res.data.refreshToken,
        }));
        toast.success("Email verified! Welcome to Glassophite.");
        router.push("/");
      } else {
        toast.success("Code verified! Please set a new password.");
        router.push(`/auth/reset-password?email=${email}&token=${res.data.resetPasswordToken}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Invalid or expired code");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await resendOtp({ email, purpose }).unwrap();
      toast.success("New code sent to your email");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code");
    }
  };

  if (!email) {
    return (
      <div className="max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 bg-white dark:bg-black relative z-10 my-5 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">Missing email. Please start again.</p>
        <Button onClick={() => router.push("/auth/login")} className="mt-4">
          Go to Login
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
        onClick={() => router.push(purpose === "PASSWORD_RESET" ? "/auth/forgot-password" : "/auth/login")}
        className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#00a76b] transition-colors mb-6"
      >
        <FiArrowLeft /> Back
      </button>

      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Verify Your Email
      </h2>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-400 text-center max-w-sm mx-auto">
        We sent a 6-digit code to <strong className="text-[#00a76b]">{email}</strong>
      </p>

      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="flex flex-col gap-3 my-8"
      >
        <MyFormInputAceternity
          name="code"
          label="Verification Code"
          placeholder="Enter 6-digit code"
          maxLength={6}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-[#00a76b] dark:from-zinc-900 dark:to-zinc-900 to-[#187c57] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {isLoading ? "Verifying..." : "Verify Code \u2192"}
          <BottomGradient />
        </Button>
      </MyFormWrapper>

      <div className="text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1 text-[#00a76b] hover:underline font-medium disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}
