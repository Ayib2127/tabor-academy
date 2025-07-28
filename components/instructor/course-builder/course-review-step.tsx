"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CourseCreationData } from '@/lib/validations/course';
import CourseSummary from './CourseSummary';
import ReviewStepHeader from './ReviewStepHeader';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

interface CourseReviewStepProps {
  courseData: CourseCreationData;
}

export default function CourseReviewStep({ courseData }: CourseReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/instructor/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      const result = await response.json();
      toast.success('Course submitted for review successfully!');
      router.push(`/dashboard/instructor/courses/${result.courseId}`);
    } catch (error: any) {
      console.error('Error submitting course:', error);
      showApiErrorToast({
        code: error.code || 'INTERNAL_ERROR',
        error: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ReviewStepHeader
        title="Review Your Course"
        description="Please review all the details before submitting your course for review."
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <CourseSummary courseData={courseData} />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Back
        </Button>
      </div>
    </div>
  );
} 