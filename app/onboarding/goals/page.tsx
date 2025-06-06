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
  Rocket,
  Briefcase,
  GraduationCap,
  DollarSign,
  ArrowRight,
  Users,
  Heart,
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Timer,
  Target,
  Bell,
  HelpCircle
} from "lucide-react"
import Link from "next/link"

export default function GoalSettingPage() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState<string>("")
  const [selectedTimeline, setSelectedTimeline] = useState<string>("")
  const [selectedCommitment, setSelectedCommitment] = useState<string>("")
  const [objectives, setObjectives] = useState<string[]>([])
  const [customObjective, setCustomObjective] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const primaryGoals = [
    {
      id: "business",
      icon: Rocket,
      title: "Start My Own Business",
      description: "Launch and grow a successful online business"
    },
    {
      id: "career",
      icon: Briefcase,
      title: "Advance My Career",
      description: "Gain skills to progress in your current role"
    },
    {
      id: "skills",
      icon: GraduationCap,
      title: "Learn New Digital Skills",
      description: "Master modern digital tools and technologies"
    },
    {
      id: "income",
      icon: DollarSign,
      title: "Increase My Income",
      description: "Develop high-income digital skills"
    },
    {
      id: "change",
      icon: ArrowRight,
      title: "Change Career Path",
      description: "Transition to a new digital career"
    },
    {
      id: "personal",
      icon: Heart,
      title: "Personal Development",
      description: "Grow your skills for personal projects"
    }
  ]

  const timelineOptions = [
    {
      id: "3months",
      title: "3 Months (Intensive)",
      description: "Fast-paced learning for quick results",
      commitment: "High commitment required"
    },
    {
      id: "6months",
      title: "6 Months (Balanced)",
      description: "Steady progress with balanced pace",
      commitment: "Medium commitment required"
    },
    {
      id: "12months",
      title: "12 Months (Comprehensive)",
      description: "In-depth learning with flexible schedule",
      commitment: "Regular, manageable commitment"
    },
    {
      id: "flexible",
      title: "Flexible Timeline",
      description: "Learn at your own pace",
      commitment: "Self-paced commitment"
    }
  ]

  const commitmentOptions = [
    {
      id: "30min",
      title: "30 minutes per day",
      description: "Perfect for busy schedules"
    },
    {
      id: "1hour",
      title: "1 hour per day",
      description: "Balanced learning commitment"
    },
    {
      id: "2hours",
      title: "2+ hours per day",
      description: "Accelerated progress"
    },
    {
      id: "weekend",
      title: "Weekend learning",
      description: "Concentrated weekend sessions"
    },
    {
      id: "flexible",
      title: "Flexible schedule",
      description: "Learn when you can"
    }
  ]

  const objectiveOptions = {
    business: [
      "Launch an e-commerce store",
      "Start a digital service business",
      "Create a mobile app",
      "Build a freelance business",
      "Develop a digital product"
    ],
    career: [
      "Get promoted to a senior role",
      "Lead digital projects",
      "Improve team productivity",
      "Manage digital transformation",
      "Develop leadership skills"
    ],
    skills: [
      "Master digital marketing",
      "Learn web development",
      "Understand data analytics",
      "Master productivity tools",
      "Learn project management"
    ]
  }[selectedGoal as keyof typeof objectiveOptions] || []

  const handleContinue = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/onboarding/language")
  }

  const handleAddCustomObjective = () => {
    if (customObjective.trim()) {
      setObjectives(prev => [...prev, customObjective.trim()])
      setCustomObjective("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Progress Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Progress value={60} className="w-40" />
            <span className="text-sm text-muted-foreground">Step 3 of 5</span>
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
            <h1 className="text-4xl font-bold tracking-tighter gradient-text mb-4">
              What Do You Want to Achieve?
            </h1>
            <p className="text-lg text-muted-foreground">
              Let's set clear goals for your learning journey. This will help us create a
              personalized path that aligns with your aspirations.
            </p>
          </div>

          {/* Primary Goal Selection */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Choose Your Main Learning Goal</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {primaryGoals.map((goal) => (
                <Card 
                  key={goal.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedGoal === goal.id ? 'ring-2 ring-teal-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      selectedGoal === goal.id ? 'bg-teal-100' : 'bg-gray-100'
                    }`}>
                      <goal.icon className={`h-6 w-6 ${
                        selectedGoal === goal.id ? 'text-teal-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {selectedGoal && (
            <>
              {/* Specific Objectives */}
              <div className="mb-16">
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-6">Select Specific Objectives</h3>
                  <div className="space-y-4 mb-6">
                    {objectiveOptions.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Checkbox
                          id={`objective-${index}`}
                          checked={objectives.includes(objective)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setObjectives(prev => [...prev, objective])
                            } else {
                              setObjectives(prev => prev.filter(obj => obj !== objective))
                            }
                          }}
                        />
                        <Label
                          htmlFor={`objective-${index}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {objective}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom objective..."
                      value={customObjective}
                      onChange={(e) => setCustomObjective(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCustomObjective()
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={handleAddCustomObjective}
                    >
                      Add
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Timeline Selection */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">When Do You Want to Achieve This?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {timelineOptions.map((option) => (
                    <Card 
                      key={option.id}
                      className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedTimeline === option.id ? 'ring-2 ring-teal-500 shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedTimeline(option.id)}
                    >
                      <Calendar className={`h-8 w-8 mb-4 ${
                        selectedTimeline === option.id ? 'text-teal-600' : 'text-gray-600'
                      }`} />
                      <h3 className="font-semibold mb-2">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {option.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.commitment}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Commitment */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">How Much Time Can You Dedicate?</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {commitmentOptions.map((option) => (
                    <Card 
                      key={option.id}
                      className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedCommitment === option.id ? 'ring-2 ring-teal-500 shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedCommitment(option.id)}
                    >
                      <Timer className={`h-8 w-8 mb-4 ${
                        selectedCommitment === option.id ? 'text-teal-600' : 'text-gray-600'
                      }`} />
                      <h3 className="font-semibold mb-2">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Success Metrics & Motivation */}
              <div className="mb-16">
                <Card className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Target className="h-8 w-8 text-teal-600 mb-4" />
                      <h3 className="text-xl font-bold mb-4">Success Metrics</h3>
                      <div className="space-y-4">
                        <Input placeholder="Define a measurable goal..." />
                        <p className="text-sm text-muted-foreground">
                          Example: "Increase monthly income by $500" or "Launch online store in 6 months"
                        </p>
                      </div>
                    </div>
                    <div>
                      <Bell className="h-8 w-8 text-teal-600 mb-4" />
                      <h3 className="text-xl font-bold mb-4">Accountability</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="reminders" />
                          <Label htmlFor="reminders">Enable progress reminders</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="partner" />
                          <Label htmlFor="partner">Find an accountability partner</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Continue Button */}
              <div className="max-w-xl mx-auto">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-500"
                  onClick={handleContinue}
                  disabled={!selectedGoal || !selectedTimeline || !selectedCommitment || isLoading}
                >
                  {isLoading ? "Saving Goals..." : "Continue to Language Setup"}
                </Button>
              </div>
            </>
          )}

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
                  <DialogTitle>Goal Setting Help</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to get assistance:
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <Button variant="outline" className="justify-start">
                    Chat with a Learning Advisor
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View Goal Setting Tips
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Schedule a Consultation
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
            <Progress value={60} className="w-40" />
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