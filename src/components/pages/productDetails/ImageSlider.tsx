"use client";

import type React from "react";

import { MyButton } from "@/components/ui/buttons/MyButton/MyButton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaSearchengin } from "react-icons/fa6";
import { TImage } from "@/types/types";



interface ImageSliderProps {
  images: TImage[];
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
      <div className="relative h-[320px] sm:h-[450px] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
        <p className="text-xs sm:text-sm text-neutral-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div
        ref={imageContainerRef}
        className="relative max-h-[500px] max-w-[500px] h-full w-full aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {images?.length > 0 && (
            <div className="relative h-full w-full">
              <Image
                src={images[currentIndex]?.image || "/placeholder.svg?height=450&width=450"}
                alt={`Product image ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                className="object-cover object-center rounded-2xl"
              />
            </div>
          )}
        </div>

        {/* Hover indicator */}
        {images?.length > 0 && isHovering && inStock && (
          <div
            className="hidden xl:flex absolute h-44 w-44 rounded-full pointer-events-none items-center justify-center shadow-lg border border-white/20"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(2px)",
              top: Math.max(0, Math.min(position.y - 88, 320)),
              left: Math.max(0, Math.min(position.x - 88, 320)),
            }}
          >
            <FaSearchengin className="h-7 w-7 text-white opacity-90 drop-shadow" />
          </div>
        )}

        {/* Stock Out Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center">
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white mb-2" />
            <span className="text-white font-black text-xl sm:text-2xl tracking-wider">OUT OF STOCK</span>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer",
                  index === currentIndex ? "bg-white w-5" : "bg-white/50 w-2 hover:bg-white/80"
                )}
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
            "hidden xl:block h-[450px] w-[450px] aspect-square overflow-hidden absolute top-0 -right-[470px] rounded-2xl z-30 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-2xl"
          )}
        >
          <div className="h-full w-full">
            <Image
              src={images[currentIndex]?.image || "/placeholder.svg?height=450&width=450"}
              alt={`Zoomed product image ${currentIndex + 1}`}
              width={800}
              height={800}
              unoptimized
              style={customStyle}
              className="rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Thumbnails and navigation */}
      {images.length > 1 && (
        <div className="mt-3 sm:mt-4 flex justify-center items-center space-x-2 sm:space-x-3 max-w-full overflow-x-auto py-1 px-2 scrollbar-none touch-pan-x">
          <MyButton
            variant="outline"
            size="icon"
            className="bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 z-10 shadow-sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />
            <span className="sr-only">Previous slide</span>
          </MyButton>

          <div className="flex items-center space-x-2 overflow-x-auto max-w-[calc(100%-80px)] py-1 scrollbar-none">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => goToSlide(index)}
                className={`relative h-12 w-12 sm:h-16 sm:w-16 md:h-18 md:w-18 flex-shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer ${
                  index === currentIndex
                    ? "border-2 border-[#007C74] ring-2 ring-[#007C74]/30 scale-105"
                    : "border border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.image || "/placeholder.svg?height=80&width=80"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />

                {/* Thumbnail Stock Out Indicator */}
                {!inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white/80" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <MyButton
            variant="outline"
            size="icon"
            className="bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 z-10 shadow-sm"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />
            <span className="sr-only">Next slide</span>
          </MyButton>
        </div>
      )}
    </div>
  );
}
