"use client"

import type React from "react"

import { useState } from "react"
import { Save, Edit, Phone, MapPin, X } from "lucide-react"

export default function ContactInformation() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    phoneNumber: "+1 (555) 123-4567",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your backend
    console.log("Updated contact information:", formData)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
            isEditing ? "bg-gray-200 text-gray-700" : "bg-primary/10 text-primary hover:bg-primary/20"
          } transition-colors`}
        >
          {isEditing ? (
            <>
              <X size={16} className="mr-1.5" />
              Cancel
            </>
          ) : (
            <>
              <Edit size={16} className="mr-1.5" />
              Edit
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-4">
              <Phone size={18} className="text-gray-500 mr-2" />
              <h3 className="text-md font-medium text-gray-700">Phone Number</h3>
            </div>

            {isEditing ? (
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            ) : (
              <p className="text-gray-900">{formData.phoneNumber}</p>
            )}
          </div>

          <div>
            <div className="flex items-center mb-4">
              <MapPin size={18} className="text-gray-500 mr-2" />
              <h3 className="text-md font-medium text-gray-700">Address</h3>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-900">
                <p>{formData.address.street}</p>
                <p>
                  {formData.address.city}, {formData.address.state} {formData.address.zipCode}
                </p>
                <p>{formData.address.country}</p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Save size={16} className="mr-1.5" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
