'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Filter,
  Search,
  Bell,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Download,
  Share2,
  Settings,
  Play,
  Award,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, parseISO } from 'date-fns';

interface CalendarEvent {
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
}

interface CalendarDashboardProps {
  userId: string;
  role: string;
}

// Mock events data - replace with real API calls
const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Digital Marketing Workshop',
      description: 'Live workshop on social media marketing strategies',
      startDate: new Date(2024, 11, 15, 14, 0),
      endDate: new Date(2024, 11, 15, 16, 0),
      type: 'workshop',
      status: 'scheduled',
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      location: 'Online',
      meetingLink: 'https://zoom.us/j/123456789',
      color: '#4ECDC4',
      priority: 'high',
      notifications: {
        email: true,
        push: true,
        sms: false,
        minutesBefore: 15,
      },
      courseId: 'course-1',
    },
    {
      id: '2',
      title: 'Mentorship Session',
      description: 'One-on-one session with Sarah Kimani',
      startDate: new Date(2024, 11, 18, 10, 0),
      endDate: new Date(2024, 11, 18, 11, 0),
      type: 'mentorship',
      status: 'scheduled',
      participants: ['Sarah Kimani'],
      location: 'Online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      color: '#FF6B35',
      priority: 'medium',
      notifications: {
        email: true,
        push: true,
        sms: true,
        minutesBefore: 30,
      },
      instructorId: 'instructor-1',
    },
    {
      id: '3',
      title: 'Assignment Deadline',
      description: 'Submit final project for No-Code Development course',
      startDate: new Date(2024, 11, 20, 23, 59),
      endDate: new Date(2024, 11, 20, 23, 59),
      type: 'deadline',
      status: 'scheduled',
      color: '#E74C3C',
      priority: 'high',
      notifications: {
        email: true,
        push: true,
        sms: false,
        minutesBefore: 60,
      },
      courseId: 'course-2',
    },
    {
      id: '4',
      title: 'Course Review Meeting',
      description: 'Review course content and student feedback',
      startDate: new Date(2024, 11, 22, 15, 0),
      endDate: new Date(2024, 11, 22, 16, 30),
      type: 'meeting',
      status: 'scheduled',
      participants: ['Course Team', 'Quality Assurance'],
      location: 'Conference Room A',
      color: '#9B59B6',
      priority: 'medium',
      notifications: {
        email: true,
        push: true,
        sms: false,
        minutesBefore: 15,
      },
    },
  ];

export default function CalendarDashboard({ userId, role }: CalendarDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Calendar navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Get calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(event => event.type === filter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [events, filter, searchQuery]);

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.startDate, date));
  };

  // Get event type icon
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <CalendarDays className="w-4 h-4" />;
      case 'mentorship':
        return <Users className="w-4 h-4" />;
      case 'workshop':
        return <Users className="w-4 h-4" />;
      case 'meeting':
        return <CheckCircle className="w-4 h-4" />;
      case 'deadline':
        return <AlertTriangle className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle event creation
  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
  };

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully');
  };

  // Export calendar
  const handleExportCalendar = (format: 'ics' | 'csv') => {
    toast.success(`Calendar exported as ${format.toUpperCase()}`);
    // Implement export functionality
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 animate-pulse text-[#4ECDC4]" />
          <span className="text-[#2C3E50]">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Calendar</h1>
          <p className="text-[#2C3E50]/60">Manage your schedule and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateEvent} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 border-[#4ECDC4]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="mentorship">Mentorship</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
            </SelectContent>
          </Select>
          <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
            <SelectTrigger className="w-32 border-[#4ECDC4]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#4ECDC4] focus:border-[#4ECDC4]"
          />
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={goToPreviousMonth} variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={goToToday} variant="outline" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            <CalendarDays className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button onClick={goToNextMonth} variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold text-[#2C3E50]">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
      </div>

      {/* Calendar Grid */}
      <Card className="border-[#E5E8E8]">
        <CardContent className="p-0">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-white p-3 text-center">
                <span className="text-sm font-medium text-[#2C3E50]">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={index}
                  className={`min-h-[120px] bg-white p-2 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        isCurrentDay
                          ? 'bg-[#4ECDC4] text-white rounded-full w-6 h-6 flex items-center justify-center'
                          : isCurrentMonth
                          ? 'text-[#2C3E50]'
                          : 'text-gray-400'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <Badge className="bg-[#4ECDC4] text-white text-xs">
                        {dayEvents.length}
                      </Badge>
                    )}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{ borderLeft: `3px solid ${event.color}` }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-gray-500">
                          {format(event.startDate, 'HH:mm')}
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#4ECDC4]" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents
              .filter(event => event.startDate > new Date())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div>
                      <h4 className="font-medium text-[#2C3E50]">{event.title}</h4>
                      <p className="text-sm text-[#2C3E50]/60">
                        {format(event.startDate, 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(event.type)}
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getEventTypeIcon(selectedEvent.type)}
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#2C3E50]">Description</Label>
                  <p className="text-sm text-[#2C3E50]/70 mt-1">
                    {selectedEvent.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#2C3E50]">Start Time</Label>
                    <p className="text-sm text-[#2C3E50]/70 mt-1">
                      {format(selectedEvent.startDate, 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#2C3E50]">End Time</Label>
                    <p className="text-sm text-[#2C3E50]/70 mt-1">
                      {format(selectedEvent.endDate, 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <Label className="text-sm font-medium text-[#2C3E50]">Location</Label>
                    <p className="text-sm text-[#2C3E50]/70 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.location}
                    </p>
                  </div>
                )}

                {selectedEvent.meetingLink && (
                  <div>
                    <Label className="text-sm font-medium text-[#2C3E50]">Meeting Link</Label>
                    <a
                      href={selectedEvent.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#4ECDC4] hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Meeting
                    </a>
                  </div>
                )}

                {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-[#2C3E50]">Participants</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedEvent.participants.map((participant, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(selectedEvent.priority)}>
                    {selectedEvent.priority} priority
                  </Badge>
                  <Badge
                    className={
                      selectedEvent.status === 'completed'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : selectedEvent.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }
                  >
                    {selectedEvent.status}
                  </Badge>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Handle edit
                      toast.info('Edit functionality coming soon');
                    }}
                    className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#4ECDC4]" />
              Create New Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title" className="text-[#2C3E50] font-semibold">
                Event Title
              </Label>
              <Input
                id="event-title"
                placeholder="Enter event title"
                className="border-[#E5E8E8] focus:border-[#4ECDC4]"
              />
            </div>

            <div>
              <Label htmlFor="event-description" className="text-[#2C3E50] font-semibold">
                Description
              </Label>
              <Textarea
                id="event-description"
                placeholder="Enter event description"
                className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start" className="text-[#2C3E50] font-semibold">
                  Start Date & Time
                </Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
              <div>
                <Label htmlFor="event-end" className="text-[#2C3E50] font-semibold">
                  End Date & Time
                </Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-type" className="text-[#2C3E50] font-semibold">
                  Event Type
                </Label>
                <Select>
                  <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="mentorship">Mentorship</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-priority" className="text-[#2C3E50] font-semibold">
                  Priority
                </Label>
                <Select>
                  <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreatingEvent(false)}
                className="border-[#E5E8E8] hover:border-[#4ECDC4]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsCreatingEvent(false);
                  toast.success('Event created successfully');
                }}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 