"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Search,
  Home,
  BookOpen,
  Users,
  LayoutDashboard,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Error Communication Section */}
            <div className="space-y-4">
              <h1 className="text-8xl md:text-9xl font-bold tracking-tighter gradient-text animate-fade-up">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Oops! This page seems to have wandered off
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Don't worry, even the best explorers sometimes take unexpected paths. 
                Let's get you back on track to continue your learning journey.
              </p>
            </div>

            {/* Navigation Recovery Section */}
            <div className="w-full max-w-sm mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, topics, or mentors..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              <Button size="lg" className="w-full" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse All Courses
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Access Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/community">
                  <Users className="mr-2 h-4 w-4" />
                  Visit Community
                </Link>
              </Button>
            </div>

            {/* Popular Destinations */}
            <Card className="w-full max-w-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/courses/digital-marketing"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Digital Marketing</p>
                    <p className="text-sm text-muted-foreground">Master online marketing</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/courses/entrepreneurship"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Entrepreneurship</p>
                    <p className="text-sm text-muted-foreground">Start your business</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/success-stories"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Success Stories</p>
                    <p className="text-sm text-muted-foreground">Get inspired</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Latest Articles</p>
                    <p className="text-sm text-muted-foreground">Stay updated</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </Card>

            {/* Help & Support */}
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
              <Card className="flex-1 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">Chat with our support team</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/support/contact">Contact Support</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/support/faq">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Visit FAQ
                    </Link>
                  </Button>
                </div>
              </Card>
              <Card className="flex-1 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <ExternalLink className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Quick Links</h3>
                    <p className="text-sm text-muted-foreground">Popular resources</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/community/forum">
                      Community Forum
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/resources">
                      Learning Resources
                      <ArrowRight className="h-4 w-4" />
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