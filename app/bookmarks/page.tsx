"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  Search,
  Bookmark,
  FolderPlus,
  Edit,
  Trash2,
  Share2,
  FileText,
  Video,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  ArrowUpDown,
  Filter,
  MessageSquare,
  Download,
  Settings,
  HelpCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { withDefault, DEFAULT_BANNER_URL } from "@/lib/defaults";

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFolder, setActiveFolder] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Mock bookmarks data
  const bookmarks = {
    folders: [
      { id: "all", name: "All Bookmarks", count: 24 },
      { id: "courses", name: "Courses", count: 8 },
      { id: "lessons", name: "Lessons", count: 12 },
      { id: "resources", name: "Resources", count: 4 },
      { id: "custom-1", name: "Digital Marketing", count: 6, custom: true },
      { id: "custom-2", name: "Business Plans", count: 3, custom: true }
    ],
    items: [
      {
        id: "bm-001",
        type: "course",
        title: "Digital Marketing Fundamentals",
        description: "Complete guide to digital marketing strategies",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        progress: 45,
        lastAccessed: new Date(2024, 2, 15),
        notes: "Important concepts in Chapter 3 about SEO",
        folder: "courses"
      },
      {
        id: "bm-002",
        type: "lesson",
        title: "Social Media Strategy Planning",
        description: "Learn to create effective social media strategies",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
        duration: "45 minutes",
        completed: false,
        notes: "Review engagement metrics section",
        folder: "lessons"
      },
      {
        id: "bm-003",
        type: "resource",
        title: "Marketing Campaign Template",
        description: "Ready-to-use template for campaign planning",
        fileType: "PDF",
        size: "2.4 MB",
        downloads: 128,
        notes: "Useful for quarterly planning",
        folder: "resources"
      }
    ],
    notes: [
      {
        id: "note-001",
        content: "Key points about SEO optimization",
        timestamp: new Date(2024, 2, 15),
        associatedContent: "Digital Marketing Fundamentals",
        tags: ["seo", "marketing"]
      },
      {
        id: "note-002",
        content: "Important metrics for social media analytics",
        timestamp: new Date(2024, 2, 14),
        associatedContent: "Social Media Strategy Planning",
        tags: ["social-media", "analytics"]
      }
    ],
    studyPlan: {
      nextReview: new Date(2024, 2, 20),
      estimatedTime: "2.5 hours",
      priorityItems: [
        "SEO Fundamentals",
        "Content Marketing Strategy",
        "Analytics Dashboard"
      ]
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
            <span>Bookmarks & Notes</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                My Bookmarks & Notes
              </h1>
              <p className="text-muted-foreground">
                Organize and access your saved content
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button>
                <Bookmark className="h-4 w-4 mr-2" />
                Add Bookmark
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Folders Sidebar */}
            <Card className="p-6 lg:col-span-1 h-fit">
              <div className="space-y-4">
                {bookmarks.folders.map((folder) => (
                  <button
                    key={folder.id}
                    className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent ${
                      activeFolder === folder.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setActiveFolder(folder.id)}
                  >
                    <div className="flex items-center gap-2">
                      {folder.custom ? (
                        <FolderPlus className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm font-medium">{folder.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Bookmarked Items */}
              <div className="space-y-4">
                {bookmarks.items.map((item) => (
                  <Card key={item.id} className="p-4">
                    {item.type === "course" && (
                      <div className="flex gap-4">
                        <div className="w-48 h-32 relative rounded-lg overflow-hidden">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Course</span>
                          </div>
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Notes
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button variant="ghost" size="icon" className="ml-auto">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.type === "lesson" && (
                      <div className="flex gap-4">
                        <div className="w-48 h-32 relative rounded-lg overflow-hidden">
                          <Image
                            src={withDefault(item.thumbnail, DEFAULT_BANNER_URL)}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Lesson</span>
                          </div>
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{item.duration}</span>
                            </div>
                            <span className={`flex items-center ${
                              item.completed ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {item.completed ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <Clock className="h-4 w-4 mr-1" />
                              )}
                              {item.completed ? "Completed" : "In Progress"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Notes
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button variant="ghost" size="icon" className="ml-auto">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.type === "resource" && (
                      <div className="flex items-center gap-4">
                        <FileText className="h-12 w-12 text-primary" />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{item.fileType}</span>
                            <span>{item.size}</span>
                            <span>{item.downloads} downloads</span>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button variant="ghost" size="icon" className="ml-auto">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-xl font-semibold mb-6">Learning Notes</h2>
              <div className="space-y-4">
                {bookmarks.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-lg border hover:bg-accent"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {note.associatedContent}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {note.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mb-2">{note.content}</p>
                    <div className="flex items-center gap-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              {/* Study Plan */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Study Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your bookmarks
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Next Review</span>
                    <span className="text-sm font-medium">
                      {bookmarks.studyPlan.nextReview.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Estimated Time</span>
                    <span className="text-sm font-medium">
                      {bookmarks.studyPlan.estimatedTime}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Priority Items</h4>
                    {bookmarks.studyPlan.priorityItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                      >
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Bookmark preferences
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-sync notes</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reminder notifications</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings/bookmarks">
                      More Settings
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
                      Bookmark support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/bookmarks">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Bookmarks Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/notes">
                      <FileText className="mr-2 h-4 w-4" />
                      Notes Help
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