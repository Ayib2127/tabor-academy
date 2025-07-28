"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  user_id: string;
  type: 'course_announcement' | 'course_status_change' | 'new_enrollment' | 'assignment_due' | 'message_received' | 'system_alert' | 'achievement_unlocked';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
  updated_at: string;
}

interface UseRealtimeNotificationsProps {
  userId: string;
  enabled?: boolean;
  onNotificationReceived?: (notification: Notification) => void;
  onNotificationUpdated?: (notification: Notification) => void;
}

export function useRealtimeNotifications({
  userId,
  enabled = true,
  onNotificationReceived,
  onNotificationUpdated
}: UseRealtimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Memoize fetchNotifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        setError(fetchError.message);
        return;
      }

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    } catch (err) {
      console.error('Error in fetchNotifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return true;
    } catch (err) {
      console.error('Error in markAsRead:', err);
      return false;
    }
  }, [userId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabase.rpc('mark_notifications_as_read', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      return true;
    } catch (err) {
      console.error('Error in markAllAsRead:', err);
      return false;
    }
  }, [userId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? Math.max(0, prev - 1) : prev;
      });

      return true;
    } catch (err) {
      console.error('Error in deleteNotification:', err);
      return false;
    }
  }, [userId, notifications]);

  // useEffect for fetching notifications
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // useEffect for real-time subscription
  useEffect(() => {
    if (!enabled || !userId) return;

    const setupRealtimeSubscription = async () => {
      try {
        // Subscribe to notifications for this user
        const newChannel = supabase
          .channel(`notifications:${userId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              try {
                const newNotification = payload.new as Notification;
                
                // Add to notifications list
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show toast notification
                toast(newNotification.title, {
                  description: newNotification.message,
                  duration: 5000,
                  action: {
                    label: 'View',
                    onClick: () => {
                      // Handle view action
                      onNotificationReceived?.(newNotification);
                    }
                  }
                });

                // Call callback
                onNotificationReceived?.(newNotification);
              } catch (err) {
                console.warn('Error handling new notification:', err);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              try {
                const updatedNotification = payload.new as Notification;
                
                // Update in notifications list
                setNotifications(prev => 
                  prev.map(notification => 
                    notification.id === updatedNotification.id 
                      ? updatedNotification
                      : notification
                  )
                );

                // Update unread count
                setUnreadCount(prev => {
                  const oldNotification = notifications.find(n => n.id === updatedNotification.id);
                  if (oldNotification?.read !== updatedNotification.read) {
                    return updatedNotification.read ? Math.max(0, prev - 1) : prev + 1;
                  }
                  return prev;
                });

                // Call callback
                onNotificationUpdated?.(updatedNotification);
              } catch (err) {
                console.warn('Error handling notification update:', err);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              try {
                const deletedNotification = payload.old as Notification;
                
                // Remove from notifications list
                setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
                
                // Update unread count
                if (!deletedNotification.read) {
                  setUnreadCount(prev => Math.max(0, prev - 1));
                }
              } catch (err) {
                console.warn('Error handling notification deletion:', err);
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setError(null); // Clear any previous errors
            } else if (status === 'CHANNEL_ERROR') {
              setError('Connection issue with real-time notifications');
              
              // Retry connection after a delay
              setTimeout(() => {
                if (enabled && userId) {
                  setupRealtimeSubscription();
                }
              }, 5000);
            } else if (status === 'TIMED_OUT') {
              setError('Connection timed out');
              
              // Retry connection after a delay
              setTimeout(() => {
                if (enabled && userId) {
                  setupRealtimeSubscription();
                }
              }, 3000);
            }
          });

        setChannel(newChannel);
      } catch (err) {
        setError('Failed to setup real-time notifications');
        
        // Retry after a delay
        setTimeout(() => {
          if (enabled && userId) {
            setupRealtimeSubscription();
          }
        }, 5000);
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn('Error cleaning up real-time subscription:', err);
        }
      }
    };
  }, [enabled, userId, onNotificationReceived, onNotificationUpdated]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
} 