"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  Download,
  HardDrive,
  Wifi,
  WifiOff,
  Pause,
  Play,
  RefreshCcw,
  Filter,
  Clock,
  FileText,
  Video,
  BookOpen,
  Settings,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
  ArrowUpDown,
  Calendar,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OfflineContentPage() {
  const [downloadProgress, setDownloadProgress] = useState(45)
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const offlineContent = {
    storage: {
      used: 2.5, // GB
      total: 16, // GB
      breakdown: {
        videos: 1.8,
        documents: 0.5,
        interactive: 0.2
      }
    },
    downloads: {
      active: [
        {
          id: "dl-001",
          title: "Digital Marketing Fundamentals",
          type: "Course",
          size: "450 MB",
          progress: 65,
          timeLeft: "10 minutes"
        },
        {
          id: "dl-002",
          title: "Social Media Strategy",
          type: "Module",
          size: "280 MB",
          progress: 30,
          timeLeft: "15 minutes"
        }
      ],
      completed: [
        {
          id: "dl-003",
          title: "Business Plan Templates",
          type: "Resource",
          size: "25 MB",
          downloadDate: new Date(2024, 2, 15)
        }
      ]
    },
    available: [
      {
        id: "content-001",
        title: "E-commerce Fundamentals",
        type: "Course",
        thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c",
        size: "1.2 GB",
        duration: "6 hours",
        expiry: "30 days"
      },
      {
        id: "content-002",
        title: "Marketing Analytics",
        type: "Module",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        size: "800 MB",
        duration: "4 hours",
        expiry: "30 days"
      }
    ],
    library: [
      {
        id: "lib-001",
        title: "Introduction to Digital Marketing",
        type: "Course",
        size: "750 MB",
        lastAccessed: new Date(2024, 2, 14),
        expiryDate: new Date(2024, 3, 14)
      },
      {
        id: "lib-002",
        title: "Content Creation Workshop",
        type: "Workshop",
        size: "350 MB",
        lastAccessed: new Date(2024, 2, 13),
        expiryDate: new Date(2024, 3, 13)
      }
    ]
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
            <span>Offline Content</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Offline Learning Hub
              </h1>
              <p className="text-muted-foreground">
                Manage your downloaded content and offline learning materials
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <HardDrive className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Storage Used</h2>
                  <p className="text-sm text-muted-foreground">
                    {offlineContent.storage.used}GB of {offlineContent.storage.total}GB
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Downloads */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Current Downloads</h2>
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause All
                  </Button>
                </div>
                <div className="space-y-4">
                  {offlineContent.downloads.active.map((download) => (
                    <div
                      key={download.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{download.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {download.type} • {download.size}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Pause className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{download.progress}%</span>
                          <span>{download.timeLeft} remaining</span>
                        </div>
                        <Progress value={download.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Available Content */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Available for Download</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {offlineContent.available.map((content) => (
                    <div
                      key={content.id}
                      className="rounded-lg border overflow-hidden hover:bg-accent"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={content.thumbnail}
                          alt={content.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{content.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {content.type} • {content.size} • {content.duration}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Available offline for {content.expiry}
                          </span>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Downloaded Library */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Your Offline Library</h2>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search downloads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {offlineContent.library.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        {item.type === "Course" ? (
                          <BookOpen className="h-8 w-8 text-primary" />
                        ) : (
                          <Video className="h-8 w-8 text-primary" />
                        )}
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.type} • {item.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Storage Management */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HardDrive className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      {((offlineContent.storage.used / offlineContent.storage.total) * 100).toFixed(0)}% used
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Progress
                    value={(offlineContent.storage.used / offlineContent.storage.total) * 100}
                    className="h-2"
                  />
                  <div className="space-y-2">
                    {Object.entries(offlineContent.storage.breakdown).map(([type, size]) => (
                      <div
                        key={type}
                        className="flex justify-between p-2 rounded-lg hover:bg-accent"
                      >
                        <span className="capitalize">{type}</span>
                        <span>{size} GB</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Storage
                  </Button>
                </div>
              </Card>

              {/* Download Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Download Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage preferences
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Download over WiFi only</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-delete after 30 days</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Background downloads</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings/downloads">
                      More Settings
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Sync Status */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <RefreshCcw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sync Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Last synced: 5 minutes ago
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Progress Sync</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm">Notes Sync</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Sync Now
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
                      Offline learning support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/offline">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Offline Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/downloads">
                      <Download className="mr-2 h-4 w-4" />
                      Download FAQ
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