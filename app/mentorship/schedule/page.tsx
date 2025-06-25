"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Settings,
  Globe,
  Users,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Download
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [sessionType, setSessionType] = useState("one-on-one")
  const [sessionDuration, setSessionDuration] = useState(60)

  // Mock scheduling data
  const mentor = {
    id: "mentor-001",
    name: "Dr. Grace Mensah",
    title: "Digital Marketing Expert",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 4.9,
    reviews: 124,
    timezone: "WAT",
    languages: ["English", "French"],
    availability: {
      nextAvailable: "Tomorrow",
      timeSlots: [
        { date: "2024-03-20", times: ["09:00", "11:00", "14:00", "16:00"] },
        { date: "2024-03-21", times: ["10:00", "13:00", "15:00"] },
        { date: "2024-03-22", times: ["09:00", "12:00", "14:00"] }
      ]
    },
    sessionTypes: [
      {
        type: "one-on-one",
        name: "1:1 Mentorship Session",
        description: "Personal guidance and focused discussion",
        durations: [30, 60, 90],
        pricing: {
          30: "$30",
          60: "$50",
          90: "$70"
        }
      },
      {
        type: "group",
        name: "Group Workshop",
        description: "Interactive session with up to 5 participants",
        durations: [60, 90],
        pricing: {
          60: "$25/person",
          90: "$35/person"
        }
      }
    ]
  }

  const upcomingSessions = [
    {
      id: "session-001",
      mentor: "Sarah Kimani",
      type: "one-on-one",
      date: new Date(2024, 2, 25, 14, 0),
      duration: 60,
      topic: "Business Strategy Review"
    },
    {
      id: "session-002",
      mentor: "John Okafor",
      type: "group",
      date: new Date(2024, 2, 28, 10, 0),
      duration: 90,
      topic: "Digital Marketing Workshop"
    }
  ]

  const preparationChecklist = [
    { item: "Complete pre-session questionnaire", completed: true },
    { item: "Upload relevant documents", completed: false },
    { item: "Test video call setup", completed: false },
    { item: "Review session agenda", completed: true }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/mentorship" className="hover:text-foreground">Mentorship</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/mentorship/profile/${mentor.id}`} className="hover:text-foreground">
              {mentor.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Schedule Session</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Schedule Mentorship Session
              </h1>
              <p className="text-muted-foreground">
                Book your session with {mentor.name}
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <Image
                  src={mentor.avatar}
                  alt={mentor.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-semibold">{mentor.name}</h2>
                  <p className="text-sm text-muted-foreground">{mentor.title}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Session Type Selection */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Choose Session Type</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {mentor.sessionTypes.map((type) => (
                    <div
                      key={type.type}
                      className={`p-4 rounded-lg border cursor-pointer hover:bg-accent ${
                        sessionType === type.type ? "border-primary" : ""
                      }`}
                      onClick={() => setSessionType(type.type)}
                    >
                      <h3 className="font-medium mb-1">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {type.durations.map((duration) => (
                          <span
                            key={duration}
                            className="text-sm px-2 py-1 rounded-full bg-accent"
                          >
                            {duration} min - {type.pricing[duration]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Calendar and Time Selection */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Next available: {mentor.availability.nextAvailable}</span>
                    <span>Timezone: {mentor.timezone}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendar will be integrated here */}
                    <div className="aspect-square bg-accent rounded-lg flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-muted-foreground" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Available Time Slots</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {mentor.availability.timeSlots[0].times.map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            className={selectedTime === time ? "border-primary" : ""}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Session Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Session Details</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Session Topic</Label>
                    <Input placeholder="e.g., Business Strategy Review" />
                  </div>

                  <div className="space-y-4">
                    <Label>Session Goals</Label>
                    <textarea
                      className="w-full h-32 p-2 rounded-md border resize-none"
                      placeholder="What would you like to achieve in this session?"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Additional Notes</Label>
                    <textarea
                      className="w-full h-24 p-2 rounded-md border resize-none"
                      placeholder="Any specific topics or questions you'd like to discuss?"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Session Summary */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Session Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Session Type</span>
                    <span className="font-medium">1:1 Mentorship</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Duration</span>
                    <span className="font-medium">60 minutes</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Price</span>
                    <span className="font-medium">$50</span>
                  </div>
                  <Button className="w-full">
                    Confirm & Pay
                  </Button>
                </div>
              </Card>

              {/* Preparation Checklist */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Session Preparation</h3>
                <div className="space-y-4">
                  {preparationChecklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                    >
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm">{item.item}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Your Upcoming Sessions</h3>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{session.topic}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {session.type}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>with {session.mentor}</p>
                        <p>{session.date.toLocaleString()}</p>
                      </div>
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
                      Scheduling support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/scheduling">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Scheduling Guide
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