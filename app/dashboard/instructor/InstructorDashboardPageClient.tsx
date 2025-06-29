"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  TrendingUp
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

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

export default function InstructorDashboardPageClient({ user, role }: { user: any, role: string }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [submittingCourse, setSubmittingCourse] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/instructor/dashboard');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data.');
        }
        
        const data: DashboardData = await response.json();
        setDashboardData(data);
        
        // Show notifications for status changes
        data.notifications.forEach(notification => {
          if (!notification.read && notification.type === 'status_change') {
            toast.info(notification.message);
          }
        });
        
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || 'Failed to fetch dashboard data.');
        toast.error(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const handleCreateCourseClick = () => {
    router.push('/dashboard/instructor/course-builder')
  }

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
      
      // Refresh dashboard data
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
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </Badge>
        );
      case 'pending_review':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Needs Changes
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            <Edit className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  const getActionForCourse = (course: CourseOverview) => {
    switch (course.status) {
      case 'draft':
        return (
          <Button
            onClick={() => handleSubmitForReview(course.id)}
            disabled={submittingCourse === course.id}
            className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
            size="sm"
          >
            {submittingCourse === course.id ? (
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
        );
      case 'rejected':
        return (
          <div className="space-y-2">
            <Button
              onClick={() => router.push(`/dashboard/instructor/courses/${course.id}/content`)}
              variant="outline"
              size="sm"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review Feedback
            </Button>
            {course.rejection_reason && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                {course.rejection_reason}
              </p>
            )}
          </div>
        );
      case 'pending_review':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case 'published':
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Button
              onClick={() => router.push(`/courses/${course.id}`)}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredCourses = dashboardData?.courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "published") {
      return course.status === 'published' && matchesSearch;
    } else if (activeTab === "drafts") {
      return course.status === 'draft' && matchesSearch;
    } else if (activeTab === "pending") {
      return course.status === 'pending_review' && matchesSearch;
    } else if (activeTab === "rejected") {
      return course.status === 'rejected' && matchesSearch;
    } else {
      return matchesSearch;
    }
  }) || [];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // If not authenticated, show a loading state
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Search and Notifications Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses, students, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              {dashboardData?.notifications && dashboardData.notifications.length > 0 && (
                <Button variant="ghost" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-brand-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dashboardData.notifications.filter(n => !n.read).length}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, {user?.user_metadata?.full_name || user?.email}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your courses
                </p>
              </div>
              <Button className="bg-gradient-to-r from-brand-orange-600 to-brand-orange-500" onClick={handleCreateCourseClick}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange-500"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && dashboardData && (
            <>
              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-3">
                      <Users className="h-6 w-6 text-brand-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <h3 className="text-2xl font-bold">{dashboardData.stats.totalStudents}</h3>
                      <p className="text-sm text-green-500">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        Active learners
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-teal-100 rounded-full p-3">
                      <BookOpen className="h-6 w-6 text-brand-teal-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                      <h3 className="text-2xl font-bold">{dashboardData.stats.totalCourses}</h3>
                      <p className="text-sm text-blue-500">
                        {dashboardData.courses.filter(c => c.status === 'published').length} published
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-3">
                      <DollarSign className="h-6 w-6 text-brand-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <h3 className="text-2xl font-bold">${dashboardData.stats.totalRevenue.toFixed(2)}</h3>
                      <p className="text-sm text-green-500">From course sales</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-teal-100 rounded-full p-3">
                      <Star className="h-6 w-6 text-brand-teal-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                      <h3 className="text-2xl font-bold">{dashboardData.stats.averageRating}</h3>
                      <p className="text-sm text-yellow-500">⭐ Excellent</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Items */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {dashboardData.actionItems.map((item) => (
                  <Card key={item.type} className={`p-6 card-hover ${item.urgent ? 'border-red-200 bg-red-50' : 'gradient-border'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-3 ${
                        item.type === 'assignment' ? 'bg-blue-100' :
                        item.type === 'question' ? 'bg-green-100' :
                        'bg-red-100'
                      }`}>
                        {item.type === 'assignment' && <FileText className="h-6 w-6 text-blue-500" />}
                        {item.type === 'question' && <MessageSquare className="h-6 w-6 text-green-500" />}
                        {item.type === 'review' && <AlertTriangle className="h-6 w-6 text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.type === 'assignment' && 'Assignments to Grade'}
                          {item.type === 'question' && 'Student Questions'}
                          {item.type === 'review' && 'Courses Need Changes'}
                        </p>
                        <h3 className="text-2xl font-bold">{item.count}</h3>
                        {item.urgent && item.count > 0 && (
                          <p className="text-sm text-red-500">Requires attention</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Course Management */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
                
                {/* Course Tabs */}
                <div className="mb-6">
                  <div className="flex space-x-4 border-b border-gray-200">
                    {[
                      { key: "all", label: "All Courses", count: dashboardData.courses.length },
                      { key: "published", label: "Published", count: dashboardData.courses.filter(c => c.status === 'published').length },
                      { key: "pending", label: "Pending Review", count: dashboardData.courses.filter(c => c.status === 'pending_review').length },
                      { key: "drafts", label: "Drafts", count: dashboardData.courses.filter(c => c.status === 'draft').length },
                      { key: "rejected", label: "Needs Changes", count: dashboardData.courses.filter(c => c.status === 'rejected').length },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                          activeTab === tab.key 
                            ? "border-b-2 border-brand-orange-500 text-brand-orange-500" 
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {tab.count}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {activeTab === "all" ? "No courses yet" : `No ${activeTab} courses`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === "all" 
                        ? "Create your first course to start teaching and earning."
                        : `You don't have any ${activeTab} courses at the moment.`
                      }
                    </p>
                    {activeTab === "all" && (
                      <Button onClick={handleCreateCourseClick} className="bg-brand-orange-500 hover:bg-brand-orange-600">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Your First Course
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48 w-full">
                          <Image
                            src={course.thumbnail_url || '/logo.jpg'}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            {getStatusBadge(course.status)}
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 text-gray-700">
                              ${course.price}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">{course.title}</h3>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {course.students}
                              </span>
                              <span className="flex items-center gap-1">
                                <BarChart className="h-4 w-4" />
                                {course.completionRate}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                {course.averageRating}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Completion Rate</span>
                              <span>{course.completionRate}%</span>
                            </div>
                            <Progress value={course.completionRate} className="h-2 bg-gray-200" />
                          </div>

                          <div className="flex flex-col gap-2">
                            {getActionForCourse(course)}
                            
                            <div className="flex gap-2">
                              <Link href={`/dashboard/instructor/courses/${course.id}/content`} className="flex-1">
                                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </Link>
                              <Link href={`/dashboard/instructor/courses/${course.id}/students`} className="flex-1">
                                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100" size="sm">
                                  <Users className="h-4 w-4 mr-2" />
                                  Students
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            Updated {formatTimeAgo(course.updated_at)}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                  {dashboardData.recentActivity.length === 0 ? (
                    <Card className="p-6 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Activity</h3>
                      <p className="text-gray-600">Student activity will appear here as they engage with your courses.</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.recentActivity.map((activity) => (
                        <Card key={activity.id} className="p-4 flex items-center justify-between card-hover">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {activity.avatar ? (
                                <Image
                                  src={activity.avatar}
                                  alt={activity.student}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <User className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {activity.student} {activity.action} {activity.course}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatTimeAgo(activity.time)}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

    <div>
                  <h2 className="text-2xl font-bold mb-6">Quick Tools</h2>
                  <Card className="p-6 card-hover gradient-border">
                    <div className="space-y-4">
                      <Link href="/dashboard/instructor/students">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Students
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start">
                        <Video className="h-4 w-4 mr-2" />
                        Record New Lesson
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Announcement
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Course Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Get Support
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
} 