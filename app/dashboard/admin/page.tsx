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
  BookOpen,
  Globe,
  BarChart,
  Server,
  AlertCircle,
  CheckCircle,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  Shield,
  Database,
  Activity,
  DollarSign,
  TrendingUp,
  UserPlus,
  Flag,
  AlertTriangle,
  Lock,
  FileCheck,
  Scale,
  Zap,
  Sliders,
  Megaphone,
  LayoutGrid
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

// Mock data for the admin dashboard
const adminData = {
  systemHealth: {
    serverStatus: "Operational",
    databaseHealth: "Good",
    apiLatency: "120ms",
    errorRate: "0.02%"
  },
  recentUsers: [
    {
      id: 1,
      name: "John Okafor",
      type: "Student",
      status: "Active",
      joined: "2 hours ago",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      id: 2,
      name: "Grace Mensah",
      type: "Instructor",
      status: "Pending",
      joined: "5 hours ago",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    },
    {
      id: 3,
      name: "David Kamau",
      type: "Mentor",
      status: "Active",
      joined: "1 day ago",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    }
  ],
  contentModeration: [
    {
      id: 1,
      type: "Course",
      title: "Digital Marketing Mastery",
      status: "Pending Review",
      author: "Sarah Kimani",
      submitted: "3 hours ago"
    },
    {
      id: 2,
      type: "Forum Post",
      title: "Inappropriate content reported",
      status: "Flagged",
      author: "Anonymous",
      submitted: "1 hour ago"
    },
    {
      id: 3,
      type: "Course",
      title: "E-commerce Fundamentals",
      status: "Pending Review",
      author: "John Smith",
      submitted: "5 hours ago"
    }
  ],
  recentAlerts: [
    {
      id: 1,
      type: "error",
      message: "Payment gateway timeout",
      time: "10 minutes ago",
      priority: "high"
    },
    {
      id: 2,
      type: "warning",
      message: "High server load detected",
      time: "30 minutes ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "success",
      message: "Backup completed successfully",
      time: "1 hour ago",
      priority: "low"
    }
  ],
  analytics: {
    userGrowth: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [650, 590, 800, 810, 960, 1000]
    },
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12000, 19000, 15000, 25000, 22000, 30000]
    }
  }
}

export default function AdminDashboardPage() {
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
                placeholder="Search users, content, or settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="ghost" className="relative ml-4">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-brand-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                7
              </span>
            </Button>
          </div>

          {/* System Status Overview */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">System Overview</h1>
              <Button variant="outline" className="text-green-500">
                <CheckCircle className="h-4 w-4 mr-2" />
                All Systems Operational
              </Button>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-3">
                    <Server className="h-6 w-6 text-brand-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Server Status</p>
                    <h3 className="text-xl font-bold">{adminData.systemHealth.serverStatus}</h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-3">
                    <Database className="h-6 w-6 text-brand-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Database Health</p>
                    <h3 className="text-xl font-bold">{adminData.systemHealth.databaseHealth}</h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-3">
                    <Activity className="h-6 w-6 text-brand-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API Latency</p>
                    <h3 className="text-xl font-bold">{adminData.systemHealth.apiLatency}</h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-3">
                    <AlertTriangle className="h-6 w-6 text-brand-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <h3 className="text-xl font-bold">{adminData.systemHealth.errorRate}</h3>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Platform Metrics</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-brand-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-2xl font-bold">12,543</h3>
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
                    <h3 className="text-2xl font-bold">256</h3>
                    <p className="text-sm text-green-500">+8 this week</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-3">
                    <DollarSign className="h-6 w-6 text-brand-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <h3 className="text-2xl font-bold">$45,250</h3>
                    <p className="text-sm text-green-500">+12% this month</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-3">
                    <TrendingUp className="h-6 w-6 text-brand-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <h3 className="text-2xl font-bold">78%</h3>
                    <p className="text-sm text-green-500">+5% this month</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <h3 className="font-semibold mb-4">User Growth</h3>
                <Line
                  data={{
                    labels: adminData.analytics.userGrowth.labels,
                    datasets: [
                      {
                        label: 'New Users',
                        data: adminData.analytics.userGrowth.data,
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
                    }
                  }}
                />
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <h3 className="font-semibold mb-4">Revenue Trends</h3>
                <Line
                  data={{
                    labels: adminData.analytics.revenue.labels,
                    datasets: [
                      {
                        label: 'Revenue',
                        data: adminData.analytics.revenue.data,
                        borderColor: 'rgb(20, 184, 166)',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
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
                    }
                  }}
                />
              </Card>
            </div>
          </div>

          {/* Recent Activity and Alerts */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Users</h2>
                <Button variant="ghost">View All</Button>
              </div>
              <div className="space-y-6">
                {adminData.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{user.name}</h3>
                        <span className={`text-sm ${
                          user.status === "Active" ? "text-green-500" : "text-brand-orange-500"
                        }`}>{user.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.type}</p>
                      <p className="text-sm text-muted-foreground">{user.joined}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 card-hover gradient-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">System Alerts</h2>
                <Button variant="ghost">View All</Button>
              </div>
              <div className="space-y-6">
                {adminData.recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      alert.type === "error" ? "bg-red-100" :
                      alert.type === "warning" ? "bg-brand-orange-100" : "bg-green-100"
                    }`}>
                      {alert.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-brand-orange-500" />}
                      {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{alert.message}</h3>
                        <span className="text-sm text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Priority: {alert.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Content Moderation */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Content Moderation</h2>
              <Button variant="outline">View All Content</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {adminData.contentModeration.map((content) => (
                <Card key={content.id} className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`rounded-full p-2 ${
                      content.type === "Course" ? "bg-brand-teal-100" : "bg-brand-orange-100"
                    }`}>
                      {content.type === "Course" ? (
                        <BookOpen className="h-5 w-5 text-brand-teal-500" />
                      ) : (
                        <Flag className="h-5 w-5 text-brand-orange-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{content.type}</p>
                      <h3 className="font-medium">{content.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Author</span>
                      <span>{content.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={content.status === "Flagged" ? "text-red-500" : "text-brand-orange-500"}>
                        {content.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Submitted</span>
                      <span>{content.submitted}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Review</Button>
                    <Button className="flex-1">Approve</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform Configuration */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6 card-hover gradient-border">
                <Button variant="ghost" className="w-full h-auto text-left flex items-start gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-2">
                    <Sliders className="h-5 w-5 text-brand-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Feature Flags</h3>
                    <p className="text-sm text-muted-foreground">Manage platform features</p>
                  </div>
                </Button>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <Button variant="ghost" className="w-full h-auto text-left flex items-start gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-2">
                    <Globe className="h-5 w-5 text-brand-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Localization</h3>
                    <p className="text-sm text-muted-foreground">Language and region settings</p>
                  </div>
                </Button>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <Button variant="ghost" className="w-full h-auto text-left flex items-start gap-4">
                  <div className="bg-brand-orange-100 rounded-full p-2">
                    <Megaphone className="h-5 w-5 text-brand-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Announcements</h3>
                    <p className="text-sm text-muted-foreground">System-wide messages</p>
                  </div>
                </Button>
              </Card>

              <Card className="p-6 card-hover gradient-border">
                <Button variant="ghost" className="w-full h-auto text-left flex items-start gap-4">
                  <div className="bg-brand-teal-100 rounded-full p-2">
                    <LayoutGrid className="h-5 w-5 text-brand-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">API Management</h3>
                    <p className="text-sm text-muted-foreground">Configure integrations</p>
                  </div>
                </Button>
              </Card>
            </div>
          </div>

          {/* Emergency Controls */}
          <Card className="p-6 bg-red-50 border-red-200 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Emergency Controls</h3>
                  <p className="text-sm text-red-600">Critical system operations</p>
                </div>
              </div>
              <Button variant="destructive">
                <Zap className="h-4 w-4 mr-2" />
                Emergency Shutdown
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}