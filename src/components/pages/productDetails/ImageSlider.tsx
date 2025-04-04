"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious();
    }
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovering]);

  return (
    <div className="relative">
      <div
        className="relative h-[450px] w-full overflow-hidden rounded-lg bg-gray-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`transition-all duration-500 ease-in-out ${
            isHovering ? "scale-150" : "scale-100"
          }`}
        >
          <Image
            src={
              images[currentIndex] || "/placeholder.svg?height=450&width=450"
            }
            alt={`Product image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {isHovering && (
          <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full">
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </div>
        )}

        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </button>

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next slide</span>
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index === currentIndex ? "bg-black w-5" : "bg-gray-300"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-20 w-20 overflow-hidden rounded transition-all ${
              index === currentIndex
                ? "border-2 border-black"
                : "border border-gray-200 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={images[index] || "/placeholder.svg?height=80&width=80"}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
