/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Minus, Plus, AlertTriangle, X, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"


import { useGetPrescriptionLensesQuery } from "@/redux/features/lens/lensApi"

export default function CartItem({ item }: any) {
  const { updateItemQuantity, removeItem, updateItemPrescription } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { data: lensesData } = useGetPrescriptionLensesQuery({ isAvailable: true })
  const lenses = lensesData?.data || []

  const [showPrescriptionEdit, setShowPrescriptionEdit] = useState(false)
  const [editLensId, setEditLensId] = useState(item.lensId || "")
  const [editLeftPower, setEditLeftPower] = useState(item.lensPowerDetails?.leftEye || "0.00")
  const [editRightPower, setEditRightPower] = useState(item.lensPowerDetails?.rightEye || "0.00")

  const powerOptions: string[] = [];
  for (let i = -10.00; i <= 6.00; i += 0.25) {
    const val = i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
    powerOptions.push(val);
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > item.maxQuantity) {
      toast.error("Stock limit reached", {
        description: `Only ${item.maxQuantity} items are available in stock.`,
      })
      return
    }
    updateItemQuantity(item.id, newQuantity)
  }

  const lensPrice = item.lens?.price ?? lenses.find((l: any) => l.id === item.lensId)?.price ?? 0;
  const hasLens = !!item.lensId && lensPrice > 0;
  const baseFramePrice = (item.discountPrice || item.price) - lensPrice;
  const baseFrameOriginalPrice = item.price - lensPrice;

  const handleRemoveClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmRemove = () => {
    setShowConfirm(false)
    setIsRemoving(true)
    setTimeout(() => {
      removeItem(item.id)
    }, 300)
  }

  const handleCancelRemove = () => {
    setShowConfirm(false)
  }

  return (
    <motion.div
      className={`p-4 ${isRemoving ? "opacity-50" : ""}`}
      animate={{ opacity: isRemoving ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between  ">
            <div className="flex-1 pr-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{item.name}</h3>
              <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2 flex-wrap">
                <span>Brand: {item.brand}</span>
                <span>•</span>
                <span>Size: {item.size}</span>
                <span>•</span>
                <span className={item.maxQuantity < 7 ? "text-red-500 font-bold" : "text-emerald-600 font-medium"}>
                  Stock: {item.maxQuantity}
                </span>
              </div>

              {/* Color Variant */}
              {item.color && (
                <div className="mt-1.5 flex items-center">
                  <div
                    className="h-4 w-4 rounded-full border border-gray-300 mr-1.5"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-500">{item.colorName}</span>
                </div>
              )}

              {/* Prescription / Lens Details */}
              {item.lensPowerDetails && (
                <div className="mt-2 p-2 rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#007C74] flex items-center">
                      👓 Prescription Lenses
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditLensId(item.lensId || (lenses[0]?.id || ""));
                          setEditLeftPower(item.lensPowerDetails?.leftEye || "0.00");
                          setEditRightPower(item.lensPowerDetails?.rightEye || "0.00");
                          setShowPrescriptionEdit(!showPrescriptionEdit);
                        }}
                        className="text-[10px] text-[#3C55A5] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const confirmClear = window.confirm("Are you sure you want to remove the prescription lenses from this frame?");
                          if (confirmClear) {
                            updateItemPrescription(item.id, null, null);
                            toast.success("Prescription removed");
                          }
                        }}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                    <div>Type: <span className="font-medium">{item.lensPowerDetails.lensType} {item.lens?.price !== undefined && `(+ ৳${item.lens.price.toFixed(2)})`}</span></div>
                    <div className="flex space-x-3">
                      <span>Left (OS): <span className="font-medium">{item.lensPowerDetails.leftEye}</span></span>
                      <span>Right (OD): <span className="font-medium">{item.lensPowerDetails.rightEye}</span></span>
                    </div>
                  </div>
                </div>
              )}

              {showPrescriptionEdit && (
                <div className="mt-2 p-3 rounded-lg border border-[#007C74]/30 bg-[#007C74]/5 space-y-3">
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex justify-between items-center">
                    <span>Edit Prescription</span>
                    <button onClick={() => setShowPrescriptionEdit(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Lens Type</label>
                      <select
                        value={editLensId}
                        onChange={(e) => setEditLensId(e.target.value)}
                        className="w-full p-1.5 rounded border text-xs bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none"
                      >
                        {lenses.map((opt) => (
                          <option key={opt.id} value={opt.id}>{opt.name} (+ ৳{opt.price.toFixed(2)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Left (OS)</label>
                        <select
                          value={editLeftPower}
                          onChange={(e) => setEditLeftPower(e.target.value)}
                          className="w-full p-1.5 rounded border text-xs bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none"
                        >
                          {powerOptions.map((opt) => (
                            <option key={`edit-left-${opt}`} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Right (OD)</label>
                        <select
                          value={editRightPower}
                          onChange={(e) => setEditRightPower(e.target.value)}
                          className="w-full p-1.5 rounded border text-xs bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none"
                        >
                          {powerOptions.map((opt) => (
                            <option key={`edit-right-${opt}`} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-1.5">
                      <button
                        onClick={() => setShowPrescriptionEdit(false)}
                        className="px-2.5 py-1 rounded text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const selectedLens = lenses.find(l => l.id === editLensId);
                          updateItemPrescription(item.id, {
                            lensType: selectedLens?.name || "Custom Lens",
                            leftEye: editLeftPower,
                            rightEye: editRightPower,
                          }, editLensId);
                          setShowPrescriptionEdit(false);
                          toast.success("Prescription updated");
                        }}
                        className="px-2.5 py-1 rounded text-xs bg-[#007C74] text-white hover:bg-[#007C74]/90 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemoveClick}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 h-fit"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Inline Delete Confirmation */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-2">
                  <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                    <AlertTriangle size={13} />
                    <span>Remove this item?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCancelRemove}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                      <X size={11} />
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmRemove}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    >
                      <Check size={11} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price and Quantity */}
          <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className={`px-2 py-1 text-gray-500 hover:text-gray-700 cursor-pointer ${
                  item.quantity >= item.maxQuantity ? "opacity-50" : ""
                }`}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right flex flex-col items-end">
              {hasLens ? (
                <div className="flex flex-col items-end space-y-0.5 text-xs">
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Frame:{" "}
                    {item.discountPrice ? (
                      <>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          ৳{baseFramePrice.toFixed(2)}
                        </span>
                        <span className="ml-1 text-[10px] text-gray-400 line-through">
                          ৳{baseFrameOriginalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ৳{baseFramePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Lens: <span className="font-semibold text-gray-900 dark:text-gray-100">+ ৳{lensPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 pt-0.5 border-t border-gray-100 dark:border-neutral-800">
                    Unit: ৳{(item.discountPrice || item.price).toFixed(2)}
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                    {item.quantity} × ৳{(item.discountPrice || item.price).toFixed(2)} ={" "}
                    <span className="font-bold text-[#007C74] text-sm">
                      ৳{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.quantity} × ৳{(item.discountPrice || item.price).toFixed(2)} =
                  </div>
                  <div className="mt-0.5">
                    {item.discountPrice ? (
                      <>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">৳{(item.discountPrice * item.quantity).toFixed(2)}</span>
                        <span className="ml-1.5 text-xs text-gray-400 line-through">৳{(item.price * item.quantity).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-900 dark:text-gray-100">৳{(item.price * item.quantity).toFixed(2)}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Removed save for later container */}
        </div>
      </div>
    </motion.div>
  )
}
