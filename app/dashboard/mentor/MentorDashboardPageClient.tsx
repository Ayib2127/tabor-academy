"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  BookOpen,
  Target,
  Award,
  ChevronRight,
  Star,
  Heart,
  Rocket,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  FileText
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for the mentor dashboard
const mentorData = {
  name: "Dr. Sarah Kimani",
  stats: {
    activeMentees: 3,
    hoursInvested: 24,
    goalsAchieved: 12,
    satisfactionRate: 98
  },
  activeMentees: [
    {
      id: 1,
      name: "John Okafor",
      goal: "Launch Digital Marketing Agency",
      progress: 65,
      nextSession: "Tomorrow, 2:00 PM",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      id: 2,
      name: "Grace Mensah",
      goal: "Scale E-commerce Business",
      progress: 45,
      nextSession: "Thursday, 10:00 AM",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    },
    {
      id: 3,
      name: "David Kamau",
      goal: "Master Digital Marketing",
      progress: 80,
      nextSession: "Friday, 3:00 PM",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    }
  ],
  upcomingSessions: [
    {
      id: 1,
      mentee: "John Okafor",
      type: "Goal Review",
      date: "Tomorrow, 2:00 PM",
      duration: "45 mins",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      id: 2,
      mentee: "Grace Mensah",
      type: "Progress Check",
      date: "Thursday, 10:00 AM",
      duration: "30 mins",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  ],
  menteeProgress: [
    {
      id: 1,
      mentee: "John Okafor",
      achievement: "Completed Business Plan",
      date: "2 days ago",
      type: "milestone"
    },
    {
      id: 2,
      mentee: "Grace Mensah",
      achievement: "Launched Online Store",
      date: "1 week ago",
      type: "major"
    },
    {
      id: 3,
      mentee: "David Kamau",
      achievement: "First Client Acquired",
      date: "3 days ago",
      type: "milestone"
    }
  ]
}

export default function MentorDashboardPageClient({ user, role }) {
  const [searchQuery, setSearchQuery] = useState("")

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
                placeholder="Search mentees, sessions, or resources..."
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
                <h1 className="text-3xl font-bold mb-2">Welcome, {mentorData.name}</h1>
                <p className="text-muted-foreground">Making an impact through mentorship</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-brand-orange-500">
                  <Award className="h-5 w-5" />
                  <span className="font-bold">Top Mentor</span>
                </div>
                <p className="text-sm text-muted-foreground">4.9/5 Rating</p>
              </div>
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
                  <p className="text-sm text-muted-foreground">Active Mentees</p>
                  <h3 className="text-2xl font-bold">{mentorData.stats.activeMentees}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-teal-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-brand-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hours Mentored</p>
                  <h3 className="text-2xl font-bold">{mentorData.stats.hoursInvested}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-orange-100 rounded-full p-3">
                  <Target className="h-6 w-6 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goals Achieved</p>
                  <h3 className="text-2xl font-bold">{mentorData.stats.goalsAchieved}</h3>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-4">
              <div className="bg-brand-teal-100 rounded-full p-3">
                <Star className="h-6 w-6 text-brand-teal-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                <h3 className="text-2xl font-bold">{mentorData.stats.satisfactionRate}%</h3>
              </div>
            </div>
          </div>

          {/* ...rest of the dashboard UI... */}
        </div>
      </main>
    </div>
  )
} 