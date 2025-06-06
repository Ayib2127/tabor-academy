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
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Users,
  CheckCircle,
  Upload,
  HelpCircle,
  Star
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ScholarshipApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setCurrentStep(currentStep + 1)
  }

  const scholarships = [
    {
      title: "General Merit Scholarship",
      amount: "Full Tuition",
      deadline: "April 30, 2024",
      eligibility: ["Outstanding academic record", "Leadership potential", "Community involvement"],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
    },
    {
      title: "Women in Tech Scholarship",
      amount: "75% Tuition",
      deadline: "May 15, 2024",
      eligibility: ["Female applicants", "Interest in technology", "Demonstrated potential"],
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095"
    },
    {
      title: "Youth Entrepreneur Grant",
      amount: "50% Tuition",
      deadline: "June 1, 2024",
      eligibility: ["Age 18-25", "Business idea", "Entrepreneurial spirit"],
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216"
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
            <span>Scholarship Application</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Eligibility</span>
              <span className="text-sm font-medium">Application</span>
              <span className="text-sm font-medium">Documents</span>
              <span className="text-sm font-medium">Review</span>
            </div>
            <Progress value={currentStep * 25} className="h-2" />
          </div>

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
                  Available Scholarships
                </h1>
                <p className="text-muted-foreground">
                  Choose from our available scholarship programs designed to support aspiring learners in Africa.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {scholarships.map((scholarship, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={scholarship.image}
                        alt={scholarship.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{scholarship.title}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-lg font-medium">{scholarship.amount}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Deadline: {scholarship.deadline}</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {scholarship.eligibility.map((criteria, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" onClick={() => setCurrentStep(2)}>
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country of Residence</Label>
                    <select
                      id="country"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select your country</option>
                      <option value="KE">Kenya</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Africa</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Education Level</Label>
                    <select
                      id="education"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="high-school">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Continue to Documents"}
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Required Documents</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Academic Transcripts</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your transcripts here, or click to browse
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Proof of Income</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload documents showing financial need
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Letter of Recommendation</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload your recommendation letter
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setCurrentStep(4)}
                    disabled={isSubmitting}
                  >
                    Continue to Review
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <div className="text-center mb-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Application Complete!</h2>
                  <p className="text-muted-foreground">
                    Your scholarship application has been submitted successfully.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-accent rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Next Steps</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Application review (2-3 weeks)
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Interview scheduling (if selected)
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Final decision notification
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" asChild>
                      <Link href="/dashboard">Return to Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/application-status">
                        Check Application Status
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help with your application?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}