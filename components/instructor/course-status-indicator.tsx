'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Send,
  Eye,
  MessageSquare,
  Calendar,
  User,
} from 'lucide-react';

interface CourseStatusIndicatorProps {
  course: {
    id: string;
    title: string;
    status: 'draft' | 'pending_review' | 'published' | 'rejected';
    rejection_reason?: string;
    reviewed_at?: string;
    reviewed_by?: string;
    updated_at: string;
  };
  onSubmitForReview?: (courseId: string) => void;
  isSubmitting?: boolean;
  showActions?: boolean;
}

export function CourseStatusIndicator({
  course,
  onSubmitForReview,
  isSubmitting = false,
  showActions = true,
}: CourseStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published':
        return {
          badge: (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Published
            </Badge>
          ),
          description: 'Your course is live and available to students',
          color: 'green',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        };
      case 'pending_review':
        return {
          badge: (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Clock className="w-3 h-3 mr-1" />
              Under Review
            </Badge>
          ),
          description: 'Your course is being reviewed by our team',
          color: 'yellow',
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
        };
      case 'rejected':
        return {
          badge: (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Needs Changes
            </Badge>
          ),
          description: 'Admin feedback received - please review and resubmit',
          color: 'red',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
        };
      default: // draft
        return {
          badge: (
            <Badge variant="outline">
              <Edit className="w-3 h-3 mr-1" />
              Draft
            </Badge>
          ),
          description: 'Course is in draft mode - ready to submit for review',
          color: 'gray',
          icon: <Edit className="w-5 h-5 text-gray-600" />,
        };
    }
  };

  const statusConfig = getStatusConfig(course.status);

  const getStatusActions = () => {
    switch (course.status) {
      case 'draft':
      case 'rejected':
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#E5E8E8] hover:border-[#4ECDC4]"
            >
              <a href={`/dashboard/instructor/courses/${course.id}/content`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Course
              </a>
            </Button>
            {onSubmitForReview && (
              <Button
                onClick={() => onSubmitForReview(course.id)}
                disabled={isSubmitting}
                size="sm"
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </div>
        );
      case 'pending_review':
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-gray-300 text-gray-500"
            >
              <Clock className="w-4 h-4 mr-2" />
              Under Review
            </Button>
          </div>
        );
      case 'published':
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#E5E8E8] hover:border-[#4ECDC4]"
            >
              <a href={`/courses/${course.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Live
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#E5E8E8] hover:border-[#4ECDC4]"
            >
              <a href={`/dashboard/instructor/courses/${course.id}/content`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </a>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Status Badge and Description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {statusConfig.icon}
          <div>
            {statusConfig.badge}
            <p className="text-sm text-[#2C3E50]/60 mt-1">
              {statusConfig.description}
            </p>
          </div>
        </div>
        
        {course.status === 'rejected' && course.rejection_reason && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                View Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#2C3E50] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Admin Feedback
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Changes Requested</h4>
                  <p className="text-red-700">{course.rejection_reason}</p>
                </div>
                
                {course.reviewed_at && (
                  <div className="text-sm text-[#2C3E50]/60">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>Reviewed on {formatDate(course.reviewed_at)}</span>
                    </div>
                    {course.reviewed_by && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Reviewed by Admin</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                  <ol className="text-blue-700 text-sm space-y-1">
                    <li>1. Address the feedback provided above</li>
                    <li>2. Make the necessary changes to your course</li>
                    <li>3. Submit your course for review again</li>
                  </ol>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Status-specific Information */}
      {course.status === 'pending_review' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-800">Review in Progress</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Our team is reviewing your course. You'll receive a notification once the review is complete.
                  Typical review time is 2-3 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {course.status === 'rejected' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">Action Required</h4>
                <p className="text-sm text-red-700 mt-1">
                  Your course needs some changes before it can be published. Please review the admin feedback
                  and make the necessary updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {course.status === 'published' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Course is Live!</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your course is now published and available to students. You can continue to edit and improve
                  your course content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {showActions && (
        <div className="pt-2">
          {getStatusActions()}
        </div>
      )}
    </div>
  );
}