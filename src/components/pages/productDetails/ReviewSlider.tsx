"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Review {
  rating: number
  comment: string
}

interface ReviewSliderProps {
  reviews: Review[]
}

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? reviews.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || reviews.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, reviews.length])

  if (reviews.length === 0) {
    return <p className="text-center py-8 text-gray-500">No reviews yet.</p>
  }

  return (
    <div className="relative overflow-hidden py-6">
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="flex">
          {reviews.map((review, index) => (
            <div key={index} className="min-w-full px-4" style={{ flex: "0 0 100%" }}>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-gray-500" />
                    </div>
                  <div>
                    <p className="font-medium">Customer</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 1 && (
        <>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 shadow-md"
            onClick={goToPrevious}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous review</span>
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 shadow-md"
            onClick={goToNext}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next review</span>
          </button>

          <div className="flex justify-center mt-4 space-x-1.5">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex ? "bg-black w-4" : "bg-gray-300",
                )}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

