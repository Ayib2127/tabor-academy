"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Users,
  Calendar,
  Clock,
  Globe,
  BookOpen,
  MessageSquare,
  Video,
  PlusCircle,
  Filter,
  ChevronRight,
  Star,
  Share2,
  BarChart3,
  ShoppingCart,
  Code,
  Coins,
  Laptop,
  Target,
  CheckCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock study groups data
const studyGroups = {
  featured: [
    {
      id: 1,
      name: "Digital Marketing Masters",
      description: "Weekly discussions on digital marketing strategies for Ethiopian markets",
      category: "Digital Marketing",
      members: 12,
      maxMembers: 15,
      schedule: "Tuesdays & Thursdays, 7PM EAT",
      language: "English",
      level: "Intermediate",
      progress: 65,
      nextSession: "2024-03-05T19:00:00",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      leader: {
        name: "Sarah Kimani",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    },
    {
      id: 2,
      name: "E-commerce Entrepreneurs",
      description: "Building and scaling online businesses in Ethiopia",
      category: "E-commerce",
      members: 8,
      maxMembers: 10,
      schedule: "Mondays & Wednesdays, 6PM WAT",
      language: "English & French",
      level: "Advanced",
      progress: 45,
      nextSession: "2024-03-04T18:00:00",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      leader: {
        name: "John Okafor",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      }
    }
  ],
  categories: [
    {
      id: "digital-marketing",
      icon: BarChart3,
      name: "Digital Marketing",
      groups: 15
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      name: "E-commerce",
      groups: 12
    },
    {
      id: "no-code",
      icon: Code,
      name: "No-Code Development",
      groups: 8
    },
    {
      id: "finance",
      icon: Coins,
      name: "Financial Literacy",
      groups: 10
    },
    {
      id: "tech",
      icon: Laptop,
      name: "Technical Skills",
      groups: 14
    }
  ],
  activeGroups: [
    {
      id: 3,
      name: "No-Code App Builders",
      description: "Learn to build apps without coding using modern tools",
      category: "No-Code Development",
      members: 10,
      maxMembers: 12,
      schedule: "Weekends, 3PM CAT",
      language: "English",
      level: "Beginner",
      progress: 30,
      nextSession: "2024-03-09T15:00:00",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      leader: {
        name: "Grace Mensah",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    },
    {
      id: 4,
      name: "Mobile Money Integration",
      description: "Implementing payment solutions for Ethiopian markets",
      category: "Finance",
      members: 15,
      maxMembers: 15,
      schedule: "Fridays, 5PM EAT",
      language: "English & Swahili",
      level: "Intermediate",
      progress: 75,
      nextSession: "2024-03-08T17:00:00",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      leader: {
        name: "David Kamau",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      }
    }
  ],
  upcomingSessions: [
    {
      id: 1,
      groupName: "Digital Marketing Masters",
      topic: "Social Media Strategy Workshop",
      date: "2024-03-05T19:00:00",
      duration: "90 minutes",
      participants: 12
    },
    {
      id: 2,
      groupName: "E-commerce Entrepreneurs",
      topic: "Product Photography Basics",
      date: "2024-03-04T18:00:00",
      duration: "60 minutes",
      participants: 8
    }
  ]
}

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Study Groups
              </h1>
              <p className="text-muted-foreground">
                Join a group of motivated learners and accelerate your growth
              </p>
            </div>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Study Group
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search study groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select className="p-2 border rounded-md">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className="p-2 border rounded-md">
              <option value="all">All Languages</option>
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="swahili">Swahili</option>
            </select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Featured Groups */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Groups</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {studyGroups.featured.map((group) => (
                <Card key={group.id} className="overflow-hidden card-hover gradient-border">
                  <div className="relative h-48">
                    <Image
                      src={group.image}
                      alt={group.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white mb-1">{group.name}</h3>
                      <p className="text-white/80 text-sm">{group.description}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={group.leader.image}
                        alt={group.leader.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{group.leader.name}</p>
                        <p className="text-sm text-muted-foreground">Group Leader</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="font-medium">{group.members}/{group.maxMembers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Level</p>
                        <p className="font-medium">{group.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Schedule</p>
                        <p className="font-medium">{group.schedule}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <p className="font-medium">{group.language}</p>
                      </div>
                    </div>
                    <Progress value={group.progress} className="mb-4" />
                    <div className="flex gap-2">
                      <Button className="flex-1">Join Group</Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {studyGroups.categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selectedCategory === category.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.groups} groups</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Active Groups */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Active Groups</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {studyGroups.activeGroups.map((group) => (
                <Card key={group.id} className="p-6 card-hover gradient-border">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={group.image}
                        alt={group.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{group.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members}/{group.maxMembers}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{group.level}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>{group.language}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Upcoming Sessions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {studyGroups.upcomingSessions.map((session) => (
                <Card key={session.id} className="p-6 card-hover gradient-border">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent rounded-full p-3">
                      <Video className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.topic}</h3>
                      <p className="text-sm text-muted-foreground">{session.groupName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{session.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-medium">{session.participants}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Join Session</Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-to-r from-orange-50 to-teal-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Start Your Own Study Group</h2>
              <p className="text-muted-foreground mb-6">
                Create a study group, set your schedule, and connect with learners who share your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500">
                  Create a Group
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}