import OrderHistoryList from "@/components/pages/profile/OrderHistoryList";
import ProfileHeader from "@/components/pages/profile/ProfileHeader";


export default function OrderHistoryPage() {
  return (
    <div className="">
      <ProfileHeader title="Order History" description="View and track all your previous orders" />

      <div className="mt-8">
        <OrderHistoryList />
      </div>
    </div>
  )
}
