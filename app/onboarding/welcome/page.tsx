"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Globe, Brain, Users, Play, Pause, ChevronRight, HelpCircle, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WelcomeWizardPage() {
  const router = useRouter()
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [showSkipWarning, setShowSkipWarning] = useState(false)
  const [showEmailReminder, setShowEmailReminder] = useState(false)
  const userName = "Sarah" // This would come from auth context

  const onboardingSteps = [
    {
      icon: Users,
      title: "Welcome & Introduction",
      description: "Get to know our platform and community"
    },
    {
      icon: Brain,
      title: "Skill Assessment",
      description: "Evaluate your current digital skills"
    },
    {
      icon: ChevronRight,
      title: "Goal Setting",
      description: "Define your learning objectives"
    },
    {
      icon: Globe,
      title: "Language Preferences",
      description: "Choose your learning languages"
    },
    {
      icon: Users,
      title: "Profile Completion",
      description: "Complete your learner profile"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Header with Progress */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Progress value={20} className="w-40" />
            <span className="text-sm text-muted-foreground">Step 1 of 5</span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  English
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Français</DropdownMenuItem>
                <DropdownMenuItem>Swahili</DropdownMenuItem>
                <DropdownMenuItem>العربية</DropdownMenuItem>
                <DropdownMenuItem>አማርኛ</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={showSkipWarning} onOpenChange={setShowSkipWarning}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">Skip Onboarding</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to skip?</DialogTitle>
                  <DialogDescription>
                    Skipping the onboarding process means you'll miss out on:
                    <ul className="list-disc list-inside mt-4 space-y-2">
                      <li>Personalized learning recommendations</li>
                      <li>Custom-tailored course suggestions</li>
                      <li>Progress tracking optimization</li>
                      <li>Community matching based on your goals</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => setShowSkipWarning(false)}>
                    Continue Onboarding
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => router.push("/dashboard")}
                  >
                    Skip Anyway
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          {/* Welcome Section */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter gradient-text mb-4">
              Welcome to Your Learning Journey
            </h1>
            <p className="text-2xl font-medium mb-2">Hello, {userName}!</p>
            <p className="text-lg text-muted-foreground">
              Join thousands of African entrepreneurs transforming their future through digital skills. 
              Let's personalize your learning experience to help you achieve your goals.
            </p>
          </div>

          {/* Journey Overview */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">What to Expect</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {onboardingSteps.map((step, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="mb-4">
                    <step.icon className="h-8 w-8 mx-auto text-teal-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Estimated completion time: 10-15 minutes
              </p>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Let's Get You Started</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Personalized Learning Paths",
                  description: "Get a customized curriculum based on your goals and current skill level"
                },
                {
                  icon: Users,
                  title: "AI-Powered Recommendations",
                  description: "Receive intelligent course suggestions that adapt to your progress"
                },
                {
                  icon: Globe,
                  title: "Community Connection",
                  description: "Connect with fellow learners and mentors from across Africa"
                }
              ].map((benefit, index) => (
                <Card key={index} className="p-6 card-hover gradient-border">
                  <benefit.icon className="h-12 w-12 text-teal-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Setup Option */}
          <div className="mb-16">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Express Setup Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Experienced with online learning? Take the express route with minimal onboarding.
                  </p>
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm">Reduced personalization</p>
                  </div>
                </div>
                <div className="border-l pl-8">
                  <h4 className="font-semibold mb-4">Comparison</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Personalized Recommendations</span>
                      <span className="text-muted-foreground">Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Path Customization</span>
                      <span className="text-muted-foreground">Basic</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Matching</span>
                      <span className="text-muted-foreground">General</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Platform Introduction Video */}
          <div className="mb-16">
            <Card className="p-6">
              <div className="aspect-video relative bg-gray-100 rounded-lg mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                  alt="Platform introduction"
                  fill
                  className="object-cover rounded-lg"
                />
                <Button
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full"
                  variant="secondary"
                  onClick={() => setVideoPlaying(!videoPlaying)}
                >
                  {videoPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    Subtitles
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  Skip Video
                </Button>
              </div>
            </Card>
          </div>

          {/* Navigation Controls */}
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-4">
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500"
                onClick={() => router.push("/onboarding/assessment")}
              >
                Start My Journey
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Watch Demo First
              </Button>
              <Dialog open={showEmailReminder} onOpenChange={setShowEmailReminder}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="lg" className="w-full">
                    Continue Later
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Your Progress</DialogTitle>
                    <DialogDescription>
                      We'll send you an email reminder to continue your onboarding process.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setShowEmailReminder(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Send reminder email logic here
                      setShowEmailReminder(false)
                    }}>
                      Send Reminder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Support available 24/7</span>
            </div>
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Need Help?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Support Options</DialogTitle>
                    <DialogDescription>
                      Choose how you'd like to get help:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 mt-4">
                    <Button variant="outline" className="justify-start">
                      Live Chat with Support
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Email: support@taboracademy.com
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Call: +254 700 000000
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/faq">View Onboarding FAQ</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex justify-between items-center">
            <Progress value={20} className="w-40" />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}