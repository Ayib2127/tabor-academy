"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

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
}

interface CourseBasicsStepProps {
  courseData: CourseData
  updateCourseData: (updates: Partial<CourseData>) => void
}

const categories = [
  "Digital Marketing",
  "No-Code Development",
  "E-commerce",
  "AI Tools",
  "Civil Engineering",
  "Financial Literacy",
  "Entrepreneurship",
  "Freelancing",
]

export function CourseBasicsStep({ courseData, updateCourseData }: CourseBasicsStepProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      updateCourseData({
        tags: [...courseData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateCourseData({
      tags: courseData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E8E8] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">📚 Course Foundation</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#2C3E50] font-semibold">
              Course Title *
            </Label>
            <Input
              id="title"
              value={courseData.title}
              onChange={(e) => updateCourseData({ title: e.target.value })}
              placeholder="e.g., Master Digital Marketing for African Entrepreneurs"
              className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
            />
            <p className="text-sm text-[#2C3E50]/60">
              Create a compelling title that clearly describes what students will learn
            </p>
          </div>

          {/* Course Type */}
          <div className="space-y-2">
            <Label className="text-[#2C3E50] font-semibold">Course Delivery Type *</Label>
            <div className="flex gap-4">
              {(['self_paced','cohort'] as const).map((type) => (
                <Button
                  key={type}
                  variant={courseData.deliveryType === type ? 'default' : 'outline'}
                  onClick={() => updateCourseData({ deliveryType: type })}
                >
                  {type === 'self_paced' ? 'Self-Paced' : 'Cohort-Based'}
                </Button>
              ))}
            </div>
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#2C3E50] font-semibold">
              Course Description *
            </Label>
            <Textarea
              id="description"
              value={courseData.description}
              onChange={(e) => updateCourseData({ description: e.target.value })}
              placeholder="Describe what students will learn, the outcomes they can expect, and why this course is valuable for their entrepreneurial journey..."
              rows={4}
              className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
            />
            <p className="text-sm text-[#2C3E50]/60">
              Write a detailed description that highlights the value and practical outcomes
            </p>
          </div>

          {/* Conditional Cohort Dates */}
          {courseData.deliveryType === 'cohort' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold">Start Date *</Label>
                <Input
                  type="date"
                  value={courseData.startDate || ''}
                  onChange={(e) => updateCourseData({ startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">End Date *</Label>
                <Input
                  type="date"
                  value={courseData.endDate || ''}
                  onChange={(e) => updateCourseData({ endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Registration Deadline *</Label>
                <Input
                  type="date"
                  value={courseData.registrationDeadline || ''}
                  onChange={(e) => updateCourseData({ registrationDeadline: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Category and Level */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#2C3E50] font-semibold">Category *</Label>
              <Select value={courseData.category} onValueChange={(value) => updateCourseData({ category: value })}>
                <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20">
                  <SelectValue placeholder="Select a category">
                    {courseData.category || "Select a category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!courseData.category && (
                <p className="text-sm text-red-500">Please select a category</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#2C3E50] font-semibold">Skill Level *</Label>
              <Select value={courseData.level} onValueChange={(value) => updateCourseData({ level: value as any })}>
                <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20">
                  <SelectValue placeholder="Select skill level">
                    {courseData.level ? (
                      <>
                        {courseData.level === "beginner" && "🌱 Beginner"}
                        {courseData.level === "intermediate" && "🚀 Intermediate"}
                        {courseData.level === "advanced" && "⭐ Advanced"}
                      </>
                    ) : (
                      "Select skill level"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">🌱 Beginner</SelectItem>
                  <SelectItem value="intermediate">🚀 Intermediate</SelectItem>
                  <SelectItem value="advanced">⭐ Advanced</SelectItem>
                </SelectContent>
              </Select>
              {!courseData.level && (
                <p className="text-sm text-red-500">Please select a skill level</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-[#2C3E50] font-semibold">Course Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag (e.g., SEO, Social Media)"
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {courseData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20 hover:bg-[#4ECDC4]/20"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <p className="text-sm text-[#2C3E50]/60">Add relevant tags to help students discover your course</p>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-[#4ECDC4]/20 bg-[#4ECDC4]/5">
        <CardContent className="p-4">
          <h3 className="font-semibold text-[#2C3E50] mb-2 flex items-center gap-2">💡 Course Creation Tips</h3>
          <ul className="text-sm text-[#2C3E50]/80 space-y-1">
            <li>• Focus on practical, outcome-driven learning that students can apply immediately</li>
            <li>• Use clear, action-oriented language that speaks to aspiring entrepreneurs</li>
            <li>• Consider the mobile-first experience for learners across Africa</li>
            <li>• Highlight real-world applications and business opportunities</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 