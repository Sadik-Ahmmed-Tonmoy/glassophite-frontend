/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Button from "@/components/ui/buttons/Button/Button";
import { FlipWords } from "@/components/ui/flip-words";
import { LinkPreview } from "@/components/ui/link-preview";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormCheckBox from "@/components/ui/MyForm/MyFormCheckBox/MyFormCheckBox";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldValues } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { z } from "zod";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const validationSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
  }).min(1, {
    message: "First name is required",
  }),

  lastName: z.string({
    required_error: "Last name is required",
  }).min(1, "Last name is required"),
  phone: z.string({
    required_error: "Phone number is required",
  }).min(1, "Phone number is required"),
  email: z.string({
    required_error: "Email is required",
  }).email("Invalid email address"),
  password: z.string({
    required_error: "Password is required",
  }).min(8, "Password must be at least 8 characters long"),
  c_password: z.string({
    required_error: "Confirm password is required",
  }).min(8, "Confirm password must be at least 8 characters long"),
}).refine((data) => data.password === data.c_password, {
  message: "Passwords don't match",
  path: ["c_password"],
});

export function RegisterWithEmail() {
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const [accepted, setAccepted] = React.useState(false);

  const handleSubmit = async (data: FieldValues) => {
    if (!accepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      const res = await register({
        email: data.email,
        password: data.password,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phoneNumber: data.phone,
        logInProcess: "EMAIL",
      }).unwrap();

      if (res?.success) {
        toast.success("Account created! Please verify your email.");
        router.push(`/auth/verify-otp?email=${data.email}&purpose=EMAIL_VERIFICATION`);
      } else {
        toast.error(res?.message || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{ boxShadow: "0px 0px 16px 0px rgba(228, 237, 240, 0.80)" }}
      className="max-w-xl w-full relative mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black z-10 my-5 md:my-0"
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Welcome to Glassophite
      </h2>
      <div className="flex justify-center items-center px-4">
        <div className="text-neutral-600 text-sm mt-2 dark:text-neutral-300 text-center">
          Are you{" "}
          <FlipWords
            duration={1800}
            className="text-[#00a76b] dark:text-[#00a76b]"
            words={["sharp", "witty", "literate", "smart", "brilliant"]}
          />{" "}
          ? <br />
          Then register now!
        </div>
      </div>

      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="flex flex-col gap-3 my-8"
      >
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-3">
          <MyFormInputAceternity
            name="firstName"
            label="First name"
            placeholder="Your First name"
          />
          <MyFormInputAceternity
            name="lastName"
            label="Last name"
            placeholder="Your Last name"
          />
        </div>
        <div className="flex flex-col gap-6 mb-4">
          <MyFormInputAceternity
            name="phone"
            label="Phone Number"
            placeholder="Your Phone Number"
          />
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
          <MyFormInputAceternity
            name="c_password"
            label="Confirm Password"
            placeholder="Re-type Your Password"
            type="password"
          />
        </div>

        <div className="mb-4">
          <MyFormCheckBox
            title="I accept the Terms &amp; Conditions"
            handleCheckboxChange={setAccepted}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br relative group/btn from-[#00a76b] dark:from-zinc-900 dark:to-zinc-900 to-[#187c57] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {isLoading ? "Creating account..." : "Sign up \u2192"}
          <BottomGradient />
        </Button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative group/btn flex space-x-2 items-center justify-center ps-2 px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <BsGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="relative group/btn flex space-x-2 items-center justify-center ps-2 px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
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

      <div className="mb-2 text-center text-neutral-600 dark:text-neutral-300 text-opacity-75 font-inter text-[14px] font-normal leading-normal">
        Already have an account?{" "}
        <LinkPreview
          url="/auth/login"
          imageSrc="https://i.ibb.co/T8z2p8G/banner-img.webp"
          isStatic
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#00a76b] to-[#00a76b] dark:text-[#00a76b]"
        >
          Login
        </LinkPreview>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
    </>
  );
};
