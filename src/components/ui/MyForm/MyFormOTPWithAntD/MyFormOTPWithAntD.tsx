/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

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

const MyFormOTPWithAntD = ({
  name,
  label,
  type = "text",
  size = "medium",
  parentClassName = "",
  labelClassName = "",
  inputClassName = "",
  ...rest
}: TInputProps) => {

  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
console.log(otp);
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue(name, otp.join(""));
  }, [otp, name, setValue]);

  const handleInputChange = (index: number, value: string) => {
    if (value === "" || value.match(/^[0-9]+$/)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value !== "" && index < 5) {
        (document.getElementById(`${name}-input-${index + 1}`) as HTMLInputElement).focus();
      } else if (value === "" && index > 0) {
        (document.getElementById(`${name}-input-${index - 1}`) as HTMLInputElement).focus();
      }
    }
  };

  const handleStartPositionInput = () => {
    if(otp[0] === ""){
           (document.getElementById(`${name}-input-0`) as HTMLInputElement).focus();
    } 
  }

  return (
    <div className={cn(`form-group ${size}`, parentClassName)}>
      {label && <p className={cn("mb-2", labelClassName)}>{label}</p>}
      <Controller
        control={control}
        name={name}
        render={({ fieldState: { error }  }) => (
          <div  className="flex gap-3 xs:gap-6 h-10 xs:h-[50px] justify-center">
            {[0, 1, 2, 3, 4,5].map((index) => (
              <input
                key={index}
                id={`${name}-input-${index}`}
                maxLength={1}
                type={type}
                value={otp[index]}
                className={cn("border border-gray-300 rounded-md p-2 w-full text-center", inputClassName)}
                {...rest}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onFocus={(e) => e.target.select()}
                onClick={handleStartPositionInput}
              />
            ))}
             {error && <small style={{ color: "red" }}>{error.message}</small>}
          </div>
        )}
      />
    </div>
  );
};

export default MyFormOTPWithAntD;
