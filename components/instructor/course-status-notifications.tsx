'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  MessageSquare,
  Calendar,
  ChevronRight,
  Eye,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface StatusNotification {
  id: string;
  type: 'course_approved' | 'course_rejected' | 'course_under_review';
  title: string;
  message: string;
  course_id: string;
  course_title: string;
  created_at: string;
  read: boolean;
  metadata?: {
    rejection_reason?: string;
    reviewed_by?: string;
    reviewed_at?: string;
  };
}

interface CourseStatusNotificationsProps {
  userId: string;
  courses: Array<{
    id: string;
    title: string;
    status: string;
    rejection_reason?: string;
    updated_at: string;
  }>;
}

export function CourseStatusNotifications({ userId, courses }: CourseStatusNotificationsProps) {
  const [notifications, setNotifications] = useState<StatusNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<StatusNotification | null>(null);

  useEffect(() => {
    // Generate notifications based on course status changes
    generateNotificationsFromCourses();
  }, [courses, userId]);

  const generateNotificationsFromCourses = () => {
    const newNotifications: StatusNotification[] = [];

    courses.forEach(course => {
      // Check for status-based notifications
      if (course.status === 'published') {
        newNotifications.push({
          id: `notif-${course.id}-approved`,
          type: 'course_approved',
          title: 'Course Approved!',
          message: `Your course "${course.title}" has been approved and is now live.`,
          course_id: course.id,
          course_title: course.title,
          created_at: course.updated_at,
          read: false,
          metadata: {
            reviewed_by: 'Admin Team',
            reviewed_at: course.updated_at,
          },
        });
      }

      if (course.status === 'needs_changes' && course.rejection_reason) {
        newNotifications.push({
          id: `notif-${course.id}-rejected`,
          type: 'course_rejected',
          title: 'Course Needs Changes',
          message: `Your course "${course.title}" requires some updates before publication.`,
          course_id: course.id,
          course_title: course.title,
          created_at: course.updated_at,
          read: false,
          metadata: {
            rejection_reason: course.rejection_reason,
            reviewed_by: 'Admin Team',
            reviewed_at: course.updated_at,
          },
        });
      }

      if (course.status === 'pending_review') {
        newNotifications.push({
          id: `notif-${course.id}-review`,
          type: 'course_under_review',
          title: 'Course Under Review',
          message: `Your course "${course.title}" is now being reviewed by our team.`,
          course_id: course.id,
          course_title: course.title,
          created_at: course.updated_at,
          read: false,
          metadata: {
            reviewed_by: 'Admin Team',
            reviewed_at: course.updated_at,
          },
        });
      }
    });

    // Sort by creation date (newest first)
    newNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'course_rejected':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'course_under_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'course_approved':
        return 'border-green-200 bg-green-50';
      case 'course_rejected':
        return 'border-red-200 bg-red-50';
      case 'course_under_review':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getActionButton = (notification: StatusNotification) => {
    switch (notification.type) {
      case 'course_approved':
        return (
          <Link href={`/courses/${notification.course_id}`}>
            <Button size="sm" className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
              <Eye className="w-4 h-4 mr-2" />
              View Live Course
            </Button>
          </Link>
        );
      case 'course_rejected':
        return (
          <Link href={`/dashboard/instructor/courses/${notification.course_id}/content`}>
            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              <Edit className="w-4 h-4 mr-2" />
              Make Changes
            </Button>
          </Link>
        );
      case 'course_under_review':
        return (
          <Button size="sm" variant="outline" disabled className="border-gray-300 text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            In Review
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-96 bg-white border border-[#E5E8E8] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-[#E5E8E8]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#2C3E50]">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-[#4ECDC4] hover:text-[#4ECDC4]/80"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-[#2C3E50]/40 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">No Notifications</h4>
                  <p className="text-[#2C3E50]/60">
                    You'll receive notifications about course status changes here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E8E8]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#F7F9F9] cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        setSelectedNotification(notification);
                        markAsRead(notification.id);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full border border-[#E5E8E8]">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#2C3E50] text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-[#2C3E50]/70 truncate">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#2C3E50]/60">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            {!notification.read && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#2C3E50]/40" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getNotificationIcon(selectedNotification.type)}
                <span>{selectedNotification.title}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className={`border ${getNotificationColor(selectedNotification.type)}`}>
                <CardContent className="p-4">
                  <p className="text-[#2C3E50]">{selectedNotification.message}</p>
                  
                  {selectedNotification.metadata?.rejection_reason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">Admin Feedback:</h4>
                      <p className="text-red-700">{selectedNotification.metadata.rejection_reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="text-sm text-[#2C3E50]/60">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(selectedNotification.created_at).toLocaleString()}</span>
                </div>
                {selectedNotification.metadata?.reviewed_by && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>From: {selectedNotification.metadata.reviewed_by}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                {getActionButton(selectedNotification)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}