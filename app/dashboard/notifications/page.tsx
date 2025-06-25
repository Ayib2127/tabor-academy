"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Filter,
  GraduationCap,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Star,
  Users,
  X
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function NotificationCenterPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("7")

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "security",
      title: "New device login detected",
      message: "A new login was detected from Chrome on MacOS",
      timestamp: new Date(2024, 2, 1, 10, 30),
      priority: "high",
      read: false
    },
    {
      id: 2,
      type: "learning",
      title: "Course milestone achieved",
      message: "Congratulations! You've completed 50% of Digital Marketing Fundamentals",
      timestamp: new Date(2024, 2, 1, 9, 15),
      priority: "medium",
      read: true
    },
    {
      id: 3,
      type: "community",
      title: "New reply to your discussion",
      message: "John Doe replied to your post in 'Social Media Strategy'",
      timestamp: new Date(2024, 1, 29, 14, 45),
      priority: "low",
      read: false
    },
    {
      id: 4,
      type: "mentorship",
      title: "Upcoming mentorship session",
      message: "Your session with Sarah Smith is scheduled for tomorrow at 2 PM",
      timestamp: new Date(2024, 1, 28, 11, 20),
      priority: "high",
      read: false
    },
    {
      id: 5,
      type: "system",
      title: "Platform maintenance",
      message: "Scheduled maintenance on March 5th from 2 AM to 4 AM EAT",
      timestamp: new Date(2024, 1, 27, 16, 30),
      priority: "medium",
      read: true
    }
  ]

  const filterNotifications = (notifications) => {
    return notifications
      .filter(notification => {
        // Filter by type
        if (selectedFilter !== "all" && notification.type !== selectedFilter) {
          return false
        }
        
        // Filter by search query
        if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
        
        // Filter by date range
        const daysAgo = Math.floor((new Date() - notification.timestamp) / (1000 * 60 * 60 * 24))
        return daysAgo <= parseInt(dateRange)
      })
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "security":
        return <Shield className="h-6 w-6 text-red-500" />
      case "learning":
        return <BookOpen className="h-6 w-6 text-green-500" />
      case "community":
        return <Users className="h-6 w-6 text-blue-500" />
      case "mentorship":
        return <Star className="h-6 w-6 text-yellow-500" />
      case "system":
        return <Settings className="h-6 w-6 text-purple-500" />
      default:
        return <Bell className="h-6 w-6 text-gray-500" />
    }
  }

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleMarkAllRead = () => {
    // Handle marking all notifications as read
  }

  const handleExportNotifications = () => {
    // Handle exporting notifications
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
            <span>Notifications</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Notification Center
              </h1>
              <p className="text-muted-foreground">
                Stay updated with your learning progress and platform activities
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleMarkAllRead}>
                Mark All as Read
              </Button>
              <Button variant="outline" onClick={handleExportNotifications}>
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Notifications</option>
                  <option value="security">Security</option>
                  <option value="learning">Learning</option>
                  <option value="community">Community</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="system">System</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Priority Notifications */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold">Important Alerts</h2>
            {filterNotifications(notifications)
              .filter(notification => notification.priority === "high")
              .map(notification => (
                <Card
                  key={notification.id}
                  className={`p-4 border-l-4 ${
                    notification.read ? "border-l-gray-300" : "border-l-orange-500"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 rounded-full p-2">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getPriorityStyles(notification.priority)
                          }`}>
                            {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                          </span>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {/* All Notifications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Notifications</h2>
            {filterNotifications(notifications)
              .filter(notification => notification.priority !== "high")
              .map(notification => (
                <Card
                  key={notification.id}
                  className={`p-4 border-l-4 ${
                    notification.read ? "border-l-gray-300" : "border-l-orange-500"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      notification.type === "learning" ? "bg-green-100" :
                      notification.type === "community" ? "bg-blue-100" :
                      notification.type === "mentorship" ? "bg-yellow-100" :
                      notification.type === "system" ? "bg-purple-100" :
                      "bg-gray-100"
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}