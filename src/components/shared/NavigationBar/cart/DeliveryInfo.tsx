"use client"

import { Truck, Calendar, Info } from "lucide-react"
import { useGetDeliverySettingsQuery } from "@/redux/features/order/orderApi"

export default function DeliveryInfo() {
  const { data, isLoading } = useGetDeliverySettingsQuery()

  const settings = data?.data ?? {
    standardDays: 5,
    expressDays: 2,
    standardCost: 60,
    expressCost: 120,
  }

  const today = new Date()
  const standardDelivery = new Date(today)
  standardDelivery.setDate(today.getDate() + settings.standardDays)

  const expressDelivery = new Date(today)
  expressDelivery.setDate(today.getDate() + settings.expressDays)

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  if (isLoading) {
    return (
      <div className="px-4 py-3 border-t">
        <div className="bg-blue-50 rounded-lg p-3 animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-blue-100 rounded w-3/4 mb-1" />
          <div className="h-3 bg-blue-100 rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border-t">
      <div className="bg-blue-50 rounded-lg p-3">
        <h3 className="text-sm font-medium text-blue-800 flex items-center mb-2">
          <Truck size={16} className="mr-2" />
          Estimated Delivery
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <Calendar size={14} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">Inside Dhaka</p>
              <p className="text-blue-600 text-xs">Estimated by {formatDate(standardDelivery)}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar size={14} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">Outside Dhaka</p>
              <p className="text-blue-600 text-xs">Estimated by {formatDate(expressDelivery)}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-blue-200 flex items-start">
          <Info size={14} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-600 text-wrap">
            Orders placed before 2 PM are processed the same day.
          </p>
        </div>
      </div>
    </div>
  )
}
