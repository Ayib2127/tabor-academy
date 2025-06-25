"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronRight,
  Bell,
  Clock,
  MessageSquare,
  Settings,
  Volume2,
  Smartphone,
  Moon,
  Calendar,
  Vibrate,
  Languages,
  Goal,
  Crown,
  Star,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function MobileNotificationsPage() {
  const [masterToggle, setMasterToggle] = useState(true)
  const [notificationPreview, setNotificationPreview] = useState({
    title: "Course Reminder",
    message: "Your next lesson starts in 30 minutes",
    type: "reminder"
  })

  // Mock notification settings
  const notificationCategories = {
    learning: [
      { id: "daily-reminder", label: "Daily Study Reminders", enabled: true },
      { id: "deadlines", label: "Course Deadline Alerts", enabled: true },
      { id: "missed-sessions", label: "Missed Session Notifications", enabled: false },
      { id: "study-streak", label: "Study Streak Maintenance", enabled: true }
    ],
    progress: [
      { id: "achievements", label: "Achievement Unlocked", enabled: true },
      { id: "completion", label: "Course Completion", enabled: true },
      { id: "milestones", label: "Milestone Reached", enabled: true },
      { id: "skill-level", label: "Skill Level Advancement", enabled: true }
    ],
    community: [
      { id: "mentor-messages", label: "Mentor Messages", enabled: true },
      { id: "forum-replies", label: "Forum Reply Alerts", enabled: false },
      { id: "collaboration", label: "Peer Collaboration Invites", enabled: true },
      { id: "study-groups", label: "Study Group Updates", enabled: true }
    ],
    system: [
      { id: "app-updates", label: "App Updates Available", enabled: true },
      { id: "sync-status", label: "Sync Completion Status", enabled: true },
      { id: "maintenance", label: "Technical Maintenance", enabled: false },
      { id: "security", label: "Security Notifications", enabled: true }
    ]
  }

  const quietHours = {
    enabled: true,
    start: "22:00",
    end: "07:00",
    weekends: true
  }

  const deliveryMethods = {
    push: true,
    inApp: true,
    email: false,
    sms: false,
    whatsapp: true
  }

  const priorities = {
    high: ["mentor-messages", "deadlines", "security"],
    medium: ["achievements", "study-streak", "app-updates"],
    low: ["forum-replies", "study-groups"]
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/settings" className="hover:text-foreground">Settings</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Notifications</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Notification Preferences
              </h1>
              <p className="text-muted-foreground">
                Customize how and when you receive notifications
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${
                  masterToggle ? "bg-green-100" : "bg-red-100"
                }`}>
                  <Bell className={`h-6 w-6 ${
                    masterToggle ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
                <div>
                  <h2 className="font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    {masterToggle ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMasterToggle(!masterToggle)}
                >
                  {masterToggle ? "Disable All" : "Enable All"}
                </Button>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Notification Categories */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Categories</h2>
                <div className="space-y-8">
                  {Object.entries(notificationCategories).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-medium mb-4 capitalize">{category} Notifications</h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={item.id}
                                checked={item.enabled}
                                className="rounded border-gray-300"
                                onChange={() => {}}
                              />
                              <Label htmlFor={item.id}>{item.label}</Label>
                            </div>
                            {priorities.high.includes(item.id) && (
                              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                                High Priority
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Timing and Frequency */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Timing & Frequency</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Quiet Hours</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={quietHours.start}
                          onChange={() => {}}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={quietHours.end}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={quietHours.weekends}
                          onChange={() => {}}
                          className="rounded border-gray-300"
                        />
                        <span>Enable on weekends</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Frequency Limits</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Maximum notifications per hour</span>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          defaultValue="5"
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Minimum time between notifications</span>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          defaultValue="10"
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Delivery Methods */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Delivery Methods</h2>
                <div className="space-y-4">
                  {Object.entries(deliveryMethods).map(([method, enabled]) => (
                    <div
                      key={method}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => {}}
                          className="rounded border-gray-300"
                        />
                        <span className="capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      Sample notification
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-accent space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{notificationPreview.title}</span>
                    <span className="text-sm text-muted-foreground">Now</span>
                  </div>
                  <p className="text-sm">{notificationPreview.message}</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Test Notification
                </Button>
              </Card>

              {/* Quick Settings */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Settings</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/notifications/schedule">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule Settings
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/notifications/sound">
                      <div className="flex items-center">
                        <Volume2 className="mr-2 h-4 w-4" />
                        Sound & Vibration
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/notifications/priority">
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4" />
                        Priority Settings
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
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
                      Notification support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/notifications">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Troubleshooting Guide
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