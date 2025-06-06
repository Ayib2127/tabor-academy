"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  Download,
  Eye,
  Globe,
  Lock,
  Save,
  Settings,
  Shield,
  UserCircle,
  Users,
  MessageSquare,
  Database,
  Cookie,
  FileText,
  AlertTriangle,
  HelpCircle,
  Mail
} from "lucide-react"
import Link from "next/link"

export default function PrivacyControlsPage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock privacy settings data
  const privacySettings = {
    profileVisibility: {
      profile: "public",
      progress: true,
      achievements: true,
      certificates: true,
      activityFeed: true,
      directoryListing: true,
      mentorshipAvailability: true
    },
    contactPreferences: {
      allowMessages: "connections",
      showEmail: false,
      showPhone: false,
      showSocial: true
    },
    dataSharing: {
      analytics: true,
      learningInsights: true,
      marketingCommunications: false,
      successStories: true,
      thirdPartyIntegrations: false
    },
    learningData: {
      progressTracking: true,
      performanceAnalytics: true,
      contentInteraction: true,
      mentorshipRecording: false
    },
    communicationPrivacy: {
      discussionVisibility: "public",
      messageEncryption: true,
      groupParticipation: true
    },
    cookiePreferences: {
      essential: true,
      analytics: true,
      marketing: false,
      personalization: true
    }
  }

  const handlePrivacyUpdate = () => {
    setIsEditing(false)
    // Handle privacy settings update logic here
  }

  const handleDataExport = () => {
    // Handle data export logic here
  }

  const handleDataDeletion = () => {
    // Handle data deletion logic here
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
            <span>Privacy Controls</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Privacy & Data Controls
              </h1>
              <p className="text-muted-foreground">
                Manage your privacy settings and control your data
              </p>
            </div>
            <div className="flex gap-4">
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
                    Edit Settings
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleDataExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <Tabs defaultValue="visibility" className="space-y-8">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="visibility"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Profile Visibility
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Data Sharing
              </TabsTrigger>
              <TabsTrigger
                value="communication"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Communication
              </TabsTrigger>
              <TabsTrigger
                value="cookies"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Cookies
              </TabsTrigger>
            </TabsList>

            {/* Profile Visibility Tab */}
            <TabsContent value="visibility">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <UserCircle className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Profile Visibility</h2>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your profile information
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">Profile Privacy</Label>
                      <select
                        id="profileVisibility"
                        className="w-full p-2 border rounded-md"
                        defaultValue={privacySettings.profileVisibility.profile}
                        disabled={!isEditing}
                      >
                        <option value="public">Public</option>
                        <option value="connections">Connections Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Learning Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Display your course progress to others
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.profileVisibility.progress ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.profileVisibility.progress ? "Visible" : "Hidden"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Achievements</p>
                        <p className="text-sm text-muted-foreground">
                          Display your earned badges and achievements
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.profileVisibility.achievements ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.profileVisibility.achievements ? "Visible" : "Hidden"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Certificates</p>
                        <p className="text-sm text-muted-foreground">
                          Display your completed course certificates
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.profileVisibility.certificates ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.profileVisibility.certificates ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Community Visibility</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your visibility in the learning community
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activity Feed</p>
                        <p className="text-sm text-muted-foreground">
                          Show your learning activities in the community feed
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.profileVisibility.activityFeed ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.profileVisibility.activityFeed ? "Visible" : "Hidden"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Directory Listing</p>
                        <p className="text-sm text-muted-foreground">
                          Appear in the learner directory
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.profileVisibility.directoryListing ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.profileVisibility.directoryListing ? "Listed" : "Unlisted"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mentorship Availability</p>
                        <p className="text-sm text-muted-foreground">
                          Show your availability for mentorship
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.profileVisibility.mentorshipAvailability ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.profileVisibility.mentorshipAvailability ? "Available" : "Hidden"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Data Sharing Tab */}
            <TabsContent value="data">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Database className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Data Usage & Analytics</h2>
                      <p className="text-sm text-muted-foreground">
                        Control how your learning data is used
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Usage Analytics</p>
                        <p className="text-sm text-muted-foreground">
                          Share anonymous usage data to improve the platform
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.dataSharing.analytics ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.dataSharing.analytics ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Learning Insights</p>
                        <p className="text-sm text-muted-foreground">
                          Allow analysis of your learning patterns
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.dataSharing.learningInsights ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.dataSharing.learningInsights ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Success Stories</p>
                        <p className="text-sm text-muted-foreground">
                          Allow your achievements to be featured
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.dataSharing.successStories ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.dataSharing.successStories ? "Allowed" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 rounded-full p-2">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Data Rights</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your data and privacy rights
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="font-medium">Download Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Get a copy of your personal data
                      </p>
                      <Button variant="outline" className="w-full" onClick={handleDataExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Request Data Export
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Data Deletion</p>
                      <p className="text-sm text-muted-foreground">
                        Request deletion of your account and data
                      </p>
                      <Button
                        variant="outline"
                        className="w-full text-red-500 hover:text-red-600"
                        onClick={handleDataDeletion}
                      >
                        Request Account Deletion
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Communication Tab */}
            <TabsContent value="communication">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <MessageSquare className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Communication Privacy</h2>
                      <p className="text-sm text-muted-foreground">
                        Control your messaging and discussion preferences
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="messagePrivacy">Direct Messages</Label>
                      <select
                        id="messagePrivacy"
                        className="w-full p-2 border rounded-md"
                        defaultValue={privacySettings.contactPreferences.allowMessages}
                        disabled={!isEditing}
                      >
                        <option value="everyone">Allow from Everyone</option>
                        <option value="connections">Connections Only</option>
                        <option value="none">Disable Messages</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email Address</p>
                        <p className="text-sm text-muted-foreground">
                          Display your email to other users
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.contactPreferences.showEmail ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.contactPreferences.showEmail ? "Visible" : "Hidden"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Social Links</p>
                        <p className="text-sm text-muted-foreground">
                          Display your social media profiles
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.contactPreferences.showSocial ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.contactPreferences.showSocial ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Globe className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Discussion Settings</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your participation in discussions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="discussionVisibility">Discussion Posts</Label>
                      <select
                        id="discussionVisibility"
                        className="w-full p-2 border rounded-md"
                        defaultValue={privacySettings.communicationPrivacy.discussionVisibility}
                        disabled={!isEditing}
                      >
                        <option value="public">Visible to Everyone</option>
                        <option value="course">Course Participants Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Message Encryption</p>
                        <p className="text-sm text-muted-foreground">
                          Enable end-to-end encryption for messages
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.communicationPrivacy.messageEncryption ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.communicationPrivacy.messageEncryption ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Group Participation</p>
                        <p className="text-sm text-muted-foreground">
                          Show your participation in study groups
                        </p>
                      </div>
                      <Button
                        variant={privacySettings.communicationPrivacy.groupParticipation ? "default" : "outline"}
                        size="sm"
                        disabled={!isEditing}
                      >
                        {privacySettings.communicationPrivacy.groupParticipation ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Cookies Tab */}
            <TabsContent value="cookies">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Cookie className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Cookie Preferences</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage how we use cookies to improve your experience
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Essential Cookies</p>
                      <p className="text-sm text-muted-foreground">
                        Required for basic platform functionality
                      </p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      disabled={true}
                    >
                      Required
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics Cookies</p>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how you use the platform
                      </p>
                    </div>
                    <Button
                      variant={privacySettings.cookiePreferences.analytics ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {privacySettings.cookiePreferences.analytics ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Cookies</p>
                      <p className="text-sm text-muted-foreground">
                        Used for personalized advertising
                      </p>
                    </div>
                    <Button
                      variant={privacySettings.cookiePreferences.marketing ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {privacySettings.cookiePreferences.marketing ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Personalization Cookies</p>
                      <p className="text-sm text-muted-foreground">
                        Remember your preferences and settings
                      </p>
                    </div>
                    <Button
                      variant={privacySettings.cookiePreferences.personalization ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                    >
                      {privacySettings.cookiePreferences.personalization ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <HelpCircle className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">About Cookies</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cookies help us provide, protect and improve our services. By continuing to use our site, you agree to our cookie policy.
                        </p>
                        <Button variant="link" className="px-0 mt-2" asChild>
                          <Link href="/cookie-policy">Learn More About Cookies</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}