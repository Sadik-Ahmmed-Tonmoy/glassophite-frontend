"use client"

import { CheckCircle, Clock, Truck, XCircle } from "lucide-react"

interface OrderStatusBadgeProps {
  status: "processing" | "shipped" | "delivered" | "cancelled"
  deliveryDate?: string
  estimatedDelivery?: string
}

export default function OrderStatusBadge({ status, deliveryDate, estimatedDelivery }: OrderStatusBadgeProps) {
  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={20} className="text-green-500" />
      case "shipped":
        return <Truck size={20} className="text-blue-500" />
      case "processing":
        return <Clock size={20} className="text-yellow-500" />
      case "cancelled":
        return <XCircle size={20} className="text-red-500" />
    }
  }

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Your order is {status}</h3>
            <p className="text-sm text-gray-500">
              {status === "delivered"
                ? `Delivered on ${new Date(deliveryDate!).toLocaleDateString()}`
                : status === "shipped"
                  ? `Expected delivery by ${new Date(estimatedDelivery!).toLocaleDateString()}`
                  : status === "processing"
                    ? "Your order is being processed"
                    : "Your order has been cancelled"}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
