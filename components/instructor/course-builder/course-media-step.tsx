"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Video, DollarSign, ImageIcon } from "lucide-react"
import { useState } from "react"

interface CourseData {
  price: number
  thumbnailUrl: string
  promoVideoUrl: string
}

interface CourseMediaStepProps {
  courseData: CourseData
  updateCourseData: (updates: Partial<CourseData>) => void
}

export function CourseMediaStep({ courseData, updateCourseData }: CourseMediaStepProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [videoPreview, setVideoPreview] = useState<string>("")

  const handleFileUpload = (file: File, type: "thumbnail" | "video") => {
    const url = URL.createObjectURL(file)

    if (type === "thumbnail") {
      setThumbnailPreview(url)
      updateCourseData({ thumbnailUrl: url })
    } else {
      setVideoPreview(url)
      updateCourseData({ promoVideoUrl: url })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E8E8] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
          <CardTitle className="text-[#2C3E50] flex items-center gap-2">🎨 Course Media & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Course Thumbnail */}
          <div className="space-y-4">
            <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Course Thumbnail
            </Label>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#E5E8E8] rounded-lg p-6 text-center hover:border-[#4ECDC4] transition-colors">
                  <Upload className="w-8 h-8 text-[#2C3E50]/40 mx-auto mb-2" />
                  <p className="text-sm text-[#2C3E50]/60 mb-2">Upload a course thumbnail</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, "thumbnail")
                    }}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("thumbnail-upload")?.click()}
                    className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/5"
                  >
                    Choose File
                  </Button>
                </div>
                <p className="text-xs text-[#2C3E50]/60">Recommended: 1280x720px, JPG or PNG, max 5MB</p>
              </div>

              {thumbnailPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#2C3E50]">Preview:</p>
                  <img
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Thumbnail preview"
                    className="w-full h-40 object-cover rounded-lg border border-[#E5E8E8]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Promotional Video */}
          <div className="space-y-4">
            <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
              <Video className="w-4 h-4" />
              Promotional Video (Optional)
            </Label>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#E5E8E8] rounded-lg p-6 text-center hover:border-[#FF6B35] transition-colors">
                  <Video className="w-8 h-8 text-[#2C3E50]/40 mx-auto mb-2" />
                  <p className="text-sm text-[#2C3E50]/60 mb-2">Upload a promotional video</p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, "video")
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("video-upload")?.click()}
                    className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/5"
                  >
                    Choose File
                  </Button>
                </div>
                <p className="text-xs text-[#2C3E50]/60">Keep it short (30-90 seconds), MP4 format, max 50MB</p>
              </div>

              {videoPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#2C3E50]">Preview:</p>
                  <video src={videoPreview} controls className="w-full h-40 rounded-lg border border-[#E5E8E8]" />
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Course Pricing
            </Label>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2C3E50]/40" />
                  <Input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => updateCourseData({ price: Number.parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-10 border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                  />
                </div>
                <p className="text-sm text-[#2C3E50]/60">Set your course price in USD. Enter 0 for a free course.</p>
              </div>

              <div className="bg-[#F7F9F9] rounded-lg p-4 border border-[#E5E8E8]">
                <h4 className="font-semibold text-[#2C3E50] mb-2">💰 Pricing Tips</h4>
                <ul className="text-sm text-[#2C3E50]/70 space-y-1">
                  <li>• Consider your target market's purchasing power</li>
                  <li>• Free courses can build your reputation</li>
                  <li>• Price based on value and outcomes delivered</li>
                  <li>• You can always adjust pricing later</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Guidelines */}
      <Card className="border-[#4ECDC4]/20 bg-[#4ECDC4]/5">
        <CardContent className="p-4">
          <h3 className="font-semibold text-[#2C3E50] mb-2 flex items-center gap-2">📱 Mobile-First Guidelines</h3>
          <ul className="text-sm text-[#2C3E50]/80 space-y-1">
            <li>• Ensure thumbnails are clear and readable on small screens</li>
            <li>• Keep promotional videos short and engaging</li>
            <li>• Consider data usage for learners with limited internet</li>
            <li>• Test how your media appears on mobile devices</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 