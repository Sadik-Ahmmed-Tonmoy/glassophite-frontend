"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TOrderItem } from "@/types/types";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";

// Define a type for the return request
interface ReturnRequest {
  orderId: string;
  orderNumber: string;
  items: string[];
  reason: string;
  additionalDetails?: string;
  returnMethod: string;
  refundMethod: string;
  images: string[];
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  requestDate: string;
}

interface ReturnDialogProps {
  orderId: string;
  orderNumber: string;
  orderItems: TOrderItem[];
  isDelivered: boolean;
}

const getItemImage = (item: TOrderItem) => {
  if (!item.image) return "/placeholder.svg?height=48&width=48";
  try {
    const parsed = JSON.parse(item.image);
    return parsed?.image || item.image;
  } catch {
    return item.image;
  }
};

export default function ReturnDialog({
  orderId,
  orderNumber,
  orderItems,
  isDelivered,
}: ReturnDialogProps) {
  const { isDark, theme: styles } = useProfileTheme();
  const [open, setOpen] = useState(false);
  const [returnItems, setReturnItems] = useState<{ [key: string]: boolean }>({});
  const [returnReason, setReturnReason] = useState("");
  const [returnAdditionalDetails, setReturnAdditionalDetails] = useState("");
  const [returnMethod, setReturnMethod] = useState("mail");
  const [refundMethod, setRefundMethod] = useState("original");
  const [returnImages, setReturnImages] = useState<string[]>([]);
  const [returnStep, setReturnStep] = useState(1);
  const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Initialize return items state
  useEffect(() => {
    const initialReturnItems: { [key: string]: boolean } = {};
    orderItems.forEach((item) => {
      initialReturnItems[item.id] = false;
    });
    setReturnItems(initialReturnItems);
  }, [orderItems]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setReturnStep(1);
      setReturnRequest(null);
    }
  }, [open]);

  // Handle return item toggle
  const handleReturnItemToggle = (itemId: string) => {
    setReturnItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Handle return image upload
  const handleReturnImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload these to a server
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setReturnImages((prev) => [...prev, ...newImages]);
  };

  // Remove return image
  const removeReturnImage = (index: number) => {
    setReturnImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateReturnForm = () => {
    const selectedItems = Object.entries(returnItems).filter(([, s]) => s);
    if (selectedItems.length === 0) { setValidationError("Please select at least one item to return"); return false; }
    if (!returnReason) { setValidationError("Please select a reason for your return"); return false; }
    if (returnReason === "other" && !returnAdditionalDetails) { setValidationError("Please provide additional details for your return reason"); return false; }
    setValidationError("");
    return true;
  };

  const handleReturnNextStep = () => {
    if (returnStep === 1 && !validateReturnForm()) return;
    setValidationError("");
    setReturnStep((prev) => prev + 1);
  };

  // Handle previous step in return process
  const handleReturnPrevStep = () => {
    setReturnStep((prev) => prev - 1);
  };

  // Handle return submission
  const handleReturnSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedItems = Object.entries(returnItems)
        .filter(([, isSelected]) => isSelected)
        .map(([itemId]) => itemId);

      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      };

      setReturnRequest(newReturnRequest);
      setReturnStep(3);
    } catch {
      setValidationError("There was an error submitting your return request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close return dialog and reset
  const handleCloseReturnDialog = () => {
    setOpen(false);
  };

  // Render return steps
  const renderReturnSteps = () => {
    switch (returnStep) {
      case 1:
        return (
          <div className="py-4 space-y-6">
            <div>
              <h4 className={cn("font-medium mb-3", styles.text)} data-translate="return.selectItems">
                Select Items to Return
              </h4>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <Checkbox
                      id={`return-item-${item.id}`}
                      checked={returnItems[item.id] || false}
                      onCheckedChange={() => handleReturnItemToggle(item.id)}
                      className={cn("mt-1", styles.checkbox)}
                    />
                    <div
                      className={cn(
                        "flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden",
                        isDark ? "bg-white/5" : "bg-gray-100"
                      )}
                    >
                      <Image
                        src={getItemImage(item)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor={`return-item-${item.id}`}
                        className={cn("block font-medium cursor-pointer", styles.text)}
                      >
                        {item.name}
                      </label>
                      <p className={cn("text-sm", styles.textMutedLighter)}>
                        {item.variant && `${item.variant} • `}
                        <span data-translate="return.qty">Qty</span>: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-medium", styles.text)}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="return-reason" className={cn("block font-medium mb-2", styles.text)} data-translate="return.reason">
                Reason for Return
              </label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger id="return-reason" className={cn("w-full", styles.select)}>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged" data-translate="return.reason.damaged">
                    Item arrived damaged
                  </SelectItem>
                  <SelectItem value="defective" data-translate="return.reason.defective">
                    Item is defective
                  </SelectItem>
                  <SelectItem value="wrong-item" data-translate="return.reason.wrongItem">
                    Received wrong item
                  </SelectItem>
                  <SelectItem value="not-as-described" data-translate="return.reason.notAsDescribed">
                    Item not as described
                  </SelectItem>
                  <SelectItem value="no-longer-needed" data-translate="return.reason.noLongerNeeded">
                    No longer needed
                  </SelectItem>
                  <SelectItem value="other" data-translate="return.reason.other">
                    Other reason
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {returnReason === "other" && (
              <div>
                <label
                  htmlFor="return-details"
                  className={cn("block font-medium mb-2", styles.text)}
                  data-translate="return.additionalDetails"
                >
                  Additional Details
                </label>
                <Textarea
                  id="return-details"
                  rows={3}
                  value={returnAdditionalDetails}
                  onChange={(e) => setReturnAdditionalDetails(e.target.value)}
                  className={cn("w-full", styles.input)}
                  placeholder="Please provide more details about your return reason..."
                />
              </div>
            )}

            {validationError && (
              <div className={cn("p-3 rounded-xl border flex items-start gap-2 text-sm", isDark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-700")}>
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className={cn("p-4 rounded-xl border flex items-start gap-2 text-sm", isDark ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-yellow-50 border-yellow-200 text-yellow-800")}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div>
                <strong>Return Policy:</strong> Items must be returned within 30 days of delivery in their original condition.
                Once your return is approved, you will receive a return shipping label via email.
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="py-4 space-y-6">
            <div>
              <h4 className={cn("font-medium mb-3", styles.text)} data-translate="return.methodTitle">
                Return Method
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="return-method-mail"
                    checked={returnMethod === "mail"}
                    onCheckedChange={() => setReturnMethod("mail")}
                    className={styles.checkbox}
                  />
                  <div>
                    <label
                      htmlFor="return-method-mail"
                      className={cn("font-medium cursor-pointer", styles.text)}
                      data-translate="return.method.mail"
                    >
                      Return by Mail
                    </label>
                    <p className={cn("text-sm", styles.textMutedLighter)} data-translate="return.method.mailDesc">
                      We&apos;ll send you a prepaid shipping label to return the items.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="return-method-dropoff"
                    checked={returnMethod === "dropoff"}
                    onCheckedChange={() => setReturnMethod("dropoff")}
                    className={styles.checkbox}
                  />
                  <div>
                    <label
                      htmlFor="return-method-dropoff"
                      className={cn("font-medium cursor-pointer", styles.text)}
                      data-translate="return.method.dropoff"
                    >
                      Return to Store
                    </label>
                    <p className={cn("text-sm", styles.textMutedLighter)} data-translate="return.method.dropoffDesc">
                      Return your items to any of our physical store locations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className={cn("font-medium mb-3", styles.text)} data-translate="return.refundTitle">
                Refund Method
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="refund-method-original"
                    checked={refundMethod === "original"}
                    onCheckedChange={() => setRefundMethod("original")}
                    className={styles.checkbox}
                  />
                  <div>
                    <label
                      htmlFor="refund-method-original"
                      className={cn("font-medium cursor-pointer", styles.text)}
                      data-translate="return.refund.original"
                    >
                      Original Payment Method
                    </label>
                    <p className={cn("text-sm", styles.textMutedLighter)} data-translate="return.refund.originalDesc">
                      Refund to the original payment method used for the purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="refund-method-credit"
                    checked={refundMethod === "credit"}
                    onCheckedChange={() => setRefundMethod("credit")}
                    className={styles.checkbox}
                  />
                  <div>
                    <label
                      htmlFor="refund-method-credit"
                      className={cn("font-medium cursor-pointer", styles.text)}
                      data-translate="return.refund.credit"
                    >
                      Store Credit
                    </label>
                    <p className={cn("text-sm", styles.textMutedLighter)} data-translate="return.refund.creditDesc">
                      Receive store credit that can be used for future purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className={cn("font-medium mb-3", styles.text)} data-translate="return.uploadPhotos">
                Upload Photos (Optional)
              </h4>
              <p className={cn("text-sm mb-3", styles.textMutedLighter)} data-translate="return.uploadPhotosDesc">
                If your item is damaged or defective, please upload photos to help us process your return faster.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {returnImages.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative h-24 rounded-md overflow-hidden border",
                      styles.border
                    )}
                  >
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
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer transition-colors",
                    styles.border,
                    isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera size={24} className={cn("mb-2", styles.icon)} />
                    <p className={cn("text-sm", styles.textMutedLighter)} data-translate="return.clickToUpload">
                      Click to upload photos
                    </p>
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
        );
      case 3:
        return (
          <div className="py-4 space-y-6">
            <div className={cn("p-4 rounded-lg border", styles.bgSuccess)}>
              <div className="flex items-center">
                <CheckCircle size={24} className={cn("mr-3 flex-shrink-0", styles.text)} />
                <div>
                  <h4 className={cn("font-medium", styles.text)} data-translate="return.requestSubmitted">
                    Return Request Submitted
                  </h4>
                  <p className={cn("text-sm mt-1", styles.textMuted)} data-translate="return.requestSubmittedDesc">
                    Your return request has been submitted successfully. We&apos;ll review it and get back to you soon.
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("border rounded-md p-4", styles.border)}>
              <h4 className={cn("font-medium mb-3", styles.text)} data-translate="return.requestDetails">
                Return Request Details
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={styles.textMutedLighter} data-translate="return.requestDate">
                    Request Date:
                  </span>
                  <span className={cn("font-medium", styles.text)}>
                    {returnRequest
                      ? new Date(returnRequest.requestDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.textMutedLighter} data-translate="return.status">
                    Status:
                  </span>
                  <span
                    className={cn(
                      "font-medium px-2 py-0.5 rounded-full text-xs",
                      styles.badgePending
                    )}
                  >
                    Pending Review
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.textMutedLighter} data-translate="return.method">
                    Return Method:
                  </span>
                  <span className={cn("font-medium", styles.text)}>
                    {returnMethod === "mail"
                      ? "Return by Mail"
                      : "Return to Store"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.textMutedLighter} data-translate="return.refund">
                    Refund Method:
                  </span>
                  <span className={cn("font-medium", styles.text)}>
                    {refundMethod === "original"
                      ? "Original Payment Method"
                      : "Store Credit"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: styles.border }}>
                <h5 className={cn("font-medium mb-2", styles.text)} data-translate="return.itemsToReturn">
                  Items to Return
                </h5>
                <div className="space-y-3">
                  {orderItems.map((item) => {
                    if (!returnItems[item.id]) return null;
                    return (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-8 h-8 relative rounded-md overflow-hidden",
                            isDark ? "bg-white/5" : "bg-gray-100"
                          )}
                        >
                          <Image
                            src={getItemImage(item)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-sm font-medium", styles.text)}>
                            {item.name}
                          </p>
                          <p className={cn("text-xs", styles.textMutedLighter)}>
                            {item.variant && `${item.variant} • `}
                            <span data-translate="return.qty">Qty</span>: {item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={cn("p-4 rounded-lg border", styles.bgInfo)}>
              <div className="flex items-start">
                <AlertCircle size={20} className={cn("mr-3 flex-shrink-0 mt-0.5", styles.text)} />
                <div>
                  <h4 className={cn("font-medium", styles.text)} data-translate="return.whatsNext">
                    What&apos;s Next?
                  </h4>
                  <ol
                    className={cn("text-sm mt-1 list-decimal pl-4 space-y-1", styles.textMuted)}
                  >
                    <li data-translate="return.nextStep1">
                      We&apos;ll review your return request within 1-2 business days.
                    </li>
                    <li data-translate="return.nextStep2">
                      Once approved, you&apos;ll receive return instructions via email.
                    </li>
                    <li data-translate="return.nextStep3">
                      After we receive your return, we&apos;ll process your refund within 5-7 business days.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isDelivered) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn("flex items-center", styles.buttonPrimary)}>
          <RotateCcw size={16} className="mr-1.5" />
          <span data-translate="return.button">Return Items</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] max-h-[90vh] overflow-y-auto transition-colors duration-500",
          styles.card
        )}
      >
        <DialogHeader>
          <DialogTitle className={styles.text} data-translate="return.dialogTitle">
            Return Items
          </DialogTitle>
          <DialogDescription className={styles.textMutedLighter}>
            {returnStep === 1 &&
              `Select the items you want to return from order #${orderNumber}`}
            {returnStep === 2 && "Choose your return and refund preferences"}
            {returnStep === 3 && "Return request confirmation"}
          </DialogDescription>
        </DialogHeader>

        {renderReturnSteps()}

        <DialogFooter className="flex justify-between">
          {returnStep === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={handleCloseReturnDialog}
                className={styles.buttonOutline}
                data-translate="return.cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReturnNextStep}
                className={styles.buttonPrimary}
                data-translate="return.next"
              >
                Next Step
              </Button>
            </>
          ) : returnStep === 2 ? (
            <>
              <Button
                variant="outline"
                onClick={handleReturnPrevStep}
                className={styles.buttonOutline}
                data-translate="return.back"
              >
                Back
              </Button>
              <Button
                onClick={handleReturnSubmit}
                disabled={isSubmitting}
                className={styles.buttonPrimary}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                    <span data-translate="return.processing">Processing...</span>
                  </>
                ) : (
                  <span data-translate="return.submit">Submit Return Request</span>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCloseReturnDialog}
              className={styles.buttonPrimary}
              data-translate="return.close"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}