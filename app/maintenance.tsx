"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Wrench,
  CheckCircle,
  Download,
  Users,
  Bell,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0
  })

  useEffect(() => {
    // Simulate maintenance progress
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100))
    }, 3000)

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer)
          return prev
        }

        let newSeconds = prev.seconds - 1
        let newMinutes = prev.minutes
        let newHours = prev.hours

        if (newSeconds < 0) {
          newSeconds = 59
          newMinutes -= 1
        }

        if (newMinutes < 0) {
          newMinutes = 59
          newHours -= 1
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        }
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Maintenance Notice */}
            <div className="space-y-4">
              <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Wrench className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                We're Making Things Better
              </h1>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Tabor Digital Academy is currently undergoing scheduled maintenance to improve your learning experience. We'll be back shortly!
              </p>
            </div>

            {/* Progress & Timer */}
            <Card className="w-full max-w-md p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Maintenance Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-center gap-4 text-2xl font-bold">
                  <div>
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-sm text-muted-foreground">h</span>
                  </div>
                  <span>:</span>
                  <div>
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-sm text-muted-foreground">m</span>
                  </div>
                  <span>:</span>
                  <div>
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-sm text-muted-foreground">s</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Maintenance Details */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
              <Card className="p-6">
                <h2 className="font-semibold mb-4">What's Being Improved</h2>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Platform performance optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Enhanced security measures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>New course features deployment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>System updates and patches</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Available Services</h2>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Access to downloaded content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Community WhatsApp groups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Offline study materials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Support via alternative channels</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Alternative Activities */}
            <Card className="w-full max-w-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Continue Learning Offline</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/downloads"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Access Downloads</p>
                    <p className="text-sm text-muted-foreground">Previously saved content</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/community/whatsapp"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Join Study Groups</p>
                    <p className="text-sm text-muted-foreground">Connect with peers</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/resources/pdf"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">PDF Guides</p>
                    <p className="text-sm text-muted-foreground">Downloadable resources</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/resources/audio"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Audio Content</p>
                    <p className="text-sm text-muted-foreground">Offline learning</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </Card>

            {/* Updates & Support */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
              <Card className="flex-1 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Get Updates</h3>
                    <p className="text-sm text-muted-foreground">Stay informed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/status">Check Status Page</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Subscribe to SMS Alerts
                  </Button>
                </div>
              </Card>

              <Card className="flex-1 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">We're here</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="tel:+254700000000">
                      <Phone className="mr-2 h-4 w-4" />
                      Emergency Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="mailto:support@taboracademy.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Us
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