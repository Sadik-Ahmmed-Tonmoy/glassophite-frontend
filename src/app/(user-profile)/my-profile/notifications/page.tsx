import NotificationList from "@/components/pages/profile/NotificationList";
import NotificationPreferences from "@/components/pages/profile/NotificationPreferences";
import ProfileHeader from "@/components/pages/profile/ProfileHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  robots: "noindex, nofollow",
};


export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <ProfileHeader title="Notifications" description="Stay updated on your orders and account activity" />

      <div>
        <NotificationList />
      </div>

      <div>
        <NotificationPreferences />
      </div>
    </div>
  )
}
