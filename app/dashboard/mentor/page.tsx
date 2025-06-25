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

export default function MentorDashboardPage() {
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

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center gap-4">
                <div className="bg-brand-teal-100 rounded-full p-3">
                  <Star className="h-6 w-6 text-brand-teal-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                  <h3 className="text-2xl font-bold">{mentorData.stats.satisfactionRate}%</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Active Mentees */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Active Mentees</h2>
              <Button variant="outline">View All Mentees</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {mentorData.activeMentees.map((mentee) => (
                <Card key={mentee.id} className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      src={mentee.image}
                      alt={mentee.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{mentee.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentee.goal}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{mentee.progress}%</span>
                      </div>
                      <Progress value={mentee.progress} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Session</span>
                      <span>{mentee.nextSession}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="flex-1">Message</Button>
                    <Button className="flex-1">View Profile</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions and Progress */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 md:col-span-2 card-hover gradient-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                <Button variant="ghost">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
              <div className="space-y-6">
                {mentorData.upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4">
                    <Image
                      src={session.image}
                      alt={session.mentee}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{session.mentee}</h3>
                        <span className="text-sm text-muted-foreground">{session.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{session.type}</p>
                      <p className="text-sm text-brand-orange-500">{session.date}</p>
                    </div>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-2xl font-bold mb-6">Mentee Progress</h2>
              <div className="space-y-6">
                {mentorData.menteeProgress.map((progress) => (
                  <div key={progress.id} className="flex items-start gap-4">
                    <div className="bg-brand-orange-100 rounded-full p-2">
                      {progress.type === "milestone" ? (
                        <Target className="h-5 w-5 text-brand-orange-500" />
                      ) : (
                        <Rocket className="h-5 w-5 text-brand-orange-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{progress.mentee}</h3>
                      <p className="text-sm text-muted-foreground">{progress.achievement}</p>
                      <p className="text-sm text-brand-orange-500">{progress.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Resources and Tools */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 md:col-span-2 card-hover gradient-border">
              <h2 className="text-2xl font-bold mb-6">Mentoring Resources</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Button variant="outline" className="h-auto p-6 text-left flex items-start gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-2">
                    <BookOpen className="h-5 w-5 text-brand-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Mentoring Guide</h3>
                    <p className="text-sm text-muted-foreground">Best practices and tips for effective mentoring</p>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-6 text-left flex items-start gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-2">
                    <Target className="h-5 w-5 text-brand-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Goal Setting Templates</h3>
                    <p className="text-sm text-muted-foreground">Tools for setting and tracking mentee goals</p>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-6 text-left flex items-start gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-2">
                    <FileText className="h-5 w-5 text-brand-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Session Templates</h3>
                    <p className="text-sm text-muted-foreground">Structured formats for different session types</p>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-6 text-left flex items-start gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-2">
                    <MessageSquare className="h-5 w-5 text-brand-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Communication Guide</h3>
                    <p className="text-sm text-muted-foreground">Tips for effective mentee communication</p>
                  </div>
                </Button>
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <h2 className="text-2xl font-bold mb-6">Quick Tools</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Progress Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Mentor Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}