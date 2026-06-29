import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#080808]">
      {children}
    </div>
  );
};

export default layout;
