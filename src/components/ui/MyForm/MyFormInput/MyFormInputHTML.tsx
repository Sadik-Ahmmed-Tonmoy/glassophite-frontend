/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  size?: string;
  parentClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  [key: string]: any; // Allow other props
};

const MyFormInputHTML = ({
  name,
  label,
  type = "text",
  size = "medium",
  parentClassName = "",
  labelClassName = "",
  inputClassName = "",
  ...rest
}: TInputProps) => {
  const { control } = useFormContext();

  return (
    <div className={cn(`form-group ${size}`, parentClassName)}>
      {label && <p className={cn("mb-2", labelClassName)}>{label}</p>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            id={name}
            {...field}
            type={type}
            value={field.value || ""} // Ensure the input is always controlled
            className={cn("border border-gray-300 rounded-md p-2 w-full", inputClassName)}
            {...rest}
          />
        )}
      />
    </div>
  );
};

export default MyFormInputHTML;
