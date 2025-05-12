"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Star, StarOff } from "lucide-react";
import { addDoctorReview } from "@/services/user/auth/authService";

type DoctorReviewFormProps = {
  doctorId: string;
  onSuccess?: (data: ReviewFormData) => void;
  onError?:(error:unknown) =>void
};

export type ReviewFormData = {
  doctorId: string;
  rating: number;
  reviewText: string;
};

export const DoctorReviewForm = ({ doctorId, onSuccess, onError }: DoctorReviewFormProps) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReviewFormData>({
    defaultValues: {
      doctorId,
      rating: 0,
      reviewText: "",
    },
  });

  const reviewText = watch("reviewText");

  const handleFormSubmit = async (data: ReviewFormData) => {
    const submissionData = {
      ...data,
      rating: selectedRating,
      doctorId,
    };

    setIsSubmitting(true);

    try {
      await addDoctorReview(submissionData);

      reset({ doctorId, rating: 0, reviewText: "" });
      setSelectedRating(0);
      if (onSuccess) onSuccess(submissionData);
    } catch (error) {
      console.error("Submission error:", error);

      if (onError) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Leave a Review
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Your Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || selectedRating);
            return (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
              >
                {isFilled ? (
                  <Star className={`w-8 h-8 text-medical-green fill-current`} />
                ) : (
                  <StarOff className="w-8 h-8 text-gray-300" />
                )}
              </button>
            );
          })}
        </div>
        {selectedRating === 0 && (
          <p className="mt-1 text-sm text-red-500">Please select a rating</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="reviewText" className="block text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="reviewText"
          {...register("reviewText", {
            required: "Review is required",
            minLength: {
              value: 10,
              message: "Review must be at least 10 characters",
            },
            maxLength: {
              value: 500,
              message: "Review must be less than 500 characters",
            },
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.reviewText
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-medical-green-light"
          } transition-colors`}
          rows={5}
          placeholder="Share your experience with this doctor..."
        />
        <div className="flex justify-between mt-1">
          {errors.reviewText ? (
            <p className="text-sm text-red-500">{errors.reviewText.message}</p>
          ) : (
            <p className="text-sm text-gray-500">
              {reviewText?.length || 0}/500 characters
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={selectedRating === 0 || !!errors.reviewText}
        className={`w-full py-2 px-4 rounded-lg font-medium ${
          selectedRating === 0 || !!errors.reviewText
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-medical-green hover:bg-medical-green-light text-white transform hover:scale-105 transition-transform"
        }`}
      >
       {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
};

export default DoctorReviewForm;
