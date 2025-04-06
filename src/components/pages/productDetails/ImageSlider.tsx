"use client";

import type React from "react";

import { MyButton } from "@/components/ui/buttons/MyButton/MyButton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaSearchengin } from "react-icons/fa6";

interface ImageItem {
  image: string;
  id: number;
}

interface ImageSliderProps {
  images: ImageItem[];
  inStock: boolean;
  selectedVariantColor?: string;
}

export default function ImageSlider({ images, inStock, selectedVariantColor }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevVariantColor, setPrevVariantColor] = useState(selectedVariantColor);
  const [isHovering, setIsHovering] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
 
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Track variant color changes for animation
  useEffect(() => {
    if (selectedVariantColor !== prevVariantColor) {
      setPrevVariantColor(selectedVariantColor);
    }
  }, [selectedVariantColor, prevVariantColor]);

  // Handle hover with delay
  const handleMouseEnter = () => {
    setIsHovering(true);

    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    // Set a new timer for showing the zoom view
    hoverTimerRef.current = setTimeout(() => {
      setShowZoom(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowZoom(false);

    // Clear the timer if it exists
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle mouse movement for zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top } = imageContainerRef.current.getBoundingClientRect();

    // Calculate position relative to the container
    const x = e.clientX - left;
    const y = e.clientY - top;

    setPosition({ x, y });
  };

 

  
  const customStyle = {
    transform: `translate(calc(100% - ${position.x}px), calc(100% - ${position.y}px)) translate(-${position.x}px, -${position.y}px) scale(1.75, 1.75)`,
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[450px] w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        ref={imageContainerRef}
        className="relative  max-h-[500px] max-w-[500px] h-full w-full xl:h-[500px] xl:w-[500px] aspect-square overflow-hidden rounded-lg bg-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
     
        // onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
      >
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100">
          {/* Wishlist Button */}
          {/* <button
            className={`absolute top-4 right-4 z-30 bg-white/80 p-2 rounded-full hover:bg-white transition-all duration-300 ${
              isWishlistActive ? "scale-110" : "scale-100"
            }`}
            onClick={toggleWishlist}
            aria-label={isWishlistActive ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isWishlistActive ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </button> */}
          {images?.length > 0 && (
            <div className="relative h-full w-full  ">
              {/* <Image
                src={images[currentIndex]?.image || "/placeholder.svg?height=450&width=450"}
                alt={`Product image ${currentIndex + 1}`}
                width={800}
                height={800}
                priority
                quality={80}
                placeholder="blur"
                blurDataURL={images[currentIndex]?.image}
                className="object-center h-full w-full rounded-lg"
              /> */}
              <img
                src={images[currentIndex]?.image || "/placeholder.svg?height=450&width=450"}
                alt={`Product image ${currentIndex + 1}`}
                className="object-center h-full w-full rounded-lg"
                loading="lazy"
              />
            </div>
          )}
        </div>
        {/* Hover indicator */}
        {images?.length > 0 && isHovering && inStock && (
          <div
            className="hidden lg:flex absolute h-52 w-52 rounded-lg pointer-events-none items-center justify-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              top: Math.max(0, Math.min(position.y - 100, 350)),
              left: Math.max(0, Math.min(position.x - 100, 350)),
            }}
          >
            {/* <Search className="h-8 w-8 text-white opacity-80" /> */}
            <FaSearchengin className="h-8 w-8 text-white opacity-80" />
          </div>
        )}

        {/* Stock Out Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center">
            <XCircle className="w-16 h-16 text-white mb-3" />
            <span className="text-white font-bold text-2xl">STOCK OUT</span>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn("w-2.5 h-2.5 rounded-full transition-all", index === currentIndex ? "bg-black w-5" : "bg-gray-300")}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zoom view */}
      {images?.length > 0 && showZoom && inStock && (
        <div
          className={cn(
            "hidden lg:block max-h-[500px] max-w-[500px] h-full w-full xl:h-[500px] xl:w-[500px] aspect-square overflow-hidden absolute top-0 -right-[490px] rounded-lg z-20 border border-gray-200 bg-[#f7f8f7]"
          )}
        >
          <div className="h-full w-full">
            <img
              src={images[currentIndex]?.image || "/placeholder.svg?height=450&width=450"}
              alt={`Zoomed product image ${currentIndex + 1}`}
              style={customStyle}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Thumbnails and navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2 overflow-x-auto pb-2">
          <MyButton
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-30"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous slide</span>
          </MyButton>

          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => goToSlide(index)}
              className={`relative h-14  w-14 md:h-20 md:w-20 overflow-hidden rounded transition-all ${
                index === currentIndex ? "border-2 border-black" : "border border-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img.image || "/placeholder.svg?height=80&width=80"} alt={`Thumbnail ${index + 1}`} className="object-cover " />

              {/* Thumbnail Stock Out Indicator */}
              {!inStock && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white/80" />
                </div>
              )}
            </button>
          ))}

          <MyButton variant="outline" size="icon" className="bg-white/80 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-30" onClick={goToNext}>
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next slide</span>
          </MyButton>
        </div>
      )}
    </div>
  );
}
