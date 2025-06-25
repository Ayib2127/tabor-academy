"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Share2,
  ExternalLink,
  Shield,
  Briefcase,
  BookOpen,
  TrendingUp,
  Download,
  LinkedinIcon,
  Globe,
  Lock
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CertificationPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  // Mock certification data
  const certifications = {
    inProgress: [
      {
        id: "cert-001",
        name: "Digital Marketing Specialist",
        issuer: "Tabor Digital Academy",
        progress: 75,
        requirements: [
          { name: "Core Courses", completed: true },
          { name: "Specialization Courses", completed: true },
          { name: "Final Project", completed: false },
          { name: "Peer Reviews", completed: true }
        ],
        estimatedCompletion: "March 2024",
        industry: ["Marketing", "Digital"]
      },
      {
        id: "cert-002",
        name: "E-commerce Entrepreneur",
        issuer: "Tabor Digital Academy",
        progress: 45,
        requirements: [
          { name: "Business Fundamentals", completed: true },
          { name: "E-commerce Platform", completed: false },
          { name: "Marketing Strategy", completed: false },
          { name: "Financial Management", completed: false }
        ],
        estimatedCompletion: "May 2024",
        industry: ["Business", "E-commerce"]
      }
    ],
    completed: [
      {
        id: "cert-003",
        name: "Web Development Fundamentals",
        issuer: "Tabor Digital Academy",
        completionDate: "January 2024",
        grade: "A",
        verificationId: "TDA-WD-2024-001",
        badges: ["Top Performer", "Peer Mentor"]
      }
    ],
    available: [
      {
        id: "cert-004",
        name: "Data Analytics Professional",
        description: "Master data analysis and visualization",
        duration: "6 months",
        level: "Intermediate",
        prerequisites: ["Basic Statistics", "Excel Proficiency"],
        career: ["Data Analyst", "Business Intelligence"]
      },
      {
        id: "cert-005",
        name: "Project Management Expert",
        description: "Learn agile and traditional project management",
        duration: "4 months",
        level: "Advanced",
        prerequisites: ["Business Fundamentals", "Team Leadership"],
        career: ["Project Manager", "Scrum Master"]
      }
    ]
  }

  const partners = [
    {
      name: "African Development Bank",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
      type: "Financial Institution"
    },
    {
      name: "Tech4Africa",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
      type: "Industry Association"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Certifications</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Certification & Credentials
              </h1>
              <p className="text-muted-foreground">
                Track your progress towards professional certifications
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {certifications.completed.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text mb-1">
                    {certifications.inProgress.length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* In Progress Certifications */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Certifications In Progress</h2>
                {certifications.inProgress.map((cert) => (
                  <Card key={cert.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Est. Completion</p>
                        <p className="text-sm text-muted-foreground">{cert.estimatedCompletion}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-sm font-medium">{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {cert.requirements.map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                          >
                            {req.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-sm">{req.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Completed Certifications */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Completed Certifications</h2>
                {certifications.completed.map((cert) => (
                  <Card key={cert.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-4">
                        <Award className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">Grade: {cert.grade}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed {cert.completionDate}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/verify/${cert.verificationId}`}>
                          <Shield className="h-4 w-4 mr-2" />
                          Verify
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Available Certifications */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Available Certifications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {certifications.available.map((cert) => (
                    <Card key={cert.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cert.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {cert.level}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {cert.duration}</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Prerequisites:</p>
                          <div className="flex flex-wrap gap-2">
                            {cert.prerequisites.map((prereq, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 rounded-full bg-accent"
                              >
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full">Start Certification</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Industry Recognition */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Industry Recognition</h3>
                <div className="space-y-4">
                  {partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent"
                    >
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Career Impact */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Career Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Boost your professional profile
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/profile/linkedin">
                      <div className="flex items-center">
                        <LinkedinIcon className="mr-2 h-4 w-4" />
                        Add to LinkedIn
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/profile/portfolio">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Add to Portfolio
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Verification Info */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Verification System</h3>
                    <p className="text-sm text-muted-foreground">
                      Blockchain-secured credentials
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  All certifications are secured using blockchain technology for
                  tamper-proof verification.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/verification/learn-more">Learn More</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}