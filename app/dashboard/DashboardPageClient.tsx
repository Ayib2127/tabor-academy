"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SuccessFunnelCard } from "@/components/dashboard/success-funnel-card";
import { EnrolledCoursesCarousel } from "@/components/dashboard/enrolled-courses-carousel";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { AchievementsList } from "@/components/dashboard/achievements-list";
import { Recommendations } from "@/components/dashboard/recommendations";
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
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Line } from "react-chartjs-2";
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

interface DashboardData {
  user: {
    id: string;
    name: string;
    avatar?: string;
    funnelStage: string;
    memberSince: string;
  };
  stats: {
    totalCourses: number;
    learningStreak: number;
    achievementPoints: number;
    completedCourses: number;
  };
  enrolledCourses: any[];
  recommendedCourses: any[];
  allRecommendations: any[];
  recentAchievements: any[];
  nextStepCourse: any;
  completedStages?: string[];
}

// Fallback/mock data for empty/failure state
const fallbackData: DashboardData = {
  user: {
    id: 'demo-user',
    name: 'Demo User',
    avatar: undefined,
    funnelStage: 'Idea',
    memberSince: '2024-01-01'
  },
  stats: {
    totalCourses: 0,
    learningStreak: 0,
    achievementPoints: 0,
    completedCourses: 0,
  },
  enrolledCourses: [],
  recommendedCourses: [],
  allRecommendations: [],
  recentAchievements: [
    {
      id: '1',
      title: 'Welcome!',
      description: 'You joined Tabor Academy',
      date: 'Today',
      icon: 'star',
    }
  ],
  nextStepCourse: {
    title: 'Start Your First Course',
    description: 'Browse our catalog and enroll in your first course to begin your journey.',
    action: 'Browse Courses',
    course: null
  },
  completedStages: [],
};

export default function DashboardPageClient({ user, role }: { user: any; role: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      // If data is empty or missing key sections, use fallback
      if (!data || !data.user || (Array.isArray(data.enrolledCourses) && data.enrolledCourses.length === 0)) {
        setDashboardData(fallbackData)
      } else {
      setDashboardData(data)
      }
      setError(null)
    } catch (err: any) {
      setDashboardData(fallbackData)
      setError(null) // Don't show error, show fallback instead
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleContinueCourse = (courseId: number) => {
    window.location.href = `/courses/${courseId}`
  }

  const handleLearnMore = (courseId: number) => {
    window.location.href = `/courses/${courseId}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#4ECDC4]" />
                <span className="text-lg text-[#2C3E50]">Loading your personalized dashboard...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                    Unable to Load Dashboard
                  </h3>
                  <p className="text-[#2C3E50]/60 mb-4">
                    {error}
                  </p>
                  <Button onClick={fetchDashboardData} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-white">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-7xl">
          {/* Enhanced Search and Notifications Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search courses, content, and community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
              />
            </div>
            <Button variant="ghost" className="relative ml-4 hover:bg-[#4ECDC4]/10">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-[#2C3E50]">
                  {getGreeting()}, {dashboardData.user.name}! 👋
                </h1>
                <p className="text-[#2C3E50]/70 text-lg">
                  Ready to continue your entrepreneurial journey?
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-[#FF6B35] mb-1">
                  <Flame className="h-6 w-6" />
                  <span className="font-bold text-xl">{dashboardData.stats.learningStreak} Day Streak!</span>
                </div>
                <p className="text-sm text-[#2C3E50]/60">Keep the momentum going! 🔥</p>
              </div>
            </div>
          </div>

          {/* Success Funnel Card */}
          <div className="mb-12">
            <SuccessFunnelCard
              funnelStage={dashboardData.user.funnelStage}
              nextStep={dashboardData.nextStepCourse}
              userName={dashboardData.user.name}
              completedStages={dashboardData.completedStages}
            />
          </div>

          {/* My Courses Section */}
          <div className="mb-12">
            <EnrolledCoursesCarousel courses={dashboardData.enrolledCourses} />
          </div>

          {/* Quick Stats */}
          <div className="mb-12">
            <QuickStats
              stats={{
                learningHours: dashboardData.stats.totalCourses * 5, // Mock calculation
                learningTrend: "+5 this week",
                coursesCompleted: dashboardData.stats.completedCourses,
                coursesTrend: `${dashboardData.enrolledCourses.length - dashboardData.stats.completedCourses} in progress`,
                achievementPoints: dashboardData.stats.achievementPoints,
                achievementTrend: "Top 10%",
                nextMilestone: "Complete Advanced Marketing",
                milestoneDue: "2 days left"
              }}
            />
          </div>

          {/* Learning Analytics and Progress */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 md:col-span-2 card-hover gradient-border border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-6 text-[#2C3E50]">Weekly Learning Activity</h2>
              <Line
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Hours Spent Learning',
                      data: [4, 6, 5, 7, 3, 4, 2], // Mock data
                      borderColor: '#4ECDC4',
                      backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: '#4ECDC4',
                      pointBorderColor: '#4ECDC4',
                      pointHoverBackgroundColor: '#FF6B35',
                      pointHoverBorderColor: '#FF6B35'
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
                      },
                      grid: {
                        color: '#E5E8E8'
                      }
                    },
                    x: {
                      grid: {
                        color: '#E5E8E8'
                      }
                    }
                  }
                }}
              />
            </Card>

            <Card className="p-6 card-hover gradient-border border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-6 text-[#2C3E50]">Skill Progress</h2>
              <div className="space-y-6">
                {[
                  { skill: 'Business Validation', progress: 75, color: '#4ECDC4' },
                  { skill: 'Digital Marketing', progress: 60, color: '#FF6B35' },
                  { skill: 'Product Development', progress: 45, color: '#4ECDC4' }
                ].map(({ skill, progress, color }) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#2C3E50] font-medium">{skill}</span>
                      <span className="text-[#2C3E50] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#E5E8E8] rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Achievements, Community, and Events */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <AchievementsList achievements={dashboardData.recentAchievements} />

            <Card className="p-6 card-hover gradient-border border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-6 text-[#2C3E50]">Community Highlights</h2>
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    type: "discussion",
                    title: "Startup Validation Tips",
                    activity: "5 new replies",
                    trending: true
                  },
                  {
                    id: 2,
                    type: "studyGroup",
                    title: "Entrepreneur Study Group",
                    activity: "Meeting tomorrow",
                    trending: false
                  }
                ].map((update) => (
                  <div key={update.id} className="flex items-start gap-4">
                    <div className="bg-[#4ECDC4]/10 rounded-full p-3">
                      {update.type === "discussion" ? (
                        <MessageSquare className="h-6 w-6 text-[#4ECDC4]" />
                      ) : (
                        <Users className="h-6 w-6 text-[#4ECDC4]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2C3E50]">{update.title}</h3>
                        {update.trending && (
                          <ChevronRight className="h-4 w-4 text-[#FF6B35]" />
                        )}
                      </div>
                      <p className="text-sm text-[#FF6B35]">{update.activity}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                  Join Community
                </Button>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border border-[#E5E8E8] shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-6 text-[#2C3E50]">Upcoming Events</h2>
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    title: "Startup Pitch Workshop",
                    date: "Tomorrow, 2 PM",
                    type: "workshop",
                    featured: true
                  },
                  {
                    id: 2,
                    title: "Mentor Session",
                    date: "Friday, 10 AM",
                    type: "mentoring",
                    featured: false
                  }
                ].map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="bg-[#FF6B35]/10 rounded-full p-3">
                      {event.type === "workshop" ? (
                        <Users className="h-6 w-6 text-[#FF6B35]" />
                      ) : (
                        <Calendar className="h-6 w-6 text-[#FF6B35]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2C3E50]">{event.title}</h3>
                        {event.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-[#FF6B35]">{event.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white">
                  View All Events
                </Button>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50]">Recommended for You</h2>
                <p className="text-[#2C3E50]/60 mt-1">
                  Curated courses based on your {dashboardData.user.funnelStage.toLowerCase()} stage journey
                </p>
              </div>
              <Button variant="outline" asChild className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                <Link href="/courses">
                  View All Courses
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <Recommendations
              courses={dashboardData.allRecommendations}
              onLearnMore={handleLearnMore}
            />
          </div>

          {/* Mobile App Notice */}
          <Card className="p-8 bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 border-[#E5E8E8] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-[#2C3E50] text-lg">Learn Anywhere, Anytime</h3>
                  <p className="text-sm text-[#2C3E50]/70">
                    Download our mobile app for offline learning and never miss a lesson
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white px-6 py-3">
                <Download className="h-5 w-5 mr-2" />
                Get the App
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 