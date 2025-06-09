"use client"

import { useState } from "react"
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
  Star
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

  const handleCreateCourseClick = () => {
    router.push('/dashboard/instructor/course-builder')
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
                <h1 className="text-3xl font-bold mb-2">Welcome, {instructorData.name}</h1>
                <p className="text-muted-foreground">Here's what's happening with your courses</p>
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
                  <h3 className="text-2xl font-bold">{instructorData.stats.activeStudents}</h3>
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
                  <h3 className="text-2xl font-bold">{instructorData.stats.coursesActive}</h3>
                  <p className="text-sm text-green-500">+1 this week</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange-100 rounded-full p-3">
                  <Star className="h-6 w-6 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <h3 className="text-2xl font-bold">{instructorData.stats.rating}</h3>
                  <p className="text-sm text-green-500">Top Rated</p>
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
                  <h3 className="text-2xl font-bold">{instructorData.stats.completionRate}%</h3>
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

          {/* Course Management */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Courses</h2>
              <Button variant="outline">Manage All Courses</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {instructorData.activeCourses.map((course) => (
                <Card key={course.id} className="card-hover gradient-border">
                  <div className="relative h-48">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">{course.title}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Students</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="font-medium">{course.completionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Recent Activity</span>
                        <span className="font-medium">{course.recentActivity} actions</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button variant="outline" className="flex-1">Edit</Button>
                      <Button className="flex-1">View</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Student Activity */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recent Student Activity</h2>
                  <Button variant="ghost">View All</Button>
                </div>
                <div className="space-y-6">
                  {instructorData.studentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="bg-brand-orange-100 rounded-full p-2">
                        {activity.type === "assignment" && <FileText className="h-5 w-5 text-brand-orange-500" />}
                        {activity.type === "question" && <MessageSquare className="h-5 w-5 text-brand-orange-500" />}
                        {activity.type === "completion" && <CheckCircle className="h-5 w-5 text-brand-orange-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{activity.student}</h3>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-sm text-brand-orange-500">{activity.course}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
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
        </div>
      </main>
    </div>
  )
}