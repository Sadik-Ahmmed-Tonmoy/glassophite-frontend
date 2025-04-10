"use client"

import { Truck, Calendar, Info } from "lucide-react"

export default function DeliveryInfo() {
  // Calculate estimated delivery dates
  const today = new Date()
  const standardDelivery = new Date(today)
  standardDelivery.setDate(today.getDate() + 5)

  const expressDelivery = new Date(today)
  expressDelivery.setDate(today.getDate() + 2)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
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
              <p className="text-blue-800">Standard Delivery</p>
              <p className="text-blue-600 text-xs">Estimated by {formatDate(standardDelivery)}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar size={14} className="text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800">Express Delivery</p>
              <p className="text-blue-600 text-xs">Estimated by {formatDate(expressDelivery)}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-blue-200 flex items-start">
          <Info size={14} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-600 text-wrap">
            Free shipping on orders over ₹1000. Orders placed before 2 PM are processed the same day.
          </p>
        </div>
      </div>
    </div>
  )
}
