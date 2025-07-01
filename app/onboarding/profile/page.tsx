"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  User,
  Briefcase,
  GraduationCap,
  Building2,
  BookOpen,
  Laptop,
  Users,
  Bell,
  Lock,
  ArrowLeft,
  Save,
  HelpCircle,
  Check,
  Camera
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfileCompletionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("")

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Progress Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Progress value={100} className="w-40" />
            <span className="text-sm text-muted-foreground">Step 5 of 5</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          {/* Introduction */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-teal-100 rounded-full mb-4">
              <Check className="h-6 w-6 text-teal-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter gradient-text mb-4">
              Almost Done!
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete your profile to get the most personalized learning experience.
              This information helps us match you with relevant courses and connect you with peers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Personal Information */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <User className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Personal Details</h2>
                  <p className="text-muted-foreground">Basic information about you</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Your full name" />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select id="gender" className="w-full p-2 border rounded-md">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Profile Photo</Label>
                    <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
                      {profileImage ? (
                        <div className="relative w-32 h-32">
                          <Image
                            src={profileImage}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-0 right-0"
                            onClick={() => setProfileImage("")}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <Button variant="outline">Upload Photo</Button>
                          <p className="text-sm text-muted-foreground mt-2">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <select id="location" className="w-full p-2 border rounded-md">
                      <option value="">Select country</option>
                      <option value="KE">Kenya</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Ethiopia</option>
                      <option value="ET">Ethiopia</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Professional Background */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Briefcase className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Professional Information</h2>
                  <p className="text-muted-foreground">Your work experience and skills</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="occupation">Current Occupation</Label>
                    <Input id="occupation" placeholder="Your current role" />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry Sector</Label>
                    <select id="industry" className="w-full p-2 border rounded-md">
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="retail">Retail</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      placeholder="Years of work experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employment">Employment Status</Label>
                    <select id="employment" className="w-full p-2 border rounded-md">
                      <option value="">Select status</option>
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="student">Student</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Educational Background */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <GraduationCap className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Educational History</h2>
                  <p className="text-muted-foreground">Your academic background</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="education">Highest Education Level</Label>
                    <select id="education" className="w-full p-2 border rounded-md">
                      <option value="">Select education level</option>
                      <option value="high-school">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="doctorate">Doctorate</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="field">Field of Study</Label>
                    <Input id="field" placeholder="Your major or specialization" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      placeholder="Relevant certifications (optional)"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="studying" />
                    <Label htmlFor="studying">
                      I am currently studying
                    </Label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Experience */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Building2 className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Business Experience</h2>
                  <p className="text-muted-foreground">Your entrepreneurial background</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="business-status">Business Status</Label>
                    <select id="business-status" className="w-full p-2 border rounded-md">
                      <option value="">Select status</option>
                      <option value="planning">Planning stage</option>
                      <option value="starting">Starting up</option>
                      <option value="running">Currently running</option>
                      <option value="scaling">Scaling up</option>
                      <option value="none">No business yet</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="business-sector">Business Sector</Label>
                    <Input
                      id="business-sector"
                      placeholder="Your business industry (if applicable)"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="business-goals">Primary Business Goals</Label>
                    <select id="business-goals" className="w-full p-2 border rounded-md">
                      <option value="">Select goal</option>
                      <option value="start">Start a new business</option>
                      <option value="grow">Grow existing business</option>
                      <option value="digital">Digital transformation</option>
                      <option value="expand">Market expansion</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="challenges">Main Challenges</Label>
                    <Input
                      id="challenges"
                      placeholder="Biggest business challenges"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Learning Preferences */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <BookOpen className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Learning Preferences</h2>
                  <p className="text-muted-foreground">How you prefer to learn</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Learning Style</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="visual" />
                      <Label htmlFor="visual">Visual learning (videos, diagrams)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="audio" />
                      <Label htmlFor="audio">Audio learning (lectures, discussions)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reading" />
                      <Label htmlFor="reading">Reading (articles, books)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="practical" />
                      <Label htmlFor="practical">Practical (hands-on projects)</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Interaction Level</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="group" />
                      <Label htmlFor="group">Group learning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="individual" />
                      <Label htmlFor="individual">Individual learning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mentor" />
                      <Label htmlFor="mentor">Mentor guidance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="peer" />
                      <Label htmlFor="peer">Peer learning</Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technology Access */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Laptop className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Technology Setup</h2>
                  <p className="text-muted-foreground">Your learning environment</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Device Access</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="smartphone" />
                      <Label htmlFor="smartphone">Smartphone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tablet" />
                      <Label htmlFor="tablet">Tablet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="laptop" />
                      <Label htmlFor="laptop">Laptop/Desktop</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Internet Access</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reliable" />
                      <Label htmlFor="reliable">Reliable internet connection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="limited" />
                      <Label htmlFor="limited">Limited data plan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="offline" />
                      <Label htmlFor="offline">Need offline access</Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Community & Communication */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Users className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Community Engagement</h2>
                  <p className="text-muted-foreground">Your preferred interaction level</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Participation Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="discussions" />
                      <Label htmlFor="discussions">Forum discussions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="study-groups" />
                      <Label htmlFor="study-groups">Study groups</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mentorship" />
                      <Label htmlFor="mentorship">Mentorship program</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Communication Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-updates" />
                      <Label htmlFor="email-updates">Email updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms-reminders" />
                      <Label htmlFor="sms-reminders">SMS reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="app-notifications" />
                      <Label htmlFor="app-notifications">App notifications</Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Lock className="h-8 w-8 text-teal-600" />
                <div>
                  <h2 className="text-2xl font-bold">Privacy Settings</h2>
                  <p className="text-muted-foreground">Control your data and visibility</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="public-profile" />
                  <Label htmlFor="public-profile">
                    Make my profile visible to other learners
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="share-progress" />
                  <Label htmlFor="share-progress">
                    Share my learning progress with my network
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="recommendations" />
                  <Label htmlFor="recommendations">
                    Receive personalized course recommendations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="research" />
                  <Label htmlFor="research">
                    Participate in platform research and improvements
                  </Label>
                </div>
              </div>
            </Card>

            {/* Complete Profile Button */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="w-full max-w-xl bg-gradient-to-r from-teal-600 to-teal-500"
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? "Completing Setup..." : "Complete Profile & Start Learning"}
              </Button>
              <p className="text-sm text-muted-foreground">
                You can update these preferences anytime from your account settings
              </p>
            </div>
          </div>

          {/* Help and Support */}
          <div className="mt-12 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Need Help?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Profile Setup Help</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to get assistance:
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <Button variant="outline" className="justify-start">
                    Chat with Support
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View Profile FAQ
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Privacy Information
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex justify-between items-center">
            <Progress value={100} className="w-40" />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}