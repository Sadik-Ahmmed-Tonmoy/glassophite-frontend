"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { BsCheck } from "react-icons/bs";

type TInputProps = { title: string; titleClassName?: string; handleCheckboxChange: (isChecked: boolean) => void; defaultSelected?: boolean; checkBoxColor?: string };

const MyFormCheckBox = ({ title, titleClassName, handleCheckboxChange = () => {}, defaultSelected , checkBoxColor="#00a76b" }: TInputProps) => {
  const [selectedCheckbox, setSelectedCheckbox] = useState(defaultSelected || false);

  const handleIsCheckboxChange = () => {
    const newState = !selectedCheckbox;
    setSelectedCheckbox(newState);
    handleCheckboxChange(newState); // Pass the updated state directly
  };

  return (
    <label
      className="flex items-center hover:cursor-pointer gap-3 text-[#252728] font-inter text-sm font-normal leading-normal w-fit h-min"
      onChange={handleIsCheckboxChange}
    >
      <div className="relative flex items-center overflow-hidden">
        <input
          type="checkbox"
          className={`rounded h-4 w-4 transition-all duration-300 hover:cursor-pointer ${
            selectedCheckbox == true ? `bg-[${checkBoxColor}] text-white` : "bg-white"
          } border border-[#0094CF] appearance-none`}
        />
        <BsCheck
          size={16}
          className={`absolute top-0 text-white  transition-all duration-300  ${
            selectedCheckbox == true
              ? `text-white translate-x-0 opacity-100 visible rounded bg-[${checkBoxColor}]`
              : "bg-white -translate-x-full opacity-0 invisible"
          }`}
        />
      </div>
      <p className={cn("text-black-80 font-inter text-[14px] font-normal leading-normal tracking-[-0.14px]", titleClassName)}> {title}</p>
    </label>
  );
};

export default MyFormCheckBox;
