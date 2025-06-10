"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
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
  DollarSign
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

interface Course {
    id: string;
    title: string;
    is_published: boolean;
    created_at: string;
    thumbnail_url?: string;
    price?: number;
    students?: number;
    completionRate?: number;
    recentActivity?: number;
}

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'assignment' | 'question'; // Expanded types for potential future use
  student: string;
  action: string;
  course: string;
  time: string;
}

// Mock data for the instructor dashboard
const instructorData = {
  name: "Dr. Sarah Kimani",
  stats: {
    activeStudents: 156,
    coursesActive: 3,
    rating: 4.9,
    completionRate: 78
  },
  activeCourses: [
    {
      id: 1,
      title: "Digital Marketing Mastery",
      students: 156,
      completionRate: 78,
      recentActivity: 12,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
      id: 2,
      title: "E-commerce Strategy",
      students: 89,
      completionRate: 65,
      recentActivity: 8,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
      id: 3,
      title: "Social Media Marketing",
      students: 234,
      completionRate: 82,
      recentActivity: 15,
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0"
    }
  ],
  studentActivity: [
    {
      id: 1,
      type: "assignment",
      student: "John Okafor",
      action: "Submitted final project",
      course: "Digital Marketing Mastery",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "question",
      student: "Grace Mensah",
      action: "Asked a question",
      course: "E-commerce Strategy",
      time: "4 hours ago"
    },
    {
      id: 3,
      type: "completion",
      student: "David Kamau",
      action: "Completed module 3",
      course: "Social Media Marketing",
      time: "6 hours ago"
    }
  ],
  quickActions: [
    {
      id: 1,
      title: "Review Assignments",
      count: 15,
      icon: FileText,
      color: "text-brand-orange-500",
      bgColor: "bg-brand-orange-100"
    },
    {
      id: 2,
      title: "Student Questions",
      count: 8,
      icon: MessageSquare,
      color: "text-brand-teal-500",
      bgColor: "bg-brand-teal-100"
    },
    {
      id: 3,
      title: "Course Updates",
      count: 3,
      icon: Edit,
      color: "text-brand-orange-500",
      bgColor: "bg-brand-orange-100"
    },
    {
      id: 4,
      title: "Live Sessions",
      count: 2,
      icon: Video,
      color: "text-brand-teal-500",
      bgColor: "bg-brand-teal-100"
    }
  ]
}

export default function InstructorDashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [instructorName, setInstructorName] = useState(instructorData.name)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [overallCompletionRate, setOverallCompletionRate] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchInstructorData() {
      setLoading(true);
      setError(null);
      try {
        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error(sessionError.message);
        }
        
        if (!session) {
          console.error("No active session found");
          throw new Error("No active session found. Please log in.");
        }
        
        console.log("Session found:", session);
        
        // Get user details
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error("User error:", userError);
          throw new Error(userError.message);
        }

        if (!user) {
          router.push('/login');
          return;
        }

        setInstructorName(user.user_metadata?.full_name || user.email || 'Instructor');

        // Fetch courses from the API route
        const coursesResponse = await fetch('/api/instructor/courses', {
          credentials: 'include', // Important for including cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!coursesResponse.ok) {
          const errorData = await coursesResponse.json();
          throw new Error(errorData.error || 'Failed to fetch instructor courses.');
        }
        
        const { courses: coursesData, summaryStats } = await coursesResponse.json();
        setCourses(coursesData);

        // Update summary stats with fetched data
        setTotalStudents(summaryStats.totalStudents);
        setTotalRevenue(summaryStats.totalRevenue);
        setOverallCompletionRate(summaryStats.averageCompletionRate || 0);

        // Fetch recent activity from the new API route
        const activityResponse = await fetch('/api/instructor/activity', {
          credentials: 'include', // Important for including cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!activityResponse.ok) {
          const errorData = await activityResponse.json();
          throw new Error(errorData.error || 'Failed to fetch recent activity.');
        }
        
        const activityData: ActivityItem[] = await activityResponse.json();
        setRecentActivity(activityData);

      } catch (err: any) {
        console.error("Error fetching instructor data:", err);
        setError(err.message || 'Failed to fetch instructor data.');
        toast.error(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchInstructorData();
  }, [router, supabase]);

  const handleCreateCourseClick = () => {
    router.push('/dashboard/instructor/course-builder')
  }

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update course status to ${!currentStatus}`);
      }

      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      // Optimistically update the UI
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId ? { ...course, is_published: !currentStatus } : course
        )
      );
    } catch (err: any) {
      console.error("Error toggling publish status:", err);
      toast.error(err.message || 'Failed to update course status.');
    }
  };

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
            <Button variant="ghost" className="relative ml-4">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-brand-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {instructorName}</h1>
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

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange-100 rounded-full p-3">
                  <Users className="h-6 w-6 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : totalStudents}</h3>
                  <p className="text-sm text-green-500">+15% this month</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-teal-100 rounded-full p-3">
                  <BookOpen className="h-6 w-6 text-brand-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : courses.length}</h3>
                  <p className="text-sm text-green-500">+1 this week</p>
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
                  <h3 className="text-2xl font-bold">{loading ? '...' : `$${totalRevenue.toFixed(2)}`}</h3>
                  <p className="text-sm text-green-500">+10% this month</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-teal-100 rounded-full p-3">
                  <BarChart className="h-6 w-6 text-brand-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : `${overallCompletionRate.toFixed(0)}%`}</h3>
                  <p className="text-sm text-green-500">Above Average</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {instructorData.quickActions.map((action) => (
                <Card key={action.id} className="p-6 card-hover gradient-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${action.bgColor} rounded-full p-2`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <span className="text-sm font-medium">{action.count} Pending</span>
                  </div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <Button variant="ghost" size="sm" className="mt-4">
                    View All
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Courses */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Active Courses</h2>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground mb-4">No courses found. Create your first course!</p>
                <Button onClick={handleCreateCourseClick} className="bg-gradient-to-r from-brand-orange-500 to-brand-teal-500">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2">
                    <Image
                      src={course.thumbnail_url || "/placeholder.svg"}
                      alt={course.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Status: {course.is_published ? 
                          <span className="text-green-600">Published</span> : 
                          <span className="text-orange-500">Draft</span>
                        }
                      </p>
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students || 0} Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={course.completionRate || 0} 
                            className="w-24 h-2 bg-muted"
                          />
                          <span className="font-medium">
                            {course.completionRate?.toFixed(0) || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/instructor/courses/${course.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/instructor/courses/${course.id}/students`}>
                            <Users className="h-4 w-4 mr-2" />
                            View Students
                          </Link>
                        </Button>
                        <Button
                          variant={course.is_published ? "destructive" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => handleTogglePublish(course.id, course.is_published)}
                        >
                          {course.is_published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/learning-analytics?courseId=${course.id}`}>
                            <BarChart className="h-4 w-4 mr-2" />
                            Analytics
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            {
              loading ? (
                <p>Loading recent activity...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : recentActivity.length === 0 ? (
                <p>No recent activity found.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <Card key={activity.id} className="p-4 flex items-center justify-between card-hover">
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-100 rounded-full p-3">
                              {activity.type === 'assignment' && <FileText className="h-5 w-5 text-gray-600" />}
                              {activity.type === 'question' && <MessageSquare className="h-5 w-5 text-gray-600" />}
                              {activity.type === 'completion' && <CheckCircle className="h-5 w-5 text-gray-600" />}
                              {activity.type === 'enrollment' && <Users className="h-5 w-5 text-gray-600" />} 
                            </div>
                            <div>
                              <p className="font-semibold">{activity.student} {activity.action} {activity.course}</p>
                              <p className="text-sm text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Card className="p-6 card-hover gradient-border">
                      <h2 className="text-2xl font-bold mb-6">Quick Tools</h2>
                      <div className="space-y-4">
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
              )
            }
          </div>
        </div>
      </main>
    </div>
  )
}