import Footer from "@/components/shared/Footer/Footer";

import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <div className="">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
