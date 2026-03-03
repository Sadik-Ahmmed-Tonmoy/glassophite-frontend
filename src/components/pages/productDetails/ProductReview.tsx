"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
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
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

// Import additional shadcn components
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import BottomGradient from "@/components/ui/BottomGradient";
import Button from "@/components/ui/buttons/Button/Button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TReview } from "@/types/types";

interface ProductReviewProps {
  productId: string;
  initialReviews: TReview[];
}

export default function ProductReview({
  productId,
  initialReviews,
}: ProductReviewProps) {
  console.log(  productId,);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const MAX_IMAGES = 6;

  const [reviews, setReviews] = useState<TReview[]>(initialReviews || []);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState<TReview>({
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

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme styles
  const themeStyles = {
    dark: {
      bg: "bg-black",
      bgMuted: "bg-neutral-900",
      card: "bg-white/5 border-white/10",
      cardHover: "hover:bg-white/10",
      text: "text-white",
      textMuted: "text-neutral-300",
      textMutedLighter: "text-neutral-400",
      border: "border-white/10",
      borderHover: "hover:border-white/20",
      button: "bg-white/10 hover:bg-white/20 text-white",
      buttonPrimary: "bg-gradient-to-br from-[#3a745e] to-[#187c57] text-white",
      buttonSecondary: "border-white/20 text-white hover:bg-white/10",
      input:
        "bg-white/5 border-white/10 text-white placeholder:text-neutral-500",
      label: "text-neutral-300",
      starFilled: "text-yellow-400 fill-yellow-400",
      starEmpty: "text-neutral-600",
      success: "bg-green-500/20 border-green-500/30 text-green-500",
      warning: "bg-amber-500/20 border-amber-500/30 text-amber-500",
      dropdown: "bg-neutral-900 border-white/10 text-white",
      dropdownItem: "hover:bg-white/10 text-white",
      ratingBar: (rating: number) => {
        if (rating >= 4) return "bg-green-500";
        if (rating === 3) return "bg-yellow-500";
        return "bg-red-500";
      },
      icon: "text-neutral-400",
    },
    light: {
      bg: "bg-white",
      bgMuted: "bg-neutral-100",
      card: "bg-white border-neutral-200",
      cardHover: "hover:bg-neutral-50",
      text: "text-neutral-900",
      textMuted: "text-neutral-600",
      textMutedLighter: "text-neutral-500",
      border: "border-neutral-200",
      borderHover: "hover:border-neutral-300",
      button:
        "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
      buttonPrimary: "bg-gradient-to-br from-[#3a745e] to-[#187c57] text-white",
      buttonSecondary:
        "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
      input:
        "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400",
      label: "text-neutral-700",
      starFilled: "text-yellow-500 fill-yellow-500",
      starEmpty: "text-neutral-300",
      success: "bg-green-50 border-green-200 text-green-700",
      warning: "bg-amber-50 border-amber-200 text-amber-700",
      dropdown: "bg-white border-neutral-200 text-neutral-900",
      dropdownItem: "hover:bg-neutral-100 text-neutral-900",
      ratingBar: (rating: number) => {
        if (rating >= 4) return "bg-green-500";
        if (rating === 3) return "bg-yellow-500";
        return "bg-red-500";
      },
      icon: "text-neutral-500",
    },
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

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
        return (
          new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
        );
    }
  });

  // Display limited reviews or all reviews
  const displayedReviews = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 3);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: TReview) => ({ ...prev, [name]: value }));

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
    setFormData((prev: TReview) => ({ ...prev, rating }));

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
      const newReview: TReview = {
        ...formData,
        id: Date.now().toString(),
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

  const handleHelpfulClick = (
    reviewId: string | undefined,
    isHelpful: boolean,
  ) => {
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
      }),
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
      setWarningMessage(
        `You can only upload a maximum of ${MAX_IMAGES} images.`,
      );
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
              setUploadedImages((prev) => [
                ...prev,
                event.target!.result as string,
              ]);
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
            setUploadedImages((prev) => [
              ...prev,
              event.target!.result as string,
            ]);
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
      setWarningMessage(
        `You can only upload a maximum of ${MAX_IMAGES} images.`,
      );
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
              setUploadedImages((prev) => [
                ...prev,
                event.target!.result as string,
              ]);
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
            setUploadedImages((prev) => [
              ...prev,
              event.target!.result as string,
            ]);
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
    setCurrentImageIndex((prev) =>
      prev === 0 ? uploadedImages.length - 1 : prev - 1,
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === uploadedImages.length - 1 ? 0 : prev + 1,
    );
  };

  // Handle review image click
  const handleReviewImageClick = (review: TReview, imageIndex: number) => {
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

  // Framer Motion variants
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const scaleIn = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  };

  const slideUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  return (
    <div>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className={`text-2xl font-bold flex items-center ${styles.text}`}>
            <MessageSquare className={`mr-2 h-6 w-6 ${styles.icon}`} />
            <span data-translate="reviews.title">Customer Reviews</span>
          </h2>

          {/* Sort dropdown */}
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span
              className={`text-sm ${styles.textMuted}`}
              data-translate="reviews.sortBy"
            >
              Sort by:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`border rounded-md px-3 py-1.5 text-sm flex items-center gap-2 ${styles.border} ${styles.text}`}
              >
                {sortOption === "newest"
                  ? "Newest"
                  : sortOption === "highest"
                    ? "Highest Rating"
                    : sortOption === "lowest"
                      ? "Lowest Rating"
                      : "Most Helpful"}
                <ChevronDown className={`h-4 w-4 ${styles.icon}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={styles.dropdown}>
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={() => setSortOption("newest")}
                  data-translate="reviews.sortNewest"
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={() => setSortOption("highest")}
                  data-translate="reviews.sortHighest"
                >
                  Highest Rating
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={() => setSortOption("lowest")}
                  data-translate="reviews.sortLowest"
                >
                  Lowest Rating
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={styles.dropdownItem}
                  onClick={() => setSortOption("helpful")}
                  data-translate="reviews.sortHelpful"
                >
                  Most Helpful
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`${styles.success} px-4 py-3 rounded-md`}
              data-translate="reviews.submitSuccess"
            >
              Thank you! Your review has been submitted successfully.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              className={`flex flex-col items-center p-6 border rounded-lg bg-gradient-to-b ${styles.card} shadow-sm`}
            >
              <div className={`text-6xl font-bold ${styles.text}`}>
                {avgRating.toFixed(1)}
              </div>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${star <= Math.round(avgRating) ? styles.starFilled : styles.starEmpty}`}
                  />
                ))}
              </div>
              <div
                className={`text-sm ${styles.textMutedLighter} mt-1`}
                data-translate="reviews.basedOn"
              >
                Based on {reviews.length} reviews
              </div>

              <div className="w-full space-y-3 mt-8">
                {ratingDistribution.map((item) => (
                  <div
                    key={item.rating}
                    className="flex items-center space-x-2"
                  >
                    <div className="flex items-center w-16">
                      <span className={`text-sm font-medium ${styles.text}`}>
                        {item.rating}
                      </span>
                      <Star className={`h-4 w-4 ml-1 ${styles.starFilled}`} />
                    </div>
                    <div
                      className={`flex-1 h-3 ${isDark ? "bg-white/10" : "bg-gray-200"} rounded-full overflow-hidden`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${styles.ratingBar(item.rating)}`}
                      />
                    </div>
                    <div
                      className={`w-10 text-xs ${styles.textMutedLighter} font-medium`}
                    >
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>

              {/* Write a Review Button */}
              <Button
                onClick={() => {
                  setShowReviewForm((prev) => !prev);
                  setUploadedImages([]);
                }}
                className={`mt-8 w-full ${styles.buttonPrimary} rounded-md h-10 font-medium`}
              >
                <div className="flex items-center justify-center gap-2">
                  <PenLine className="mr-2 h-5 w-5" />
                  <span data-translate="reviews.writeReview">
                    Write a Review
                  </span>
                </div>
                <BottomGradient />
              </Button>

              {/* Additional information */}
              <div
                className={`mt-6 text-center text-sm ${styles.textMutedLighter} border-t ${styles.border} pt-4 w-full`}
              >
                <p data-translate="reviews.helpMessage">
                  Your feedback helps other shoppers make better decisions!
                </p>
              </div>
            </motion.div>

            {/* Review Guidelines */}
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className={`border rounded-lg p-4 ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50/50 border-blue-100"} shadow-sm`}
            >
              <h3
                className={`font-medium text-green-primary mb-2`}
                data-translate="reviews.guidelines"
              >
                Review Guidelines
              </h3>
              <ul
                className={`text-sm text-green-secondary space-y-1 list-disc pl-5`}
              >
                <li data-translate="reviews.guideline1">
                  Be specific about your experience
                </li>
                <li data-translate="reviews.guideline2">
                  Focus on the product&apos;s features and quality
                </li>
                <li data-translate="reviews.guideline3">
                  Photos help other customers understand the product better
                </li>
                <li data-translate="reviews.guideline4">
                  Keep it respectful and honest
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Reviews List and Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Reviews List */}
            {reviews.length > 0 ? (
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                {displayedReviews.map((review, index) => (
                  <motion.div
                    key={review.id || index}
                    variants={slideUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-5 ${styles.card} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className={`font-semibold ${styles.text}`}>
                              {review.name}
                            </span>
                            {review.verified && (
                              <span
                                className={`ml-2 text-xs ${isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"} px-2 py-0.5 rounded-full`}
                                data-translate="reviews.verified"
                              >
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? styles.starFilled : styles.starEmpty}`}
                              />
                            ))}
                            <span
                              className={`text-xs ${styles.textMutedLighter} ml-2`}
                            >
                              {review.date
                                ? new Date(review.date).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className={`mt-3 ${styles.textMuted}`}>
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.images.map((image: string, idx: number) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            className={`relative h-16 w-16 rounded-md border ${styles.border} overflow-hidden cursor-pointer group`}
                            onClick={() => handleReviewImageClick(review, idx)}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Review image ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`mt-4 flex items-center text-sm ${styles.textMutedLighter}`}
                    >
                      <span data-translate="reviews.helpfulQuestion">
                        Was this review helpful?
                      </span>
                      <button
                        className="ml-3 flex items-center hover:text-blue-500 group"
                        onClick={() => handleHelpfulClick(review.id, true)}
                      >
                        <ThumbsUp
                          className={`h-4 w-4 mr-1 group-hover:text-blue-500 ${styles.icon}`}
                        />
                        <span>{review.helpful || 0}</span>
                      </button>
                      <button
                        className="ml-3 flex items-center hover:text-red-500 group"
                        onClick={() => handleHelpfulClick(review.id, false)}
                      >
                        <ThumbsDown
                          className={`h-4 w-4 mr-1 group-hover:text-red-500 ${styles.icon}`}
                        />
                        <span>{review.unhelpful || 0}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}

                {reviews.length > 3 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 border ${styles.border} rounded-md ${styles.textMuted} transition-colors flex items-center justify-center font-medium shadow-sm hover:shadow`}
                    onClick={() => setShowAllReviews((prev) => !prev)}
                  >
                    {showAllReviews ? (
                      <>
                        <span data-translate="reviews.showLess">Show Less</span>
                        <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span data-translate="reviews.seeAll">
                          See All Reviews ({reviews.length})
                        </span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className={`text-center py-12 border rounded-lg ${styles.card} shadow-sm`}
              >
                <MessageSquare
                  className={`h-12 w-12 mx-auto ${styles.icon} mb-3`}
                />
                <p
                  className={`${styles.textMutedLighter} mb-4`}
                  data-translate="reviews.noReviews"
                >
                  No reviews yet. Be the first to review this product!
                </p>

                <Button
                  onClick={() => setShowReviewForm(true)}
                  className={`mt-8 w-fit px-16 sm:px-20 mx-auto ${styles.buttonPrimary} rounded-md h-10 font-medium`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PenLine className="mr-2 h-5 w-5 hidden sm:block" />
                    <span data-translate="reviews.writeReview">
                      Write a Review
                    </span>
                  </div>
                  <BottomGradient />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 bg-black border-none overflow-hidden">
            <DialogHeader className="absolute top-2 right-2 z-10">
              <DialogTitle className="sr-only">Image Preview</DialogTitle>
              <DialogClose className="text-white hover:text-gray-300 transition-colors rounded-full bg-black/50 p-1">
                <X className="h-6 w-6" />
                <span className="sr-only" data-translate="common.close">
                  Close
                </span>
              </DialogClose>
            </DialogHeader>

            {/* Image container */}
            <div className="relative bg-black rounded-lg overflow-hidden h-[70vh] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {uploadedImages.map(
                  (image, index) =>
                    index === currentImageIndex && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </motion.div>
                    ),
                )}
              </AnimatePresence>

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
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-5 py-1">
                {currentImageIndex + 1} / {uploadedImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            {uploadedImages.length > 1 && (
              <DialogFooter className="flex justify-center p-4 bg-black/80 backdrop-blur-sm rounded-b-lg">
                <div className="flex justify-center space-x-2 overflow-x-auto pb-2 pe-3">
                  {uploadedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-16 w-16 rounded-md overflow-hidden border-2 transition-all duration-200 transform ${
                        index === currentImageIndex
                          ? "border-blue-500 scale-110 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Form Drawer */}
        <Drawer open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DrawerContent
            className={
              isDark
                ? "bg-black border-white/10"
                : "bg-white border-neutral-200"
            }
          >
            <DrawerTitle className="sr-only">Review Product</DrawerTitle>

            <div
              className={`p-4 w-full max-w-5xl mx-auto overflow-hidden overflow-y-auto h-screen xl:h-auto max-h-screen ${styles.text}`}
            >
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h3
                  className={`text-xl font-semibold flex items-center ${styles.text}`}
                >
                  <PenLine className="mr-2 h-5 w-5 text-green-primary" />
                  <span data-translate="reviews.writeReviewTitle">
                    Write a Review
                  </span>
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className={`${styles.textMuted} hover:${styles.text} transition-colors`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div className="space-y-1">
                  <label
                    className={`block text-sm font-medium ${styles.label}`}
                    data-translate="reviews.ratingLabel"
                  >
                    Your Rating*
                  </label>
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
                          className={`h-8 w-8 ${star <= (hoveredRating || formData.rating) ? styles.starFilled : styles.starEmpty}`}
                        />
                      </button>
                    ))}
                  </div>
                  {formErrors.rating && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.rating}
                    </p>
                  )}
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${styles.label}`}
                      data-translate="reviews.nameLabel"
                    >
                      Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${styles.input} ${
                        formErrors.name ? "border-red-500" : styles.border
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${styles.label}`}
                      data-translate="reviews.emailLabel"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${styles.input} ${
                        formErrors.email ? "border-red-500" : styles.border
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1">
                  <label
                    htmlFor="comment"
                    className={`block text-sm font-medium ${styles.label}`}
                    data-translate="reviews.commentLabel"
                  >
                    Review*
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    value={formData.comment}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${styles.input} ${
                      formErrors.comment ? "border-red-500" : styles.border
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    placeholder={
                      isDark
                        ? "Share your experience..."
                        : "Share your experience..."
                    }
                  ></textarea>
                  {formErrors.comment && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.comment}
                    </p>
                  )}
                </div>

                {/* Image upload */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${styles.label}`}
                    data-translate="reviews.photosLabel"
                  >
                    Add Photos (Optional)
                  </label>
                  <div className="flex flex-col space-y-3">
                    <div
                      className={cn(
                        `border-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-dashed"} rounded-md p-4 transition-colors`,
                        uploadedImages.length === 0 ? "block" : "hidden",
                        styles.border,
                      )}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className={`h-10 w-10 ${styles.icon} mb-2`} />
                        <p
                          className={`text-sm font-medium ${styles.textMuted}`}
                          data-translate="reviews.dragDrop"
                        >
                          Drag and drop images here or
                        </p>
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
                            <span
                              className="text-sm"
                              data-translate="reviews.browseFiles"
                            >
                              Browse Files
                            </span>
                          </label>
                        </div>
                        <p
                          className={`mt-2 text-xs ${styles.textMutedLighter}`}
                        >
                          {uploadedImages.length > 0
                            ? `${uploadedImages.length}/${MAX_IMAGES} images selected`
                            : `Upload up to ${MAX_IMAGES} images`}
                        </p>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {uploadedImages.length > 0 && (
                      <motion.div
                        initial="initial"
                        animate="animate"
                        variants={{
                          initial: { opacity: 0 },
                          animate: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2"
                      >
                        {uploadedImages.map((image, index) => (
                          <motion.div
                            key={index}
                            variants={scaleIn}
                            className="relative group transform transition-all duration-200 hover:scale-105"
                          >
                            <div
                              className="h-full w-full rounded-md overflow-hidden border cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                              style={{
                                borderColor: isDark
                                  ? "rgba(255,255,255,0.1)"
                                  : "#e5e7eb",
                              }}
                              onClick={() => openImageModal(index)}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full object-contain transition-opacity duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
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
                          </motion.div>
                        ))}
                        {uploadedImages.length < MAX_IMAGES && (
                          <div
                            className={`h-24 w-full border-2 border-dashed ${styles.border} rounded-md flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-colors duration-300`}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="flex flex-col items-center text-gray-500">
                              <Upload className="h-6 w-6 mb-1" />
                              <span className="text-xs">
                                {MAX_IMAGES - uploadedImages.length} more
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {showWarning && (
                        <motion.div
                          variants={fadeIn}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className={`mt-2 ${styles.warning} px-3 py-2 rounded-md`}
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Form actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className={`px-4 py-2 border ${styles.border} rounded-md ${styles.textMuted} hover:${styles.borderHover} transition-colors`}
                    data-translate="reviews.cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary transition-colors disabled:opacity-50 shadow-sm"
                    data-translate={
                      isSubmitting ? "reviews.submitting" : "reviews.submit"
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
