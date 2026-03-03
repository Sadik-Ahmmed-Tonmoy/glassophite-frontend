/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Truck } from "lucide-react"; // or any icon library
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type ShippingOption = {
  value: string;
  label: string;
  price: string;
  icon?: React.ElementType; // e.g., Calendar, Clock, Truck
  delivery?: string; // formatted delivery date
  description?: string; // fallback text when no delivery
};

type TShippingMethodProps = {
  name: string;
  label?: string;
  options: ShippingOption[];
  size?: "small" | "medium" | "large";
  parentClassName?: string;
  labelClassName?: string;
  [key: string]: any; // allow additional props
};

const MyFormShippingMethod = React.forwardRef<
  HTMLDivElement,
  TShippingMethodProps
>(
  (
    {
      name,
      label,
      options,
      size = "medium",
      parentClassName = "",
      labelClassName = "",
      ...rest
    },
    ref,
  ) => {
    const { control } = useFormContext();

    return (
      <div
        ref={ref}
        className={cn(`form-group w-full ${size}`, parentClassName)}
        {...rest}
      >
        {label && (
          <p
            className={cn(
              "text-sm font-medium text-black dark:text-white leading-none mb-3 ms-1",
              labelClassName,
            )}
          >
            {label}
          </p>
        )}

        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="space-y-4">
                {options.map((option: any) => {
                  const Icon = option.icon || Truck; // fallback icon
                  const isSelected = field.value === option.value;

                  return (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "relative flex items-start p-4 border rounded-lg transition-all cursor-pointer",
                        isSelected
                          ? "border-[#007C74] bg-[#007C74]/5 dark:bg-[#007C74]/10"
                          : "border-gray-200 dark:border-gray-800",
                      )}
                      onClick={() => field.onChange(option.value)}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name={name}
                          value={option.value}
                          checked={isSelected}
                          onChange={() => field.onChange(option.value)}
                          className="h-4 w-4 text-[#007C74] border-gray-300 dark:border-gray-600 focus:ring-[#007C74]"
                        />
                      </div>
                      <div className="ml-3 flex justify-between w-full">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {option.label}
                          </span>
                          {option.delivery ? (
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                              <Icon size={14} className="mr-1" />
                              <span>Estimated delivery:</span> {option.delivery}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                              <Icon size={14} className="mr-1" />
                              {option.description}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-foreground">
                          {option.price}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {error && (
                <small className="text-red-500 block mt-2">
                  {error.message}
                </small>
              )}
            </>
          )}
        />
      </div>
    );
  },
);

MyFormShippingMethod.displayName = "MyFormShippingMethod";

export default MyFormShippingMethod;
