"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Star,
  Clock,
  BookOpen,
  Share2,
  Bookmark,
  Gift,
  Globe,
  CheckCircle,
  Download,
  Users,
  Award,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Lock
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock course data - in production this would come from an API
const course = {
  id: 1,
  title: "Digital Marketing Mastery for Ethiopian Markets",
  subtitle: "Learn how to create and execute successful digital marketing campaigns specifically tailored for Ethiopian consumers",
  banner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  previewVideo: "https://example.com/preview.mp4",
  instructor: {
    name: "Sarah Kimani",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    title: "Digital Marketing Expert",
    bio: "10+ years experience in Ethiopian digital markets",
    expertise: ["Social Media Marketing", "Content Strategy", "Market Analysis"],
    rating: 4.9,
    students: 12500,
    courses: 8
  },
  rating: {
    average: 4.8,
    total: 425,
    breakdown: {
      5: 300,
      4: 80,
      3: 25,
      2: 15,
      1: 5
    }
  },
  enrollments: 2456,
  lastUpdated: "2024-02-15",
  language: "English",
  subtitles: ["French", "Swahili"],
  price: 99,
  curriculum: [
    {
      title: "Introduction to Ethiopian Digital Marketing",
      duration: "2 hours",
      lessons: [
        {
          title: "Understanding the Ethiopian Digital Landscape",
          duration: "30 mins",
          preview: true
        },
        {
          title: "Market Research and Consumer Behavior",
          duration: "45 mins",
          preview: false
        },
        {
          title: "Mobile-First Strategy for Ethiopia",
          duration: "45 mins",
          preview: false
        }
      ]
    },
    {
      title: "Social Media Marketing for Ethiopian Audiences",
      duration: "3 hours",
      lessons: [
        {
          title: "Platform Selection and Strategy",
          duration: "45 mins",
          preview: true
        },
        {
          title: "Content Creation for Local Markets",
          duration: "45 mins",
          preview: false
        },
        {
          title: "Community Management and Engagement",
          duration: "45 mins",
          preview: false
        },
        {
          title: "Paid Social Media Campaigns",
          duration: "45 mins",
          preview: false
        }
      ]
    }
  ],
  learningOutcomes: [
    "Develop market-specific digital marketing strategies",
    "Create engaging content for Ethiopian audiences",
    "Implement successful social media campaigns",
    "Measure and analyze campaign performance",
    "Understand mobile marketing dynamics in Ethiopia",
    "Build and manage online communities"
  ],
  requirements: [
    "Basic understanding of marketing concepts",
    "Access to a computer or smartphone",
    "Internet connection for online tools",
    "No prior digital marketing experience required"
  ],
  successStories: [
    {
      name: "John Okafor",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      story: "Launched successful digital agency after course completion",
      outcome: "400% revenue increase"
    },
    {
      name: "Grace Mensah",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      story: "Transformed local business through digital marketing",
      outcome: "10,000+ new customers"
    }
  ],
  faqs: [
    {
      question: "Is this course suitable for beginners?",
      answer: "Yes, this course is designed for both beginners and intermediate marketers. We start with the basics and progressively move to advanced concepts."
    },
    {
      question: "How long do I have access to the course?",
      answer: "You get lifetime access to all course materials, including future updates and additions."
    },
    {
      question: "Are there any prerequisites?",
      answer: "No specific prerequisites are required. Basic marketing knowledge and computer skills are helpful but not mandatory."
    }
  ]
}

export default function CourseDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedModules, setExpandedModules] = useState<number[]>([])

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleIndex)
        ? prev.filter(i => i !== moduleIndex)
        : [...prev, moduleIndex]
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Course Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={course.banner}
            alt={course.title}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container relative py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>{course.language}</span>
                {course.subtitles.length > 0 && (
                  <span className="text-gray-400">
                    (Subtitles: {course.subtitles.join(", ")})
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
              <p className="text-xl text-gray-300">{course.subtitle}</p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{course.rating.average}</span>
                  <span className="text-gray-400">({course.rating.total} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span>{course.enrollments} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>Last updated {course.lastUpdated}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Image
                  src={course.instructor.photo}
                  alt={course.instructor.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-gray-400">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-white/10 backdrop-blur-lg text-white">
              <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                <Image
                  src={course.banner}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Button size="lg" className="rounded-full w-16 h-16">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">${course.price}</span>
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-lg py-6">
                  Enroll Now
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Gift className="h-4 w-4 mr-2" />
                    Gift
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/20">
                  <h3 className="font-semibold">This course includes:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>24 hours of video content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>15 downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Community discussion access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center text-sm">
                  <p>30-Day Money-Back Guarantee</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="container py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Curriculum
            </TabsTrigger>
            <TabsTrigger
              value="instructor"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Instructor
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Learning Outcomes */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Success Stories */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Success Stories</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {course.successStories.map((story, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={story.photo}
                        alt={story.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{story.name}</h3>
                        <p className="text-sm text-green-500">{story.outcome}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{story.story}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Course Content</h2>
              <div className="text-sm text-muted-foreground">
                {course.curriculum.reduce((acc, module) => acc + module.lessons.length, 0)} lessons •{" "}
                {course.curriculum.reduce((acc, module) => {
                  const [hours] = module.duration.split(" ")
                  return acc + parseInt(hours)
                }, 0)} hours total
              </div>
            </div>

            <div className="space-y-4">
              {course.curriculum.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center justify-between hover:bg-accent"
                    onClick={() => toggleModule(moduleIndex)}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          expandedModules.includes(moduleIndex) ? "rotate-90" : ""
                        }`}
                      />
                      <h3 className="font-medium">{module.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {module.lessons.length} lessons • {module.duration}
                    </div>
                  </button>

                  {expandedModules.includes(moduleIndex) && (
                    <div className="border-t">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="p-4 flex items-center justify-between hover:bg-accent/50"
                        >
                          <div className="flex items-center gap-2">
                            {lesson.preview ? (
                              <Play className="h-4 w-4 text-primary" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={lesson.preview ? "" : "text-muted-foreground"}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {lesson.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-8">
            <div className="flex items-start gap-6">
              <Image
                src={course.instructor.photo}
                alt={course.instructor.name}
                width={120}
                height={120}
                className="rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2">{course.instructor.name}</h2>
                <p className="text-lg text-muted-foreground mb-4">{course.instructor.title}</p>
                <div className="flex gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{course.instructor.rating} Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.instructor.students.toLocaleString()} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.instructor.courses} Courses</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold">Areas of Expertise:</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.instructor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold">{course.rating.average}</div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= course.rating.average
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Course Rating • {course.rating.total} Reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(course.rating.breakdown)
                    .reverse()
                    .map(([stars, count]) => (
                      <div key={stars} className="flex items-center gap-4">
                        <div className="w-12 text-sm">{stars} stars</div>
                        <Progress
                          value={(count / course.rating.total) * 100}
                          className="flex-1"
                        />
                        <div className="w-12 text-sm text-right">
                          {((count / course.rating.total) * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Student Feedback</h3>
                {/* Add review list component here */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            {course.faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}