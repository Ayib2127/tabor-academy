"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface DashboardUpdate {
  type: 'course_update' | 'enrollment' | 'assignment' | 'activity' | 'progress';
  data: any;
  timestamp: string;
}

interface UseRealtimeDashboardProps {
  userId: string;
  instructorId?: string;
  enabled?: boolean;
  onUpdate?: (update: DashboardUpdate) => void;
}

export function useRealtimeDashboard({
  userId,
  instructorId,
  enabled = true,
  onUpdate
}: UseRealtimeDashboardProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  // Setup real-time subscriptions for dashboard data
  useEffect(() => {
    if (!enabled || !userId) return;

    const setupRealtimeSubscriptions = async () => {
      try {
        const newChannels: RealtimeChannel[] = [];

        // Subscribe to course updates (for instructors)
        if (instructorId) {
          const courseChannel = supabase
            .channel(`courses:${instructorId}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'courses',
                filter: `instructor_id=eq.${instructorId}`
              },
              (payload) => {
                try {
                  const update: DashboardUpdate = {
                    type: 'course_update',
                    data: payload,
                    timestamp: new Date().toISOString()
                  };
                  setLastUpdate(update.timestamp);
                  onUpdate?.(update);
                } catch (err) {
                  console.warn('Error handling course update:', err);
                }
              }
            )
            .subscribe((status) => {
              if (status === 'CHANNEL_ERROR') {
                setTimeout(() => {
                  if (enabled && userId && instructorId) {
                    setupRealtimeSubscriptions();
                  }
                }, 5000);
              }
            });

          newChannels.push(courseChannel);
        }

        // Subscribe to enrollments (for instructors)
        if (instructorId) {
          const enrollmentChannel = supabase
            .channel(`enrollments:${instructorId}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'enrollments',
                filter: `course_id=in.(select id from courses where instructor_id=eq.${instructorId})`
              },
              (payload) => {
                try {
                  const update: DashboardUpdate = {
                    type: 'enrollment',
                    data: payload,
                    timestamp: new Date().toISOString()
                  };
                  setLastUpdate(update.timestamp);
                  onUpdate?.(update);
                } catch (err) {
                  console.warn('Error handling enrollment update:', err);
                }
              }
            )
            .subscribe((status) => {
              if (status === 'CHANNEL_ERROR') {
                setTimeout(() => {
                  if (enabled && userId && instructorId) {
                    setupRealtimeSubscriptions();
                  }
                }, 5000);
              }
            });

          newChannels.push(enrollmentChannel);
        }

        // Subscribe to assignments (for instructors)
        if (instructorId) {
          const assignmentChannel = supabase
            .channel(`assignments:${instructorId}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'assignments',
                filter: `instructor_id=eq.${instructorId}`
              },
              (payload) => {
                try {
                  const update: DashboardUpdate = {
                    type: 'assignment',
                    data: payload,
                    timestamp: new Date().toISOString()
                  };
                  setLastUpdate(update.timestamp);
                  onUpdate?.(update);
                } catch (err) {
                  console.warn('Error handling assignment update:', err);
                }
              }
            )
            .subscribe((status) => {
              if (status === 'CHANNEL_ERROR') {
                setTimeout(() => {
                  if (enabled && userId && instructorId) {
                    setupRealtimeSubscriptions();
                  }
                }, 5000);
              }
            });

          newChannels.push(assignmentChannel);
        }

        // Subscribe to activity log (for instructors)
        if (instructorId) {
          const activityChannel = supabase
            .channel(`activity:${instructorId}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'activity_log',
                filter: `instructor_id=eq.${instructorId}`
              },
              (payload) => {
                try {
                  const update: DashboardUpdate = {
                    type: 'activity',
                    data: payload,
                    timestamp: new Date().toISOString()
                  };
                  setLastUpdate(update.timestamp);
                  onUpdate?.(update);
                } catch (err) {
                  console.warn('Error handling activity update:', err);
                }
              }
            )
            .subscribe((status) => {
              if (status === 'CHANNEL_ERROR') {
                setTimeout(() => {
                  if (enabled && userId && instructorId) {
                    setupRealtimeSubscriptions();
                  }
                }, 5000);
              }
            });

          newChannels.push(activityChannel);
        }

        // Subscribe to progress updates (for students)
        if (!instructorId) {
          const progressChannel = supabase
            .channel(`progress:${userId}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'progress',
                filter: `user_id=eq.${userId}`
              },
              (payload) => {
                try {
                  const update: DashboardUpdate = {
                    type: 'progress',
                    data: payload,
                    timestamp: new Date().toISOString()
                  };
                  setLastUpdate(update.timestamp);
                  onUpdate?.(update);
                } catch (err) {
                  console.warn('Error handling progress update:', err);
                }
              }
            )
            .subscribe((status) => {
              if (status === 'CHANNEL_ERROR') {
                setTimeout(() => {
                  if (enabled && userId) {
                    setupRealtimeSubscriptions();
                  }
                }, 5000);
              }
            });

          newChannels.push(progressChannel);
        }

        setChannels(newChannels);
        setIsConnected(true);

        // Check subscription status
        setTimeout(() => {
          const allSubscribed = newChannels.every(channel => 
            channel.state === 'joined'
          );
          if (allSubscribed) {
            // console.log('All real-time subscriptions active');
          }
        }, 1000);

      } catch (err) {
        console.warn('Error setting up real-time subscriptions:', err);
        setIsConnected(false);
        
        // Retry after a delay
        setTimeout(() => {
          if (enabled && userId) {
            // console.log('Retrying real-time dashboard setup...');
            setupRealtimeSubscriptions();
          }
        }, 5000);
      }
    };

    setupRealtimeSubscriptions();

    // Cleanup subscriptions on unmount
    return () => {
      try {
        // console.log('Cleaning up real-time dashboard subscriptions');
        channels.forEach(channel => {
          supabase.removeChannel(channel);
        });
        setIsConnected(false);
      } catch (err) {
        console.warn('Error cleaning up real-time dashboard subscriptions:', err);
      }
    };
  }, [enabled, userId, instructorId, onUpdate]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setLastUpdate(new Date().toISOString());
    onUpdate?.({
      type: 'activity',
      data: { manual_refresh: true },
      timestamp: new Date().toISOString()
    });
  }, [onUpdate]);

  return {
    isConnected,
    lastUpdate,
    refresh
  };
} 