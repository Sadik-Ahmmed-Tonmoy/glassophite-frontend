
import Footer from "@/components/shared/Footer/Footer";
import NavBar from "@/components/shared/NavBar/NavBar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <NavBar />
      <div className="">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
