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
import { withDefault, DEFAULT_AVATAR_URL } from "@/lib/defaults";

export default function MentorshipProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Mock data - replace with actual data fetching
  const mentor = {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Senior Software Engineer",
    company: "Tech Corp",
    avatar: DEFAULT_AVATAR_URL,
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 75,
    description: "Experienced software engineer with 10+ years in full-stack development...",
    skills: ["React", "Node.js", "Python", "AWS", "Docker"],
    languages: ["English", "Spanish"],
    availability: {
      sessionDurations: [30, 60, 90],
      schedule: {
        "Monday": ["09:00", "14:00", "16:00"],
        "Tuesday": ["10:00", "15:00", "17:00"],
        "Wednesday": ["11:00", "13:00", "18:00"]
      }
    },
    education: [
      { degree: "PhD Computer Science", institution: "Stanford University", year: "2020" },
      { degree: "MS Software Engineering", institution: "MIT", year: "2017" }
    ],
    certifications: [
      { name: "AWS Solutions Architect", issuer: "Amazon", year: "2021" },
      { name: "Google Cloud Professional", issuer: "Google", year: "2020" }
    ],
    achievements: [
      "Led development of 3 major applications",
      "Mentored 50+ junior developers",
      "Published 15 technical articles"
    ],
    reviews: [
      {
        id: "1",
        author: "John Doe",
        rating: 5,
        content: "Excellent mentor! Very knowledgeable and patient.",
        date: new Date("2024-01-15"),
        helpful: 12
      },
      {
        id: "2", 
        author: "Jane Smith",
        rating: 4,
        content: "Great insights and practical advice.",
        date: new Date("2024-01-10"),
        helpful: 8
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <Image
                  src={mentor.avatar}
                  alt={mentor.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{mentor.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">
                    {mentor.title} at {mentor.company}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.floor(mentor.rating)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {mentor.rating} ({mentor.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      ${mentor.hourlyRate}/hour
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{mentor.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
              <div className="space-y-6">
                {mentor.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
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
      </main>
    </div>
  )
}