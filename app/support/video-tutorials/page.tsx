"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Play,
  ChevronRight,
  Clock,
  Users,
  BookOpen,
  Settings,
  Smartphone,
  CreditCard,
  GraduationCap,
  CheckCircle,
  Volume2,
  Subtitles,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VideoTutorialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock tutorial data
  const tutorials = {
    gettingStarted: [
      {
        id: "gs1",
        title: "Platform Overview",
        duration: "5:30",
        views: "1.2K",
        thumbnail: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b",
        description: "Complete walkthrough of the Tabor Academy platform",
        instructor: "Sarah Mwangi",
        level: "Beginner"
      },
      {
        id: "gs2",
        title: "Account Setup Guide",
        duration: "4:15",
        views: "956",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
        description: "Learn how to set up and customize your learning account",
        instructor: "John Okafor",
        level: "Beginner"
      },
      {
        id: "gs3",
        title: "Navigation Basics",
        duration: "3:45",
        views: "789",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        description: "Master the basic navigation and interface elements",
        instructor: "Grace Mensah",
        level: "Beginner"
      }
    ],
    courseLearning: [
      {
        id: "cl1",
        title: "Course Enrollment Process",
        duration: "6:20",
        views: "2.1K",
        thumbnail: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
        description: "Step-by-step guide to enrolling in courses",
        instructor: "Sarah Mwangi",
        level: "Beginner"
      },
      {
        id: "cl2",
        title: "Assignment Submission",
        duration: "8:45",
        views: "1.5K",
        thumbnail: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b",
        description: "Learn how to submit assignments and get feedback",
        instructor: "John Okafor",
        level: "Intermediate"
      },
      {
        id: "cl3",
        title: "Progress Tracking",
        duration: "5:15",
        views: "987",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        description: "Understanding your learning progress and analytics",
        instructor: "Grace Mensah",
        level: "Intermediate"
      }
    ],
    technical: [
      {
        id: "tech1",
        title: "Mobile App Setup",
        duration: "7:30",
        views: "3.2K",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
        description: "Installing and configuring the mobile app",
        instructor: "Sarah Mwangi",
        level: "Beginner"
      },
      {
        id: "tech2",
        title: "Offline Learning Mode",
        duration: "6:45",
        views: "1.8K",
        thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b",
        description: "Setting up and using offline learning features",
        instructor: "John Okafor",
        level: "Intermediate"
      },
      {
        id: "tech3",
        title: "Troubleshooting Guide",
        duration: "9:15",
        views: "2.5K",
        thumbnail: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae",
        description: "Common issues and how to resolve them",
        instructor: "Grace Mensah",
        level: "Advanced"
      }
    ]
  }

  const handleVideoPlay = (videoId: string) => {
    setCurrentVideo(videoId)
    setIsPlaying(true)
  }

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
            <span>Video Tutorials</span>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
              Video Tutorials
            </h1>
            <p className="text-muted-foreground mb-6">
              Learn how to make the most of our platform with these helpful video guides
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Featured Tutorial */}
          {currentVideo && (
            <Card className="mb-8 overflow-hidden">
              <div className="aspect-video relative bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-16 w-16 text-white" />
                </div>
                <img
                  src={tutorials.gettingStarted[0].thumbnail}
                  alt="Tutorial thumbnail"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Platform Overview</h2>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Subtitles className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    5:30
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    1.2K views
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Beginner
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Complete walkthrough of the Tabor Academy platform, including navigation,
                  key features, and getting started tips.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful (245)
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Not Helpful (12)
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tutorial Categories */}
          <Tabs defaultValue="gettingStarted" className="space-y-8">
            <TabsList>
              <TabsTrigger value="gettingStarted">Getting Started</TabsTrigger>
              <TabsTrigger value="courseLearning">Course Learning</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            {Object.entries(tutorials).map(([category, videos]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card
                      key={video.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleVideoPlay(video.id)}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {video.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {video.level}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Tutorial Series */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Complete Tutorial Series</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Beginner's Guide",
                  videos: 8,
                  duration: "45 mins",
                  progress: 75,
                  thumbnail: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b"
                },
                {
                  title: "Advanced Features",
                  videos: 12,
                  duration: "1.5 hours",
                  progress: 30,
                  thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
                }
              ].map((series, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={series.thumbnail}
                      alt={series.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold mb-1">{series.title}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          {series.videos} videos
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {series.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{series.progress}%</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${series.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <Card className="mt-12 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Need Additional Help?</h2>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>
              <Button asChild>
                <Link href="/support/contact">Contact Support</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}