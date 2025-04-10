"use client"

import { CheckCircle, Calendar, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { CartItem } from "@/hooks/use-cart"

interface OrderConfirmationProps {
  orderId: string
  orderDate: string
  shippingDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
}

export default function OrderConfirmation({
  orderId,
  orderDate,
  shippingDetails,
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
}: OrderConfirmationProps) {
  // Calculate estimated delivery date (7 days from order)
  const estimatedDelivery = new Date(orderDate)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-gray-900 mb-2">Order Information</h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Order Number:</span> <span className="font-medium">{orderId}</span>
              </p>
              <p>
                <span className="text-gray-600">Order Date:</span> <span>{formatDate(orderDate)}</span>
              </p>
              <p className="flex items-center">
                <Calendar size={14} className="text-gray-500 mr-1" />
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="ml-1">{formatDate(estimatedDelivery.toISOString())}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-gray-900 mb-2">Shipping Address</h2>
            <div className="space-y-1 text-sm">
              <p>
                {shippingDetails.firstName} {shippingDetails.lastName}
              </p>
              <p>{shippingDetails.address}</p>
              <p>
                {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}
              </p>
              <p>{shippingDetails.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="border rounded-lg overflow-hidden">
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex items-center p-4">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.colorName && `Color: ${item.colorName}`}
                      {item.size && ` • Size: ${item.size}`}
                      {` • Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <div className="flex items-start">
            <Truck size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Shipping Information</h3>
              <p className="text-sm text-blue-600 mt-1">
                You will receive an email with tracking information once your order ships.
              </p>
              <p className="text-sm text-blue-600 mt-1">
                For any questions about your order, please contact our customer service at support@eyestyle.com
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="outline">
            <Link href="/my-profile/order-history">View Order History</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/products" className="flex items-center">
              Continue Shopping
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
