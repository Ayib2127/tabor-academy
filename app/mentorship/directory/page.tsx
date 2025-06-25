"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Users,
  Star,
  Globe,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  Award,
  Briefcase,
  Languages,
  BookOpen,
  TrendingUp,
  HelpCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MentorDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  // Mock mentor data
  const mentors = {
    featured: [
      {
        id: "mentor-001",
        name: "Dr. Grace Mensah",
        title: "Digital Marketing Expert",
        expertise: ["Digital Marketing", "E-commerce", "Brand Strategy"],
        rating: 4.9,
        reviews: 124,
        hourlyRate: "$50",
        availability: "Available",
        location: "Accra, Ghana",
        languages: ["English", "Twi"],
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        verified: true,
        experience: "10+ years",
        successRate: 98,
        totalMentees: 250
      },
      {
        id: "mentor-002",
        name: "John Okafor",
        title: "Tech Entrepreneur",
        expertise: ["Startups", "Tech Innovation", "Business Development"],
        rating: 4.8,
        reviews: 98,
        hourlyRate: "$45",
        availability: "Next Week",
        location: "Lagos, Nigeria",
        languages: ["English", "Yoruba"],
        avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57",
        verified: true,
        experience: "8 years",
        successRate: 95,
        totalMentees: 180
      }
    ],
    categories: [
      { name: "Digital Marketing", count: 45 },
      { name: "Business Development", count: 38 },
      { name: "Technology", count: 52 },
      { name: "Finance", count: 29 },
      { name: "Creative Arts", count: 23 }
    ],
    filters: {
      expertise: [
        "Digital Marketing",
        "E-commerce",
        "Tech Development",
        "Business Strategy",
        "Financial Planning"
      ],
      experience: ["1-3 years", "3-5 years", "5-10 years", "10+ years"],
      availability: ["Available Now", "This Week", "Next Week"],
      language: ["English", "French", "Swahili", "Arabic"],
      priceRange: ["Free", "$20-50", "$50-100", "$100+"]
    },
    stats: {
      totalMentors: 185,
      activeMentors: 120,
      totalHours: 12500,
      averageRating: 4.8
    }
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
            <span>Find a Mentor</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Find Your Perfect Mentor
              </h1>
              <p className="text-muted-foreground">
                Connect with experienced mentors who can guide you on your entrepreneurial journey
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {mentors.stats.activeMentors}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Mentors</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {mentors.stats.totalHours.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Hours Mentored</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by expertise, industry, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Mentors</TabsTrigger>
              <TabsTrigger value="available">Available Now</TabsTrigger>
              <TabsTrigger value="rated">Highly Rated</TabsTrigger>
              <TabsTrigger value="african">African Experts</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <Card className="p-6 h-fit">
              <h2 className="font-semibold mb-4">Refine Search</h2>
              <div className="space-y-6">
                {Object.entries(mentors.filters).map(([category, options]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="space-y-1">
                      {options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-sm hover:text-primary"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Featured Mentors */}
              <div className="grid md:grid-cols-2 gap-6">
                {mentors.featured.map((mentor) => (
                  <Card key={mentor.id} className="p-6">
                    <div className="flex gap-4">
                      <div className="relative">
                        <Image
                          src={mentor.avatar}
                          alt={mentor.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                          mentor.availability === "Available" ? "bg-green-500" : "bg-yellow-500"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{mentor.name}</h3>
                          {mentor.verified && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {mentor.title}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise.map((exp) => (
                            <span
                              key={exp}
                              className="text-xs px-2 py-1 rounded-full bg-accent"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span>{mentor.rating}</span>
                            <span className="text-muted-foreground ml-1">
                              ({mentor.reviews})
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            <span>{mentor.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="text-sm">
                        <p className="font-medium">{mentor.hourlyRate}/hour</p>
                        <p className="text-muted-foreground">{mentor.availability}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mentors.categories.map((category) => (
                  <Card
                    key={category.name}
                    className="p-4 hover:bg-accent cursor-pointer"
                  >
                    <h3 className="font-medium mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} mentors
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Become a Mentor CTA */}
          <Card className="mt-8 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Share Your Expertise</h2>
                <p className="text-muted-foreground">
                  Join our community of mentors and help shape the next generation of African entrepreneurs
                </p>
              </div>
              <Button size="lg" className="min-w-[200px]">
                Become a Mentor
              </Button>
            </div>
          </Card>

          {/* Help Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Finding the right mentor
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/mentorship">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Mentorship Guide
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/matching">
                    <Users className="mr-2 h-4 w-4" />
                    Matching Process
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
      </main>
    </div>
  )
}