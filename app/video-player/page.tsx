"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  SkipBack,
  SkipForward,
  MessageSquare,
  Bookmark,
  Share2,
  Download,
  Flag,
  Subtitles,
  Eye,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Languages,
  FileText,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function VideoPlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(1800) // 30 minutes in seconds
  const [quality, setQuality] = useState("720p")
  const [showCaptions, setShowCaptions] = useState(true)

  // Mock video data
  const videoData = {
    title: "Digital Marketing Strategy Fundamentals",
    course: "Digital Marketing Mastery",
    instructor: "Grace Mensah",
    duration: "30:00",
    progress: 45,
    chapters: [
      { time: "00:00", title: "Introduction" },
      { time: "03:45", title: "Understanding Your Audience" },
      { time: "12:30", title: "Channel Selection" },
      { time: "18:15", title: "Content Strategy" },
      { time: "25:00", title: "Analytics & Measurement" }
    ],
    transcript: [
      {
        time: "00:00",
        speaker: "Grace Mensah",
        text: "Welcome to Digital Marketing Strategy Fundamentals..."
      },
      {
        time: "00:30",
        speaker: "Grace Mensah",
        text: "In this lesson, we'll cover the key principles..."
      }
    ],
    interactiveElements: [
      {
        time: 180,
        type: "quiz",
        question: "What is the first step in creating a digital marketing strategy?",
        options: [
          "Understanding your audience",
          "Creating content",
          "Choosing platforms",
          "Setting budget"
        ]
      },
      {
        time: 450,
        type: "resource",
        title: "Marketing Strategy Template",
        link: "/resources/marketing-template"
      }
    ],
    nextLesson: {
      title: "Content Creation Best Practices",
      duration: "25:00",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/courses" className="hover:text-foreground">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/courses/digital-marketing" className="hover:text-foreground">
              {videoData.course}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{videoData.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Container */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-16 w-16 text-white opacity-50" />
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Progress value={(currentTime / duration) * 100} className="h-1" />
                      <div className="flex justify-between text-xs text-white">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? (
                            <VolumeX className="h-6 w-6" />
                          ) : (
                            <Volume2 className="h-6 w-6" />
                          )}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <Subtitles className="h-4 w-4 mr-2" />
                          CC
                        </Button>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value)}
                          className="bg-transparent text-white text-sm"
                        >
                          <option value="1080p">1080p</option>
                          <option value="720p">720p</option>
                          <option value="480p">480p</option>
                          <option value="360p">360p</option>
                        </select>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                          className="bg-transparent text-white text-sm"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={1}>1x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize2 className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{videoData.title}</h1>
                    <p className="text-muted-foreground">
                      {videoData.course} • {videoData.instructor}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chapters */}
                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Chapters</h2>
                  <div className="space-y-2">
                    {videoData.chapters.map((chapter, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <Play className="h-4 w-4" />
                          <span>{chapter.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {chapter.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Interactive Elements */}
                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Interactive Elements</h2>
                  <div className="space-y-4">
                    {videoData.interactiveElements.map((element, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border hover:bg-accent"
                      >
                        {element.type === "quiz" && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              <span className="font-medium">Quiz</span>
                            </div>
                            <p className="mb-2">{element.question}</p>
                            <div className="space-y-2">
                              {element.options.map((option, optIndex) => (
                                <button
                                  key={optIndex}
                                  className="w-full text-left p-2 rounded-lg hover:bg-accent"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {element.type === "resource" && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{element.title}</span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={element.link}>
                                View Resource
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Transcript */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Transcript</h2>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="space-y-4">
                  {videoData.transcript.map((entry, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <span className="text-sm text-muted-foreground w-12">
                        {entry.time}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{entry.speaker}</p>
                        <p className="text-sm">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Next Lesson */}
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Up Next</h2>
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{videoData.nextLesson.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Duration: {videoData.nextLesson.duration}
                    </p>
                  </div>
                  <Button className="w-full">
                    Continue Learning
                  </Button>
                </div>
              </Card>

              {/* Accessibility Options */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Accessibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Viewing options
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Closed Captions</span>
                    <input
                      type="checkbox"
                      checked={showCaptions}
                      onChange={(e) => setShowCaptions(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Contrast</span>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings/accessibility">
                      More Options
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Help Section */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Playback support
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/playback">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Playback Issues
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/quality">
                      <Settings className="mr-2 h-4 w-4" />
                      Quality Settings
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help/contact">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}