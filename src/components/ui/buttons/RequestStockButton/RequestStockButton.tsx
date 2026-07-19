"use client";
import "./RequestStockButton.css"; // Import your CSS file here
import {
  useCreateStockRequestMutation,
  useGetMyStockRequestsQuery,
} from "@/redux/features/stockRequest/stockRequestApi";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface RequestStockButtonProps {
  productId?: string;
  variantId?: string;
}

const RequestStockButton = ({
  productId,
  variantId,
}: RequestStockButtonProps) => {
  const token = useAppSelector((state) => state.auth.access_token);
  const { data: myRequestsData } = useGetMyStockRequestsQuery(undefined, {
    skip: !token,
  });
  const [createStockRequest, { isLoading }] = useCreateStockRequestMutation();

  const isAlreadyRequested = useMemo(() => {
    if (!myRequestsData?.data || !productId || !variantId) return false;
    return myRequestsData.data.some(
      (req: { productId: string; variantId: string; status: string }) =>
        req.productId === productId &&
        req.variantId === variantId &&
        req.status === "PENDING",
    );
  }, [myRequestsData, productId, variantId]);

  const handleRequestClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || !variantId) {
      toast.error("Invalid product or variant context");
      return;
    }

    if (!token) {
      toast.error("Please log in", {
        description: "You must be logged in to request restock notifications.",
      });
      return;
    }

    try {
      await createStockRequest({ productId, variantId }).unwrap();
      toast.success("Restock Request Placed", {
        description: "We will notify you once this variant is back in stock.",
      });
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error("Request failed", {
        description: error?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <button
      onClick={handleRequestClick}
      disabled={isLoading || isAlreadyRequested}
      className={cn(
        "RequestBtn w-full transition-colors flex justify-center items-center gap-1.5 py-3 rounded-md disabled:cursor-not-allowed",
        isAlreadyRequested
          ? "bg-emerald-600 dark:bg-emerald-700 text-white disabled:opacity-100"
          : "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white disabled:opacity-75",
      )}
    >
      <span className="IconContainer">
        {isLoading ? (
          <Loader2 className="w-[1em] h-[1em] animate-spin text-white" />
        ) : isAlreadyRequested ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            fill="white"
            className="request-icon"
          >
            <path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 338.7 54.6 233.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            fill="white"
            className="request-icon"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>
        )}
      </span>
      <p className="text text-white">
        {isLoading
          ? "Requesting..."
          : isAlreadyRequested
            ? "Already Requested"
            : "Request Stock"}
      </p>
    </button>
  );
};

export default RequestStockButton;
