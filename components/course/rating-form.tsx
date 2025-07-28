'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

interface RatingFormProps {
  courseId: string;
  initialRating?: number;
  initialReview?: string;
  onRatingSubmitted?: (rating: number, averageRating: number) => void;
}

export function RatingForm({
  courseId,
  initialRating = 0,
  initialReview = '',
  onRatingSubmitted,
}: RatingFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      showApiErrorToast({
        code: 'VALIDATION_ERROR',
        error: 'Please select a rating',
        courseId,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rating');
      }

      const result = await response.json();
      
      toast.success(result.message);
      
      if (onRatingSubmitted) {
        onRatingSubmitted(rating, result.averageRating);
      }
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      if (error.code) {
        showApiErrorToast({
          code: error.code,
          error: error.message,
          details: error.details,
          courseId,
        });
      } else {
        showApiErrorToast({
          code: 'INTERNAL_ERROR',
          error: error.message || 'Failed to submit rating',
          courseId,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#2C3E50] mb-2">Rate this course</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-[#2C3E50]/60">
            {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-[#2C3E50] mb-2">Write a review (optional)</h3>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with this course..."
          className="border-[#E5E8E8] focus:border-[#4ECDC4]"
          rows={4}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          'Submit Rating'
        )}
      </Button>
    </div>
  );
} 