import { Tooltip } from "@nextui-org/react";
import React from "react";

interface ScrollButtonProps {
  to: string;
  name: string;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ to, name }) => {
  const handleClick = () => {
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Tooltip placement="left" title={name}>
      <p
        className="text-[12px] leading-[12px] my-[0.5px] hover:text-primary-color"
        key={name}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {name}
      </p>
    </Tooltip>
  );
};

export default ScrollButton;
