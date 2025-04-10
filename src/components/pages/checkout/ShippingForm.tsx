"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Truck, Clock, Calendar } from "lucide-react"

// Create a schema for form validation
const shippingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Please enter a valid ZIP code"),
  country: z.string().min(2, "Country is required"),
})

type ShippingFormValues = z.infer<typeof shippingSchema>

interface ShippingFormProps {
  initialValues: ShippingFormValues
  onSubmit: (data: ShippingFormValues) => void
  shippingMethod: string
  onShippingMethodChange: (method: string) => void
}

export default function ShippingForm({
  initialValues,
  onSubmit,
  shippingMethod,
  onShippingMethodChange,
}: ShippingFormProps) {
  const [saveAddress, setSaveAddress] = useState(false)

  // Get today's date and calculate delivery dates
  const today = new Date()
  const standardDelivery = new Date(today)
  standardDelivery.setDate(today.getDate() + 5)

  const expressDelivery = new Date(today)
  expressDelivery.setDate(today.getDate() + 2)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initialValues,
  })

  const onFormSubmit = (data: ShippingFormValues) => {
    // If save address is checked, you could save to localStorage or user profile
    if (saveAddress) {
      localStorage.setItem("savedAddress", JSON.stringify(data))
    }

    onSubmit(data)
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          {/* Address Information */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address*
            </label>
            <input
              id="address"
              {...register("address")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              id="city"
              {...register("city")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State/Province*
            </label>
            <input
              id="state"
              {...register("state")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP/Postal Code*
            </label>
            <input
              id="zipCode"
              {...register("zipCode")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country*
            </label>
            <select
              id="country"
              {...register("country")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="India">India</option>
            </select>
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
          </div>
        </div>

        {/* Save Address Checkbox */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              id="saveAddress"
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-700">
              Save this address for future orders
            </label>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Shipping Method</h3>

          <RadioGroup value={shippingMethod} onValueChange={onShippingMethodChange} className="space-y-4">
            <div
              className={`relative flex items-start p-4 border rounded-lg ${shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-gray-200"}`}
            >
              <div className="flex items-center h-5">
                <RadioGroupItem value="standard" id="standard" />
              </div>
              <div className="ml-3 flex justify-between w-full">
                <Label htmlFor="standard" className="flex flex-col">
                  <span className="font-medium">Standard Shipping</span>
                  <span className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar size={14} className="mr-1" />
                    Estimated delivery: {formatDate(standardDelivery)}
                  </span>
                </Label>
                <span className="font-medium">$5.00</span>
              </div>
            </div>

            <div
              className={`relative flex items-start p-4 border rounded-lg ${shippingMethod === "express" ? "border-primary bg-primary/5" : "border-gray-200"}`}
            >
              <div className="flex items-center h-5">
                <RadioGroupItem value="express" id="express" />
              </div>
              <div className="ml-3 flex justify-between w-full">
                <Label htmlFor="express" className="flex flex-col">
                  <span className="font-medium">Express Shipping</span>
                  <span className="text-sm text-gray-500 flex items-center mt-1">
                    <Clock size={14} className="mr-1" />
                    Estimated delivery: {formatDate(expressDelivery)}
                  </span>
                </Label>
                <span className="font-medium">$15.00</span>
              </div>
            </div>

            <div
              className={`relative flex items-start p-4 border rounded-lg ${shippingMethod === "free" ? "border-primary bg-primary/5" : "border-gray-200"}`}
            >
              <div className="flex items-center h-5">
                <RadioGroupItem value="free" id="free" />
              </div>
              <div className="ml-3 flex justify-between w-full">
                <Label htmlFor="free" className="flex flex-col">
                  <span className="font-medium">Free Shipping</span>
                  <span className="text-sm text-gray-500 flex items-center mt-1">
                    <Truck size={14} className="mr-1" />
                    Orders over $100 qualify for free shipping
                  </span>
                </Label>
                <span className="font-medium">$0.00</span>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )
}
