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
  onNext: () => void
}

export function CourseMediaStep({ courseData, updateCourseData, onNext }: CourseMediaStepProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [thumbnailError, setThumbnailError] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [promoVideoUrl, setPromoVideoUrl] = useState(courseData.promoVideoUrl || "")
  const [promoVideoError, setPromoVideoError] = useState<string>("")

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleThumbnailUpload = async (file: File) => {
    setIsUploading(true)
    setThumbnailError("")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "Tabor-Academy")
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dbn8jx8bh/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.secure_url) {
        updateCourseData({ thumbnailUrl: data.secure_url })
        setThumbnailPreview(data.secure_url)
      } else {
        setThumbnailError("Image upload failed. Please try again.")
      }
    } catch (err) {
      setThumbnailError("Image upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handlePromoVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPromoVideoUrl(url);
    if (url && !validateUrl(url)) {
      setPromoVideoError("Please enter a valid video URL (optional)");
      updateCourseData({ promoVideoUrl: undefined });
    } else if (!url) {
      setPromoVideoError("");
      updateCourseData({ promoVideoUrl: undefined });
    } else {
      setPromoVideoError("");
      updateCourseData({ promoVideoUrl: url });
    }
  };

  const isStepValid =
    !!courseData.thumbnailUrl &&
    !thumbnailError &&
    (!promoVideoUrl || (promoVideoUrl && !promoVideoError && validateUrl(promoVideoUrl)))

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
                      if (file) handleThumbnailUpload(file)
                    }}
                    className=""
                    id="thumbnail-upload"
                  />
                  {isUploading ? (
                    <p className="text-sm text-[#2C3E50]/60 mt-2">Uploading...</p>
                  ) : null}
                  {thumbnailError && <p className="text-sm text-red-500 mt-2">{thumbnailError}</p>}
                </div>
                <p className="text-xs text-[#2C3E50]/60">Recommended: 1280x720px, JPG or PNG, max 5MB</p>
              </div>

              {thumbnailPreview || courseData.thumbnailUrl ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#2C3E50]">Preview:</p>
                  <img
                    src={thumbnailPreview || courseData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-40 object-cover rounded-lg border border-[#E5E8E8]"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Promotional Video URL (Optional) */}
          <div className="space-y-4">
            <Label className="text-[#2C3E50] font-semibold flex items-center gap-2">
              <Video className="w-4 h-4" />
              Promotional Video URL (Optional)
            </Label>
            <Input
              type="url"
              value={promoVideoUrl}
              onChange={handlePromoVideoChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
            />
            {promoVideoError && <p className="text-sm text-red-500">{promoVideoError}</p>}
            <p className="text-sm text-[#2C3E50]/60">Paste a link to a YouTube, Vimeo, or direct video (optional)</p>
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

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={onNext}
              disabled={!isStepValid}
              className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
            >
              Next
            </Button>
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