import React from "react";
import MobileNavBar from "./MobileNavBar/MobileNavBar";
import PCNavBar from "./PCNavBar/PCNavBar";

const NavigationBar = () => {
  return (
    <header className="w-full relative z-50">
      <div className="hidden lg:block">
        <PCNavBar />
      </div>
      <div className="block lg:hidden">
        <MobileNavBar />
      </div>
    </header>
  );
};

export default NavigationBar;
