"use client";
import { TProduct, TVariant } from "@/app/types/types";
import { Heart, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddToCartButton from "../buttons/AddToCartButton/AddToCartButton";
import RequestStockButton from "../buttons/RequestStockButton/RequestStockButton";
import ViewDetailsButton from "../buttons/ViewDetailsButton/view-details-button";



interface ProductCardProps {
  product: TProduct
}

function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<TVariant>(
    product?.variants[0]
  );
  const [isActive, setIsActive] = useState(false);

  const handleColorButtonClick = (variant: TVariant) => {
    setSelectedVariant(variant);
  };

  const handleClick = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <div className="w-[350px] mx-auto">
      <div className="bg-gray-100 rounded-md">
        <div className="w-full h-52 relative">
          <button
            className={`absolute top-2 right-2 z-20 text-2xl text-white transition-transform duration-300 ${
              isActive ? "scale-110" : "scale-100"
            }`}
            onClick={handleClick}
          >
            <Heart className={isActive ? "fill-red-500 text-red-500" : ""} />
          </button>

          {/* Product Code Badge */}
          <div className="absolute bottom-2 left-2 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
            Code: <span className="ps-1">{selectedVariant.productCode}</span>
          </div>

          {product.variants.map((variant, index) => (
            <div key={index} className="relative">
              <Image
                src={variant.imgList[0]?.image || "/placeholder.svg"}
                alt="shoes"
                width={400}
                height={400}
                priority
                quality={80}
                placeholder="blur"
                blurDataURL={variant.imgList[0]?.image}
                className={`absolute h-52 w-full rounded-t-md object-cover ${
                  selectedVariant.color === variant.color
                    ? "z-10 transition-all duration-500"
                    : "transition-all delay-500"
                }`}
                style={{
                  clipPath:
                    selectedVariant.color === variant.color
                      ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%) "
                      : "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%) ",
                }}
              />
              {selectedVariant.color === variant.color && !variant.inStock && (
                <div className="absolute inset-4 bg-black/50 z-20 flex flex-col items-center justify-center">
                  <XCircle className="w-12 h-12 text-white mb-2" />
                  <span className="text-white font-bold text-xl">
                    STOCK OUT
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <article className="text-black pt-2 p-4">
          <div className="flex justify-between">
            <h1 className="font-semibold text-xl text-green-600">
              {selectedVariant.title.length > 15
                ? `${selectedVariant.title.slice(0, 15)}...`
                : selectedVariant.title}
            </h1>
            {!selectedVariant.inStock ? (
              <span className="text-red-500 font-medium text-sm">
                Out of Stock
              </span>
            ) : (
              <span className="text-green-500 font-medium text-sm">
                {selectedVariant.quantity <= 5
                  ? `Only ${selectedVariant.quantity} left!`
                  : "In Stock"}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {selectedVariant.shortDescription &&
            selectedVariant.shortDescription.length > 40
              ? `${selectedVariant.shortDescription.slice(0, 40)}...`
              : selectedVariant.shortDescription}
          </p>
          <div className="flex justify-between py-2">
            <h1 className="font-semibold text-2xl text-green-600">
              ৳ {selectedVariant.priceAfterDiscount} BDT
            </h1>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400 line-through">
                ৳{selectedVariant.mainPrice} BDT
              </span>
              <span className="text-sm text-green-500">
                {selectedVariant.discountPercent}% off
              </span>
            </div>
          </div>
          <div className="flex justify-between py-2">
            <div className="flex gap-2 items-center">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => handleColorButtonClick(variant)}
                  className={`relative w-6 h-6 border rounded-full grid place-content-center transition-all ${
                    selectedVariant.color === variant.color
                      ? "border-black"
                      : "border-gray-200"
                  } ${!variant.inStock ? "opacity-60" : ""}`}
                  title={
                    variant.inStock
                      ? `Available: ${variant.quantity}`
                      : "Out of Stock"
                  }
                >
                  <span
                    className="w-4 h-4 rounded-full inline-block"
                    style={{
                      backgroundColor: variant.color,
                    }}
                  ></span>
                  {!variant.inStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-[1px] bg-red-500 rotate-45"></div>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Product Code (Alternative Position) */}
            <div className="text-xs text-gray-500 flex items-center">
              <span className="font-mono">
                SKU: {selectedVariant.productCode}
              </span>
            </div>
          </div>

          {/* Button Group */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ViewDetailsButton />
            {!selectedVariant.inStock ? (
              <RequestStockButton />
            ) : (
              <AddToCartButton />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

export default ProductCard;
