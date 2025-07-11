import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'course' | 'mentorship' | 'workshop' | 'meeting' | 'deadline' | 'reminder';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  participants?: string[];
  location?: string;
  meetingLink?: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    minutesBefore: number;
  };
  courseId?: string;
  instructorId?: string;
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEvent['type'];
  location?: string;
  meetingLink?: string;
  color?: string;
  priority?: CalendarEvent['priority'];
  participants?: string[];
  courseId?: string;
  instructorId?: string;
  studentId?: string;
  notifications?: CalendarEvent['notifications'];
  recurring?: CalendarEvent['recurring'];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
  status?: CalendarEvent['status'];
}

export interface CalendarFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  courseId?: string;
  status?: string;
}

export function useCalendar(userId: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  // Fetch events
  const fetchEvents = useCallback(async (filters?: CalendarFilters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('calendar_events')
        .select('*')
        .or(`user_id.eq.${userId},instructor_id.eq.${userId},student_id.eq.${userId}`);

      // Apply filters
      if (filters?.startDate && filters?.endDate) {
        query = query.gte('start_date', filters.startDate.toISOString())
                     .lte('end_date', filters.endDate.toISOString());
      }

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters?.courseId) {
        query = query.eq('course_id', filters.courseId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error: fetchError } = await query.order('start_date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to match our interface
      const transformedEvents: CalendarEvent[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        type: event.type,
        status: event.status,
        participants: event.participants || [],
        location: event.location,
        meetingLink: event.meeting_link,
        color: event.color,
        priority: event.priority,
        recurring: event.recurring,
        notifications: event.notifications,
        courseId: event.course_id,
        instructorId: event.instructor_id,
        studentId: event.student_id,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at),
      }));

      setEvents(transformedEvents);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  // Create event
  const createEvent = useCallback(async (eventData: CreateEventData): Promise<CalendarEvent | null> => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate.toISOString(),
          end_date: eventData.endDate.toISOString(),
          type: eventData.type,
          location: eventData.location,
          meeting_link: eventData.meetingLink,
          color: eventData.color || '#4ECDC4',
          priority: eventData.priority || 'medium',
          participants: eventData.participants || [],
          user_id: userId,
          course_id: eventData.courseId,
          instructor_id: eventData.instructorId,
          student_id: eventData.studentId,
          notifications: eventData.notifications || {
            email: true,
            push: true,
            sms: false,
            minutesBefore: 15,
          },
          recurring: eventData.recurring,
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the created event
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        type: data.type,
        status: data.status,
        participants: data.participants || [],
        location: data.location,
        meetingLink: data.meeting_link,
        color: data.color,
        priority: data.priority,
        recurring: data.recurring,
        notifications: data.notifications,
        courseId: data.course_id,
        instructorId: data.instructor_id,
        studentId: data.student_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (err) {
      console.error('Error creating calendar event:', err);
      toast.error('Failed to create event');
      return null;
    }
  }, [userId, supabase]);

  // Update event
  const updateEvent = useCallback(async (eventData: UpdateEventData): Promise<CalendarEvent | null> => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Only include fields that are provided
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.startDate !== undefined) updateData.start_date = eventData.startDate.toISOString();
      if (eventData.endDate !== undefined) updateData.end_date = eventData.endDate.toISOString();
      if (eventData.type !== undefined) updateData.type = eventData.type;
      if (eventData.status !== undefined) updateData.status = eventData.status;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.meetingLink !== undefined) updateData.meeting_link = eventData.meetingLink;
      if (eventData.color !== undefined) updateData.color = eventData.color;
      if (eventData.priority !== undefined) updateData.priority = eventData.priority;
      if (eventData.participants !== undefined) updateData.participants = eventData.participants;
      if (eventData.courseId !== undefined) updateData.course_id = eventData.courseId;
      if (eventData.instructorId !== undefined) updateData.instructor_id = eventData.instructorId;
      if (eventData.studentId !== undefined) updateData.student_id = eventData.studentId;
      if (eventData.notifications !== undefined) updateData.notifications = eventData.notifications;
      if (eventData.recurring !== undefined) updateData.recurring = eventData.recurring;

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', eventData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the updated event
      const updatedEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        type: data.type,
        status: data.status,
        participants: data.participants || [],
        location: data.location,
        meetingLink: data.meeting_link,
        color: data.color,
        priority: data.priority,
        recurring: data.recurring,
        notifications: data.notifications,
        courseId: data.course_id,
        instructorId: data.instructor_id,
        studentId: data.student_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? updatedEvent : event
      ));
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (err) {
      console.error('Error updating calendar event:', err);
      toast.error('Failed to update event');
      return null;
    }
  }, [supabase]);

  // Delete event
  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting calendar event:', err);
      toast.error('Failed to delete event');
      return false;
    }
  }, [supabase]);

  // Get upcoming events
  const getUpcomingEvents = useCallback(async (days: number = 7): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_upcoming_events', { p_user_id: userId, p_days: days });

      if (error) {
        throw error;
      }

      return (data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        type: event.type,
        status: event.status,
        participants: event.participants || [],
        location: event.location,
        meetingLink: event.meeting_link,
        color: event.color,
        priority: event.priority,
        courseId: event.course_id,
        instructorId: event.instructor_id,
        studentId: event.student_id,
        createdAt: new Date(),
        updatedAt: new Date(),
        notifications: { email: true, push: true, sms: false, minutesBefore: 15 },
      }));
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      return [];
    }
  }, [userId, supabase]);

  // Get events by date range
  const getEventsByDateRange = useCallback(async (
    startDate: Date,
    endDate: Date
  ): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_events_by_date_range', {
          p_user_id: userId,
          p_start_date: startDate.toISOString(),
          p_end_date: endDate.toISOString(),
        });

      if (error) {
        throw error;
      }

      return (data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        type: event.type,
        status: event.status,
        participants: event.participants || [],
        location: event.location,
        meetingLink: event.meeting_link,
        color: event.color,
        priority: event.priority,
        courseId: event.course_id,
        instructorId: event.instructor_id,
        studentId: event.student_id,
        createdAt: new Date(),
        updatedAt: new Date(),
        notifications: { email: true, push: true, sms: false, minutesBefore: 15 },
      }));
    } catch (err) {
      console.error('Error fetching events by date range:', err);
      return [];
    }
  }, [userId, supabase]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('calendar_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Calendar event change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newEvent = payload.new as any;
            const transformedEvent: CalendarEvent = {
              id: newEvent.id,
              title: newEvent.title,
              description: newEvent.description,
              startDate: new Date(newEvent.start_date),
              endDate: new Date(newEvent.end_date),
              type: newEvent.type,
              status: newEvent.status,
              participants: newEvent.participants || [],
              location: newEvent.location,
              meetingLink: newEvent.meeting_link,
              color: newEvent.color,
              priority: newEvent.priority,
              recurring: newEvent.recurring,
              notifications: newEvent.notifications,
              courseId: newEvent.course_id,
              instructorId: newEvent.instructor_id,
              studentId: newEvent.student_id,
              createdAt: new Date(newEvent.created_at),
              updatedAt: new Date(newEvent.updated_at),
            };
            setEvents(prev => [...prev, transformedEvent]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedEvent = payload.new as any;
            const transformedEvent: CalendarEvent = {
              id: updatedEvent.id,
              title: updatedEvent.title,
              description: updatedEvent.description,
              startDate: new Date(updatedEvent.start_date),
              endDate: new Date(updatedEvent.end_date),
              type: updatedEvent.type,
              status: updatedEvent.status,
              participants: updatedEvent.participants || [],
              location: updatedEvent.location,
              meetingLink: updatedEvent.meeting_link,
              color: updatedEvent.color,
              priority: updatedEvent.priority,
              recurring: updatedEvent.recurring,
              notifications: updatedEvent.notifications,
              courseId: updatedEvent.course_id,
              instructorId: updatedEvent.instructor_id,
              studentId: updatedEvent.student_id,
              createdAt: new Date(updatedEvent.created_at),
              updatedAt: new Date(updatedEvent.updated_at),
            };
            setEvents(prev => prev.map(event => 
              event.id === updatedEvent.id ? transformedEvent : event
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedEvent = payload.old as any;
            setEvents(prev => prev.filter(event => event.id !== deletedEvent.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsByDateRange,
  };
} 