"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BookOpen, Users, Clock, DollarSign, Tag } from "lucide-react"

interface CourseData {
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  tags: string[]
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

interface CourseReviewStepProps {
  courseData: CourseData
}

export function CourseReviewStep({ courseData }: CourseReviewStepProps) {
  const totalLessons = courseData.modules.reduce((total, module) => total + module.lessons.length, 0)
  const estimatedDuration = totalLessons * 10 // Assuming 10 minutes per lesson

  const levelEmojis = {
    beginner: "🌱",
    intermediate: "🚀",
    advanced: "⭐",
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E8E8] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#1B4D3E]/5 to-[#4ECDC4]/5">
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#1B4D3E]" />
            Course Review
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Course Overview */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">{courseData.title}</h2>
                <p className="text-[#2C3E50]/70 leading-relaxed">{courseData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F7F9F9] rounded-lg p-4 border border-[#E5E8E8]">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-sm font-medium text-[#2C3E50]">Category</span>
                  </div>
                  <p className="text-[#2C3E50] font-semibold">{courseData.category}</p>
                </div>

                <div className="bg-[#F7F9F9] rounded-lg p-4 border border-[#E5E8E8]">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-sm font-medium text-[#2C3E50]">Level</span>
                  </div>
                  <p className="text-[#2C3E50] font-semibold">
                    {levelEmojis[courseData.level]}{" "}
                    {courseData.level.charAt(0).toUpperCase() + courseData.level.slice(1)}
                  </p>
                </div>

                <div className="bg-[#F7F9F9] rounded-lg p-4 border border-[#E5E8E8]">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-sm font-medium text-[#2C3E50]">Duration</span>
                  </div>
                  <p className="text-[#2C3E50] font-semibold">
                    ~{Math.round(estimatedDuration / 60)}h {estimatedDuration % 60}m
                  </p>
                </div>

                <div className="bg-[#F7F9F9] rounded-lg p-4 border border-[#E5E8E8]">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-sm font-medium text-[#2C3E50]">Price</span>
                  </div>
                  <p className="text-[#2C3E50] font-semibold">
                    {courseData.price === 0 ? "Free" : `$${courseData.price.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {courseData.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-sm font-medium text-[#2C3E50]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Course Media */}
            <div className="space-y-4">
              {courseData.thumbnailUrl && (
                <div>
                  <h3 className="text-sm font-medium text-[#2C3E50] mb-2">Course Thumbnail</h3>
                  <img
                    src={courseData.thumbnailUrl || "/placeholder.svg"}
                    alt="Course thumbnail"
                    className="w-full h-48 object-cover rounded-lg border border-[#E5E8E8]"
                  />
                </div>
              )}

              {courseData.promoVideoUrl && (
                <div>
                  <h3 className="text-sm font-medium text-[#2C3E50] mb-2">Promotional Video</h3>
                  <video
                    src={courseData.promoVideoUrl}
                    controls
                    className="w-full h-48 rounded-lg border border-[#E5E8E8]"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Structure Review */}
      <Card className="border-[#E5E8E8] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
            📚 Course Structure ({courseData.modules.length} modules, {totalLessons} lessons)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {courseData.modules.map((module, index) => (
              <div key={module.id} className="border border-[#E5E8E8] rounded-lg p-4">
                <h3 className="font-semibold text-[#2C3E50] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {module.title}
                </h3>
                <div className="ml-8 space-y-1">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center gap-2 text-sm text-[#2C3E50]/70">
                      <span className="w-4 h-4 bg-[#4ECDC4]/20 text-[#4ECDC4] rounded-full flex items-center justify-center text-xs">
                        {lessonIndex + 1}
                      </span>
                      {lesson.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Card className="border-[#1B4D3E]/20 bg-gradient-to-r from-[#1B4D3E]/5 to-[#4ECDC4]/5">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-[#1B4D3E] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Ready to Launch! 🚀</h3>
          <p className="text-[#2C3E50]/70 mb-4">
            Your course is ready to be published. Once published, students will be able to discover and enroll in your
            course.
          </p>
          <p className="text-sm text-[#2C3E50]/60">
            You can always edit your course content, add more lessons, and update pricing after publishing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 