"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Flame,
  BookOpen,
  Clock,
  Trophy,
  Calendar,
  BarChart,
  Target,
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  Users,
  Heart
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Mock data for the progress tracking page
const progressData = {
  overview: {
    coursesEnrolled: 12,
    coursesCompleted: 5,
    totalProgress: 65,
    streak: 15,
    nextMilestone: "Complete 6th Course",
    timeSpent: {
      daily: "2.5 hrs",
      weekly: "14 hrs",
      monthly: "58 hrs"
    }
  },
  activeCourses: [
    {
      id: 1,
      title: "Digital Marketing Mastery",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      progress: 75,
      lessonsCompleted: 15,
      totalLessons: 20,
      timeInvested: "12.5 hrs",
      lastAccessed: "2024-02-28",
      estimatedCompletion: "2 weeks",
      status: "in-progress"
    },
    {
      id: 2,
      title: "E-commerce Fundamentals",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      progress: 45,
      lessonsCompleted: 9,
      totalLessons: 20,
      timeInvested: "8 hrs",
      lastAccessed: "2024-02-27",
      estimatedCompletion: "3 weeks",
      status: "in-progress"
    }
  ],
  learningTimeline: [
    {
      date: "2024-02-28",
      event: "Completed Digital Marketing Module 3",
      type: "completion",
      milestone: true
    },
    {
      date: "2024-02-25",
      event: "Started E-commerce Course",
      type: "start",
      milestone: false
    }
  ],
  weeklySummary: {
    currentWeek: {
      totalHours: 14,
      daysActive: 5,
      mostProductiveDay: "Tuesday",
      goalsAchieved: 3
    },
    previousWeeks: [10, 12, 8, 14],
    dailyActivity: [2, 3, 2.5, 3, 2, 1, 0.5]
  },
  learningPaths: [
    {
      id: 1,
      title: "Digital Marketing Expert",
      progress: 60,
      courses: {
        completed: 3,
        total: 5
      },
      estimatedCompletion: "3 months",
      nextCourse: "Social Media Marketing"
    }
  ]
}

export default function ProgressTrackingPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Overall Progress Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6">Your Learning Journey</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <BookOpen className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                    <p className="text-2xl font-bold">
                      {progressData.overview.coursesCompleted}/{progressData.overview.coursesEnrolled}
                    </p>
                    <p className="text-sm text-green-500">5 in progress</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Flame className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Learning Streak</p>
                    <p className="text-2xl font-bold">{progressData.overview.streak} Days</p>
                    <p className="text-sm text-orange-500">Keep it up!</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Invested</p>
                    <p className="text-2xl font-bold">{progressData.overview.timeSpent.weekly}</p>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Trophy className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Milestone</p>
                    <p className="text-lg font-bold">{progressData.overview.nextMilestone}</p>
                    <p className="text-sm text-muted-foreground">2 days left</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Course Progress Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Active Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {progressData.activeCourses.map((course) => (
                <Card key={course.id} className="card-hover gradient-border overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button className="bg-white/90 text-black hover:bg-white">
                        <Play className="h-5 w-5 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-4">{course.title}</h3>
                    <Progress value={course.progress} className="mb-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{course.progress}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lessons</p>
                        <p className="font-medium">
                          {course.lessonsCompleted}/{course.totalLessons}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time Invested</p>
                        <p className="font-medium">{course.timeInvested}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. Completion</p>
                        <p className="font-medium">{course.estimatedCompletion}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Visual Progress Timeline */}
          <div className="mb-12">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Learning Timeline</h2>
              <div className="space-y-6">
                {progressData.learningTimeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      event.milestone ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {event.milestone ? (
                        <Trophy className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Target className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Weekly Learning Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Learning Activity</h2>
              <Line
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Hours Spent Learning',
                      data: progressData.weeklySummary.dailyActivity,
                      borderColor: 'rgb(234, 88, 12)',
                      tension: 0.4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  }
                }}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Weekly Summary</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                  <p className="text-2xl font-bold">
                    {progressData.weeklySummary.currentWeek.totalHours}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Days Active</p>
                  <p className="text-2xl font-bold">
                    {progressData.weeklySummary.currentWeek.daysActive}/7
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Most Productive</p>
                  <p className="text-2xl font-bold">
                    {progressData.weeklySummary.currentWeek.mostProductiveDay}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Goals Achieved</p>
                  <p className="text-2xl font-bold">
                    {progressData.weeklySummary.currentWeek.goalsAchieved}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Learning Path Progress */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
            {progressData.learningPaths.map((path) => (
              <Card key={path.id} className="p-6 card-hover gradient-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {path.courses.completed}/{path.courses.total} courses completed
                    </p>
                  </div>
                  <Button variant="outline">View Path</Button>
                </div>
                <Progress value={path.progress} className="mb-4" />
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    Est. completion: {path.estimatedCompletion}
                  </p>
                  <p>Next: {path.nextCourse}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}