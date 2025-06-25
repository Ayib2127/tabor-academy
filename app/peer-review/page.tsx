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
  ChevronRight,
  Clock,
  FileText,
  Star,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Users,
  Medal,
  Eye,
  ArrowRight,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PeerReviewPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [reviewProgress, setReviewProgress] = useState(0)

  // Mock review data
  const reviewQueue = [
    {
      id: "sub-001",
      title: "E-commerce Marketing Strategy",
      course: "Digital Marketing",
      submittedBy: "Anonymous",
      submittedDate: new Date(2024, 2, 15),
      deadline: new Date(2024, 2, 20),
      complexity: "Medium",
      estimatedTime: "30 mins"
    },
    {
      id: "sub-002",
      title: "Social Media Content Calendar",
      course: "Content Creation",
      submittedBy: "Anonymous",
      submittedDate: new Date(2024, 2, 14),
      deadline: new Date(2024, 2, 19),
      complexity: "Low",
      estimatedTime: "20 mins"
    }
  ]

  const evaluationCriteria = [
    {
      category: "Technical Execution",
      criteria: [
        { name: "Code Quality", weight: 25 },
        { name: "Functionality", weight: 25 },
        { name: "Performance", weight: 20 }
      ]
    },
    {
      category: "Creativity & Innovation",
      criteria: [
        { name: "Originality", weight: 15 },
        { name: "Problem Solving", weight: 15 }
      ]
    },
    {
      category: "Documentation",
      criteria: [
        { name: "Clarity", weight: 10 },
        { name: "Completeness", weight: 10 }
      ]
    }
  ]

  const reviewHistory = [
    {
      id: "rev-001",
      submission: "Mobile App UI Design",
      date: new Date(2024, 2, 10),
      rating: 4.5,
      helpfulVotes: 12
    },
    {
      id: "rev-002",
      submission: "SEO Strategy Document",
      date: new Date(2024, 2, 5),
      rating: 4.8,
      helpfulVotes: 8
    }
  ]

  const reviewQuality = {
    score: 92,
    metrics: {
      thoroughness: 95,
      constructiveness: 90,
      timeliness: 88,
      clarity: 94
    },
    badges: [
      { name: "Top Reviewer", icon: Medal },
      { name: "Detailed Feedback", icon: FileText },
      { name: "Quick Response", icon: Clock }
    ]
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
            <span>Peer Review</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Peer Review Dashboard
              </h1>
              <p className="text-muted-foreground">
                Help fellow learners improve by providing constructive feedback
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">Review Score</p>
                <p className="text-2xl font-bold gradient-text">{reviewQuality.score}</p>
              </div>
              <div className="flex -space-x-2">
                {reviewQuality.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="relative w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                    title={badge.name}
                  >
                    <badge.icon className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Review Queue */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Submissions to Review</h2>
                <div className="space-y-4">
                  {reviewQueue.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => setSelectedSubmission(submission.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{submission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {submission.course}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {submission.complexity}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Due {submission.deadline.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {submission.estimatedTime}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Start Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {selectedSubmission && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Review Interface</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Progress: {reviewProgress}%
                      </span>
                      <Progress value={reviewProgress} className="w-32 h-2" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Submission Preview */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Submission Content</h3>
                      <div className="aspect-video bg-accent rounded-lg flex items-center justify-center mb-4">
                        Submission preview will be displayed here
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Full Screen
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Evaluation Form */}
                    <div>
                      <h3 className="font-medium mb-4">Evaluation Criteria</h3>
                      <div className="space-y-6">
                        {evaluationCriteria.map((category, index) => (
                          <div key={index}>
                            <h4 className="text-sm font-medium mb-2">
                              {category.category}
                            </h4>
                            <div className="space-y-3">
                              {category.criteria.map((criterion, cIndex) => (
                                <div key={cIndex} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label>{criterion.name}</Label>
                                    <span className="text-sm text-muted-foreground">
                                      {criterion.weight}%
                                    </span>
                                  </div>
                                  <Input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                    className="w-full"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Detailed Feedback</Label>
                      <textarea
                        className="w-full h-32 p-2 border rounded-md resize-none"
                        placeholder="Provide constructive feedback..."
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Submit Review</Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Stats */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Review Quality</h2>
                <div className="space-y-4">
                  {Object.entries(reviewQuality.metrics).map(([metric, score]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="capitalize">
                          {metric.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <span>{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Review History */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Recent Reviews</h2>
                <div className="space-y-4">
                  {reviewHistory.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{review.submission}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{review.date.toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {review.helpfulVotes} helpful
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Guidelines */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Review Guidelines</h2>
                    <p className="text-sm text-muted-foreground">
                      Tips for effective peer review
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Be specific and constructive</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Provide examples and suggestions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Focus on both strengths and areas for improvement</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/review-guidelines">
                      View Full Guidelines
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Support */}
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Flag className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact support for assistance
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/support">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Get Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/community">
                      <Users className="h-4 w-4 mr-2" />
                      Ask Community
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