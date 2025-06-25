"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Users,
  Video,
  MessageSquare,
  Upload,
  Download,
  Save,
  Share2,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [activeMembers, setActiveMembers] = useState([
    {
      name: "Sarah Kimani",
      role: "Team Lead",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      status: "online"
    },
    {
      name: "John Okafor",
      role: "Developer",
      avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57",
      status: "offline"
    }
  ])

  // Mock project data
  const project = {
    title: "E-commerce Platform Development",
    course: "Digital Entrepreneurship",
    progress: 65,
    lastModified: new Date(),
    mentor: {
      name: "Grace Mensah",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce"
    },
    objectives: [
      { text: "Market Research", completed: true },
      { text: "Business Model Canvas", completed: true },
      { text: "MVP Development", completed: false },
      { text: "User Testing", completed: false }
    ],
    timeline: {
      start: new Date(2024, 2, 1),
      end: new Date(2024, 3, 15),
      milestones: [
        { title: "Research Phase", date: new Date(2024, 2, 15), completed: true },
        { title: "Development Phase", date: new Date(2024, 3, 1), completed: false },
        { title: "Testing Phase", date: new Date(2024, 3, 10), completed: false }
      ]
    },
    tasks: [
      { id: 1, title: "Competitor Analysis", status: "completed", assignee: "Sarah Kimani" },
      { id: 2, title: "User Flow Design", status: "in-progress", assignee: "John Okafor" },
      { id: 3, title: "Frontend Development", status: "to-do", assignee: "Unassigned" }
    ],
    files: [
      { name: "Business Plan.pdf", type: "document", size: "2.4 MB", modified: new Date() },
      { name: "Wireframes.fig", type: "design", size: "15.8 MB", modified: new Date() }
    ]
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          {/* Project Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/courses" className="hover:text-foreground">{project.course}</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Project Workspace</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text">
                {project.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground text-right">
                <p>Last saved {project.lastModified.toLocaleTimeString()}</p>
                {isAutoSaving && (
                  <p className="flex items-center gap-1">
                    <Save className="h-3 w-3 animate-pulse" />
                    Auto-saving...
                  </p>
                )}
              </div>
              <div className="flex -space-x-2">
                {activeMembers.map((member, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-background"
                    />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background ${
                      member.status === "online" ? "bg-green-500" : "bg-gray-300"
                    }`} />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Workspace */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Brief */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Project Brief</h2>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Brief
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Objectives</h3>
                    <div className="space-y-2">
                      {project.objectives.map((objective, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                        >
                          {objective.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span>{objective.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Start: {project.timeline.start.toLocaleDateString()}</span>
                        <span>End: {project.timeline.end.toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-2">
                        {project.timeline.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                          >
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                              <span>{milestone.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {milestone.date.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Project Mentor</h3>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-accent">
                      <Image
                        src={project.mentor.avatar}
                        alt={project.mentor.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{project.mentor.name}</p>
                        <p className="text-sm text-muted-foreground">Project Mentor</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Collaborative Workspace */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Team Collaboration Hub</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Start Meeting
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <Label htmlFor="editor">Project Documentation</Label>
                    <div className="mt-2 min-h-[200px] p-4 bg-accent rounded-lg">
                      Collaborative editor will be integrated here
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        {
                          user: "Sarah Kimani",
                          action: "updated the project timeline",
                          time: "2 hours ago"
                        },
                        {
                          user: "John Okafor",
                          action: "uploaded new wireframes",
                          time: "4 hours ago"
                        }
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
                        >
                          <div className="flex-1">
                            <p>
                              <span className="font-medium">{activity.user}</span>{" "}
                              {activity.action}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Progress */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Project Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-accent text-center">
                      <p className="text-2xl font-bold gradient-text">4/6</p>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent text-center">
                      <p className="text-2xl font-bold gradient-text">8</p>
                      <p className="text-sm text-muted-foreground">Days Remaining</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Task Management */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Tasks</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === "completed" ? "bg-green-100 text-green-800" :
                          task.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Assigned to: {task.assignee}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* File Management */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Project Files</h2>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="space-y-4">
                  {project.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.size} • {file.modified.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}