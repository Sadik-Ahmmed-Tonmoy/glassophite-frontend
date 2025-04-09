import ProfileNavbar from "@/components/pages/profile/ProfileNavbar/ProfileNavbar";
import ProfileSidebar from "@/components/pages/profile/ProfileSidebar";
import { cn } from "@/lib/utils";
import type React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <ProfileNavbar />
      <div className={cn("flex  bg-gray-50",
       " min-h-[calc(100vh-65px)]"
      )}>
        <ProfileSidebar />
        <main className="flex-1 p-6 lg:p-8 pt-6">{children}</main>
      </div>
    </div>
  );
}
