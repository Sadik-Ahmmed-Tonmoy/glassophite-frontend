"use client";

import type React from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  MessageSquare,
  PenLine,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Import additional shadcn components
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import BottomGradient from "@/components/ui/BottomGradient";
import Button from "@/components/ui/buttons/Button/Button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Import shadcn Dialog components
// import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"

// Add this right after all the imports
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}
`;

interface Review {
  id?: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  date?: string;
  helpful?: number;
  unhelpful?: number;
  verified?: boolean;
  images?: string[];
}

interface ProductReviewProps {
  productId: string;
  initialReviews: Review[];
}

export default function ProductReview({ productId, initialReviews }: ProductReviewProps) {
  console.log(productId);
  // Add this constant at the top of the component function, after the interface definitions
  const MAX_IMAGES = 6;

  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState<Review>({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  // Add these state variables after the other state declarations
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Add this to the component state variables
  const [isDragging, setIsDragging] = useState(false);

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate average rating
  const avgRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  // Get rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return (b.helpful || 0) - (a.helpful || 0);
      case "newest":
      default:
        return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
    }
  });

  // Display limited reviews or all reviews
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));

    // Clear rating error
    if (formErrors.rating) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.rating;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (formData.rating === 0) {
      errors.rating = "Please select a rating";
    }

    if (!formData.comment.trim()) {
      errors.comment = "Review comment is required";
    } else if (formData.comment.length < 10) {
      errors.comment = "Review must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString(),
        helpful: 0,
        unhelpful: 0,
        verified: true,
        images: uploadedImages.length > 0 ? [...uploadedImages] : undefined,
      };

      setReviews((prev) => [newReview, ...prev]);
      setFormData({
        name: "",
        email: "",
        rating: 0,
        comment: "",
      });
      setUploadedImages([]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setShowReviewForm(false);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleHelpfulClick = (reviewId: string | undefined, isHelpful: boolean) => {
    if (!reviewId) return;

    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          if (isHelpful) {
            return { ...review, helpful: (review.helpful || 0) + 1 };
          } else {
            return { ...review, unhelpful: (review.unhelpful || 0) + 1 };
          }
        }
        return review;
      })
    );
  };

  // Add these drag and drop handler functions after the other handler functions
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > MAX_IMAGES) {
      setWarningMessage(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      setShowWarning(true);

      // Auto-hide warning after 3 seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 10000);

      // Still process files up to the limit
      const remainingSlots = MAX_IMAGES - uploadedImages.length;
      if (remainingSlots <= 0) return;

      // Only process files up to the remaining slots
      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          if (!file.type.startsWith("image/")) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setUploadedImages((prev) => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
    } else {
      // Process all files if under the limit
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Replace the handleImageUpload function with this enhanced version
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > MAX_IMAGES) {
      setWarningMessage(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      setShowWarning(true);

      // Auto-hide warning after 3 seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 10000);

      // Still process files up to the limit
      const remainingSlots = MAX_IMAGES - uploadedImages.length;
      if (remainingSlots <= 0) {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Only process files up to the remaining slots
      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          if (!file.type.startsWith("image/")) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setUploadedImages((prev) => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
    } else {
      // Process all files if under the limit
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? uploadedImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === uploadedImages.length - 1 ? 0 : prev + 1));
  };

  // Handle review image click
  const handleReviewImageClick = (review: Review, imageIndex: number) => {
    if (!review.images) return;
    setUploadedImages(review.images);
    setCurrentImageIndex(imageIndex);
    setShowImageModal(true);
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showImageModal) return;

      if (e.key === "ArrowLeft") {
        goToPrevImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showImageModal]);

  return (
    <div>
      <style jsx>{`
        ${animationStyles}
      `}</style>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-gray-700" />
            Customer Reviews
          </h2>

          {/* Replace the sort dropdown with shadcn DropdownMenu */}
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="border rounded-md px-3 py-1.5 text-sm  flex items-center gap-2">
                {sortOption === "newest"
                  ? "Newest"
                  : sortOption === "highest"
                  ? "Highest Rating"
                  : sortOption === "lowest"
                  ? "Lowest Rating"
                  : "Most Helpful"}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("highest")}>Highest Rating</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("lowest")}>Lowest Rating</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("helpful")}>Most Helpful</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Thank you! Your review has been submitted successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Rating Summary - Enhanced Left Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col items-center p-6 border rounded-lg bg-gradient-to-b  shadow-sm">
              <div className="text-6xl font-bold text-gray-700 dark:text-gray-200 ">{avgRating.toFixed(1)}</div>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-6 w-6 ${star <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</div>

              <div className="w-full space-y-3 mt-8">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center space-x-2">
                    <div className="flex items-center w-16">
                      <span className="text-sm font-medium">{item.rating}</span>
                      <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.rating >= 4 ? "bg-green-400" : item.rating === 3 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-xs text-gray-500 font-medium">{item.count}</div>
                  </div>
                ))}
              </div>

              {/* Enhanced Write a Review Button */}

              <Button
                onClick={() => {
                  setShowReviewForm((prev) => !prev);
                  setUploadedImages([]);
                }}
                className="mt-8 bg-gradient-to-br relative group/btn from-[#3a745e]  to-[#187c57] block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              >
                <div className="flex items-center justify-center gap-2">
                  <PenLine className="mr-2 h-5 w-5" />
                  Write a Review
                </div>
                <BottomGradient />
              </Button>
              {/* Additional information */}
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-200 border-t border-gray-200 pt-4 w-full">
                <p>Your feedback helps other shoppers make better decisions!</p>
              </div>
            </div>

            {/* Review Guidelines */}
            <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-transparent border-blue-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-medium text-green-primary mb-2">Review Guidelines</h3>
              <ul className="text-sm text-green-secondary space-y-1 list-disc pl-5">
                <li>Be specific about your experience</li>
                <li>Focus on the product&apos;s features and quality</li>
                <li>Photos help other customers understand the product better</li>
                <li>Keep it respectful and honest</li>
              </ul>
            </div>
          </div>

          {/* Reviews List and Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Review Form */}
            {/* {showReviewForm && (
              <div className="border rounded-lg p-6  shadow-md ">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <PenLine className="mr-2 h-5 w-5 text-blue-600" />
                    Write a Review
                  </h3>
                  <button onClick={() => setShowReviewForm(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Your Rating*</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => handleRatingClick(star)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${star <= (hoveredRating || formData.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                    {formErrors.rating && <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-sm font-medium">
                        Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${
                          formErrors.email ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="comment" className="block text-sm font-medium">
                      Review*
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      value={formData.comment}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        formErrors.comment ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      placeholder="Share your experience with this product..."
                    ></textarea>
                    {formErrors.comment && <p className="text-red-500 text-xs mt-1">{formErrors.comment}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Add Photos (Optional)</label>
                    <div className="flex flex-col space-y-3">
                      <div
                        className={cn(
                          `border-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"} rounded-md p-4 transition-colors`,
                          uploadedImages.length == 0 ? "block" : "hidden"
                        )}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">Drag and drop images here or</p>
                          <div className="mt-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              <span className="text-sm">Browse Files</span>
                            </label>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            {uploadedImages.length > 0
                              ? `${uploadedImages.length}/${MAX_IMAGES} images selected`
                              : `Upload up to ${MAX_IMAGES} images`}
                          </p>
                        </div>
                      </div>

                  
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group transform transition-all duration-200 hover:scale-105">
                              <div
                                className="h-full w-full rounded-md overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                                onClick={() => openImageModal(index)}
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-contain transition-opacity duration-300"
                                />
                             
                                <div className="absolute inset-0 bg-black/40 opacity-55 md:opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                  <Eye className="h-6 w-6 text-white" />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-100 group-hover:opacity-100 transition-opacity duration-200 transform hover:scale-110 z-10"
                                aria-label="Remove image"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {uploadedImages.length < MAX_IMAGES && (
                            <div
                              className="h-24 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <div className="flex flex-col items-center text-gray-500">
                                <Upload className="h-6 w-6 mb-1" />
                                <span className="text-xs">{MAX_IMAGES - uploadedImages.length} more</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {showWarning && (
                        <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-md animate-fadeIn">
                          <p className="text-sm flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            {warningMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            )} */}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {displayedReviews.map((review, index) => (
                  <div key={review.id || index} className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-semibold">{review.name}</span>
                            {review.verified && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified Purchase</span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">{review.date ? new Date(review.date).toLocaleDateString() : ""}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 ">{review.comment}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative h-16 w-16 rounded-md border border-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                            onClick={() => handleReviewImageClick(review, idx)}
                          >
                            <img src={image || "/placeholder.svg"} alt={`Review image ${idx + 1}`} className="h-full w-full object-cover" />
                            {/* Add eye icon overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-200">
                      <span>Was this review helpful?</span>
                      <button className="ml-3 flex items-center hover:text-gray-700 group" onClick={() => handleHelpfulClick(review.id, true)}>
                        <ThumbsUp className="h-4 w-4 mr-1 group-hover:text-blue-500" />
                        <span className="dark:text-gray-200">{review.helpful || 0}</span>
                      </button>
                      <button className="ml-3 flex items-center hover:text-gray-700 group" onClick={() => handleHelpfulClick(review.id, false)}>
                        <ThumbsDown className="h-4 w-4 mr-1 group-hover:text-red-500" />
                        <span className="dark:text-gray-200">{review.unhelpful || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {reviews.length > 3 && (
                  <button
                    className="w-full py-3 border border-gray-300 rounded-md  transition-colors flex items-center justify-center font-medium shadow-sm hover:shadow"
                    onClick={() => setShowAllReviews((prev) => !prev)}
                  >
                    {showAllReviews ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>See All Reviews ({reviews.length})</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg  shadow-sm">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>

                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="mt-8 w-fit px-16 sm:px-20 mx-auto bg-gradient-to-br relative group/btn from-[#3a745e]  to-[#187c57] block dark:bg-zinc-800  text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <PenLine className="mr-2 h-5 w-5 hidden sm:block" />
                    Write a Review
                  </div>
                  <BottomGradient />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Replace the Image Modal with this updated version that includes DialogTitle */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 bg-black border-none overflow-hidden">
            <DialogHeader className="absolute top-2 right-2 z-10">
              <DialogTitle className="sr-only">Image Preview</DialogTitle>
              <DialogClose className="text-white hover:text-gray-300 transition-colors rounded-full bg-black/50 p-1">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>

            {/* Image container */}
            <div className="relative bg-black rounded-lg overflow-hidden h-[70vh] flex items-center justify-center">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img src={image || "/placeholder.svg"} alt={`Image ${index + 1}`} className="max-h-full max-w-full object-contain" />
                </div>
              ))}

              {/* Navigation buttons */}
              {uploadedImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 transform hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 transform hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-5 py-1 animate-fadeIn">
                {currentImageIndex + 1} / {uploadedImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <DialogFooter className="flex justify-center p-4 bg-black/80 backdrop-blur-sm rounded-b-lg ">
              {uploadedImages.length > 1 && (
                <div className="flex justify-center space-x-2 overflow-hidden pb-2 pe-3 animate-slideUp">
                  {uploadedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-16 w-16 m-2 rounded-md overflow-hidden border-2 transition-all duration-200 transform ${
                        index === currentImageIndex ? "border-blue-500 scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Reviews List and Form */}
        <Drawer open={showReviewForm} onOpenChange={setShowReviewForm}>
          {/* <DrawerTrigger>Open</DrawerTrigger> */}

          <DrawerContent className="">
            <DrawerTitle className="sr-only">Review Product</DrawerTitle>

            <div className="p-4 w-full max-w-5xl mx-auto  overflow-hidden overflow-y-auto  h-screen xl:h-auto max-h-screen">
              <div className="flex items-center justify-between  mb-4 md:mb-8">
                <h3 className="text-xl font-semibold flex items-center">
                  <PenLine className="mr-2 h-5 w-5 text-green-primary" />
                  Write a Review
                </h3>
                <button onClick={() => setShowReviewForm(false)} className="text-gray-500 dark:text-gray-100 hover:text-gray-700 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Your Rating*</label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleRatingClick(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${star <= (hoveredRating || formData.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  {formErrors.rating && <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="comment" className="block text-sm font-medium">
                    Review*
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    value={formData.comment}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.comment ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    placeholder="Share your experience with this product..."
                  ></textarea>
                  {formErrors.comment && <p className="text-red-500 text-xs mt-1">{formErrors.comment}</p>}
                </div>

                {/* Replace the image upload section with this enhanced version that includes drag and drop */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Add Photos (Optional)</label>
                  <div className="flex flex-col space-y-3">
                    <div
                      className={cn(
                        `border-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"} rounded-md p-4 transition-colors`,
                        uploadedImages.length == 0 ? "block" : "hidden"
                      )}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Drag and drop images here or</p>
                        <div className="mt-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary/90 transition-colors cursor-pointer"
                          >
                            <span className="text-sm">Browse Files</span>
                          </label>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          {uploadedImages.length > 0 ? `${uploadedImages.length}/${MAX_IMAGES} images selected` : `Upload up to ${MAX_IMAGES} images`}
                        </p>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group transform transition-all duration-200 hover:scale-105">
                            <div
                              className="h-full w-full rounded-md overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                              onClick={() => openImageModal(index)}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full object-contain transition-opacity duration-300"
                              />
                              {/* Add eye icon overlay on hover */}
                              <div className="absolute inset-0 bg-black/40 opacity-55 md:opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                <Eye className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-100 group-hover:opacity-100 transition-opacity duration-200 transform hover:scale-110 z-10"
                              aria-label="Remove image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {uploadedImages.length < MAX_IMAGES && (
                          <div
                            className="h-24 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="flex flex-col items-center text-gray-500">
                              <Upload className="h-6 w-6 mb-1" />
                              <span className="text-xs">{MAX_IMAGES - uploadedImages.length} more</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {showWarning && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-md animate-fadeIn">
                        <p className="text-sm flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {warningMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>

            {/* <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button >Cancel</Button>
      </DrawerClose>
    </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
