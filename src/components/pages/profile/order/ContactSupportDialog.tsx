"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Define a type for the support ticket
interface SupportTicket {
  orderId: string;
  orderNumber: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  ticketId: string;
}

interface ContactSupportDialogProps {
  orderId: string;
  orderNumber: string;
}

export default function ContactSupportDialog({
  orderId,
  orderNumber,
}: ContactSupportDialogProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("order-issue");
  const [contactMessage, setContactMessage] = useState("");
  const [contactPriority, setContactPriority] = useState("medium");
  const [supportTicket, setSupportTicket] = useState<SupportTicket | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme styles
  const themeStyles = {
    dark: {
      card: "bg-black border-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      input: "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      bgMuted: "bg-white/5",
      bgInfo: "bg-blue-500/10 border-blue-500/20 text-blue-500",
      bgSuccess: "bg-green-500/10 border-green-500/20 text-green-500",
      icon: "text-neutral-400",
      badge: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      buttonPrimary: "bg-primary text-white hover:bg-primary/90",
      buttonOutline: "border-white/20 text-white hover:bg-white/10",
      select: "bg-white/5 border-white/10 text-white",
    },
    light: {
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      textMuted: "text-gray-700",
      textMutedLighter: "text-gray-500",
      border: "border-gray-200",
      input: "bg-white border-gray-300 text-gray-900",
      label: "text-gray-700",
      bgMuted: "bg-gray-50",
      bgInfo: "bg-blue-50 border-blue-200 text-blue-800",
      bgSuccess: "bg-green-50 border-green-200 text-green-800",
      icon: "text-gray-400",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      buttonPrimary: "bg-primary text-white hover:bg-primary/90",
      buttonOutline: "border-gray-300 text-gray-700 hover:bg-gray-50",
      select: "bg-white border-gray-300 text-gray-900",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSupportTicket(null);
    }
  }, [open]);

  // Handle contact support submission
  const handleContactSubmit = async () => {
    setIsSubmitting(true);

    if (!contactMessage) {
      alert("Please enter a message");
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const ticketId = `TKT-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;

      const newSupportTicket: SupportTicket = {
        orderId,
        orderNumber,
        subject: contactSubject,
        message: contactMessage,
        status: "open",
        priority: contactPriority as "low" | "medium" | "high",
        createdAt: new Date().toISOString(),
        ticketId,
      };

      console.log("Support request submitted:", newSupportTicket);
      setSupportTicket(newSupportTicket);

      setContactSubject("order-issue");
      setContactMessage("");
      setContactPriority("medium");
    } catch (error) {
      console.error("Error submitting support request:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseContactDialog = () => {
    setOpen(false);
  };

  // Animation variants for content transitions
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex items-center", styles.buttonOutline)}
        >
          <MessageCircle size={16} className="mr-1.5" />
          <span data-translate="support.contact">Contact Support</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] max-h-[90vh] overflow-y-auto transition-colors duration-500",
          styles.card
        )}
      >
        <DialogHeader>
          <DialogTitle className={styles.text} data-translate="support.title">
            Contact Support
          </DialogTitle>
          <DialogDescription className={styles.textMutedLighter}>
            <span data-translate="support.description">
              We&#39;re here to help with your order #{orderNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!supportTicket ? (
            <motion.div
              key="form"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-4 space-y-6"
            >
              <div>
                <label
                  htmlFor="contact-subject"
                  className={cn("block font-medium mb-2", styles.label)}
                  data-translate="support.subjectLabel"
                >
                  What can we help you with?
                </label>
                <Select value={contactSubject} onValueChange={setContactSubject}>
                  <SelectTrigger
                    id="contact-subject"
                    className={cn("w-full", styles.select)}
                  >
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="order-issue"
                      data-translate="support.subject.orderIssue"
                    >
                      Issue with my order
                    </SelectItem>
                    <SelectItem
                      value="delivery"
                      data-translate="support.subject.delivery"
                    >
                      Delivery question
                    </SelectItem>
                    <SelectItem
                      value="product"
                      data-translate="support.subject.product"
                    >
                      Product information
                    </SelectItem>
                    <SelectItem
                      value="return"
                      data-translate="support.subject.return"
                    >
                      Return question
                    </SelectItem>
                    <SelectItem value="other" data-translate="support.subject.other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="contact-priority"
                  className={cn("block font-medium mb-2", styles.label)}
                  data-translate="support.priorityLabel"
                >
                  Priority
                </label>
                <Select value={contactPriority} onValueChange={setContactPriority}>
                  <SelectTrigger
                    id="contact-priority"
                    className={cn("w-full", styles.select)}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" data-translate="support.priority.low">
                      Low
                    </SelectItem>
                    <SelectItem value="medium" data-translate="support.priority.medium">
                      Medium
                    </SelectItem>
                    <SelectItem value="high" data-translate="support.priority.high">
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className={cn("block font-medium mb-2", styles.label)}
                  data-translate="support.messageLabel"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className={cn("w-full", styles.input)}
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <div className={cn("p-4 rounded-lg border", styles.bgInfo)}>
                <p className={cn("text-sm flex items-start", styles.textMuted)}>
                  <MessageCircle
                    size={16}
                    className="mr-2 mt-0.5 flex-shrink-0"
                  />
                  <span>
                    <span data-translate="support.responseTime">
                      Our support team typically responds within 24 hours.
                    </span>{" "}
                    <span data-translate="support.urgent">
                      For urgent issues, you can also call us at
                    </span>{" "}
                    <strong>1-800-123-4567</strong>.
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-4 space-y-6"
            >
              <div className={cn("p-4 rounded-lg border", styles.bgSuccess)}>
                <div className="flex items-center">
                  <CheckCircle size={24} className={cn("mr-3 flex-shrink-0", styles.text)} />
                  <div>
                    <h4
                      className={cn("font-medium", styles.text)}
                      data-translate="support.ticketCreated"
                    >
                      Support Ticket Created
                    </h4>
                    <p className={cn("text-sm mt-1", styles.textMuted)}>
                      <span data-translate="support.ticketCreatedDesc">
                        Your support request has been submitted successfully. We&#39;ll get back to you soon.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={cn("border rounded-md p-4", styles.border)}>
                <h4
                  className={cn("font-medium mb-3", styles.text)}
                  data-translate="support.ticketDetails"
                >
                  Ticket Details
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className={styles.textMutedLighter} data-translate="support.ticketId">
                      Ticket ID:
                    </span>
                    <span className={cn("font-medium", styles.text)}>
                      {supportTicket.ticketId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.textMutedLighter} data-translate="support.created">
                      Created:
                    </span>
                    <span className={cn("font-medium", styles.text)}>
                      {new Date(supportTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.textMutedLighter} data-translate="support.status">
                      Status:
                    </span>
                    <span
                      className={cn(
                        "font-medium px-2 py-0.5 rounded-full text-xs",
                        styles.badge
                      )}
                    >
                      Open
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.textMutedLighter} data-translate="support.priority">
                      Priority:
                    </span>
                    <span className={cn("font-medium", styles.text)}>
                      {supportTicket.priority.charAt(0).toUpperCase() +
                        supportTicket.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.textMutedLighter} data-translate="support.subject">
                      Subject:
                    </span>
                    <span className={cn("font-medium", styles.text)}>
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

                <div className="mt-4 pt-4 border-t" style={{ borderColor: styles.border }}>
                  <h5
                    className={cn("font-medium mb-2", styles.text)}
                    data-translate="support.message"
                  >
                    Message
                  </h5>
                  <p className={cn("text-sm whitespace-pre-wrap", styles.textMuted)}>
                    {supportTicket.message}
                  </p>
                </div>
              </div>

              <div className={cn("p-4 rounded-lg border", styles.bgInfo)}>
                <div className="flex items-start">
                  <AlertCircle
                    size={20}
                    className={cn("mr-3 flex-shrink-0 mt-0.5", styles.text)}
                  />
                  <div>
                    <h4
                      className={cn("font-medium", styles.text)}
                      data-translate="support.whatsNext"
                    >
                      What&#39;s Next?
                    </h4>
                    <p className={cn("text-sm mt-1", styles.textMuted)}>
                      <span data-translate="support.whatsNextDesc">
                        Our support team will review your request and respond via email within 24 hours.
                        You can also check the status of your ticket in your account.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="flex justify-end space-x-3">
          {!supportTicket ? (
            <>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className={styles.buttonOutline}
                data-translate="common.cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleContactSubmit}
                disabled={isSubmitting || !contactMessage}
                className={styles.buttonPrimary}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                    <span data-translate="support.sending">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-1.5" />
                    <span data-translate="support.send">Send Message</span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCloseContactDialog}
              className={styles.buttonPrimary}
              data-translate="common.close"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}