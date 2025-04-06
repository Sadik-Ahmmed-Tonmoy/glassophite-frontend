import React from "react";
import MobileNavBar from "./MobileNavBar/MobileNavBar";
import PCNavBar from "./PCNavBar/PCNavBar";

const NavigationBar = () => {
  return (
    <div>
      <div className="hidden lg:block">
        <PCNavBar />
      </div>
      <div className="block lg:hidden">
        <MobileNavBar />
      </div>
    </div>
  );
};

export default NavigationBar;
