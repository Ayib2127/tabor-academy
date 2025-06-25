"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  Wifi,
  WifiOff,
  Download,
  RefreshCcw,
  HardDrive,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Trash2,
  ArrowRight,
  Signal,
  Gauge,
  FileText,
  BarChart,
  Smartphone,
  HelpCircle
} from "lucide-react"
import Link from "next/link"

export default function OfflineSyncPage() {
  const [syncStatus, setSyncStatus] = useState("synced") // synced, syncing, error
  const [lastSync, setLastSync] = useState(new Date())
  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  // Mock data
  const offlineContent = {
    totalSize: "1.2 GB",
    availableSpace: "5.8 GB",
    courses: [
      {
        id: "course-1",
        title: "Digital Marketing Fundamentals",
        size: "250 MB",
        progress: 75,
        lastSync: new Date(2024, 2, 15),
        status: "synced"
      },
      {
        id: "course-2",
        title: "E-commerce Strategy",
        size: "180 MB",
        progress: 45,
        lastSync: new Date(2024, 2, 14),
        status: "pending"
      },
      {
        id: "course-3",
        title: "Social Media Marketing",
        size: "320 MB",
        progress: 100,
        lastSync: new Date(2024, 2, 13),
        status: "synced"
      }
    ],
    syncHistory: [
      {
        date: new Date(2024, 2, 15, 14, 30),
        type: "Auto Sync",
        status: "success",
        details: "All content up to date"
      },
      {
        date: new Date(2024, 2, 15, 10, 15),
        type: "Manual Sync",
        status: "success",
        details: "Downloaded 3 new lessons"
      },
      {
        date: new Date(2024, 2, 14, 16, 45),
        type: "Auto Sync",
        status: "error",
        details: "Network error occurred"
      }
    ],
    networkStatus: {
      type: "4G",
      strength: 85,
      speed: "15 Mbps",
      dataUsed: "450 MB"
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncStatus("syncing")
    // Simulate sync process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSyncProgress(i)
    }
    setIsSyncing(false)
    setSyncStatus("synced")
    setLastSync(new Date())
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
            <span>Offline Sync</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Offline Learning & Sync Management
              </h1>
              <p className="text-muted-foreground">
                Manage your offline content and synchronization settings
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                {syncStatus === "synced" ? (
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                ) : syncStatus === "syncing" ? (
                  <div className="bg-yellow-100 rounded-full p-3">
                    <RefreshCcw className="h-6 w-6 text-yellow-600 animate-spin" />
                  </div>
                ) : (
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold">
                    {syncStatus === "synced" ? "All Content Synced" :
                     syncStatus === "syncing" ? "Syncing Content..." :
                     "Sync Required"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Last synced: {lastSync.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Content Download Management */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Course Downloads</h2>
                  <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                  >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing..." : "Sync Now"}
                  </Button>
                </div>
                <div className="space-y-6">
                  {offlineContent.courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Size: {course.size}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Download Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Last synced: {course.lastSync.toLocaleDateString()}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          course.status === "synced" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {course.status === "synced" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sync History */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Sync History</h2>
                <div className="space-y-4">
                  {offlineContent.syncHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        {entry.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{entry.type}</p>
                          <p className="text-sm text-muted-foreground">{entry.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{entry.date.toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.date.toLocaleTimeString()}
                        </p>
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
                      {offlineContent.totalSize} used of {offlineContent.availableSpace}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Progress
                    value={(parseInt(offlineContent.totalSize) / parseInt(offlineContent.availableSpace)) * 100}
                    className="h-2"
                  />
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/storage/manage">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Manage Storage
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Network Status */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Network Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-2">
                      <Signal className="h-4 w-4" />
                      <span>Connection Type</span>
                    </div>
                    <span className="font-medium">{offlineContent.networkStatus.type}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span>Speed</span>
                    </div>
                    <span className="font-medium">{offlineContent.networkStatus.speed}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Data Used</span>
                    </div>
                    <span className="font-medium">{offlineContent.networkStatus.dataUsed}</span>
                  </div>
                </div>
              </Card>

              {/* Sync Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sync Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure sync preferences
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/sync">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Auto-sync Schedule
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/network">
                      <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4" />
                        Network Preferences
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/content">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Content Preferences
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
                      Sync troubleshooting
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/sync">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Sync Issues Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/offline">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Offline Access Help
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/contact">
                      <BarChart className="mr-2 h-4 w-4" />
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