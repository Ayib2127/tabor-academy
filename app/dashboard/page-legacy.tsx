"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  BookOpen,
  Trophy,
  Target,
  Clock,
  Calendar,
  Users,
  BarChart,
  MessageSquare,
  Download,
  ChevronRight,
  Star,
  Play,
  Flame,
  Brain,
  Heart,
  Zap,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Line } from "react-chartjs-2"

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for the dashboard
const dashboardData = {
  user: {
    name: "Sarah",
    streak: 15,
    totalHours: 45,
    coursesCompleted: 3,
    nextMilestone: "Complete Advanced Marketing",
    weather: {
      location: "Nairobi",
      condition: "Sunny"
    }
  },
  activeCourses: [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      progress: 65,
      nextLesson: "Social Media Strategy",
      duration: "45 mins",
      instructor: "John Smith",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
      id: 2,
      title: "E-commerce Business Essentials",
      progress: 30,
      nextLesson: "Product Photography",
      duration: "30 mins",
      instructor: "Mary Johnson",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    }
  ],
  learningStats: {
    weeklyHours: [4, 6, 5, 7, 3, 4, 2],
    skillProgress: {
      marketing: 75,
      ecommerce: 60,
      analytics: 45
    }
  },
  achievements: [
    {
      id: 1,
      title: "Fast Learner",
      description: "Completed 3 lessons in one day",
      icon: Zap,
      date: "Today"
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "100% on Marketing Quiz",
      icon: Star,
      date: "Yesterday"
    }
  ],
  recommendations: [
    {
      id: 1,
      title: "Social Media Marketing Advanced",
      reason: "Based on your interests",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0"
    },
    {
      id: 2,
      title: "E-commerce Analytics",
      reason: "Popular in your field",
      image: "https://images.unsplash.com/photo-1512054502232-10640d5d078c"
    }
  ],
  communityUpdates: [
    {
      id: 1,
      type: "discussion",
      title: "Marketing Trends 2025",
      activity: "5 new replies"
    },
    {
      id: 2,
      type: "studyGroup",
      title: "E-commerce Study Group",
      activity: "Meeting tomorrow"
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Digital Marketing Workshop",
      date: "Tomorrow, 2 PM",
      type: "workshop"
    },
    {
      id: 2,
      title: "Mentor Session",
      date: "Friday, 10 AM",
      type: "mentoring"
    }
  ]
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
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
                placeholder="Search courses, content, and community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="ghost" className="relative ml-4">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-brand-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {dashboardData.user.name}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Ready to continue your learning journey?
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-brand-orange-500">
                  <Flame className="h-5 w-5" />
                  <span className="font-bold">{dashboardData.user.streak} Day Streak!</span>
                </div>
                <p className="text-sm text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange-100 rounded-full p-3">
                  <Brain className="h-6 w-6 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Learning Hours</p>
                  <p className="text-2xl font-bold">{dashboardData.user.totalHours}</p>
                  <p className="text-sm text-green-500">+5 this week</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-teal-100 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-brand-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                  <p className="text-2xl font-bold">{dashboardData.user.coursesCompleted}</p>
                  <p className="text-sm text-brand-orange-500">1 in progress</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange-100 rounded-full p-3">
                  <Star className="h-6 w-6 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achievement Points</p>
                  <p className="text-2xl font-bold">850</p>
                  <p className="text-sm text-green-500">Top 10%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-teal-100 rounded-full p-3">
                  <Target className="h-6 w-6 text-brand-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Milestone</p>
                  <p className="text-lg font-bold truncate">
                    {dashboardData.user.nextMilestone}
                  </p>
                  <p className="text-sm text-brand-orange-500">2 days left</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Continue Learning Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dashboardData.activeCourses.map((course) => (
                <Card key={course.id} className="card-hover gradient-border">
                  <div className="relative h-48">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover rounded-t-lg"
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
                        <p className="text-muted-foreground">Next Up</p>
                        <p className="font-medium">{course.nextLesson}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Instructor</p>
                        <p className="font-medium">{course.instructor}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Analytics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 md:col-span-2 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Weekly Learning Activity</h2>
              <Line
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Hours Spent Learning',
                      data: dashboardData.learningStats.weeklyHours,
                      borderColor: 'rgb(234, 88, 12)',
                      backgroundColor: 'rgba(234, 88, 12, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Hours'
                      }
                    }
                  }
                }}
              />
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Skill Progress</h2>
              <div className="space-y-6">
                {Object.entries(dashboardData.learningStats.skillProgress).map(([skill, progress]) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <span className="capitalize">{skill}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Achievements and Events */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
              <div className="space-y-6">
                {dashboardData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-3">
                      <achievement.icon className="h-6 w-6 text-brand-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-sm text-brand-orange-500">{achievement.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Achievements
                </Button>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Community Updates</h2>
              <div className="space-y-6">
                {dashboardData.communityUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-4">
                    <div className="bg-brand-teal-100 rounded-full p-3">
                      {update.type === "discussion" ? (
                        <MessageSquare className="h-6 w-6 text-brand-teal-500" />
                      ) : (
                        <Users className="h-6 w-6 text-brand-teal-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{update.title}</h3>
                      <p className="text-sm text-brand-orange-500">{update.activity}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Updates
                </Button>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-xl font-bold mb-6">Upcoming Events</h2>
              <div className="space-y-6">
                {dashboardData.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-3">
                      {event.type === "workshop" ? (
                        <Users className="h-6 w-6 text-brand-orange-500" />
                      ) : (
                        <Calendar className="h-6 w-6 text-brand-orange-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-brand-orange-500">{event.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dashboardData.recommendations.map((course) => (
                <Card key={course.id} className="card-hover gradient-border">
                  <div className="relative h-40">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{course.reason}</p>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Mobile App Notice */}
          <Card className="p-8 bg-gradient-to-r from-brand-orange-50 to-brand-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Learn on the Go</h3>
                <p className="text-sm text-muted-foreground">
                  Download our mobile app for offline learning
                </p>
              </div>
              <Button className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600">
                <Download className="h-4 w-4 mr-2" />
                Get the App
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}