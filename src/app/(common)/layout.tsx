import Footer from "@/components/shared/Footer/Footer";
import NavigationBar from "@/components/shared/NavigationBar/NavigationBar";

import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <NavigationBar />
      <div className="h-full min-h-[calc(100vh-0px)] lg:mt-[145px] " >{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
