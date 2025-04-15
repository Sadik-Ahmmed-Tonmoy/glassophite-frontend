"use client"

import type React from "react"

import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"

export default function DeleteAccount() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteRequest = () => {
    setShowConfirmation(true)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setConfirmText("")
  }

  const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value)
  }

  const handleDeleteConfirm = async () => {
    if (confirmText !== "DELETE") {
      return
    }

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would call your API to delete the account
      console.log("Account deletion confirmed")

      // Redirect to logout or home page
      window.location.href = "/"
    } catch (error) {
      console.error("Error deleting account:", error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-6">
        <Trash2 size={20} className="text-red-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Delete Account</h2>
      </div>

      {!showConfirmation ? (
        <div>
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. This action is permanent and cannot be undone.
          </p>
          <button
            onClick={handleDeleteRequest}
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} className="mr-1.5" />
            Delete Account
          </button>
        </div>
      ) : (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex items-start mb-4">
            <AlertTriangle size={24} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-md font-semibold text-red-700">Warning: This action cannot be undone</h3>
              <p className="text-sm text-red-600 mt-1">
                This will permanently delete your account, all your data, and remove your access to all services.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To confirm, type &quot;DELETE&quot; in the field below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={handleConfirmTextChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="Type DELETE to confirm"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDeleteConfirm}
              disabled={confirmText !== "DELETE" || isDeleting}
              className={`inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md transition-colors ${
                confirmText !== "DELETE" || isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
              }`}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-1.5" />
                  Permanently Delete Account
                </>
              )}
            </button>

            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
