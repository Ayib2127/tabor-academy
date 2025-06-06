"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  Star,
  CheckCircle,
  Video,
  MessageSquare,
  Calendar,
  Download,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Award,
  Clock
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function InstructorFeedbackPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock feedback data
  const feedback = {
    course: "Digital Marketing Fundamentals",
    assignment: "Social Media Campaign Strategy",
    instructor: {
      name: "Dr. Grace Mensah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      role: "Lead Instructor",
      expertise: "Digital Marketing Strategy"
    },
    grade: {
      score: 85,
      letterGrade: "A",
      courseAverage: 78
    },
    criteria: [
      { name: "Technical Skills", score: 90, weight: 30 },
      { name: "Creative Problem Solving", score: 85, weight: 25 },
      { name: "Practical Application", score: 80, weight: 25 },
      { name: "Presentation", score: 85, weight: 20 }
    ],
    strengths: [
      "Excellent market research methodology",
      "Creative content strategy",
      "Strong data analysis"
    ],
    improvements: [
      "Enhance competitor analysis depth",
      "Include more specific KPIs",
      "Expand budget allocation details"
    ],
    videoFeedback: {
      url: "#",
      duration: "10:25",
      topics: [
        { time: "0:00", topic: "Overview" },
        { time: "2:15", topic: "Technical Analysis" },
        { time: "5:30", topic: "Recommendations" }
      ]
    },
    learningObjectives: [
      { objective: "Market Research Skills", achieved: true },
      { objective: "Campaign Strategy Development", achieved: true },
      { objective: "ROI Analysis", achieved: false },
      { objective: "Content Strategy", achieved: true }
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
            <Link href="/courses" className="hover:text-foreground">{feedback.course}</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Instructor Feedback</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                {feedback.assignment}
              </h1>
              <p className="text-muted-foreground">
                Instructor feedback and assessment details
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">{feedback.grade.score}</p>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">{feedback.grade.letterGrade}</p>
                  <p className="text-sm text-muted-foreground">Grade</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">{feedback.grade.courseAverage}</p>
                  <p className="text-sm text-muted-foreground">Course Avg</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Feedback */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Video Feedback</h2>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    {feedback.videoFeedback.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                      >
                        <span className="font-medium">{topic.topic}</span>
                        <span className="text-sm text-muted-foreground">{topic.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Detailed Assessment */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Assessment Breakdown</h2>
                <div className="space-y-6">
                  {feedback.criteria.map((criterion, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{criterion.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {criterion.score}% (Weight: {criterion.weight}%)
                        </span>
                      </div>
                      <Progress value={criterion.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Strengths and Improvements */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Strengths</h2>
                  <div className="space-y-3">
                    {feedback.strengths.map((strength, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Areas for Improvement</h2>
                  <div className="space-y-3">
                    {feedback.improvements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent"
                      >
                        <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                        <span>{improvement}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor Info */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={feedback.instructor.avatar}
                    alt={feedback.instructor.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{feedback.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{feedback.instructor.role}</p>
                    <p className="text-sm text-muted-foreground">{feedback.instructor.expertise}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/schedule">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Office Hours
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/message">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Learning Objectives */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Learning Objectives</h3>
                <div className="space-y-3">
                  {feedback.learningObjectives.map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent"
                    >
                      {objective.achieved ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      <span>{objective.objective}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Next Steps */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Next Steps</h3>
                    <p className="text-sm text-muted-foreground">
                      Recommended actions
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/resources">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Additional Resources
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/practice">
                      <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Practice Exercises
                      </div>
                      <ExternalLink className="h-4 w-4" />
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