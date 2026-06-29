import ChangePassword from "@/components/pages/profile/ChangePassword";
import DeleteAccount from "@/components/pages/profile/DeleteAccount";
import ProfileHeader from "@/components/pages/profile/ProfileHeader";
import SecuritySettings from "@/components/pages/profile/SecuritySettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  robots: "noindex, nofollow",
};


export default function AccountSettingsPage() {
  return (
    <div className="">
      <ProfileHeader title="Account Settings" description="Manage your account security and preferences" />

      <div className="grid grid-cols-1 gap-6 mt-8">
        <ChangePassword />
        <SecuritySettings />
        <DeleteAccount />
      </div>
    </div>
  )
}
