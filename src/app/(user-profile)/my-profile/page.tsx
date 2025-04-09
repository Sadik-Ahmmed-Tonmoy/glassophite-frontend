import ContactInformation from "@/components/pages/profile/ContactInformation";
import PersonalInformation from "@/components/pages/profile/PersonalInformation";
import ProfileHeader from "@/components/pages/profile/ProfileHeader";
import ProfilePicture from "@/components/pages/profile/ProfilePicture";


export default function ProfilePage() {
  return (
    <div className="">
      <ProfileHeader title="My Profile" description="Manage your personal information and contact details" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1">
          <ProfilePicture />
        </div>
        <div className="md:col-span-2 space-y-6">
          <PersonalInformation />
          <ContactInformation />
        </div>
      </div>
    </div>
  )
}
