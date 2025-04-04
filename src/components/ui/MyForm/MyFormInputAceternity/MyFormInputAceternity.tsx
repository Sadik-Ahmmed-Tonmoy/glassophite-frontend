/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  size?: string;
  placeholder?: string;
  parentClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  [key: string]: any; // Allow other props
};

const MyFormInputAceternity = React.forwardRef<HTMLInputElement, TInputProps>(
  ({ name, label, type = "text", size = "medium", placeholder, parentClassName = "", labelClassName = "", inputClassName = "", ...rest }, ref) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const radius = 100; // change this to increase the radius of the hover effect
    const [visible, setVisible] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const { control } = useFormContext();

    return (
      <div className={cn(`form-group w-full ${size}`, parentClassName)}>
        {label && (
          <p
            className={cn(
              "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 ms-1",
              labelClassName
            )}
          >
            {label}
          </p>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <motion.div
              style={{
                background: useMotionTemplate`
                  radial-gradient(
                    ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
                    #00a76b,
                    transparent 80%
                  )
                `,
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              className="p-[2px] rounded-lg transition duration-300 group/input relative"
            >
              <input
                type={type === "password" && isShowPassword ? "text" : type}
                className={cn(
                  `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
                  file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
                  focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                  group-hover/input:shadow-none transition duration-400`,
                  inputClassName
                )}
                placeholder={placeholder}
                {...field}
                {...rest}
                value={field.value ?? ""} // Ensure the input is always controlled
                ref={ref}
              />
              {type === "password" && (
                <span onClick={() => setIsShowPassword((prev) => !prev)} className="absolute right-4 top-[13px] hover:cursor-pointer">
                  {isShowPassword ? <IoEyeOff size={16} className="text-[#807D7E]" /> : <IoEyeSharp size={16} className="text-[#807D7E]" />}
                </span>
              )}

              {error && <small style={{ color: "red" }}>{error.message}</small>}
            </motion.div>
          )}
        />
      </div>
    );
  }
);

// Adding the display name for the component
MyFormInputAceternity.displayName = "MyFormInputAceternity";

export default MyFormInputAceternity;
