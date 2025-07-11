"use client"
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

export default async function MentorshipProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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