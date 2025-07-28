"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  User,
  Camera,
  MapPin,
  Calendar,
  Globe,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Settings,
  ChevronRight,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Edit,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
  Palette,
  BookOpen,
  PenTool
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { useRef } from "react"
import { withDefault, DEFAULT_AVATAR_URL } from "@/lib/defaults";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [profileImage, setProfileImage] = useState("/logo.jpg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Enhanced mock user data
  const userData = {
    name: "Sarah Kimani",
    displayName: "sarahk",
    title: "Digital Marketing Specialist",
    location: "Addis Ababa, Ethiopia",
    joinDate: "January 2024",
    membershipTier: "Premium",
    dateOfBirth: "1995-06-15",
    gender: "Female",
    primaryLanguage: "English",
    stats: {
      coursesCompleted: 12,
      learningStreak: 45,
      communityContributions: 28,
      mentorshipHours: 15
    },
    contact: {
      email: "sarah.kimani@example.com",
      emailVerified: true,
      phone: "+251936747488",
      emergencyContact: "John Doe (+254 711 000000)"
    },
    education: {
      level: "Bachelor's Degree",
      field: "Business Administration",
      institution: "University of Nairobi"
    },
    work: {
      status: "Employed",
      company: "Digital Solutions Ltd",
      role: "Marketing Manager"
    },
    skills: [
      { name: "Digital Marketing", level: 85 },
      { name: "Social Media Management", level: 90 },
      { name: "Content Creation", level: 75 },
      { name: "SEO", level: 70 }
    ],
    social: {
      linkedin: "linkedin.com/in/sarahkimani",
      twitter: "twitter.com/sarahkimani",
      github: "github.com/sarahkimani",
      facebook: "facebook.com/sarahkimani",
      instagram: "instagram.com/sarahkimani",
      behance: "behance.net/sarahkimani",
      medium: "medium.com/@sarahkimani",
      website: "sarahkimani.com"
    },
    bio: "Digital marketing professional with a passion for helping Ethiopian businesses succeed online. Experienced in creating and executing successful digital marketing campaigns.",
    professionalSummary: "Over 5 years of experience in digital marketing, specializing in social media strategy and content creation for Ethiopian markets.",
    learningJourneyStory: "Started my journey in traditional marketing before discovering the power of digital platforms. Now helping other entrepreneurs make the same transition."
  }

  const handleProfileUpdate = () => {
    setIsEditing(false)
    // Handle profile update logic here
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    // Handle account deletion logic here
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('/api/instructor/images/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }
      const data = await response.json();
      setProfileImage(data.url);
    } catch (error) {
      // Optionally show a toast
    }
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
            <span>Profile</span>
          </div>

          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                My Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          {/* Profile Completion */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold mb-1">Profile Completion</h2>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to unlock all platform features
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">85%</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <Progress value={85} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Add your professional experience to reach 100%
            </p>
          </Card>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={withDefault(profileImage, DEFAULT_AVATAR_URL)}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full"
                      onClick={handleImageUpload}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.title}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {userData.location}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Member since: </span>
                      <span className="font-medium">{userData.joinDate}</span>
                    </div>
                    <div className="text-sm">
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        {userData.membershipTier}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold gradient-text">
                        {userData.stats.coursesCompleted}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Courses Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold gradient-text">
                        {userData.stats.learningStreak}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Day Streak
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold gradient-text">
                        {userData.stats.communityContributions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Contributions
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold gradient-text">
                        {userData.stats.mentorshipHours}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mentor Hours
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Social Profiles</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.linkedin} target="_blank">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.github} target="_blank">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.twitter} target="_blank">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.facebook} target="_blank">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.instagram} target="_blank">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.behance} target="_blank">
                      <Palette className="h-4 w-4 mr-2" />
                      Behance
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.medium} target="_blank">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Medium
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={userData.social.website} target="_blank">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Website
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Profile Content */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            defaultValue={userData.name.split(" ")[0]}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            defaultValue={userData.name.split(" ")[1]}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          defaultValue={userData.displayName}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            defaultValue={userData.contact.email}
                            disabled={!isEditing}
                          />
                          {userData.contact.emailVerified && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-green-500">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue={userData.contact.phone}
                          disabled={!isEditing}
                        />
                        <p className="text-xs text-muted-foreground">
                          Country code selector coming soon
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          defaultValue={userData.contact.emergencyContact}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            defaultValue={userData.dateOfBirth}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            id="gender"
                            className="w-full p-2 border rounded-md"
                            defaultValue={userData.gender}
                            disabled={!isEditing}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primaryLanguage">Primary Language</Label>
                        <select
                          id="primaryLanguage"
                          className="w-full p-2 border rounded-md"
                          defaultValue={userData.primaryLanguage}
                          disabled={!isEditing}
                        >
                          <option value="English">English</option>
                          <option value="French">French</option>
                          <option value="Swahili">Swahili</option>
                          <option value="Arabic">Arabic</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          defaultValue={userData.location}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="w-full h-32 p-2 border rounded-md resize-none"
                          defaultValue={userData.bio}
                          disabled={!isEditing}
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">
                          Rich text editor coming soon • Maximum 500 characters
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="professionalSummary">Professional Summary</Label>
                        <textarea
                          id="professionalSummary"
                          className="w-full h-24 p-2 border rounded-md resize-none"
                          defaultValue={userData.professionalSummary}
                          disabled={!isEditing}
                          maxLength={250}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum 250 characters
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="learningJourneyStory">Learning Journey Story</Label>
                        <textarea
                          id="learningJourneyStory"
                          className="w-full h-40 p-2 border rounded-md resize-none"
                          defaultValue={userData.learningJourneyStory}
                          disabled={!isEditing}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                          Share your learning journey • Maximum 1000 characters
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="professional">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          defaultValue={userData.title}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          defaultValue={userData.work.company}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Current Role</Label>
                        <Input
                          id="role"
                          defaultValue={userData.work.role}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Employment Status</Label>
                        <select
                          id="status"
                          className="w-full p-2 border rounded-md"
                          defaultValue={userData.work.status}
                          disabled={!isEditing}
                        >
                          <option value="Employed">Employed</option>
                          <option value="Self-employed">Self-employed</option>
                          <option value="Student">Student</option>
                          <option value="Unemployed">Unemployed</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="education">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="education">Highest Education</Label>
                        <select
                          id="education"
                          className="w-full p-2 border rounded-md"
                          defaultValue={userData.education.level}
                          disabled={!isEditing}
                        >
                          <option value="High School">High School</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="Doctorate">Doctorate</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field">Field of Study</Label>
                        <Input
                          id="field"
                          defaultValue={userData.education.field}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          defaultValue={userData.education.institution}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills">
                    <div className="space-y-6">
                      {userData.skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <Label>{skill.name}</Label>
                            <span>{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} />
                        </div>
                      ))}
                      {isEditing && (
                        <Button className="w-full">
                          <PenTool className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-red-200">
                <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete your account? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}