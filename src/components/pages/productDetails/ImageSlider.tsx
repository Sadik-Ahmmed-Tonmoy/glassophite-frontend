"use client";

import type React from "react";

import { MyButton } from "@/components/ui/buttons/MyButton/MyButton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaSearchengin } from "react-icons/fa6";
import { TImage } from "@/types/types";

interface ImageSliderProps {
  images: TImage[];
  inStock: boolean;
  selectedVariantColor?: string;
}

const HOVER_DELAY_MS = 100;
const ZOOM_SCALE = 1.99;
const ZOOM_PANE_GAP = 20; // px gap between main image and zoom pane
const DEFAULT_PANE_SIZE = 450; // fallback before containerSize is measured
const PRELOAD_WIDTH = 1200; // match your Next config's deviceSizes/imageSizes bucket
const PRELOAD_QUALITY = 85;

export default function ImageSlider({
  images,
  inStock,
  selectedVariantColor,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevVariantColor, setPrevVariantColor] = useState(selectedVariantColor);
  const [isHovering, setIsHovering] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [isZoomImageLoading, setIsZoomImageLoading] = useState(true);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Show the loader again whenever the active slide changes — if it's
  // already cached (see the preload effect below) the browser resolves
  // the Image almost immediately and onLoad clears this on the same tick;
  // if it's not cached yet, the spinner covers the wait instead of an
  // empty/stale frame.
  useEffect(() => {
    setIsMainImageLoading(true);
    setIsZoomImageLoading(true);
  }, [currentIndex, images]);

  // Warm the browser cache for every slide image up front (through the same
  // Next.js image-optimizer URL the real <Image> will request), so switching
  // slides is instant instead of triggering a fresh fetch each time.
  useEffect(() => {
    if (!images || images.length === 0) return;
    images.forEach((img) => {
      if (!img?.image) return;
      const preloadImg = new window.Image();
      preloadImg.src = `/_next/image?url=${encodeURIComponent(img.image)}&w=${PRELOAD_WIDTH}&q=${PRELOAD_QUALITY}`;
    });
  }, [images]);

  // Track variant color changes for animation
  useEffect(() => {
    if (selectedVariantColor !== prevVariantColor) {
      setPrevVariantColor(selectedVariantColor);
    }
  }, [selectedVariantColor, prevVariantColor]);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // Handle hover with delay
  const handleMouseEnter = useCallback(() => {
    if (imageContainerRef.current) {
      const { width, height } = imageContainerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
    setIsHovering(true);
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => setShowZoom(true), HOVER_DELAY_MS);
  }, [clearHoverTimer]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setShowZoom(false);
    clearHoverTimer();
  }, [clearHoverTimer]);

  // Clean up timer/rAF on unmount
  useEffect(() => {
    return () => {
      clearHoverTimer();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clearHoverTimer]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  // Handle mouse movement for zoom — throttled to one update per frame
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top } = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPosition({ x, y }));
  }, []);

  // Recenters whatever point you're hovering over so it lands in the middle
  // of the zoom pane after scaling, then clamps so we never translate past
  // the image's own edges (which would show blank space). Uses the *actual*
  // measured size of the main image container, so the zoom pane always
  // matches it 1:1 instead of assuming a fixed box size.
  const zoomStyle = useMemo(() => {
    const { width, height } = containerSize;
    const xRatio = width ? position.x / width : 0.5;
    const yRatio = height ? position.y / height : 0.5;

    const rawTx = width * (0.5 - xRatio * ZOOM_SCALE);
    const rawTy = height * (0.5 - yRatio * ZOOM_SCALE);

    const minTx = width * (1 - ZOOM_SCALE);
    const minTy = height * (1 - ZOOM_SCALE);

    const tx = Math.min(0, Math.max(minTx, rawTx));
    const ty = Math.min(0, Math.max(minTy, rawTy));

    return {
      transform: `translate(${tx}px, ${ty}px) scale(${ZOOM_SCALE})`,
      transformOrigin: "0 0",
    };
  }, [position, containerSize]);

  const indicatorPosition = useMemo(
    () => ({
      top: Math.max(0, Math.min(position.y - 88, 320)),
      left: Math.max(0, Math.min(position.x - 88, 320)),
    }),
    [position]
  );

  const paneWidth = containerSize.width || DEFAULT_PANE_SIZE;
  const paneHeight = containerSize.height || DEFAULT_PANE_SIZE;

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[320px] sm:h-[450px] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
        <p className="text-xs sm:text-sm text-neutral-500">No images available</p>
      </div>
    );
  }

  const activeImage = images[currentIndex]?.image || "/placeholder.svg?height=450&width=450";

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div
        ref={imageContainerRef}
        className={cn(
          "relative max-h-[500px] max-w-[500px] h-full w-full aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm",
          isHovering && inStock && "xl:cursor-none"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {images?.length > 0 && (
            <div className="relative h-full w-full">
              <Image
                src={activeImage}
                alt={`Product image ${currentIndex + 1}`}
                fill
                loading="eager"
                priority={currentIndex === 0}
                quality={95}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                onLoad={() => setIsMainImageLoading(false)}
                className={cn(
                  "object-cover object-center rounded-2xl transition-opacity duration-200",
                  isMainImageLoading ? "opacity-0" : "opacity-100"
                )}
              />
            </div>
          )}
        </div>

        {/* Loading spinner — shown while the active slide's bytes are still
            arriving (skipped almost instantly for cached/preloaded slides) */}
        {isMainImageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        )}

        {/* Hover indicator — replaces the hidden native cursor */}
        {images?.length > 0 && isHovering && inStock && (
          <div
            className="hidden xl:flex absolute h-44 w-44 rounded-2xl pointer-events-none items-center justify-center shadow-lg border border-white/20"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(2px)",
              top: indicatorPosition.top,
              left: indicatorPosition.left,
            }}
          >
            <FaSearchengin className="h-7 w-7 text-white opacity-90 drop-shadow" />
          </div>
        )}

        {/* Stock Out Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center">
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white mb-2" />
            <span className="text-white font-black text-xl sm:text-2xl tracking-wider">
              OUT OF STOCK
            </span>
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

      {/* Zoom view — mounted (and starts fetching) as soon as we're hovering,
          not only once showZoom flips true, so the browser gets a head start
          on the download during the 100ms delay. Stays invisible via opacity
          until showZoom is true so nothing looks different to the user.
          Sized to match the main image container's measured dimensions,
          vertically centered against it, and translated so the hovered point
          stays centered in the pane. */}
      {images?.length > 0 && isHovering && inStock && (
        <div
          className={cn(
            "hidden xl:block aspect-square overflow-hidden absolute top-0 rounded-2xl z-30 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-2xl transition-opacity duration-150",
            showZoom ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          style={{
            width: paneWidth,
            height: paneHeight,
            right: `-${paneWidth + ZOOM_PANE_GAP}px`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src={activeImage}
              alt={`Zoomed product image ${currentIndex + 1}`}
              fill
              quality={90}
              sizes={`${Math.round(paneWidth * ZOOM_SCALE)}px`}
              style={zoomStyle}
              onLoad={() => setIsZoomImageLoading(false)}
              className={cn(
                "object-cover rounded-2xl transition-opacity duration-150",
                isZoomImageLoading ? "opacity-0" : "opacity-100"
              )}
            />

            {/* Loading spinner for the zoom pane — only relevant while
                showZoom is actually visible; the image itself starts
                fetching earlier (on hover-enter) so this is usually brief */}
            {showZoom && isZoomImageLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            )}
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