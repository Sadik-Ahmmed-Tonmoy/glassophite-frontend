/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useValidateCouponMutation } from "@/redux/features/coupon/couponApi";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setCoupon } from "@/redux/features/checkout/checkoutSlice";

import CheckoutStepper from "@/components/pages/checkout/CheckoutStepper";
import CheckoutSummary from "@/components/pages/checkout/CheckoutSummary";
import OrderConfirmation from "@/components/pages/checkout/OrderConfirmation";
import OrderReview from "@/components/pages/checkout/OrderReview";
import ShippingForm from "@/components/pages/checkout/ShippingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CheckoutPageClient() {
  const { items, totalPrice, clearCart, updateItemQuantity } = useCart();
  const { toast } = useToast();
  const [validateCoupon] = useValidateCouponMutation();
  const [createOrder] = useCreateOrderMutation();
  const dispatch = useAppDispatch();
  const reduxCoupon = useAppSelector((state) => state.checkout.coupon);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const stepParam = searchParams.get("step");
  const initialStep = stepParam ? parseInt(stepParam, 10) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const updateStepInUrl = useCallback(
    (step: number, replace: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step.toString());
      if (replace) {
        router.replace(`${pathname}?${params.toString()}`);
      } else {
        router.push(`${pathname}?${params.toString()}`);
      }
    },
    [pathname, router, searchParams]
  );

  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    saveAddress: false,
  });

  const [paymentMethod] = useState("CASH_ON_DELIVERY");
  const [paymentDetails] = useState<any>({});

  const [shippingMethod, setShippingMethod] = useState("standard");
  const shippingCost = shippingMethod === "express" ? 120 : 60;

  const subtotal = totalPrice;
  const initialCode = reduxCoupon?.code ?? "";
  const [couponCode, setCouponCode] = useState(initialCode);
  const initialDiscount = reduxCoupon ? subtotal * (reduxCoupon.discount / 100) : 0;
  const [discount, setDiscount] = useState(initialDiscount);

  const [rewardPointsUsed] = useState<number>(0);
  const [rewardDiscount] = useState<number>(0);

  const displayTotal = useMemo(
    () => Math.max(0, subtotal + shippingCost - discount - rewardDiscount),
    [subtotal, shippingCost, discount, rewardDiscount]
  );

  const nextStep = useCallback(() => {
    if (currentStep < 2) {
      const next = currentStep + 1;
      setCurrentStep(next);
      updateStepInUrl(next);
      window.scrollTo(0, 0);
    }
  }, [currentStep, updateStepInUrl]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      updateStepInUrl(prev);
      window.scrollTo(0, 0);
    }
  }, [currentStep, updateStepInUrl]);

  // Synchronize state when query parameters change
  useEffect(() => {
    const step = stepParam ? parseInt(stepParam, 10) : 1;
    if (step !== currentStep) {
      setCurrentStep(step);
    }
  }, [stepParam, currentStep]);

  useEffect(() => {
    if (!searchParams.get("step")) {
      updateStepInUrl(1, true);
    }
  }, [searchParams, updateStepInUrl]);

  useEffect(() => {
    if (currentStep === 2 && !shippingDetails.address) {
      setCurrentStep(1);
      updateStepInUrl(1, true);
    }
  }, [currentStep, shippingDetails.address, updateStepInUrl]);

  const handleShippingSubmit = (data: any) => {
    setShippingDetails((prev) => ({
      ...prev,
      ...data,
      country: data.country || prev.country || "Bangladesh",
    }));
    nextStep();
  };

  const orderPayload = useMemo(
    () => ({
      paymentMethod,
      couponCode: couponCode || undefined,
      shippingAddress: {
        name: `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim(),
        street: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        zipCode: shippingDetails.zipCode,
        country: shippingDetails.country || "Bangladesh",
        phone: shippingDetails.phone,
        firstName: shippingDetails.firstName,
        lastName: shippingDetails.lastName,
        address: shippingDetails.address,
      },
      shippingMethod,
      saveAddress: shippingDetails.saveAddress,
      rewardPointsUsed: rewardPointsUsed || undefined,
    }),
    [paymentMethod, couponCode, shippingDetails, shippingMethod, rewardPointsUsed]
  );

  const placeOrder = async () => {
    let adjusted = false;
    for (const item of items) {
      if (item.quantity > item.maxQuantity) {
        await updateItemQuantity(item.id, item.maxQuantity);
        adjusted = true;
      }
    }

    if (adjusted) {
      toast({
        title: "Stock levels adjusted",
        description:
          "Some items in your cart exceeded the available stock and have been adjusted to the maximum available quantity. Please review your total.",
        type: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder(orderPayload).unwrap();
      const newOrder = result?.data?.order || result?.data;
      setOrderData(newOrder);
      setOrderComplete(true);
      clearCart();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("cart_checkout_context");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      const errorMsg = error?.data?.errorMessages?.[0]?.message
        ? `${error.data.message}: ${error.data.errorMessages[0].path} - ${error.data.errorMessages[0].message}`
        : error?.data?.message ||
          error?.message ||
          "There was an error processing your order. Please try again.";
      toast({
        title: "Error placing order",
        description: errorMsg,
        type: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const result = await validateCoupon({
        code: code.toUpperCase().trim(),
      }).unwrap();
      const couponData = result?.data;
      if (couponData) {
        const discountAmount = subtotal * (couponData.discount / 100);
        setDiscount(discountAmount);
        setCouponCode(couponData.code);
        dispatch(
          setCoupon({ code: couponData.code, discount: couponData.discount })
        );
        toast({
          title: "Coupon applied",
          description: `${couponData.discount}% discount has been applied.`,
          type: "success",
        });
      }
    } catch (err: any) {
      toast({
        title: "Invalid coupon",
        description:
          err?.data?.message ||
          "The coupon code you entered is invalid or expired.",
        type: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    dispatch(setCoupon(null));
    toast({
      title: "Coupon removed",
      description: "Coupon has been removed from your order.",
      type: "success",
    });
  };

  if (orderComplete) {
    return <OrderConfirmation orderData={orderData} items={items} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 lg:py-16">
      <div className="mb-6 sm:mb-8">
        <Link
          href="/product-filter"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#007C74] transition-colors mb-3"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Continue Shopping
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Checkout
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            Your cart is empty
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Add items to your cart to proceed with checkout.
          </p>
          <Button asChild className="bg-[#007C74] hover:bg-[#006059] text-white rounded-full px-6 text-xs sm:text-sm font-bold">
            <Link href="/product-filter">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <CheckoutStepper currentStep={currentStep} />

            <div className="mt-8">
              {currentStep === 1 && (
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  shippingMethod={shippingMethod}
                  onShippingMethodChange={setShippingMethod}
                />
              )}

              {currentStep === 2 && (
                <OrderReview
                  items={items}
                  shippingDetails={shippingDetails}
                  paymentMethod={paymentMethod}
                  paymentDetails={paymentDetails}
                  shippingMethod={shippingMethod}
                  subtotal={subtotal}
                  shipping={shippingCost}
                  discount={discount}
                  total={displayTotal}
                  onBack={prevStep}
                  onPlaceOrder={placeOrder}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shippingCost}
              discount={discount}
              total={displayTotal}
              couponCode={couponCode}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
            />
          </div>
        </div>
      )}
    </div>
  );
}
