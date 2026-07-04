"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import OrderDetails from "@/components/pages/profile/OrderDetails"
import ProfileHeader from "@/components/pages/profile/ProfileHeader"
import { useGetOrderByIdQuery } from "@/redux/features/order/orderApi"
import { useParams, useRouter } from "next/navigation"
import { useProfileTheme } from "@/hooks/useProfileTheme"
import { cn } from "@/lib/utils"

export default function OrderDetailsPageClient() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { data: orderData, isLoading, error } = useGetOrderByIdQuery(orderId, { skip: !orderId })
  const { theme: styles } = useProfileTheme()

  const order = orderData?.data || orderData

  if (!orderId) {
    router.push("/my-profile/order-history")
    return null
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <ProfileHeader title="Order Details" description="Loading order information..." />
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#007C74] border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!order || error) {
    return (
      <div className="max-w-5xl mx-auto">
        <ProfileHeader title="Order Not Found" description="The requested order could not be found" />
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/my-profile/order-history")}
            className={cn("px-5 py-2.5 rounded-xl font-medium text-sm transition-all", styles.buttonPrimary)}
          >
            Back to Order History
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileHeader
        title={`Order #${order.orderNumber}`}
        description={`Placed on ${new Date(order.orderDate ?? order.createdAt ?? 0).toLocaleDateString()}`}
      />
      <div className="mt-8">
        <OrderDetails order={order} />
      </div>
    </div>
  )
}
