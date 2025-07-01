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
  Calendar,
  MessageSquare,
  Globe,
  Languages,
  Clock,
  Award,
  Briefcase,
  BookOpen,
  TrendingUp,
  Users,
  Share2,
  Flag,
  Download,
  AlertCircle,
  HelpCircle,
  FileText,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MentorProfilePage({ params }: { params: { id: string } }) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  // Mock mentor data
  const mentor = {
    id: params.id,
    name: "Dr. Grace Mensah",
    title: "Digital Marketing Expert & Business Strategist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    location: "Accra, Ghana",
    timeZone: "GMT+0",
    languages: ["English", "Twi", "French"],
    rating: 4.9,
    reviews: 124,
    verified: true,
    expertise: [
      "Digital Marketing Strategy",
      "E-commerce Development",
      "Brand Building",
      "Social Media Marketing",
      "Content Strategy",
      "Market Analysis"
    ],
    experience: {
      years: 10,
      totalSessions: 450,
      successRate: 98,
      totalMentees: 250
    },
    education: [
      {
        degree: "Ph.D. in Marketing",
        institution: "University of Cape Town",
        year: 2015
      },
      {
        degree: "MBA",
        institution: "Lagos Business School",
        year: 2012
      }
    ],
    certifications: [
      {
        name: "Google Digital Marketing",
        issuer: "Google",
        year: 2023
      },
      {
        name: "Meta Marketing Expert",
        issuer: "Meta",
        year: 2022
      }
    ],
    achievements: [
      "Built 3 successful e-commerce businesses",
      "Helped 50+ startups scale their digital presence",
      "Published author on digital marketing strategies",
      "Speaker at major Ethiopian tech conferences"
    ],
    mentorshipApproach: {
      style: "Collaborative and goal-oriented",
      methodology: [
        "Personalized strategy development",
        "Hands-on practical exercises",
        "Regular progress tracking",
        "Real-world case studies"
      ],
      focusAreas: [
        "Business strategy validation",
        "Digital marketing implementation",
        "Growth hacking techniques",
        "Market expansion strategies"
      ]
    },
    availability: {
      nextAvailable: "Tomorrow",
      schedule: {
        "Monday": ["09:00", "14:00", "16:00"],
        "Wednesday": ["10:00", "15:00"],
        "Friday": ["09:00", "13:00", "17:00"]
      },
      sessionDurations: [30, 60, 90],
      pricing: {
        "30min": "$30",
        "60min": "$50",
        "90min": "$70"
      }
    },
    reviews: [
      {
        id: "rev-001",
        author: "John Okafor",
        rating: 5,
        date: new Date(2024, 2, 15),
        content: "Dr. Mensah's guidance was instrumental in helping me scale my e-commerce business. Her practical insights and strategic approach made a significant difference.",
        helpful: 28
      },
      {
        id: "rev-002",
        author: "Sarah Kimani",
        rating: 5,
        date: new Date(2024, 2, 10),
        content: "Exceptional mentor with deep knowledge of digital marketing. She provided actionable strategies that helped me improve my business's online presence.",
        helpful: 15
      }
    ],
    successStories: [
      {
        title: "E-commerce Growth Success",
        description: "Helped mentee achieve 300% growth in online sales within 6 months",
        metrics: ["300% Revenue Growth", "5x Customer Base", "60% Reduced CAC"]
      },
      {
        title: "Digital Transformation",
        description: "Guided traditional business in successful digital transformation",
        metrics: ["100% Digital Adoption", "45% Cost Reduction", "2x Customer Satisfaction"]
      }
    ]
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/mentorship" className="hover:text-foreground">Mentorship</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/mentorship/directory" className="hover:text-foreground">
              Directory
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{mentor.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <Card className="p-6">
                <div className="flex gap-6">
                  <div className="relative">
                    <Image
                      src={mentor.avatar}
                      alt={mentor.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{mentor.name}</h1>
                      {mentor.verified && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="text-lg text-muted-foreground mb-4">
                      {mentor.title}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span>{mentor.rating}</span>
                        <span className="text-muted-foreground ml-1">
                          ({mentor.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        <span>{mentor.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{mentor.timeZone}</span>
                      </div>
                      <div className="flex items-center">
                        <Languages className="h-4 w-4 mr-1" />
                        <span>{mentor.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Experience & Expertise */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Experience & Expertise</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="px-3 py-1 rounded-full bg-accent text-sm"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Experience Highlights</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-2 rounded-lg bg-accent">
                        <span>Years of Experience</span>
                        <span className="font-medium">{mentor.experience.years}+</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent">
                        <span>Success Rate</span>
                        <span className="font-medium">{mentor.experience.successRate}%</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-accent">
                        <span>Total Mentees</span>
                        <span className="font-medium">{mentor.experience.totalMentees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mentorship Approach */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Mentorship Approach</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Methodology</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {mentor.mentorshipApproach.methodology.map((method, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-accent"
                        >
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span>{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Focus Areas</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {mentor.mentorshipApproach.focusAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-accent"
                        >
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Success Stories */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Success Stories</h2>
                <div className="space-y-6">
                  {mentor.successStories.map((story, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <h3 className="font-medium mb-2">{story.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {story.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {story.metrics.map((metric, mIndex) => (
                          <div
                            key={mIndex}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reviews */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <Button variant="outline">
                    Write a Review
                  </Button>
                </div>
                <div className="space-y-6">
                  {mentor.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {review.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-3">{review.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          👍 Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Book a Session</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Session Duration</p>
                    <div className="grid grid-cols-3 gap-2">
                      {mentor.availability.sessionDurations.map((duration) => (
                        <Button
                          key={duration}
                          variant="outline"
                          className="w-full"
                        >
                          {duration}min
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Available Times</p>
                    <div className="space-y-2">
                      {Object.entries(mentor.availability.schedule).map(([day, times]) => (
                        <div key={day}>
                          <p className="text-sm text-muted-foreground mb-1">{day}</p>
                          <div className="grid grid-cols-3 gap-2">
                            {times.map((time) => (
                              <Button
                                key={time}
                                variant="outline"
                                className={`w-full ${
                                  selectedTimeSlot === `${day}-${time}`
                                    ? "border-primary"
                                    : ""
                                }`}
                                onClick={() => setSelectedTimeSlot(`${day}-${time}`)}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">
                    Book Session
                  </Button>
                </div>
              </Card>

              {/* Background & Credentials */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Background & Credentials</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Education</h4>
                    <div className="space-y-2">
                      {mentor.education.map((edu, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg hover:bg-accent"
                        >
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution}, {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Certifications</h4>
                    <div className="space-y-2">
                      {mentor.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg hover:bg-accent"
                        >
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuer}, {cert.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Achievements</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional milestones
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {mentor.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                    >
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Help Section */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Booking support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/booking">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Booking Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/contact">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
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