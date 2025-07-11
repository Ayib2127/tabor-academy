"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  BookOpen,
  Users,
  BarChart,
  MessageSquare,
  PlusCircle,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Settings,
  HelpCircle,
  ChevronRight,
  Star,
  DollarSign,
  Eye,
  Send,
  AlertTriangle,
  Shield,
  User,
  TrendingUp,
  ClipboardList,
  LayoutDashboard,
  Inbox,
  LogOut,
  X,
  Check,
  Menu,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import ActiveCourses from '@/components/dashboard/ActiveCourses';
import ActiveStudents from '@/components/dashboard/ActiveStudents';
import AssignmentsDueSafe from '@/components/dashboard/AssignmentsDueSafe';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import StudentProgressCard from '@/components/dashboard/StudentProgressCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import { useRealtimeNotifications } from '@/lib/hooks/useRealtimeNotifications';
import { useRealtimeDashboard } from '@/lib/hooks/useRealtimeDashboard';
import { NotificationService } from '@/lib/services/notificationService';

interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalCourses: number;
}

interface CourseOverview {
  id: string;
  title: string;
  status: 'draft' | 'pending_review' | 'published' | 'rejected';
  thumbnail_url?: string;
  price: number;
  students: number;
  completionRate: number;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  averageRating: number;
  edited_since_rejection: boolean;
}

interface ActionItem {
  type: 'assignment' | 'question' | 'review';
  count: number;
  urgent: boolean;
}

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'assignment' | 'question';
  student: string;
  action: string;
  course: string;
  time: string;
  avatar?: string;
}

interface DashboardData {
  stats: DashboardStats;
  courses: CourseOverview[];
  actionItems: ActionItem[];
  recentActivity: ActivityItem[];
  notifications: Array<{
    id: string;
    type: 'status_change' | 'new_enrollment' | 'system';
    message: string;
    timestamp: string;
    read: boolean;
  }>;
}

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/instructor' },
  { label: 'Calendar', icon: Clock, href: '/calendar' },
  { label: 'Students', icon: Users, href: '/dashboard/instructor/students' },
  { label: 'Courses', icon: BookOpen, href: '/dashboard/instructor/courses' },
  { label: 'Assignments', icon: ClipboardList, href: '/dashboard/instructor/assignments' },
  { label: 'Analytics', icon: BarChart, href: '/dashboard/instructor/analytics' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/instructor/messages' },
  { label: 'Content', icon: FileText, href: '/dashboard/instructor/content' },
  { label: 'Grading', icon: CheckCircle, href: '/dashboard/instructor/grading' },
  { label: 'Settings', icon: Settings, href: '/dashboard/instructor/settings' },
];

interface InstructorDashboardPageClientProps {
  user: any;
  role: string;
  initialData: {
    stats: {
      totalStudents: number;
      totalRevenue: number;
      averageRating: number;
      totalCourses: number;
    };
    courses: Array<{
      id: string;
      title: string;
      status: string;
      thumbnail_url?: string;
      price: number;
      students: number;
      completionRate: number;
      created_at: string;
      updated_at: string;
      rejection_reason?: string;
      averageRating: number;
      edited_since_rejection: boolean;
      modules?: Array<{
        id: string;
        title: string;
        order: number;
        lessons: Array<{
          id: string;
          title: string;
          type: 'video' | 'text' | 'quiz' | 'assignment';
          position: number;
          dueDate?: string;
          needsGrading?: boolean;
        }>;
      }>;
    }>;
    actionItems: Array<{
      type: 'assignment' | 'question' | 'review';
      count: number;
      urgent: boolean;
    }>;
    recentActivity: Array<{
      id: string;
      type: 'enrollment' | 'completion' | 'assignment' | 'question';
      student: string;
      action: string;
      course: string;
      time: string;
      avatar?: string;
    }>;
    notifications: Array<{
      id: string;
      type: 'status_change' | 'new_enrollment' | 'system';
      message: string;
      timestamp: string;
      read: boolean;
    }>;
  };
}

export default function InstructorDashboardPageClient({ user, role, initialData }: InstructorDashboardPageClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [dashboardData, setDashboardData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [submittingCourse, setSubmittingCourse] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(initialData.notifications)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')

  // 1. Define refreshDashboardData first so it can be used in callbacks below
  const refreshDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      setLoading(false);
    }
  }, []);

  // 2. Memoized dashboard update handler (now can use refreshDashboardData)
  const handleDashboardUpdate = useCallback(
    (update) => {
      console.log('Dashboard update received:', update);

      switch (update.type) {
        case 'course_update':
          refreshDashboardData();
          break;
        case 'enrollment':
          refreshDashboardData();
          toast('New Student Enrollment', {
            description: 'A new student has enrolled in one of your courses',
            duration: 3000
          });
          break;
        case 'assignment':
          refreshDashboardData();
          break;
        case 'activity':
          refreshDashboardData();
          break;
        default:
          break;
      }
    },
    [refreshDashboardData]
  );

  // 3. Memoized notification handler
  const handleNotificationReceived = useCallback(
    (notification) => {
      console.log('New real-time notification received:', notification);
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => {
            if (notification.data?.course_id) {
              router.push(`/dashboard/instructor/courses/${notification.data.course_id}`);
            }
          }
        }
      });
    },
    [router]
  );

  // Real-time notifications hook
  const {
    notifications: realtimeNotifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useRealtimeNotifications({
    userId: user?.id || '',
    enabled: !!user?.id,
    onNotificationReceived: handleNotificationReceived
  });

  // Real-time dashboard updates hook
  const {
    isConnected: dashboardConnected,
    lastUpdate,
    refresh: refreshDashboard
  } = useRealtimeDashboard({
    userId: user?.id || '',
    instructorId: user?.id || '',
    enabled: !!user?.id,
    onUpdate: handleDashboardUpdate
  });

  // Update connection status based on real-time hooks
  useEffect(() => {
    if (dashboardConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [dashboardConnected]);

  // Initialize notifications and mobile detection (run only once)
  useEffect(() => {
    // Only show notifications on initial load, not on every re-render
    const unreadStatusNotifications = initialData.notifications.filter(
      notification => !notification.read && notification.type === 'status_change'
    );
    
    unreadStatusNotifications.forEach(notification => {
      toast.info(notification.message);
    });
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Empty dependency array - runs only once on mount

  // Handle clicking outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleCreateCourseClick = () => {
    router.push('/dashboard/instructor/course-builder')
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleSubmitForReview = async (courseId: string) => {
    setSubmittingCourse(courseId);
    
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit course for review.');
      }

      const result = await response.json();
      toast.success(result.message);
      
      if (dashboardData) {
        const updatedCourses = dashboardData.courses.map(course =>
          course.id === courseId 
            ? { ...course, status: 'pending_review' as const }
            : course
        );
        setDashboardData({
          ...dashboardData,
          courses: updatedCourses,
        });
      }
      
    } catch (err: any) {
      console.error('Error submitting course for review:', err);
      toast.error(err.message || 'Failed to submit course for review.');
    } finally {
      setSubmittingCourse(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case 'pending_review':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getActionForCourse = (course: CourseOverview) => {
    switch (course.status) {
      case 'draft':
        return (
          <Button
            size="sm"
            onClick={() => handleSubmitForReview(course.id)}
            disabled={submittingCourse === course.id}
            className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90"
          >
            {submittingCourse === course.id ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Submit for Review
          </Button>
        )
      case 'rejected':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/dashboard/instructor/course-builder/${course.id}`)}
            className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
          >
            <Edit className="w-4 h-4" />
            Edit & Resubmit
          </Button>
        )
      case 'published':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/dashboard/instructor/course-builder/${course.id}`)}
            className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
          >
            <Edit className="w-4 h-4" />
            Edit Course
          </Button>
        )
      default:
        return null
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  // Filter data based on search query
  const filteredCourses = dashboardData?.courses.filter(course => {
    if (!searchQuery) return true;
    return course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           course.status.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const filteredRecentActivity = dashboardData?.recentActivity.filter(activity => {
    if (!searchQuery) return true;
    return activity.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
           activity.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
           activity.action.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const filteredActionItems = dashboardData?.actionItems.filter(item => {
    if (!searchQuery) return true;
    return item.type.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Tabor Academy" width={40} height={40} className="rounded" />
            <span className="text-xl lg:text-2xl font-bold">
              <span className="text-[#FF6B35]">Tabor</span> <span className="text-[#4ECDC4]">Academy</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <Link href="/dashboard/instructor/profile" title="Edit Profile" className="focus:outline-none">
            <Image
              src={user?.user_metadata?.photo || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="Instructor Avatar"
              width={64}
              height={64}
              className="rounded-full border-2 border-[#4ECDC4] hover:shadow-lg transition"
            />
          </Link>
          <div className="mt-2 text-center">
            <div className="font-semibold text-[#2C3E50] text-sm lg:text-base">{user?.user_metadata?.full_name || user?.email || 'Instructor'}</div>
            <div className="text-xs text-gray-500">{role || 'Instructor'}</div>
          </div>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {navLinks.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a 
                  href={href} 
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#E5E8E8] text-[#2C3E50] font-medium transition-colors text-sm lg:text-base"
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 text-[#4ECDC4] flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-8">
          <a 
            href="/logout" 
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium text-sm lg:text-base"
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#F7F9F9]">
        <header className="mb-6 lg:mb-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-[#2C3E50]" />
            </button>
            <div className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Tabor Academy" width={32} height={32} className="rounded" />
              <span className="text-lg font-bold">
                <span className="text-[#FF6B35]">Tabor</span> <span className="text-[#4ECDC4]">Academy</span>
              </span>
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs min-w-[16px] h-4 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">Instructor Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.user_metadata?.full_name || user?.email || 'Instructor'}!</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1 text-xs ${
                  connectionStatus === 'connected' ? 'text-green-600' : 
                  connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-3 h-3" />
                  ) : connectionStatus === 'connecting' ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <WifiOff className="w-3 h-3" />
                  )}
                  <span className="capitalize">{connectionStatus}</span>
                </div>
                {lastUpdate && (
                  <span className="text-xs text-gray-400">
                    Last update: {new Date(lastUpdate).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search courses, students, assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-64 border-[#4ECDC4] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]"
                />
              </div>

              <div className="relative">
                <Button 
                  variant="outline" 
                  className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[#2C3E50]">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleMarkAllAsRead}
                            className="text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                          >
                            Mark all read
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-4 text-center text-gray-500">
                          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
                          Loading notifications...
                        </div>
                      ) : realtimeNotifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {realtimeNotifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                notification.read 
                                  ? 'bg-gray-50 hover:bg-gray-100' 
                                  : 'bg-blue-50 hover:bg-blue-100'
                              }`}
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {notification.type === 'course_announcement' && <Bell className="w-4 h-4 text-blue-600" />}
                                  {notification.type === 'course_status_change' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                  {notification.type === 'new_enrollment' && <Users className="w-4 h-4 text-purple-600" />}
                                  {notification.type === 'assignment_due' && <Clock className="w-4 h-4 text-orange-600" />}
                                  {notification.type === 'message_received' && <MessageSquare className="w-4 h-4 text-indigo-600" />}
                                  {notification.type === 'system_alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                  {notification.type === 'achievement_unlocked' && <Star className="w-4 h-4 text-yellow-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#2C3E50] truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-[#2C3E50]/70 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-[#2C3E50]/50 mt-1">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {realtimeNotifications.length > 5 && (
                        <div className="p-4 border-t border-gray-200">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                            onClick={() => {
                              setShowNotifications(false);
                              router.push('/dashboard/notifications');
                            }}
                          >
                            View All Notifications ({realtimeNotifications.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                <MessageSquare className="w-5 h-5 mr-2" />Messages
              </Button>
            </div>
          </div>
        </header>
        
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-[#E5E8E8] rounded-lg border border-[#4ECDC4]/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#4ECDC4]" />
                <span className="text-sm text-[#2C3E50]">
                  Search results for "<span className="font-semibold">{searchQuery}</span>"
                </span>
              </div>
              <div className="flex items-center gap-2 lg:gap-4 text-sm text-gray-600">
                <span>{filteredCourses.length} courses</span>
                <span>{filteredRecentActivity.length} activities</span>
                <span>{filteredActionItems.length} action items</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery("")}
                  className="text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile Search Bar */}
        <div className="mb-4 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search courses, students, assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full border-[#4ECDC4] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]"
            />
          </div>
        </div>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <ActiveCourses courses={filteredCourses} stats={dashboardData.stats} />
          <ActiveStudents courses={filteredCourses} stats={dashboardData.stats} />
          <AssignmentsDueSafe courses={filteredCourses} loading={loading} error={error} />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <AnalyticsCard stats={dashboardData.stats} courses={filteredCourses} />
          <StudentProgressCard courses={filteredCourses} />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <RecentActivityCard activities={filteredRecentActivity} />
          <QuickActionsCard actionItems={filteredActionItems} />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#4ECDC4]" />
              <h3 className="font-semibold text-[#2C3E50]">Messages</h3>
            </div>
            <p className="text-gray-500 text-sm">No new messages</p>
          </Card>
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#4ECDC4]" />
              <h3 className="font-semibold text-[#2C3E50]">Upcoming Schedule</h3>
            </div>
            <p className="text-gray-500 text-sm">No upcoming events</p>
          </Card>
        </section>
      </main>
    </div>
  );
} 