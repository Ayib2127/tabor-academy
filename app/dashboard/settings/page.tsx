"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Lock,
  Mail,
  Smartphone,
  Bell,
  Globe,
  Shield,
  Key,
  Laptop,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Download,
  LogOut
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Mock user settings data
  const settings = {
    email: "sarah.kimani@example.com",
    phone: "+251936747488",
    twoFactorEnabled: true,
    lastLogin: "March 1, 2024 10:30 AM",
    lastLoginLocation: "Addis Ababa, Ethiopia",
    lastLoginDevice: "Chrome on MacOS",
    notifications: {
      email: {
        courseUpdates: true,
        mentorMessages: true,
        communityActivity: false,
        marketing: true
      },
      push: {
        courseReminders: true,
        mentorSessions: true,
        achievements: true
      },
      sms: {
        securityAlerts: true,
        importantUpdates: false
      }
    },
    privacy: {
      profileVisibility: "public",
      showProgress: true,
      allowMessages: true,
      shareActivity: true
    },
    security: {
      loginHistory: [
        {
          date: "March 1, 2024 10:30 AM",
          device: "Chrome on MacOS",
          location: "Addis Ababa, Ethiopia",
          status: "success"
        },
        {
          date: "February 28, 2024 3:15 PM",
          device: "Safari on iPhone",
          location: "Addis Ababa, Ethiopia",
          status: "success"
        },
        {
          date: "February 27, 2024 9:45 AM",
          device: "Firefox on Windows",
          location: "Mombasa, Kenya",
          status: "failed"
        }
      ]
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleLogout = async () => {
    setShowLogoutConfirm(false)
    // Handle logout logic here
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
            <span>Settings</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Account Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account security and preferences
              </p>
            </div>
            <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Out</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out of your account?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="security" className="space-y-8">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="security"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="devices"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Devices
              </TabsTrigger>
            </TabsList>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Password Change */}
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Key className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Change Password</h2>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Updating Password..." : "Update Password"}
                    </Button>
                  </form>
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 rounded-full p-2">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Two-Factor Authentication</h2>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                      <Button variant={settings.twoFactorEnabled ? "outline" : "default"}>
                        {settings.twoFactorEnabled ? "Disable" : "Enable"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Backup Codes</p>
                      <p className="text-sm text-muted-foreground">
                        Generate new backup codes for account recovery
                      </p>
                      <Button variant="outline" className="w-full">
                        Generate New Codes
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Login History */}
                <Card className="p-6 md:col-span-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Laptop className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Login History</h2>
                      <p className="text-sm text-muted-foreground">
                        Recent login activity on your account
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {settings.security.loginHistory.map((login, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          {login.status === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{login.device}</p>
                            <p className="text-sm text-muted-foreground">
                              {login.location} • {login.date}
                            </p>
                          </div>
                        </div>
                        {login.status === "failed" && (
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Report
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Mail className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Email Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your email preferences
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.notifications.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about {key.toLowerCase()}
                          </p>
                        </div>
                        <Button
                          variant={value ? "default" : "outline"}
                          size="sm"
                        >
                          {value ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Bell className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Push Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Control your mobile and browser notifications
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.notifications.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about {key.toLowerCase()}
                          </p>
                        </div>
                        <Button
                          variant={value ? "default" : "outline"}
                          size="sm"
                        >
                          {value ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 rounded-full p-2">
                      <Smartphone className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">SMS Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage text message alerts
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(settings.notifications.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Receive SMS for {key.toLowerCase()}
                          </p>
                        </div>
                        <Button
                          variant={value ? "default" : "outline"}
                          size="sm"
                        >
                          {value ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Globe className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Profile Privacy</h2>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your profile
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Profile Visibility</Label>
                      <select
                        id="visibility"
                        className="w-full p-2 border rounded-md"
                        defaultValue={settings.privacy.profileVisibility}
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
                        variant={settings.privacy.showProgress ? "default" : "outline"}
                        size="sm"
                      >
                        {settings.privacy.showProgress ? "Visible" : "Hidden"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Allow Direct Messages</p>
                        <p className="text-sm text-muted-foreground">
                          Let others send you private messages
                        </p>
                      </div>
                      <Button
                        variant={settings.privacy.allowMessages ? "default" : "outline"}
                        size="sm"
                      >
                        {settings.privacy.allowMessages ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Shield className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Data & Privacy</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your data and privacy settings
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="font-medium">Download Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Get a copy of your personal data
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Request Data Export
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Activity Sharing</p>
                      <p className="text-sm text-muted-foreground">
                        Share your learning activities with the community
                      </p>
                      <Button
                        variant={settings.privacy.shareActivity ? "default" : "outline"}
                        className="w-full"
                      >
                        {settings.privacy.shareActivity ? "Sharing Enabled" : "Sharing Disabled"}
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
                        Request Account Deletion
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Devices Tab */}
            <TabsContent value="devices">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Laptop className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Connected Devices</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage devices that have access to your account
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <Laptop className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{settings.lastLoginDevice}</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.lastLoginLocation} • Current Device
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Current
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-muted-foreground">
                          Addis Ababa, Ethiopia • Last active 2 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <Laptop className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Firefox on Windows</p>
                        <p className="text-sm text-muted-foreground">
                          Mombasa, Kenya • Last active 3 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
                    Sign Out All Devices
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}