"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Book,
  Calendar,
  ChevronRight,
  Clock,
  Globe,
  Laptop,
  Layout,
  MessageSquare,
  Monitor,
  Moon,
  Save,
  Settings,
  Smartphone,
  Sun,
  Video,
  Volume2,
  Wifi
} from "lucide-react"
import Link from "next/link"

export default function LearningPreferencesPage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock preferences data
  const preferences = {
    learningStyle: {
      visual: 80,
      auditory: 60,
      reading: 70,
      kinesthetic: 50
    },
    contentPreferences: {
      videoContent: true,
      textTutorials: true,
      interactiveExercises: true,
      projectBased: true,
      groupDiscussions: false,
      oneOnOneMentoring: true
    },
    difficultyLevel: "standard",
    contentLength: "standard",
    language: {
      primary: "English",
      secondary: "Swahili",
      captionsEnabled: true,
      transcriptsEnabled: true
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reducedMotion: false
    },
    schedule: {
      preferredTime: "morning",
      weeklyGoal: 10,
      reminderFrequency: "daily",
      timezone: "Africa/Nairobi"
    },
    notifications: {
      studyReminders: true,
      progressUpdates: true,
      communityMessages: false,
      mentorshipAlerts: true
    },
    mobilePreferences: {
      autoDownload: true,
      wifiOnly: true,
      storageLimit: 2,
      videoQuality: "medium"
    }
  }

  const handlePreferencesUpdate = () => {
    setIsEditing(false)
    // Handle preferences update logic here
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
            <span>Learning Preferences</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Learning Preferences
              </h1>
              <p className="text-muted-foreground">
                Customize your learning experience to match your style and needs
              </p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Preferences
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="content" className="space-y-8">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="content"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="accessibility"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Accessibility
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Mobile
              </TabsTrigger>
            </TabsList>

            {/* Content Preferences Tab */}
            <TabsContent value="content">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Layout className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Learning Style</h2>
                      <p className="text-sm text-muted-foreground">
                        Your preferred ways of learning
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(preferences.learningStyle).map(([style, value]) => (
                      <div key={style} className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="capitalize">{style}</Label>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Book className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Content Type</h2>
                      <p className="text-sm text-muted-foreground">
                        Types of learning content you prefer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(preferences.contentPreferences).map(([type, enabled]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Show content of this type
                          </p>
                        </div>
                        <Button
                          variant={enabled ? "default" : "outline"}
                          size="sm"
                          disabled={!isEditing}
                        >
                          {enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Globe className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Language & Subtitles</h2>
                      <p className="text-sm text-muted-foreground">
                        Language and caption preferences
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryLanguage">Primary Language</Label>
                      <select
                        id="primaryLanguage"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.language.primary}
                        disabled={!isEditing}
                      >
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Swahili">Swahili</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryLanguage">Secondary Language</Label>
                      <select
                        id="secondaryLanguage"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.language.secondary}
                        disabled={!isEditing}
                      >
                        <option value="">None</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Swahili">Swahili</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Closed Captions</p>
                        <p className="text-sm text-muted-foreground">
                          Show subtitles in videos
                        </p>
                      </div>
                      <Button
                        variant={preferences.language.captionsEnabled ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.language.captionsEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 rounded-full p-2">
                      <Video className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Content Settings</h2>
                      <p className="text-sm text-muted-foreground">
                        Customize content delivery preferences
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Content Difficulty</Label>
                      <select
                        id="difficulty"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.difficultyLevel}
                        disabled={!isEditing}
                      >
                        <option value="beginner">Beginner-friendly</option>
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contentLength">Content Length</Label>
                      <select
                        id="contentLength"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.contentLength}
                        disabled={!isEditing}
                      >
                        <option value="micro">Micro (5-10 minutes)</option>
                        <option value="standard">Standard (15-30 minutes)</option>
                        <option value="extended">Extended (45+ minutes)</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Monitor className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Accessibility Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Customize your learning experience for better accessibility
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Contrast Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Button
                      variant={preferences.accessibility.highContrast ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {preferences.accessibility.highContrast ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Large Text</p>
                      <p className="text-sm text-muted-foreground">
                        Increase text size throughout the platform
                      </p>
                    </div>
                    <Button
                      variant={preferences.accessibility.largeText ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {preferences.accessibility.largeText ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Screen Reader Support</p>
                      <p className="text-sm text-muted-foreground">
                        Optimize content for screen readers
                      </p>
                    </div>
                    <Button
                      variant={preferences.accessibility.screenReader ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {preferences.accessibility.screenReader ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reduced Motion</p>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Button
                      variant={preferences.accessibility.reducedMotion ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {preferences.accessibility.reducedMotion ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Calendar className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Study Schedule</h2>
                      <p className="text-sm text-muted-foreground">
                        Set your preferred study times
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Study Time</Label>
                      <select
                        id="preferredTime"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.schedule.preferredTime}
                        disabled={!isEditing}
                      >
                        <option value="morning">Morning (6 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                        <option value="evening">Evening (6 PM - 12 AM)</option>
                        <option value="night">Late Night (12 AM - 6 AM)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weeklyGoal">Weekly Study Goal (hours)</Label>
                      <Input
                        id="weeklyGoal"
                        type="number"
                        min="1"
                        max="40"
                        defaultValue={preferences.schedule.weeklyGoal}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <select
                        id="timezone"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.schedule.timezone}
                        disabled={!isEditing}
                      >
                        <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
                        <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                        <option value="Africa/Cairo">Eastern European Time (Cairo)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Clock className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Reminders</h2>
                      <p className="text-sm text-muted-foreground">
                        Customize your study reminders
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                      <select
                        id="reminderFrequency"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.schedule.reminderFrequency}
                        disabled={!isEditing}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekdays">Weekdays Only</option>
                        <option value="weekly">Weekly</option>
                        <option value="none">No Reminders</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Study Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Daily study time notifications
                        </p>
                      </div>
                      <Button
                        variant={preferences.notifications.studyReminders ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.notifications.studyReminders ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Progress Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly progress summaries
                        </p>
                      </div>
                      <Button
                        variant={preferences.notifications.progressUpdates ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.notifications.progressUpdates ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Mobile Tab */}
            <TabsContent value="mobile">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Smartphone className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Mobile Settings</h2>
                      <p className="text-sm text-muted-foreground">
                        Configure your mobile learning experience
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Download Content</p>
                        <p className="text-sm text-muted-foreground">
                          Download next lessons automatically
                        </p>
                      </div>
                      <Button
                        variant={preferences.mobilePreferences.autoDownload ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.mobilePreferences.autoDownload ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">WiFi Only Downloads</p>
                        <p className="text-sm text-muted-foreground">
                          Download content only on WiFi
                        </p>
                      </div>
                      <Button
                        variant={preferences.mobilePreferences.wifiOnly ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.mobilePreferences.wifiOnly ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storageLimit">Storage Limit (GB)</Label>
                      <Input
                        id="storageLimit"
                        type="number"
                        min="1"
                        max="10"
                        defaultValue={preferences.mobilePreferences.storageLimit}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoQuality">Video Quality</Label>
                      <select
                        id="videoQuality"
                        className="w-full p-2 border rounded-md"
                        defaultValue={preferences.mobilePreferences.videoQuality}
                        disabled={!isEditing}
                      >
                        <option value="low">Low (Data Saver)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="high">High (Best Quality)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <MessageSquare className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Mobile Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your mobile notifications
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Community Messages</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications for community activity
                        </p>
                      </div>
                      <Button
                        variant={preferences.notifications.communityMessages ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.notifications.communityMessages ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mentorship Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications for mentorship activities
                        </p>
                      </div>
                      <Button
                        variant={preferences.notifications.mentorshipAlerts ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {preferences.notifications.mentorshipAlerts ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}