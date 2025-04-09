"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, CreditCardIcon, CheckIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface BillingAddress {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

interface PaymentDetails {
  cardType: string
  lastFourDigits: string
  expiryDate: string
}

interface PaymentInformationProps {
  paymentMethod: string
  paymentDetails?: PaymentDetails
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
}

export default function PaymentInformation({
  paymentMethod,
  paymentDetails,
  shippingAddress,
}: PaymentInformationProps) {
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: shippingAddress.name,
    street: shippingAddress.street,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zipCode: shippingAddress.zipCode,
    country: shippingAddress.country,
    phone: shippingAddress.phone,
  })

  // Handle billing address change
  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle billing address same as shipping toggle
  const handleBillingAddressSameAsShipping = (checked: boolean) => {
    setBillingAddressSameAsShipping(checked)
    if (checked) {
      setBillingAddress({
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <CreditCard size={20} className="text-primary mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Checkbox
            id="billing-same-as-shipping"
            checked={billingAddressSameAsShipping}
            onCheckedChange={handleBillingAddressSameAsShipping}
          />
          <label htmlFor="billing-same-as-shipping" className="ml-2 text-sm text-gray-700">
            Billing address same as shipping address
          </label>
        </div>
      </div>

      {!billingAddressSameAsShipping && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Billing Address</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="billing-name" className="block text-xs text-gray-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="billing-name"
                name="name"
                value={billingAddress.name}
                onChange={handleBillingAddressChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="billing-street" className="block text-xs text-gray-500 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="billing-street"
                name="street"
                value={billingAddress.street}
                onChange={handleBillingAddressChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="billing-city" className="block text-xs text-gray-500 mb-1">
                City
              </label>
              <input
                type="text"
                id="billing-city"
                name="city"
                value={billingAddress.city}
                onChange={handleBillingAddressChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="billing-state" className="block text-xs text-gray-500 mb-1">
                State / Province
              </label>
              <input
                type="text"
                id="billing-state"
                name="state"
                value={billingAddress.state}
                onChange={handleBillingAddressChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="billing-zipCode" className="block text-xs text-gray-500 mb-1">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="billing-zipCode"
                name="zipCode"
                value={billingAddress.zipCode}
                onChange={handleBillingAddressChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="billing-country" className="block text-xs text-gray-500 mb-1">
                Country
              </label>
              <input
                type="text"
                id="billing-country"
                name="country"
                value={billingAddress.country}
                onChange={handleBillingAddressChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {paymentDetails ? (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start">
            <div className="mr-4 p-2 bg-primary/10 rounded-md">
              <CreditCardIcon size={24} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium text-gray-900">{paymentDetails.cardType}</p>
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                  •••• {paymentDetails.lastFourDigits}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Expires {paymentDetails.expiryDate}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <CheckIcon size={14} className="text-green-500 mr-1" />
                Payment successful
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Billing address:{" "}
              {billingAddressSameAsShipping ? "Same as shipping address" : "Different from shipping address"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-700">
          <p className="font-medium">{paymentMethod}</p>
          <p className="mt-2">
            Billing address:{" "}
            {billingAddressSameAsShipping ? "Same as shipping address" : "Different from shipping address"}
          </p>
        </div>
      )}

      {!billingAddressSameAsShipping && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
          <div className="text-sm text-gray-600">
            <p>{billingAddress.name}</p>
            <p>{billingAddress.street}</p>
            <p>
              {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
            </p>
            <p>{billingAddress.country}</p>
            {billingAddress.phone && <p className="mt-1">{billingAddress.phone}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
