"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronRight,
  Download,
  MessageSquare,
  AlertCircle,
  Database,
  Signal,
  HardDrive,
  HelpCircle
} from "lucide-react"
import Link from "next/link"

export default function DataUsagePage() {
  const [dataSaverMode, setDataSaverMode] = useState(false)
  const [videoQuality, setVideoQuality] = useState("auto")

  // Mock data usage statistics
  const usageStats = {
    currentCycle: {
      total: 2.5, // GB
      limit: 5, // GB
      breakdown: {
        video: 1.2,
        downloads: 0.8,
        sync: 0.3,
        other: 0.2
      }
    },
    dailyUsage: [
      { date: "Mon", usage: 0.4 },
      { date: "Tue", usage: 0.6 },
      { date: "Wed", usage: 0.3 },
      { date: "Thu", usage: 0.5 },
      { date: "Fri", usage: 0.7 }
    ],
    connection: {
      type: "4G",
      speed: "15 Mbps",
      quality: "Good",
      carrier: "Safaricom"
    },
    alerts: {
      threshold: 80, // percentage
      dailyLimit: 500, // MB
      warnings: true
    }
  }

  const dataSavingOptions = {
    video: [
      { quality: "auto", label: "Auto (Recommended)", usage: "Varies" },
      { quality: "low", label: "Low (240p)", usage: "~100MB/hour" },
      { quality: "medium", label: "Medium (480p)", usage: "~250MB/hour" },
      { quality: "high", label: "High (720p)", usage: "~500MB/hour" }
    ],
    compression: {
      images: true,
      audio: true
    },
    offlineAccess: {
      autoDownload: false,
      scheduleTime: "02:00",
      expiryDays: 30
    }
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
            <span>Data Usage</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Data Usage & Bandwidth Control
              </h1>
              <p className="text-muted-foreground">
                Monitor and optimize your data consumption
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${
                  usageStats.currentCycle.total < usageStats.currentCycle.limit * 0.8
                    ? "bg-green-100"
                    : "bg-yellow-100"
                }`}>
                  <Database className={`h-6 w-6 ${
                    usageStats.currentCycle.total < usageStats.currentCycle.limit * 0.8
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`} />
                </div>
                <div>
                  <h2 className="font-semibold">Current Usage</h2>
                  <p className="text-sm text-muted-foreground">
                    {usageStats.currentCycle.total}GB of {usageStats.currentCycle.limit}GB
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Usage Overview */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Usage Overview</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Billing Cycle Progress</span>
                      <span className="text-sm font-medium">
                        {(usageStats.currentCycle.total / usageStats.currentCycle.limit * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(usageStats.currentCycle.total / usageStats.currentCycle.limit) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(usageStats.currentCycle.breakdown).map(([category, usage]) => (
                      <div key={category} className="p-4 rounded-lg bg-accent">
                        <div className="flex items-center justify-between mb-2">
                          <span className="capitalize">{category}</span>
                          <span>{usage}GB</span>
                        </div>
                        <Progress
                          value={(usage / usageStats.currentCycle.total) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Daily Usage Trend</h3>
                    <div className="flex items-end justify-between h-32">
                      {usageStats.dailyUsage.map((day) => (
                        <div key={day.date} className="flex flex-col items-center gap-2">
                          <div
                            className="w-8 bg-primary/20 rounded-t"
                            style={{ height: `${(day.usage / 1) * 100}%` }}
                          />
                          <span className="text-xs">{day.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Data Saving Controls */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Data Saving Controls</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <WifiOff className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Data Saver Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Reduce data usage across the app
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={dataSaverMode}
                      onChange={(e) => setDataSaverMode(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Video Quality Settings</h3>
                    <div className="space-y-2">
                      {dataSavingOptions.video.map((option) => (
                        <div
                          key={option.quality}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                        >
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-muted-foreground">
                              Data usage: {option.usage}
                            </p>
                          </div>
                          <input
                            type="radio"
                            name="videoQuality"
                            value={option.quality}
                            checked={videoQuality === option.quality}
                            onChange={(e) => setVideoQuality(e.target.value)}
                            className="rounded-full border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Content Compression</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                        <div>
                          <p className="font-medium">Image Compression</p>
                          <p className="text-sm text-muted-foreground">
                            Reduce image quality to save data
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={dataSavingOptions.compression.images}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                        <div>
                          <p className="font-medium">Audio Compression</p>
                          <p className="text-sm text-muted-foreground">
                            Reduce audio quality to save data
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={dataSavingOptions.compression.audio}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Network Status */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Signal className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Network Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Current connection details
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 rounded-lg bg-accent">
                    <span className="text-sm">Connection Type</span>
                    <span className="font-medium">{usageStats.connection.type}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-accent">
                    <span className="text-sm">Network Speed</span>
                    <span className="font-medium">{usageStats.connection.speed}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-accent">
                    <span className="text-sm">Carrier</span>
                    <span className="font-medium">{usageStats.connection.carrier}</span>
                  </div>
                </div>
              </Card>

              {/* Usage Alerts */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Usage Alerts</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Usage Warning Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={usageStats.alerts.threshold}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Usage Limit</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={usageStats.alerts.dailyLimit}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">MB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable Warnings</span>
                    <input
                      type="checkbox"
                      checked={usageStats.alerts.warnings}
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>
              </Card>

              {/* Offline Access */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HardDrive className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Offline Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Download scheduling
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Download Content</span>
                    <input
                      type="checkbox"
                      checked={dataSavingOptions.offlineAccess.autoDownload}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Download Schedule</Label>
                    <Input
                      type="time"
                      value={dataSavingOptions.offlineAccess.scheduleTime}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Expiry</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={dataSavingOptions.offlineAccess.expiryDays}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>
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
                      Data usage support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/data-usage">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Data Usage Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/saving-data">
                      <Download className="mr-2 h-4 w-4" />
                      Data Saving Tips
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