"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle,
  Star,
  BarChart,
  FileText,
  Download,
  MessageSquare,
  Video,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Flag,
  ArrowRight,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MentorshipHistoryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  // Mock mentorship history data
  const mentorshipHistory = {
    overview: {
      totalSessions: 24,
      totalHours: 36,
      averageRating: 4.8,
      completedGoals: 15,
      activeMentors: 3
    },
    progress: {
      skillGrowth: {
        "Digital Marketing": 85,
        "Social Media Strategy": 75,
        "Content Creation": 90,
        "Analytics": 70
      },
      milestones: [
        {
          title: "First Campaign Launch",
          date: new Date(2024, 1, 15),
          status: "completed"
        },
        {
          title: "Social Media Growth",
          date: new Date(2024, 2, 1),
          status: "completed"
        },
        {
          title: "Analytics Mastery",
          date: new Date(2024, 3, 1),
          status: "in-progress"
        }
      ]
    },
    sessions: [
      {
        id: "session-001",
        mentor: {
          name: "Dr. Grace Mensah",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
        },
        date: new Date(2024, 2, 15),
        duration: 60,
        type: "one-on-one",
        topic: "Digital Marketing Strategy",
        rating: 5,
        notes: "Focused on SEO optimization and content strategy",
        achievements: [
          "Created content calendar",
          "Identified key performance metrics",
          "Developed audience personas"
        ],
        resources: [
          { name: "Strategy Template", type: "PDF" },
          { name: "Session Recording", type: "Video" }
        ]
      },
      {
        id: "session-002",
        mentor: {
          name: "John Okafor",
          avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57"
        },
        date: new Date(2024, 2, 10),
        duration: 90,
        type: "group",
        topic: "Social Media Marketing Workshop",
        rating: 4.5,
        notes: "Interactive session on engagement strategies",
        achievements: [
          "Learned advanced targeting techniques",
          "Created engagement framework",
          "Analyzed successful case studies"
        ],
        resources: [
          { name: "Workshop Slides", type: "PDF" },
          { name: "Exercise Files", type: "ZIP" }
        ]
      }
    ],
    goals: {
      completed: [
        {
          title: "Launch Social Media Campaign",
          completedDate: new Date(2024, 2, 1),
          mentor: "Dr. Grace Mensah"
        },
        {
          title: "Develop Content Strategy",
          completedDate: new Date(2024, 2, 15),
          mentor: "John Okafor"
        }
      ],
      inProgress: [
        {
          title: "Master Analytics Tools",
          deadline: new Date(2024, 4, 1),
          progress: 65
        },
        {
          title: "Build Engagement Framework",
          deadline: new Date(2024, 4, 15),
          progress: 40
        }
      ]
    },
    certificates: [
      {
        id: "cert-001",
        title: "Digital Marketing Excellence",
        issueDate: new Date(2024, 2, 15),
        mentor: "Dr. Grace Mensah",
        skills: ["SEO", "Content Strategy", "Analytics"]
      }
    ]
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/mentorship" className="hover:text-foreground">Mentorship</Link>
            <ChevronRight className="h-4 w-4" />
            <span>History</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Mentorship Journey
              </h1>
              <p className="text-muted-foreground">
                Track your progress and review past sessions
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {mentorshipHistory.overview.totalSessions}
                  </p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {mentorshipHistory.overview.totalHours}
                  </p>
                  <p className="text-sm text-muted-foreground">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {mentorshipHistory.overview.completedGoals}
                  </p>
                  <p className="text-sm text-muted-foreground">Goals</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Session History */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Session History</h2>
                <div className="space-y-6">
                  {mentorshipHistory.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={session.mentor.avatar}
                          alt={session.mentor.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{session.topic}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                              <span>{session.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            with {session.mentor.name} • {session.date.toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {session.duration} mins
                            </span>
                            <span className="flex items-center">
                              <Video className="h-4 w-4 mr-1" />
                              {session.type}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Achievements:</p>
                            <div className="space-y-1">
                              {session.achievements.map((achievement, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            {session.resources.map((resource, index) => (
                              <Button key={index} variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                {resource.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Progress Tracking */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Skill Progress</h2>
                <div className="space-y-6">
                  {Object.entries(mentorshipHistory.progress.skillGrowth).map(([skill, progress]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Milestones */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Milestones</h2>
                <div className="space-y-4">
                  {mentorshipHistory.progress.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        {milestone.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <h3 className="font-medium">{milestone.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {milestone.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Goals Tracking */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Learning Goals</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your objectives
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Completed Goals</h4>
                    <div className="space-y-2">
                      {mentorshipHistory.goals.completed.map((goal, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{goal.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Completed {goal.completedDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">In Progress</h4>
                    <div className="space-y-2">
                      {mentorshipHistory.goals.inProgress.map((goal, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg hover:bg-accent"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{goal.title}</p>
                            <span className="text-sm">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Due {goal.deadline.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Certificates */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Certificates</h3>
                    <p className="text-sm text-muted-foreground">
                      Your achievements
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {mentorshipHistory.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <h4 className="font-medium mb-1">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Issued {cert.issueDate.toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cert.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Help Section */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Progress tracking support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/progress">
                      <BarChart className="mr-2 h-4 w-4" />
                      Progress Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/goals">
                      <Target className="mr-2 h-4 w-4" />
                      Goal Setting Tips
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/contact">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
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