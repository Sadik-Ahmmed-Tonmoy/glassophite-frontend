"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { RotateCcw, CheckCircle, AlertTriangle, XCircle, Camera, AlertCircle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TOrderItem } from "@/types/types"
import { Textarea } from "@/components/ui/textarea"

// Define a type for the return request
interface ReturnRequest {
  orderId: string
  orderNumber: string
  items: string[]
  reason: string
  additionalDetails?: string
  returnMethod: string
  refundMethod: string
  images: string[]
  status: "pending" | "approved" | "rejected" | "processing" | "completed"
  requestDate: string
}

interface ReturnDialogProps {
  orderId: string
  orderNumber: string
  orderItems: TOrderItem[]
  isDelivered: boolean
}

export default function ReturnDialog({ orderId, orderNumber, orderItems, isDelivered }: ReturnDialogProps) {
  const [open, setOpen] = useState(false)
  const [returnItems, setReturnItems] = useState<{ [key: string]: boolean }>({})
  const [returnReason, setReturnReason] = useState("")
  const [returnAdditionalDetails, setReturnAdditionalDetails] = useState("")
  const [returnMethod, setReturnMethod] = useState("mail")
  const [refundMethod, setRefundMethod] = useState("original")
  const [returnImages, setReturnImages] = useState<string[]>([])
  const [returnStep, setReturnStep] = useState(1)
  const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize return items state
  useEffect(() => {
    const initialReturnItems: { [key: string]: boolean } = {}
    orderItems.forEach((item) => {
      initialReturnItems[item.id] = false
    })
    setReturnItems(initialReturnItems)
  }, [orderItems])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setReturnStep(1)
      setReturnRequest(null)
    }
  }, [open])

  // Handle return item toggle
  const handleReturnItemToggle = (itemId: string) => {
    setReturnItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  // Handle return image upload
  const handleReturnImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In a real app, you would upload these to a server
    // Here we'll just create object URLs for preview
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setReturnImages((prev) => [...prev, ...newImages])
  }

  // Remove return image
  const removeReturnImage = (index: number) => {
    setReturnImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Validate return form
  const validateReturnForm = () => {
    // Check if any items are selected
    const selectedItems = Object.entries(returnItems).filter(([ , isSelected]) => isSelected)
    if (selectedItems.length === 0) {
      alert("Please select at least one item to return")
      return false
    }

    // Check if reason is selected
    if (!returnReason) {
      alert("Please select a reason for your return")
      return false
    }

    // If reason is "other", check if additional details are provided
    if (returnReason === "other" && !returnAdditionalDetails) {
      alert("Please provide additional details for your return reason")
      return false
    }

    return true
  }

  // Handle next step in return process
  const handleReturnNextStep = () => {
    if (returnStep === 1 && !validateReturnForm()) {
      return
    }

    setReturnStep((prev) => prev + 1)
  }

  // Handle previous step in return process
  const handleReturnPrevStep = () => {
    setReturnStep((prev) => prev - 1)
  }

  // Handle return submission
  const handleReturnSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Get selected items
      const selectedItems = Object.entries(returnItems)
        .filter(([, isSelected]) => isSelected)
        .map(([itemId]) => itemId)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a return request
      const newReturnRequest: ReturnRequest = {
        orderId,
        orderNumber,
        items: selectedItems,
        reason: returnReason,
        additionalDetails: returnAdditionalDetails,
        returnMethod,
        refundMethod,
        images: returnImages,
        status: "pending",
        requestDate: new Date().toISOString(),
      }

      console.log("Return request submitted:", newReturnRequest)
      setReturnRequest(newReturnRequest)

      // Move to confirmation step
      setReturnStep(3)
    } catch (error) {
      console.error("Error submitting return request:", error)
      alert("There was an error submitting your return request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close return dialog and reset
  const handleCloseReturnDialog = () => {
    setOpen(false)
    // Reset form will happen in useEffect when dialog closes
  }

  // Reset form
  // const resetForm = () => {
  //   setReturnReason("")
  //   setReturnAdditionalDetails("")
  //   setReturnMethod("mail")
  //   setRefundMethod("original")
  //   setReturnImages([])

  //   // Reset return items
  //   const initialReturnItems: { [key: string]: boolean } = {}
  //   orderItems.forEach((item) => {
  //     initialReturnItems[item.id] = false
  //   })
  //   setReturnItems(initialReturnItems)
  // }

  // Render return steps
  const renderReturnSteps = () => {
    switch (returnStep) {
      case 1:
        return (
          <div className="py-4 space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Select Items to Return</h4>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <Checkbox
                      id={`return-item-${item.id}`}
                      checked={returnItems[item.id] || false}
                      onCheckedChange={() => handleReturnItemToggle(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.image || "/placeholder.svg?height=48&width=48"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor={`return-item-${item.id}`}
                        className="block font-medium text-gray-900 cursor-pointer"
                      >
                        {item.name}
                      </label>
                      <p className="text-sm text-gray-500">
                        {item.variant && `${item.variant} • `}Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="return-reason" className="block font-medium text-gray-900 mb-2">
                Reason for Return
              </label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger id="return-reason" className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Item arrived damaged</SelectItem>
                  <SelectItem value="defective">Item is defective</SelectItem>
                  <SelectItem value="wrong-item">Received wrong item</SelectItem>
                  <SelectItem value="not-as-described">Item not as described</SelectItem>
                  <SelectItem value="no-longer-needed">No longer needed</SelectItem>
                  <SelectItem value="other">Other reason</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {returnReason === "other" && (
              <div>
                <label htmlFor="return-details" className="block font-medium text-gray-900 mb-2">
                  Additional Details
                </label>
                <Textarea
                  id="return-details"
                  rows={3}
                  value={returnAdditionalDetails}
                  onChange={(e) => setReturnAdditionalDetails(e.target.value)}
                  className="w-full"
                  placeholder="Please provide more details about your return reason..."
                />
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-start">
                <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Return Policy:</strong> Items must be returned within 30 days of delivery in their original
                  condition. Once your return is approved, you will receive a return shipping label via email.
                </span>
              </p>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="py-4 space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Return Method</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="return-method-mail"
                    checked={returnMethod === "mail"}
                    onCheckedChange={() => setReturnMethod("mail")}
                  />
                  <div>
                    <label htmlFor="return-method-mail" className="font-medium text-gray-900 cursor-pointer">
                      Return by Mail
                    </label>
                    <p className="text-sm text-gray-500">
                      We&apos;ll send you a prepaid shipping label to return the items.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="return-method-dropoff"
                    checked={returnMethod === "dropoff"}
                    onCheckedChange={() => setReturnMethod("dropoff")}
                  />
                  <div>
                    <label htmlFor="return-method-dropoff" className="font-medium text-gray-900 cursor-pointer">
                      Return to Store
                    </label>
                    <p className="text-sm text-gray-500">Return your items to any of our physical store locations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Refund Method</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="refund-method-original"
                    checked={refundMethod === "original"}
                    onCheckedChange={() => setRefundMethod("original")}
                  />
                  <div>
                    <label htmlFor="refund-method-original" className="font-medium text-gray-900 cursor-pointer">
                      Original Payment Method
                    </label>
                    <p className="text-sm text-gray-500">
                      Refund to the original payment method used for the purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="refund-method-credit"
                    checked={refundMethod === "credit"}
                    onCheckedChange={() => setRefundMethod("credit")}
                  />
                  <div>
                    <label htmlFor="refund-method-credit" className="font-medium text-gray-900 cursor-pointer">
                      Store Credit
                    </label>
                    <p className="text-sm text-gray-500">Receive store credit that can be used for future purchases.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Upload Photos (Optional)</h4>
              <p className="text-sm text-gray-500 mb-3">
                If your item is damaged or defective, please upload photos to help us process your return faster.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {returnImages.map((image, index) => (
                  <div key={index} className="relative h-24 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Return image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeReturnImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="return-image-upload"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload photos</p>
                  </div>
                  <input
                    id="return-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleReturnImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="py-4 space-y-6">
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle size={24} className="text-green-600 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Return Request Submitted</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your return request has been submitted successfully. We&apos;ll review it and get back to you soon.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-3">Return Request Details</h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
                  <span className="font-medium">
                    {returnRequest ? new Date(returnRequest.requestDate).toLocaleDateString() : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                    Pending Review
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Return Method:</span>
                  <span className="font-medium">{returnMethod === "mail" ? "Return by Mail" : "Return to Store"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Refund Method:</span>
                  <span className="font-medium">
                    {refundMethod === "original" ? "Original Payment Method" : "Store Credit"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h5 className="font-medium text-gray-900 mb-2">Items to Return</h5>
                <div className="space-y-3">
                  {orderItems.map((item) => {
                    if (!returnItems[item.id]) return null
                    return (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=32&width=32"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.variant && `${item.variant} • `}Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">What&apos;s Next?</h4>
                  <ol className="text-sm text-blue-700 mt-1 list-decimal pl-4 space-y-1">
                    <li>We&apos;ll review your return request within 1-2 business days.</li>
                    <li>Once approved, you&apos;ll receive return instructions via email.</li>
                    <li>After we receive your return, we&apos;ll process your refund within 5-7 business days.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (!isDelivered) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 flex items-center">
          <RotateCcw size={16} className="mr-1.5" />
          Return Items
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return Items</DialogTitle>
          <DialogDescription>
            {returnStep === 1 && `Select the items you want to return from order #${orderNumber}`}
            {returnStep === 2 && "Choose your return and refund preferences"}
            {returnStep === 3 && "Return request confirmation"}
          </DialogDescription>
        </DialogHeader>

        {renderReturnSteps()}

        <DialogFooter className="flex justify-between">
          {returnStep === 1 ? (
            <>
              <Button variant="outline" onClick={handleCloseReturnDialog}>
                Cancel
              </Button>
              <Button onClick={handleReturnNextStep} className="bg-primary hover:bg-primary/90">
                Next Step
              </Button>
            </>
          ) : returnStep === 2 ? (
            <>
              <Button variant="outline" onClick={handleReturnPrevStep}>
                Back
              </Button>
              <Button onClick={handleReturnSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Submit Return Request</>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseReturnDialog} className="bg-primary hover:bg-primary/90">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
