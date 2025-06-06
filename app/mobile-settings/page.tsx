"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronRight,
  Settings,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Battery,
  Lock,
  Eye,
  Mic,
  Camera,
  Clock,
  PlayCircle,
  Volume2,
  Languages,
  HardDrive,
  Cloud,
  Code,
  MessageSquare,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function MobileSettingsPage() {
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState(16)
  const [performanceMode, setPerformanceMode] = useState("balanced")
  const [biometricEnabled, setBiometricEnabled] = useState(true)

  // Mock settings data
  const settings = {
    display: {
      themes: ["light", "dark", "auto"],
      fontSizes: [14, 16, 18, 20],
      orientation: "auto",
      timeout: 30, // seconds
      colorScheme: "default"
    },
    performance: {
      modes: [
        { id: "battery", label: "Battery Saver", description: "Maximize battery life" },
        { id: "balanced", label: "Balanced", description: "Recommended for most users" },
        { id: "performance", label: "Performance", description: "Best app experience" }
      ],
      backgroundRefresh: true,
      cacheSize: "256MB",
      memoryUsage: "120MB"
    },
    security: {
      biometric: true,
      pinEnabled: true,
      locationServices: "while-using",
      dataSharingAnalytics: false
    },
    learning: {
      sessionDuration: 30, // minutes
      autoPlay: true,
      defaultSpeed: 1,
      subtitlesEnabled: true,
      narrationEnabled: true
    },
    accessibility: {
      screenReader: false,
      voiceControl: false,
      gestureNav: true,
      colorBlindMode: false,
      reducedMotion: false
    },
    language: {
      primary: "English",
      secondary: ["French", "Swahili"],
      region: "East Africa",
      dateFormat: "DD/MM/YYYY"
    },
    storage: {
      used: 1.2, // GB
      total: 4, // GB
      autoClean: true,
      cloudBackup: true
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
            <span>Mobile Settings</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Mobile App Settings
              </h1>
              <p className="text-muted-foreground">
                Customize your mobile learning experience
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">App Version</h2>
                  <p className="text-sm text-muted-foreground">v2.1.0 (Latest)</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Display Settings */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Display & Interface</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {settings.display.themes.map((t) => (
                        <button
                          key={t}
                          className={`p-4 rounded-lg border ${
                            theme === t ? "border-primary" : "border-border"
                          } hover:bg-accent`}
                          onClick={() => setTheme(t)}
                        >
                          {t === "light" && <Sun className="h-5 w-5 mx-auto mb-2" />}
                          {t === "dark" && <Moon className="h-5 w-5 mx-auto mb-2" />}
                          {t === "auto" && <Monitor className="h-5 w-5 mx-auto mb-2" />}
                          <span className="text-sm capitalize">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Font Size</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="range"
                        min={14}
                        max={20}
                        step={2}
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">{fontSize}px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Screen Timeout</Label>
                      <select
                        className="rounded-md border-input bg-background px-3 py-1 text-sm"
                        value={settings.display.timeout}
                      >
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={300}>5 minutes</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Screen Orientation</Label>
                      <select
                        className="rounded-md border-input bg-background px-3 py-1 text-sm"
                        value={settings.display.orientation}
                      >
                        <option value="auto">Auto-rotate</option>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Performance Settings */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Performance</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Performance Mode</Label>
                    <div className="space-y-2">
                      {settings.performance.modes.map((mode) => (
                        <div
                          key={mode.id}
                          className={`p-4 rounded-lg border ${
                            performanceMode === mode.id ? "border-primary" : "border-border"
                          } hover:bg-accent cursor-pointer`}
                          onClick={() => setPerformanceMode(mode.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{mode.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {mode.description}
                              </p>
                            </div>
                            <input
                              type="radio"
                              checked={performanceMode === mode.id}
                              onChange={() => setPerformanceMode(mode.id)}
                              className="rounded-full border-gray-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Background App Refresh</p>
                        <p className="text-sm text-muted-foreground">
                          Keep content up to date
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.performance.backgroundRefresh}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cache Size</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.performance.cacheSize} used
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear Cache
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Learning Preferences */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Learning Preferences</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Default Session Duration</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="range"
                        min={15}
                        max={60}
                        step={15}
                        value={settings.learning.sessionDuration}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-16">
                        {settings.learning.sessionDuration} mins
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-play Next Lesson</p>
                        <p className="text-sm text-muted-foreground">
                          Continue learning automatically
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.learning.autoPlay}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Default Playback Speed</p>
                        <p className="text-sm text-muted-foreground">
                          Video and audio content
                        </p>
                      </div>
                      <select
                        className="rounded-md border-input bg-background px-3 py-1 text-sm"
                        value={settings.learning.defaultSpeed}
                      >
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
              {/* Security Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Privacy and access
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Biometric Authentication</span>
                    <input
                      type="checkbox"
                      checked={biometricEnabled}
                      onChange={(e) => setBiometricEnabled(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PIN Lock</span>
                    <input
                      type="checkbox"
                      checked={settings.security.pinEnabled}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings/security">
                      Manage Security Settings
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Accessibility Settings */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Accessibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Screen Reader</span>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.screenReader}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Control</span>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.voiceControl}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reduced Motion</span>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.reducedMotion}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings/accessibility">
                      More Accessibility Options
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Storage Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HardDrive className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      {settings.storage.used}GB of {settings.storage.total}GB used
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Progress
                    value={(settings.storage.used / settings.storage.total) * 100}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Clean Cache</span>
                    <input
                      type="checkbox"
                      checked={settings.storage.autoClean}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cloud Backup</span>
                    <input
                      type="checkbox"
                      checked={settings.storage.cloudBackup}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Storage
                  </Button>
                </div>
              </Card>

              {/* Advanced Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Advanced</h3>
                    <p className="text-sm text-muted-foreground">
                      Developer options
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/developer">
                      <div className="flex items-center">
                        <Code className="mr-2 h-4 w-4" />
                        Developer Options
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/backup">
                      <div className="flex items-center">
                        <Cloud className="mr-2 h-4 w-4" />
                        Backup & Restore
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/settings/reset">
                      <div className="flex items-center">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset App
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
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Settings support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/settings">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Settings Guide
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