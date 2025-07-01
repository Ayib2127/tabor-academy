"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Settings, ImageIcon, Eye, Loader2, Send } from "lucide-react"
import { CourseBasicsStep } from "@/components/instructor/course-builder/course-basics-step"
import { CourseStructureStep } from "@/components/instructor/course-builder/course-structure-step"
import { CourseMediaStep } from "@/components/instructor/course-builder/course-media-step"
import CourseReviewStep from "@/components/instructor/course-builder/course-review-step"
import { toast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"
import { useRouter } from "next/navigation"

interface CourseData {
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  tags: string[]
  deliveryType: "self_paced" | "cohort"
  startDate?: string
  endDate?: string
  registrationDeadline?: string
  price: number
  thumbnailUrl: string
  promoVideoUrl: string
  modules: Array<{
    id: number
    title: string
    lessons: Array<{
      id: number
      title: string
    }>
  }>
}

const steps = [
  { id: 1, title: "Course Basics", icon: BookOpen, description: "Title, description, and category" },
  { id: 2, title: "Course Structure", icon: Settings, description: "Modules and lessons" },
  { id: 3, title: "Media & Pricing", icon: ImageIcon, description: "Thumbnail, video, and price" },
  { id: 4, title: "Review & Publish", icon: Eye, description: "Final review and publish" },
]

export default function CourseWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    deliveryType: "self_paced",
    startDate: undefined,
    endDate: undefined,
    registrationDeadline: undefined,

    tags: [],
    price: 0,
    thumbnailUrl: "",
    promoVideoUrl: "",
    modules: [],
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateCourseData = (updates: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CourseBasicsStep courseData={courseData} updateCourseData={updateCourseData} />
      case 2:
        return <CourseStructureStep courseData={courseData} updateCourseData={updateCourseData} />
      case 3:
        return <CourseMediaStep courseData={courseData} updateCourseData={updateCourseData} />
      case 4:
        return <CourseReviewStep courseData={courseData} />
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          courseData.title.trim() &&
          courseData.description.trim() &&
          courseData.category &&
          courseData.level &&
          courseData.deliveryType &&
          (courseData.deliveryType === 'self_paced' || (
            courseData.startDate && courseData.endDate && courseData.registrationDeadline
          ))
        )
      case 2:
        return (
          courseData.modules.length > 0 &&
          courseData.modules.every((m) => m.title.trim()) &&
          courseData.modules.some((m) => m.lessons.length > 0) &&
          courseData.modules.every((m) => m.lessons.every((l) => l.title.trim()))
        )
      case 3:
        return true // Media step is optional
      case 4:
        return true // Review step is always enabled
      default:
        return false
    }
  }

  const handleCreateCourse = async () => {
    setIsSubmitting(true)
    try {
      // Prepare payload and remove promoVideoUrl if empty or invalid
      const payload = { ...courseData };
      if (!payload.promoVideoUrl || typeof payload.promoVideoUrl !== 'string' || !/^https?:\/\//.test(payload.promoVideoUrl)) {
        delete payload.promoVideoUrl;
      }
      const response = await fetch('/api/instructor/courses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to create course')
      toast({
        title: 'Success',
        description: result.message || 'Course created successfully!'
      })
      // Redirect to the new course page
      if (result.course && result.course.id) {
        router.push(`/dashboard/instructor/courses/${result.course.id}`)
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create course'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F9] to-white">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">Create New Course</h1>
              <p className="text-[#2C3E50]/70">Build an engaging learning experience step by step</p>
            </div>
          </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#2C3E50]">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-[#2C3E50]/70">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#E5E8E8]" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const Icon = step.icon

            return (
              <Card
                key={step.id}
                className={`relative transition-all duration-200 ${
                  isActive
                    ? "ring-2 ring-[#FF6B35] bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5"
                    : isCompleted
                      ? "bg-[#1B4D3E]/5 border-[#1B4D3E]/20"
                      : "bg-white hover:bg-[#F7F9F9]"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-[#FF6B35] text-white"
                          : isCompleted
                            ? "bg-[#1B4D3E] text-white"
                            : "bg-[#E5E8E8] text-[#2C3E50]/60"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-sm ${
                          isActive ? "text-[#FF6B35]" : isCompleted ? "text-[#1B4D3E]" : "text-[#2C3E50]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#2C3E50]/60 truncate">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {currentStep < steps.length ? (
              <Button 
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateCourse}
                className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Create Course
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}