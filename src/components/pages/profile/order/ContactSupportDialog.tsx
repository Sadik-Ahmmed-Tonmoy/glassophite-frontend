"use client"

import { useState, useEffect } from "react"
import { MessageCircle, CheckCircle, AlertCircle, Send, Loader2 } from "lucide-react"
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

import { Button } from "@/components/ui/button"
import { Textarea } from "@nextui-org/react"

// Define a type for the support ticket
interface SupportTicket {
  orderId: string
  orderNumber: string
  subject: string
  message: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  ticketId: string
}

interface ContactSupportDialogProps {
  orderId: string
  orderNumber: string
}

export default function ContactSupportDialog({ orderId, orderNumber }: ContactSupportDialogProps) {
  const [open, setOpen] = useState(false)
  const [contactSubject, setContactSubject] = useState("order-issue")
  const [contactMessage, setContactMessage] = useState("")
  const [contactPriority, setContactPriority] = useState("medium")
  const [supportTicket, setSupportTicket] = useState<SupportTicket | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSupportTicket(null)
    }
  }, [open])

  // Handle contact support submission
  const handleContactSubmit = async () => {
    setIsSubmitting(true)

    if (!contactMessage) {
      alert("Please enter a message")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random ticket ID
      const ticketId = `TKT-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`

      // Create a support ticket
      const newSupportTicket: SupportTicket = {
        orderId,
        orderNumber,
        subject: contactSubject,
        message: contactMessage,
        status: "open",
        priority: contactPriority as "low" | "medium" | "high",
        createdAt: new Date().toISOString(),
        ticketId,
      }

      console.log("Support request submitted:", newSupportTicket)
      setSupportTicket(newSupportTicket)

      // Reset form
      setContactSubject("order-issue")
      setContactMessage("")
      setContactPriority("medium")
    } catch (error) {
      console.error("Error submitting support request:", error)
      alert("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close contact dialog and reset
  const handleCloseContactDialog = () => {
    setOpen(false)
    // Reset will happen in useEffect when dialog closes
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <MessageCircle size={16} className="mr-1.5" />
          Contact Support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>We&#39;re here to help with your order #{orderNumber}</DialogDescription>
        </DialogHeader>

        {!supportTicket ? (
          <div className="py-4 space-y-6">
            <div>
              <label htmlFor="contact-subject" className="block font-medium text-gray-900 mb-2">
                What can we help you with?
              </label>
              <Select value={contactSubject} onValueChange={setContactSubject}>
                <SelectTrigger id="contact-subject" className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order-issue">Issue with my order</SelectItem>
                  <SelectItem value="delivery">Delivery question</SelectItem>
                  <SelectItem value="product">Product information</SelectItem>
                  <SelectItem value="return">Return question</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="contact-priority" className="block font-medium text-gray-900 mb-2">
                Priority
              </label>
              <Select value={contactPriority} onValueChange={setContactPriority}>
                <SelectTrigger id="contact-priority" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-medium text-gray-900 mb-2">
                Message
              </label>
              <Textarea
                id="contact-message"
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start">
                <MessageCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Our support team typically responds within 24 hours. For urgent issues, you can also call us at
                  <strong> 1-800-123-4567</strong>.
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle size={24} className="text-green-600 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Support Ticket Created</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your support request has been submitted successfully. We&#39;ll get back to you soon.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-3">Ticket Details</h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-medium">{supportTicket.ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(supportTicket.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Open</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-medium">
                    {supportTicket.priority.charAt(0).toUpperCase() + supportTicket.priority.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">
                    {supportTicket.subject === "order-issue"
                      ? "Issue with my order"
                      : supportTicket.subject === "delivery"
                        ? "Delivery question"
                        : supportTicket.subject === "product"
                          ? "Product information"
                          : supportTicket.subject === "return"
                            ? "Return question"
                            : "Other"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h5 className="font-medium text-gray-900 mb-2">Message</h5>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{supportTicket.message}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">What&#39;s Next?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Our support team will review your request and respond via email within 24 hours. You can also check
                    the status of your ticket in your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-3">
          {!supportTicket ? (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleContactSubmit}
                disabled={isSubmitting || !contactMessage}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-1.5" />
                    Send Message
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseContactDialog} className="bg-primary hover:bg-primary/90">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
