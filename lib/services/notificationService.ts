import { supabase } from '@/lib/supabase/client';

export interface CreateNotificationData {
  user_id: string;
  type: 'course_announcement' | 'course_status_change' | 'new_enrollment' | 'assignment_due' | 'message_received' | 'system_alert' | 'achievement_unlocked';
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationFilters {
  user_id?: string;
  type?: string;
  read?: boolean;
  limit?: number;
  offset?: number;
}

export class NotificationService {
  /**
   * Create a single notification
   */
  static async createNotification(data: CreateNotificationData) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        throw new Error(error.message);
      }

      return notification;
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  }

  /**
   * Create multiple notifications (bulk insert)
   */
  static async createBulkNotifications(data: CreateNotificationData[]) {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .insert(data)
        .select();

      if (error) {
        console.error('Error creating bulk notifications:', error);
        throw new Error(error.message);
      }

      return notifications;
    } catch (error) {
      console.error('Error in createBulkNotifications:', error);
      throw error;
    }
  }

  /**
   * Get notifications with filters
   */
  static async getNotifications(filters: NotificationFilters = {}) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.read !== undefined) {
        query = query.eq('read', filters.read);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching notifications:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in getNotifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: string) {
    try {
      const { data, error } = await supabase.rpc('get_unread_notification_count', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error getting unread count:', error);
        throw new Error(error.message);
      }

      return data || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking notification as read:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string, notificationIds?: string[]) {
    try {
      const { data, error } = await supabase.rpc('mark_notifications_as_read', {
        p_user_id: userId,
        p_notification_ids: notificationIds
      });

      if (error) {
        console.error('Error marking all notifications as read:', error);
        throw new Error(error.message);
      }

      return data || 0;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting notification:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      throw error;
    }
  }

  /**
   * Create course announcement notifications for all enrolled students
   */
  static async createCourseAnnouncement(
    courseId: string,
    instructorId: string,
    title: string,
    message: string
  ) {
    try {
      // Get all students enrolled in the course
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('user_id')
        .eq('course_id', courseId);

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        throw new Error(enrollmentsError.message);
      }

      if (!enrollments || enrollments.length === 0) {
        return { count: 0, message: 'No students enrolled in this course' };
      }

      // Create notifications for all enrolled students
      const notifications = enrollments.map(enrollment => ({
        user_id: enrollment.user_id,
        type: 'course_announcement' as const,
        title,
        message,
        data: {
          course_id: courseId,
          instructor_id: instructorId,
          announcement_title: title
        }
      }));

      const createdNotifications = await this.createBulkNotifications(notifications);

      return {
        count: createdNotifications.length,
        message: `Announcement sent to ${createdNotifications.length} students`,
        notifications: createdNotifications
      };
    } catch (error) {
      console.error('Error in createCourseAnnouncement:', error);
      throw error;
    }
  }

  /**
   * Create course status change notification
   */
  static async createCourseStatusNotification(
    userId: string,
    courseId: string,
    courseTitle: string,
    status: 'published' | 'rejected' | 'pending_review',
    rejectionReason?: string
  ) {
    try {
      let title: string;
      let message: string;
      let type: 'course_status_change' = 'course_status_change';

      switch (status) {
        case 'published':
          title = 'Course Approved!';
          message = `Your course "${courseTitle}" has been approved and is now live.`;
          break;
        case 'rejected':
          title = 'Course Needs Changes';
          message = `Your course "${courseTitle}" requires updates before publication.`;
          break;
        case 'pending_review':
          title = 'Course Under Review';
          message = `Your course "${courseTitle}" is now being reviewed by our team.`;
          break;
        default:
          title = 'Course Status Updated';
          message = `The status of your course "${courseTitle}" has been updated.`;
      }

      const notification = await this.createNotification({
        user_id: userId,
        type,
        title,
        message,
        data: {
          course_id: courseId,
          course_title: courseTitle,
          status,
          rejection_reason: rejectionReason
        }
      });

      return notification;
    } catch (error) {
      console.error('Error in createCourseStatusNotification:', error);
      throw error;
    }
  }

  /**
   * Create new enrollment notification for instructor
   */
  static async createEnrollmentNotification(
    instructorId: string,
    courseId: string,
    courseTitle: string,
    studentName: string
  ) {
    try {
      const notification = await this.createNotification({
        user_id: instructorId,
        type: 'new_enrollment',
        title: 'New Student Enrollment',
        message: `${studentName} has enrolled in your course "${courseTitle}".`,
        data: {
          course_id: courseId,
          course_title: courseTitle,
          student_name: studentName
        }
      });

      return notification;
    } catch (error) {
      console.error('Error in createEnrollmentNotification:', error);
      throw error;
    }
  }

  /**
   * Create assignment due notification
   */
  static async createAssignmentDueNotification(
    userId: string,
    assignmentTitle: string,
    courseTitle: string,
    dueDate: string
  ) {
    try {
      const notification = await this.createNotification({
        user_id: userId,
        type: 'assignment_due',
        title: 'Assignment Due Soon',
        message: `Your assignment "${assignmentTitle}" for "${courseTitle}" is due on ${new Date(dueDate).toLocaleDateString()}.`,
        data: {
          assignment_title: assignmentTitle,
          course_title: courseTitle,
          due_date: dueDate
        }
      });

      return notification;
    } catch (error) {
      console.error('Error in createAssignmentDueNotification:', error);
      throw error;
    }
  }

  /**
   * Create system alert notification
   */
  static async createSystemAlert(
    userId: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ) {
    try {
      const notification = await this.createNotification({
        user_id: userId,
        type: 'system_alert',
        title,
        message,
        data
      });

      return notification;
    } catch (error) {
      console.error('Error in createSystemAlert:', error);
      throw error;
    }
  }
} 