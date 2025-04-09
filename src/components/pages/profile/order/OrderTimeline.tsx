"use client"

import { CheckCircle, Clock, Package, Truck } from "lucide-react"

interface OrderTimelineProps {
  status: "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  processingDate?: string
  shippingDate?: string
  deliveryDate?: string
  estimatedDelivery?: string
}

export default function OrderTimeline({
  status,
  orderDate,
  processingDate,
  shippingDate,
  deliveryDate,
  estimatedDelivery,
}: OrderTimelineProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Order Timeline</h3>

      {/* Mobile Timeline (Vertical) */}
      <div className="md:hidden relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:h-full before:w-0.5 before:bg-gray-200">
        {/* Order Placed */}
        <div className="relative">
          <div
            className={`absolute -left-8 h-6 w-6 rounded-full flex items-center justify-center ${status !== "cancelled" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"}`}
          >
            <Package size={14} />
          </div>
          <div>
            <h4 className="font-medium text-sm">Order Placed</h4>
            <p className="text-xs text-gray-500 mt-1">{new Date(orderDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Processing */}
        <div className="relative">
          <div
            className={`absolute -left-8 h-6 w-6 rounded-full flex items-center justify-center ${
              status !== "cancelled" && processingDate ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            <Clock size={14} />
          </div>
          <div>
            <h4 className="font-medium text-sm">Processing</h4>
            <p className="text-xs text-gray-500 mt-1">
              {processingDate
                ? new Date(processingDate).toLocaleDateString()
                : status === "cancelled"
                  ? "Cancelled"
                  : "Pending"}
            </p>
          </div>
        </div>

        {/* Shipped */}
        <div className="relative">
          <div
            className={`absolute -left-8 h-6 w-6 rounded-full flex items-center justify-center ${
              status === "shipped" || status === "delivered" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            <Truck size={14} />
          </div>
          <div>
            <h4 className="font-medium text-sm">Shipped</h4>
            <p className="text-xs text-gray-500 mt-1">
              {shippingDate ? new Date(shippingDate).toLocaleDateString() : "Pending"}
            </p>
          </div>
        </div>

        {/* Delivered */}
        <div className="relative">
          <div
            className={`absolute -left-8 h-6 w-6 rounded-full flex items-center justify-center ${
              status === "delivered" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            <CheckCircle size={14} />
          </div>
          <div>
            <h4 className="font-medium text-sm">Delivered</h4>
            <p className="text-xs text-gray-500 mt-1">
              {deliveryDate
                ? new Date(deliveryDate).toLocaleDateString()
                : status === "shipped" && estimatedDelivery
                  ? `Est. ${new Date(estimatedDelivery).toLocaleDateString()}`
                  : "Pending"}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Timeline (Horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Timeline Bar */}
          <div className="absolute top-5 left-0 h-0.5 w-full bg-gray-200"></div>

          <div className="flex justify-between">
            {/* Order Placed */}
            <div className="relative flex flex-col items-center text-center w-1/4">
              <div
                className={`z-10 h-10 w-10 rounded-full flex items-center justify-center ${
                  status !== "cancelled" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                <Package size={18} />
              </div>
              <h4 className="font-medium text-sm mt-2">Order Placed</h4>
              <p className="text-xs text-gray-500 mt-1">{new Date(orderDate).toLocaleDateString()}</p>

              {/* Progress Bar */}
              <div
                className="absolute top-5 left-1/2 h-0.5 w-full bg-primary"
                style={{
                  width: status !== "cancelled" ? "100%" : "0%",
                  transform: "translateX(50%)",
                }}
              ></div>
            </div>

            {/* Processing */}
            <div className="relative flex flex-col items-center text-center w-1/4">
              <div
                className={`z-10 h-10 w-10 rounded-full flex items-center justify-center ${
                  status !== "cancelled" && (status === "processing" || status === "shipped" || status === "delivered")
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                <Clock size={18} />
              </div>
              <h4 className="font-medium text-sm mt-2">Processing</h4>
              <p className="text-xs text-gray-500 mt-1">
                {processingDate
                  ? new Date(processingDate).toLocaleDateString()
                  : status === "cancelled"
                    ? "Cancelled"
                    : "Pending"}
              </p>

              {/* Progress Bar */}
              <div
                className="absolute top-5 left-1/2 h-0.5 w-full bg-primary"
                style={{
                  width: status === "shipped" || status === "delivered" ? "100%" : "0%",
                  transform: "translateX(50%)",
                }}
              ></div>
            </div>

            {/* Shipped */}
            <div className="relative flex flex-col items-center text-center w-1/4">
              <div
                className={`z-10 h-10 w-10 rounded-full flex items-center justify-center ${
                  status === "shipped" || status === "delivered" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                <Truck size={18} />
              </div>
              <h4 className="font-medium text-sm mt-2">Shipped</h4>
              <p className="text-xs text-gray-500 mt-1">
                {shippingDate ? new Date(shippingDate).toLocaleDateString() : "Pending"}
              </p>

              {/* Progress Bar */}
              <div
                className="absolute top-5 left-1/2 h-0.5 w-full bg-primary"
                style={{
                  width: status === "delivered" ? "100%" : "0%",
                  transform: "translateX(50%)",
                }}
              ></div>
            </div>

            {/* Delivered */}
            <div className="relative flex flex-col items-center text-center w-1/4">
              <div
                className={`z-10 h-10 w-10 rounded-full flex items-center justify-center ${
                  status === "delivered" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                <CheckCircle size={18} />
              </div>
              <h4 className="font-medium text-sm mt-2">Delivered</h4>
              <p className="text-xs text-gray-500 mt-1">
                {deliveryDate
                  ? new Date(deliveryDate).toLocaleDateString()
                  : status === "shipped" && estimatedDelivery
                    ? `Est. ${new Date(estimatedDelivery).toLocaleDateString()}`
                    : "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Information */}
      {status === "shipped" && estimatedDelivery && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start">
          <Truck size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Your order is on its way!</p>
            <p className="text-xs text-blue-600 mt-1">
              Estimated delivery: {new Date(estimatedDelivery).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
