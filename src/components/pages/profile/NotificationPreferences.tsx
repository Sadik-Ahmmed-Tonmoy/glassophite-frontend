"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Mail, Smartphone, Save } from "lucide-react"

export default function NotificationPreferences() {
  const [emailPreferences, setEmailPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    accountAlerts: true,
  })

  const [pushPreferences, setPushPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    accountAlerts: true,
  })

  const handleEmailToggle = (key: keyof typeof emailPreferences) => {
    setEmailPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handlePushToggle = (key: keyof typeof pushPreferences) => {
    setPushPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated preferences to your backend
    console.log("Updated notification preferences:", {
      email: emailPreferences,
      push: pushPreferences,
    })

    // Show success message (in a real app, you'd use a toast or notification)
    alert("Notification preferences updated successfully!")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Mail size={20} className="text-primary mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Email Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Order Updates</h3>
                <p className="text-sm text-gray-500">Receive updates about your orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailPreferences.orderUpdates}
                  onChange={() => handleEmailToggle("orderUpdates")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Promotions & Discounts</h3>
                <p className="text-sm text-gray-500">Receive special offers and discounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailPreferences.promotions}
                  onChange={() => handleEmailToggle("promotions")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Newsletter</h3>
                <p className="text-sm text-gray-500">Receive our weekly newsletter</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailPreferences.newsletter}
                  onChange={() => handleEmailToggle("newsletter")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Account Alerts</h3>
                <p className="text-sm text-gray-500">Receive security and account-related alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailPreferences.accountAlerts}
                  onChange={() => handleEmailToggle("accountAlerts")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Bell size={20} className="text-primary mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Push Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Order Updates</h3>
                <p className="text-sm text-gray-500">Receive updates about your orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushPreferences.orderUpdates}
                  onChange={() => handlePushToggle("orderUpdates")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Promotions & Discounts</h3>
                <p className="text-sm text-gray-500">Receive special offers and discounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushPreferences.promotions}
                  onChange={() => handlePushToggle("promotions")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-md font-medium text-gray-700">Account Alerts</h3>
                <p className="text-sm text-gray-500">Receive security and account-related alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushPreferences.accountAlerts}
                  onChange={() => handlePushToggle("accountAlerts")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center p-4 bg-gray-50 rounded-lg">
            <Smartphone size={20} className="text-gray-500 mr-3" />
            <p className="text-sm text-gray-600">
              Push notifications will be sent to all devices where you&#39;re logged in. You can manage device-specific
              settings in your device settings.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <Save size={16} className="mr-1.5" />
            Save Preferences
          </button>
        </div>
      </div>
    </form>
  )
}
