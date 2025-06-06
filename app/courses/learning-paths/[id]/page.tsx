"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  Star,
  Target,
  Brain,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Lock,
  BarChart3,
  Zap,
  Trophy
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock learning path data
const learningPath = {
  id: "digital-marketing-expert",
  title: "Digital Marketing Expert Path",
  description: "Master digital marketing skills specifically tailored for African markets. From basics to advanced strategies, this comprehensive path will transform you into a digital marketing professional.",
  duration: "6 months",
  courseCount: 5,
  difficulty: "Beginner to Advanced",
  enrolled: 2456,
  progress: 35,
  outcomes: [
    "Create comprehensive digital marketing strategies",
    "Master social media marketing for African markets",
    "Develop successful email marketing campaigns",
    "Implement SEO best practices",
    "Analyze and optimize marketing performance",
    "Build and manage online communities"
  ],
  careerBenefits: [
    "Digital Marketing Manager positions",
    "Social Media Consultant roles",
    "Marketing Strategy positions",
    "Freelance opportunities",
    "Agency leadership roles"
  ],
  courses: [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      description: "Learn the basics of digital marketing and build a strong foundation.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      duration: "4 weeks",
      lessons: 24,
      completed: true,
      skills: ["Marketing Basics", "Digital Channels", "Marketing Strategy"],
      instructor: {
        name: "Sarah Kimani",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    },
    {
      id: 2,
      title: "Social Media Marketing Mastery",
      description: "Deep dive into social media marketing strategies for African markets.",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
      duration: "6 weeks",
      lessons: 36,
      completed: false,
      inProgress: true,
      progress: 60,
      skills: ["Social Media Strategy", "Content Creation", "Community Management"],
      instructor: {
        name: "John Okafor",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      }
    },
    {
      id: 3,
      title: "Email Marketing & Automation",
      description: "Master email marketing and automation tools for business growth.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      duration: "4 weeks",
      lessons: 20,
      completed: false,
      locked: true,
      prerequisite: "Social Media Marketing Mastery",
      skills: ["Email Strategy", "Automation", "Lead Nurturing"],
      instructor: {
        name: "Grace Mensah",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    }
  ],
  milestones: [
    {
      title: "Digital Marketing Foundation",
      description: "Complete fundamental courses and first project",
      completed: true,
      reward: "Foundation Certificate"
    },
    {
      title: "Social Media Specialist",
      description: "Master social media marketing and community management",
      completed: false,
      inProgress: true,
      reward: "Social Media Certificate"
    },
    {
      title: "Marketing Automation Expert",
      description: "Advanced automation and campaign management",
      completed: false,
      locked: true,
      reward: "Automation Certificate"
    }
  ],
  skills: {
    marketing: {
      name: "Marketing Strategy",
      level: 75,
      industry: 85
    },
    social: {
      name: "Social Media",
      level: 60,
      industry: 70
    },
    analytics: {
      name: "Analytics",
      level: 45,
      industry: 65
    }
  },
  achievements: [
    {
      title: "Fast Learner",
      description: "Completed first course in record time",
      icon: Zap,
      date: "2024-02-01"
    },
    {
      title: "Project Master",
      description: "Completed 5 practical projects",
      icon: Trophy,
      date: "2024-02-15"
    }
  ],
  recommendations: {
    focus: ["Email Marketing", "Analytics Tools", "Content Strategy"],
    alternate: "Content Marketing Specialist Path",
    pace: "On track - 2 hours/day recommended"
  }
}

export default function LearningPathPage() {
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-50 via-teal-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text mb-6">
              {learningPath.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {learningPath.description}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{learningPath.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{learningPath.courseCount} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>{learningPath.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{learningPath.enrolled} Enrolled</span>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-orange-600 to-orange-500">
              Start Learning Path
            </Button>
          </div>

          {/* Progress Overview */}
          <Card className="p-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your Progress</h3>
              <span className="text-sm text-muted-foreground">
                {learningPath.progress}% Complete
              </span>
            </div>
            <Progress value={learningPath.progress} className="mb-4" />
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold">2/5</div>
                <div className="text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="font-semibold">15/42</div>
                <div className="text-muted-foreground">Lessons</div>
              </div>
              <div>
                <div className="font-semibold">3/8</div>
                <div className="text-muted-foreground">Projects</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Course Timeline */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold mb-6">Learning Journey</h2>
            <div className="space-y-6">
              {learningPath.courses.map((course, index) => (
                <Card
                  key={course.id}
                  className={`relative ${
                    course.locked ? 'opacity-75' : ''
                  }`}
                >
                  {index < learningPath.courses.length - 1 && (
                    <div className="absolute left-8 -bottom-6 w-0.5 h-6 bg-border z-0" />
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-2 ${
                        course.completed ? 'bg-green-100' :
                        course.inProgress ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        {course.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : course.locked ? (
                          <Lock className="h-6 w-6 text-gray-500" />
                        ) : (
                          <Target className="h-6 w-6 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        <p className="text-muted-foreground mb-4">{course.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.lessons} Lessons</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{course.instructor.name}</span>
                          </div>
                        </div>
                        {course.skills && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {course.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-accent rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {course.inProgress && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} />
                          </div>
                        )}
                        {course.prerequisite && (
                          <p className="text-sm text-orange-500">
                            Prerequisite: {course.prerequisite}
                          </p>
                        )}
                        <Button
                          variant={course.locked ? "outline" : "default"}
                          disabled={course.locked}
                          className="mt-4"
                        >
                          {course.completed ? "Review Course" :
                           course.inProgress ? "Continue Course" :
                           course.locked ? "Locked" : "Start Course"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Milestones */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Milestones & Achievements</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {learningPath.milestones.map((milestone, index) => (
                  <Card key={index} className="p-6">
                    <div className={`rounded-full p-2 w-12 h-12 mb-4 ${
                      milestone.completed ? 'bg-green-100' :
                      milestone.inProgress ? 'bg-orange-100' :
                      'bg-gray-100'
                    }`}>
                      {milestone.completed ? (
                        <Trophy className="h-8 w-8 text-green-500" />
                      ) : milestone.locked ? (
                        <Lock className="h-8 w-8 text-gray-500" />
                      ) : (
                        <Award className="h-8 w-8 text-orange-500" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {milestone.description}
                    </p>
                    <div className="text-sm text-orange-500">
                      Reward: {milestone.reward}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Progress */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Skills Development</h3>
              <div className="space-y-4">
                {Object.entries(learningPath.skills).map(([key, skill]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="mb-1" />
                    <div className="text-xs text-muted-foreground">
                      Industry Average: {skill.industry}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Personalized Recommendations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {learningPath.recommendations.focus.map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Learning Pace</h4>
                  <p className="text-sm text-muted-foreground">
                    {learningPath.recommendations.pace}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Alternative Path</h4>
                  <Button variant="outline" size="sm" className="w-full">
                    {learningPath.recommendations.alternate}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {learningPath.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-orange-100 rounded-full p-2">
                      <achievement.icon className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}