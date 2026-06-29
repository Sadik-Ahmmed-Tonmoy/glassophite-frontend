import NotificationPreferences from "@/components/pages/profile/NotificationPreferences";
import ProfileHeader from "@/components/pages/profile/ProfileHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  robots: "noindex, nofollow",
};


export default function NotificationsPage() {
  return (
    <div className="">
      <ProfileHeader title="Notification Preferences" description="Manage how you receive updates and alerts" />

      <div className="mt-8">
        <NotificationPreferences />
      </div>
    </div>
  )
}
