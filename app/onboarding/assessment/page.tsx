"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  BarChart3, 
  ShoppingCart, 
  Code, 
  Coins, 
  Users, 
  Laptop, 
  HelpCircle, 
  ArrowLeft,
  Save,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Pause,
  Check
} from "lucide-react"
import Link from "next/link"

export default function SkillAssessmentPage() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<"categories" | "assessment">("categories")
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const skillCategories = [
    {
      id: "digital-marketing",
      icon: BarChart3,
      title: "Digital Marketing & Social Media",
      description: "Learn to promote businesses and engage customers online"
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      title: "E-commerce & Online Business",
      description: "Build and manage successful online stores"
    },
    {
      id: "no-code",
      icon: Code,
      title: "No-Code Development & Apps",
      description: "Create websites and apps without coding"
    },
    {
      id: "finance",
      icon: Coins,
      title: "Financial Literacy & Management",
      description: "Master business finance and money management"
    },
    {
      id: "leadership",
      icon: Users,
      title: "Leadership & Communication",
      description: "Develop essential business leadership skills"
    },
    {
      id: "technical",
      icon: Laptop,
      title: "Technical Skills & Tools",
      description: "Learn essential digital tools and technologies"
    }
  ]

  const skillLevels = [
    {
      level: "Beginner",
      description: "New to the subject, learning basics",
      examples: "Understanding core concepts"
    },
    {
      level: "Intermediate",
      description: "Familiar with fundamentals, gaining confidence",
      examples: "Applying knowledge in simple projects"
    },
    {
      level: "Advanced",
      description: "Proficient in most areas, seeking mastery",
      examples: "Teaching others, handling complex tasks"
    },
    {
      level: "Expert",
      description: "Deep understanding, extensive experience",
      examples: "Creating innovative solutions"
    }
  ]

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      return // Show error or disable button
    }
    setCurrentStep("assessment")
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/onboarding/goals")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Progress Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Progress value={40} className="w-40" />
            <span className="text-sm text-muted-foreground">Step 2 of 5</span>
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
              Let's Assess Your Current Skills
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              This assessment helps us personalize your learning journey. Don't worry - there are no wrong answers!
              We just want to understand your current knowledge level.
            </p>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Estimated time: 10-15 minutes
            </div>
          </div>

          {currentStep === "categories" ? (
            <>
              {/* Skill Categories */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-8 text-center">Select Areas to Assess</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillCategories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id)
                    return (
                      <Card 
                        key={category.id}
                        className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                          isSelected ? 'ring-2 ring-teal-500 shadow-lg' : ''
                        }`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`rounded-full p-2 ${
                            isSelected ? 'bg-teal-100' : 'bg-gray-100'
                          }`}>
                            <category.icon className={`h-6 w-6 ${
                              isSelected ? 'text-teal-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <Check className="h-5 w-5 text-teal-600" />
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Skill Levels */}
              <div className="mb-12">
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-6">Skill Level Guide</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    {skillLevels.map((level, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold">{level.level}</h4>
                        <p className="text-sm text-muted-foreground">
                          {level.description}
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                          Example: {level.examples}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <p>Not sure? Don't worry - start with Beginner and adjust as you learn!</p>
                  </div>
                </Card>
              </div>

              {/* Continue Button */}
              <div className="max-w-xl mx-auto">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-500"
                  disabled={selectedCategories.length === 0}
                  onClick={handleContinue}
                >
                  Continue to Assessment
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-4">
                  {selectedCategories.length === 0 
                    ? "Please select at least one skill category to continue"
                    : `${selectedCategories.length} categories selected`
                  }
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Assessment Questions */}
              <div className="max-w-3xl mx-auto">
                <Card className="p-8 mb-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">Question {currentQuestion} of 20</h2>
                    <Progress value={(currentQuestion / 20) * 100} className="w-40" />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        How comfortable are you with creating and managing social media marketing campaigns?
                      </h3>
                      <div className="space-y-4">
                        {["Very Comfortable", "Somewhat Comfortable", "Basic Understanding", "No Experience", "I'm not sure"].map((answer, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start h-auto p-4 text-left"
                          >
                            {answer}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Navigation Controls */}
                <div className="flex justify-between items-center">
                  <Button variant="outline" disabled={currentQuestion === 1}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pause Assessment?</DialogTitle>
                          <DialogDescription>
                            Your progress will be saved. You can continue later from where you left off.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4 mt-4">
                          <Button variant="outline">Save & Exit</Button>
                          <Button>Continue Assessment</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {currentQuestion < 20 ? (
                      <Button>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        className="bg-gradient-to-r from-teal-600 to-teal-500"
                        onClick={handleComplete}
                        disabled={isLoading}
                      >
                        {isLoading ? "Completing..." : "Complete Assessment"}
                      </Button>
                    )}
                  </div>
                </div>
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
                  <DialogTitle>Assessment Help</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to get assistance:
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <Button variant="outline" className="justify-start">
                    Chat with Support
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View Assessment FAQ
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Report a Problem
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
            <Progress value={40} className="w-40" />
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