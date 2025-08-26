"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  BookOpen,
  Settings,
  Shield,
  Users,
  CreditCard,
  Smartphone,
  GraduationCap,
  ChevronRight,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Play,
  MessageSquare,
  HelpCircle,
  FileText,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from 'next/image';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const popularTopics = [
    {
      title: "Getting Started Guide",
      icon: BookOpen,
      href: "/support/getting-started"
    },
    {
      title: "Account & Security",
      icon: Shield,
      href: "/support/account-security"
    },
    {
      title: "Billing & Payments",
      icon: CreditCard,
      href: "/support/billing"
    },
    {
      title: "Mobile Learning",
      icon: Smartphone,
      href: "/support/mobile"
    }
  ]

  const helpCategories = {
    gettingStarted: [
      "Platform overview and navigation",
      "Account creation and verification",
      "Setting up your learning profile",
      "Understanding the dashboard",
      "First course enrollment guide"
    ],
    accountManagement: [
      "Password reset and security",
      "Profile customization",
      "Email preferences",
      "Privacy settings",
      "Two-factor authentication"
    ],
    coursesLearning: [
      "Course enrollment process",
      "Accessing course materials",
      "Assignment submission",
      "Progress tracking",
      "Certificate generation"
    ],
    technical: [
      "System requirements",
      "Browser compatibility",
      "Mobile app setup",
      "Video playback issues",
      "Download troubleshooting"
    ]
  }

  const videoTutorials = [
    {
      title: "Platform Walkthrough",
      duration: "5:30",
      views: "1.2K",
      thumbnail: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b"
    },
    {
      title: "Course Navigation Guide",
      duration: "4:15",
      views: "956",
      thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
    },
    {
      title: "Mobile App Tutorial",
      duration: "3:45",
      views: "789",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/support" className="hover:text-foreground">Support</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Help Center</span>
          </div>

          {/* Search Section */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
              How can we help you?
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Topics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {popularTopics.map((topic) => (
              <Card
                key={topic.title}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => window.location.href = topic.href}
              >
                <div className="flex flex-col items-center text-center">
                  <topic.icon className="h-8 w-8 mb-4 text-primary" />
                  <h3 className="font-semibold">{topic.title}</h3>
                </div>
              </Card>
            ))}
          </div>

          {/* Help Categories */}
          <div className="mb-12">
            <Tabs defaultValue="gettingStarted" className="space-y-8">
              <TabsList>
                <TabsTrigger value="gettingStarted">Getting Started</TabsTrigger>
                <TabsTrigger value="accountManagement">Account</TabsTrigger>
                <TabsTrigger value="coursesLearning">Courses</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>

              <TabsContent value="gettingStarted">
                <Card className="p-6">
                  <div className="grid gap-4">
                    {helpCategories.gettingStarted.map((article, index) => (
                      <Link
                        key={index}
                        href={`/support/article/${article.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{article}</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="accountManagement">
                <Card className="p-6">
                  <div className="grid gap-4">
                    {helpCategories.accountManagement.map((article, index) => (
                      <Link
                        key={index}
                        href={`/support/article/${article.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{article}</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="coursesLearning">
                <Card className="p-6">
                  <div className="grid gap-4">
                    {helpCategories.coursesLearning.map((article, index) => (
                      <Link
                        key={index}
                        href={`/support/article/${article.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{article}</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="technical">
                <Card className="p-6">
                  <div className="grid gap-4">
                    {helpCategories.technical.map((article, index) => (
                      <Link
                        key={index}
                        href={`/support/article/${article.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{article}</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Video Tutorials */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Video Tutorials</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {video.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {video.views} views
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Help */}
          <div className="mb-12">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 rounded-full p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Community Support</h2>
                  <p className="text-muted-foreground">
                    Get help from our community of learners and experts
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1" asChild>
                  <Link href="/community/forum">Visit Forum</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/community/ask">Ask a Question</Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Still Need Help */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Still Need Help?</h2>
                <p className="text-muted-foreground">
                  Contact our support team for personalized assistance
                </p>
              </div>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}