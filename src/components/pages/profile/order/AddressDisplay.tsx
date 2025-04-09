"use client"

import type React from "react"

import { MapPin } from "lucide-react"

interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

interface AddressDisplayProps {
  title: string
  address: Address
  icon?: React.ReactNode
}

export default function AddressDisplay({
  title,
  address,
  icon = <MapPin size={20} className="text-primary mr-2" />,
}: AddressDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="text-gray-700">
        <p className="font-medium">{address.name}</p>
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2">{address.phone}</p>}
      </div>
    </div>
  )
}
