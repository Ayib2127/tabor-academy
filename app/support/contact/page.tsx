"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Calendar,
  Globe,
  CheckCircle,
  Upload,
  Search
} from "lucide-react"
import Link from "next/link"

export default function ContactSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock support hours data
  const supportHours = {
    "East Ethiopia": {
      timezone: "EAT",
      hours: "8:00 AM - 6:00 PM",
      days: "Monday - Friday"
    },
    "West Ethiopia": {
      timezone: "WAT",
      hours: "8:00 AM - 6:00 PM",
      days: "Monday - Friday"
    },
    "Southern Ethiopia": {
      timezone: "SAST",
      hours: "8:00 AM - 6:00 PM",
      days: "Monday - Friday"
    }
  }

  const supportCategories = [
    {
      id: "technical",
      title: "Technical Support",
      description: "Help with platform access, bugs, or technical issues",
      responseTime: "2-4 hours"
    },
    {
      id: "billing",
      title: "Billing & Payments",
      description: "Questions about payments, refunds, or subscriptions",
      responseTime: "1-2 hours"
    },
    {
      id: "course",
      title: "Course Support",
      description: "Help with course content or learning materials",
      responseTime: "4-6 hours"
    },
    {
      id: "mentorship",
      title: "Mentorship",
      description: "Questions about mentorship programs",
      responseTime: "4-8 hours"
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/support" className="hover:text-foreground">Support</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Contact</span>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
              Contact Our Support Team
            </h1>
            <p className="text-muted-foreground">
              Get help from our dedicated support team. We're here to assist you with any questions or issues.
            </p>
          </div>

          {/* Quick Search */}
          <Card className="p-6 mb-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-semibold mb-4">Search Before Contacting Support</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search our help articles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Submit a Support Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category</Label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required
                    >
                      <option value="">Select a category</option>
                      {supportCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full h-32 p-2 border rounded-md resize-none"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Attachments (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Support Request"}
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Alternative Contact Methods</h2>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <MessageSquare className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">
                          Chat with our support team in real-time
                        </p>
                      </div>
                    </div>
                    <Button>Start Chat</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">
                          Speak directly with our support team
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Call Now</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-4">
                      <Video className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Video Consultation</p>
                        <p className="text-sm text-muted-foreground">
                          Schedule a video call with our support team
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Book Session</Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Support Hours</h2>
                <div className="space-y-4">
                  {Object.entries(supportHours).map(([region, data]) => (
                    <div key={region} className="space-y-1">
                      <p className="font-medium">{region}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.hours} ({data.timezone})
                      </p>
                      <p className="text-sm text-muted-foreground">{data.days}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Response Times</h2>
                <div className="space-y-4">
                  {supportCategories.map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{category.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Typical response: {category.responseTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Helpful Resources</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/support/faq">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      FAQs
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/support/guides">
                      <FileText className="h-4 w-4 mr-2" />
                      User Guides
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="https://t.me/tabor_academy">
                      <Globe className="h-4 w-4 mr-2" />
                      Community Forum
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5 border-primary/10">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Premium Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Get priority support with faster response times
                    </p>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )}