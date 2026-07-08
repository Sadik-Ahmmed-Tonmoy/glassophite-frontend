/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useWatch, useFormContext } from "react-hook-form";

import MyFormCheckBox from "@/components/ui/MyForm/MyFormCheckBox/MyFormCheckBox";
import MyFormInputAceternity from "@/components/ui/MyForm/MyFormInputAceternity/MyFormInputAceternity";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MyFormShippingMethod from "@/components/ui/MyForm/MyFormShippingMethod/MyFormShippingMethod";
import { cn } from "@/lib/utils";
import { useGetAddressesQuery, useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } from "@/redux/features/address/addressApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const validationSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }).min(1, { message: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }).min(1, { message: "Last name is required" }),
  address: z.string({ required_error: "Address is required" }).min(1, { message: "Address is required" }),
  city: z.string({ required_error: "City is required" }).min(1, { message: "City is required" }),
  state: z.string({ required_error: "State is required" }).min(1, { message: "State is required" }),
  zipCode: z.string({ required_error: "ZIP code is required" }).min(1, { message: "ZIP code is required" }),
  shippingMethod: z.string({ required_error: "Shipping method is required" }).min(1, { message: "Shipping method is required" }),
});

const savedAddressValidationSchema = z.object({
  shippingMethod: z.string({ required_error: "Shipping method is required" }).min(1, { message: "Shipping method is required" }),
});

const editAddressValidationSchema = z.object({
  label: z.string({ required_error: "Label is required" }).min(1, { message: "Label is required" }),
  name: z.string({ required_error: "Full name is required" }).min(1, { message: "Full name is required" }),
  phone: z.string({ required_error: "Phone number is required" }).min(1, { message: "Phone number is required" }),
  street: z.string({ required_error: "Street address is required" }).min(1, { message: "Street address is required" }),
  city: z.string({ required_error: "City is required" }).min(1, { message: "City is required" }),
  state: z.string({ required_error: "State is required" }).min(1, { message: "State is required" }),
  zipCode: z.string({ required_error: "ZIP code is required" }).min(1, { message: "ZIP code is required" }),
});

const shippingOptions = [
  {
    value: "standard",
    label: "Inside Dhaka",
    price: "৳60.00",
    delivery: "1–3 business days",
    icon: Calendar
  },
  {
    value: "express",
    label: "Outside Dhaka",
    price: "৳120.00",
    delivery: "4–7 business days",
    icon: Clock
  },
];

function ShippingMethodWatcher({ onChange }: { onChange: (method: string) => void }) {
  const { control } = useFormContext();
  const method = useWatch({
    control,
    name: "shippingMethod",
  });

  useEffect(() => {
    if (method) {
      onChange(method);
    }
  }, [method, onChange]);

  return null;
}

function SaveAddressButton({ isSaving, onSave }: { isSaving: boolean; onSave: (values: any) => void }) {
  const { trigger, getValues } = useFormContext();
  const token = useAppSelector((state) => state.auth.access_token);

  const handleClick = async () => {
    const isValid = await trigger(["firstName", "lastName", "address", "city", "state", "zipCode"]);
    if (isValid) {
      onSave(getValues());
    }
  };

  if (!token) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSaving}
      className="px-3 py-1.5 bg-[#007C74] hover:bg-[#007C74]/90 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
    >
      {isSaving ? "Saving..." : "Save Address"}
    </button>
  );
}

interface ShippingFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  shippingMethod: string;
  onShippingMethodChange: (method: string) => void;
}

export default function ShippingForm({
  onSubmit,
  shippingMethod,
  onShippingMethodChange,
}: ShippingFormProps) {
  const [saveAddress, setSaveAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressMode, setAddressMode] = useState<"saved" | "new">("new");
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);

  const [createAddress, { isLoading: isSavingAddress }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const token = useAppSelector((state) => state.auth.access_token);

  const { data: addressesData, isLoading: addressesLoading } = useGetAddressesQuery(undefined, {
    skip: !token,
  });
  const savedAddresses = addressesData?.data || [];
  const hasUserInteracted = useRef(false);

  const handleSaveToBook = async (formValues: any) => {
    try {
      await createAddress({
        name: `${formValues.firstName} ${formValues.lastName}`.trim(),
        street: formValues.address,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        country: "Bangladesh",
        phone: formValues.phone || "",
        label: "Shipping",
        isDefault: false,
      }).unwrap();

      toast.success("Address saved to address book!");
      setAddressMode("saved");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save address. Please try again.");
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDeleteId) return;
    try {
      await deleteAddress(addressToDeleteId).unwrap();
      toast.success("Address deleted successfully!");
      if (selectedAddressId === addressToDeleteId) {
        setSelectedAddressId(null);
      }
      setAddressToDeleteId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete address.");
    }
  };

  const handleEditAddressSubmit = async (data: any) => {
    if (!editingAddress) return;
    try {
      await updateAddress({
        id: editingAddress.id,
        label: data.label,
        name: data.name,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
        country: "Bangladesh",
      }).unwrap();
      toast.success("Address updated successfully!");
      setEditingAddress(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update address. Please try again.");
    }
  };

  // Only auto-switch to "saved" on initial load if user hasn't manually toggled tabs
  useEffect(() => {
    if (!hasUserInteracted.current && savedAddresses.length > 0) {
      setAddressMode("saved");
    }
  }, [savedAddresses.length]);

  // Set default selected address
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find((a: any) => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr?.id || null);
    }
  }, [savedAddresses, selectedAddressId]);

  const handleSavedAddressSubmit = (data: any) => {
    const selectedAddress = savedAddresses.find((a: any) => a.id === selectedAddressId);
    if (!selectedAddress) {
      return;
    }

    const nameParts = (selectedAddress.name || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    onSubmit({
      firstName,
      lastName,
      address: selectedAddress.street || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      zipCode: selectedAddress.zipCode || "",
      country: selectedAddress.country || "Bangladesh",
      phone: selectedAddress.phone || "",
      saveAddress: false,
      shippingMethod: data.shippingMethod,
    });
  };

  const handleNewAddressSubmit = (data: any) => {
    onSubmit({ ...data, saveAddress });

    if (saveAddress) {
      localStorage.setItem("savedAddress", JSON.stringify(data));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const fieldVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-divider bg-content1/50 backdrop-blur-sm p-6 transition-colors duration-500"
    >
      <h2 className="text-xl font-semibold text-foreground mb-6">Shipping Information</h2>

      {/* Segmented Mode Switcher */}
      {!addressesLoading && (
        <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 border dark:border-white/5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setAddressMode("saved"); hasUserInteracted.current = true; }}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer",
              addressMode === "saved"
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            Saved Addresses
          </button>
          <button
            type="button"
            onClick={() => { setAddressMode("new"); hasUserInteracted.current = true; }}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer",
              addressMode === "new"
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            Add New Shipping Address
          </button>
        </div>
      )}

      {/* Render selected view */}
      {addressMode === "saved" ? (
        <MyFormWrapper
          key="saved-address-form"
          onSubmit={handleSavedAddressSubmit}
          resolver={zodResolver(savedAddressValidationSchema)}
          defaultValues={{ shippingMethod }}
          className="space-y-6"
        >
          <ShippingMethodWatcher onChange={onShippingMethodChange} />

          {savedAddresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr: any) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between",
                    selectedAddressId === addr.id
                      ? "border-[#007C74] bg-[#007C74]/5 dark:bg-[#007C74]/10 shadow-sm"
                      : "border-gray-200 dark:border-white/10 hover:border-[#007C74]/40"
                  )}
                >
                  <div className="flex items-start gap-3 w-full">
                    <MapPin size={20} className={cn("mt-0.5 shrink-0", selectedAddressId === addr.id ? "text-[#007C74]" : "text-gray-400")} />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {addr.label}
                          </p>
                          {addr.isDefault && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#007C74]/10 text-[#007C74] rounded-full shrink-0">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddress(addr);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors text-gray-500 hover:text-[#007C74] cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit2 size={14} />
                          </button>
                           <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddressToDeleteId(addr.id);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors text-gray-500 hover:text-red-500 cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-neutral-300 mt-1 truncate">
                        {addr.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 break-words line-clamp-2">
                        {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                  </div>
                  {addr.phone && <p className="text-xs text-gray-500 dark:text-neutral-400 mt-3">{addr.phone}</p>}
                </div>
              ))}

              <button
                type="button"
                onClick={() => { setAddressMode("new"); hasUserInteracted.current = true; }}
                className="w-full min-h-[140px] flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-[#007C74]/50 hover:bg-[#007C74]/5 transition-all duration-200 cursor-pointer text-gray-500 hover:text-[#007C74] h-full"
              >
                <Plus size={24} className="mb-2" />
                <span className="text-sm font-semibold">Add New Shipping Address</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8 px-4 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-white/5">
              <MapPin size={36} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">No saved addresses found</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 mb-4">You have not saved any addresses yet.</p>
              <button
                type="button"
                onClick={() => { setAddressMode("new"); hasUserInteracted.current = true; }}
                className="text-xs font-semibold px-4 py-2 bg-[#007C74] hover:bg-[#007C74]/90 text-white rounded-lg cursor-pointer"
              >
                Add New Shipping Address
              </button>
            </div>
          )}

          {savedAddresses.length > 0 && (
            <>
              <MyFormShippingMethod
                name="shippingMethod"
                label="Shipping Method"
                options={shippingOptions}
              />

             <motion.div variants={fieldVariants} initial={false}>
            <button type="submit" className={cn(
              "bg-gradient-to-br relative group/btn from-[#00a76b] to-[#187c57] block w-full text-white rounded-md h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] cursor-pointer",
            )}>
              Continue to Payment
            </button>
          </motion.div>
            </>
          )}
        </MyFormWrapper>
      ) : (
        <MyFormWrapper
          key="new-address-form"
          onSubmit={handleNewAddressSubmit}
          resolver={zodResolver(validationSchema)}
          defaultValues={{ shippingMethod }}
          className="space-y-6"
        >
          <ShippingMethodWatcher onChange={onShippingMethodChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="firstName" label="First Name" placeholder="Enter your first name" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="lastName" label="Last Name" placeholder="Enter your last name" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="email" label="Email Address" placeholder="Enter your email" type="email" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="phone" label="Phone Number" placeholder="Enter your phone number" type="tel" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false} className="md:col-span-2">
              <MyFormInputAceternity name="address" label="Street Address" placeholder="Enter your street address" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="city" label="City" placeholder="Enter your city" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="state" label="State/Province" placeholder="Enter your state" />
            </motion.div>
            <motion.div variants={fieldVariants} initial={false}>
              <MyFormInputAceternity name="zipCode" label="ZIP/Postal Code" placeholder="Enter your ZIP code" />
            </motion.div>
          </div>

          <motion.div variants={fieldVariants} initial={false} className="flex flex-row items-center gap-4 flex-wrap">
            <MyFormCheckBox
              title="Save this address for future orders"
              handleCheckboxChange={setSaveAddress}
              defaultSelected={saveAddress}
            />
            <SaveAddressButton isSaving={isSavingAddress} onSave={handleSaveToBook} />
          </motion.div>

          <MyFormShippingMethod
            name="shippingMethod"
            label="Shipping Method"
            options={shippingOptions}
          />

          <motion.div variants={fieldVariants} initial={false}>
            <button type="submit" className={cn(
              "bg-gradient-to-br relative group/btn from-[#00a76b] to-[#187c57] block w-full text-white rounded-md h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] cursor-pointer",
            )}>
              Continue to Payment
            </button>
          </motion.div>
        </MyFormWrapper>
      )}
      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={(open) => !open && setEditingAddress(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-xl text-neutral-900 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black dark:text-white">Edit Saved Address</DialogTitle>
            <DialogDescription className="sr-only">Update your saved shipping address details.</DialogDescription>
          </DialogHeader>
          
          {editingAddress && (
            <MyFormWrapper
              key={`edit-addr-${editingAddress.id}`}
              onSubmit={handleEditAddressSubmit}
              resolver={zodResolver(editAddressValidationSchema)}
              defaultValues={{
                label: editingAddress.label || "",
                name: editingAddress.name || "",
                phone: editingAddress.phone || "",
                street: editingAddress.street || "",
                city: editingAddress.city || "",
                state: editingAddress.state || "",
                zipCode: editingAddress.zipCode || "",
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 mt-2">
                <MyFormInputAceternity name="label" label="Address Label" placeholder="e.g. Home, Work, Shipping" />
                <MyFormInputAceternity name="name" label="Full Name" placeholder="Enter recipient's full name" />
                <MyFormInputAceternity name="phone" label="Phone Number" placeholder="Enter phone number" />
                <MyFormInputAceternity name="street" label="Street Address" placeholder="Enter street address" />
                <div className="grid grid-cols-2 gap-4">
                  <MyFormInputAceternity name="city" label="City" placeholder="City" />
                  <MyFormInputAceternity name="state" label="State" placeholder="State" />
                </div>
                <MyFormInputAceternity name="zipCode" label="ZIP/Postal Code" placeholder="ZIP code" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-150 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingAddress(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingAddress}
                  className="px-4 py-2 bg-[#007C74] hover:bg-[#007C74]/90 text-white rounded-lg text-sm font-medium disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingAddress ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </MyFormWrapper>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Address Confirmation Dialog */}
      <AlertDialog open={!!addressToDeleteId} onOpenChange={(open) => !open && setAddressToDeleteId(null)}>
        <AlertDialogContent className="sm:max-w-[440px] bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-xl text-neutral-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
              Confirm Address Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-neutral-400 text-sm mt-2">
              Are you sure you want to delete this saved address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel
              onClick={() => setAddressToDeleteId(null)}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer text-gray-750 dark:text-neutral-300 bg-transparent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAddress}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
