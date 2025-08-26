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
    hourlyRate: 150,
    experience: "8+ years",
    languages: ["English", "Spanish"],
    skills: ["React", "Node.js", "Python", "AWS"],
    availability: {
      sessionDurations: [30, 60, 90],
      schedule: {
        "Monday": ["9:00 AM", "2:00 PM", "4:00 PM"],
        "Tuesday": ["10:00 AM", "3:00 PM"],
        "Wednesday": ["9:00 AM", "1:00 PM", "5:00 PM"]
      }
    },
    education: [
      { degree: "PhD Computer Science", institution: "Stanford University", year: "2020" },
      { degree: "MS Software Engineering", institution: "MIT", year: "2018" }
    ],
    certifications: [
      { name: "AWS Solutions Architect", issuer: "Amazon", year: "2021" },
      { name: "Google Cloud Professional", issuer: "Google", year: "2020" }
    ],
    achievements: [
      "Led 50+ successful projects",
      "Mentored 200+ developers",
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
        content: "Great session, learned a lot about React best practices.",
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
                  <h1 className="text-2xl font-bold mb-2">{mentor.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">
                    {mentor.title} at {mentor.company}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{mentor.rating}</span>
                      <span className="text-muted-foreground">({mentor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{mentor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>${mentor.hourlyRate}/hr</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((language) => (
                      <span
                        key={language}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {mentor.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
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