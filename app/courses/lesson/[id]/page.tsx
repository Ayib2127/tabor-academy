"use client"

import { useState, useRef, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Bookmark,
  MessageSquare,
  Settings,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Clock,
  Edit,
  Share2,
  HelpCircle,
  Smartphone,
  Wifi,
  WifiOff
} from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"



import LessonContentDisplay from '@/components/student/lesson-content';
import Skeleton from '@/components/ui/skeleton';
/*



  id: 1,
  title: "Understanding the African Digital Landscape",
  course: "Digital Marketing Mastery",
  module: "Introduction to African Digital Marketing",
  duration: "45 minutes",
  progress: 35,
  instructor: {
    name: "Sarah Kimani",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
  },
  videoUrl: "https://example.com/lesson-video.mp4",
  transcript: true,
  resources: [
    {
      name: "African Digital Marketing Guide 2024",
      type: "PDF",
      size: "2.4 MB"
    },
    {
      name: "Market Research Templates",
      type: "ZIP",
      size: "1.8 MB"
    }
  ],
  nextLesson: {
    id: 2,
    title: "Market Research and Consumer Behavior"
  },
  previousLesson: null,
  chapters: [
    { time: 0, title: "Introduction" },
    { time: 180, title: "Current State of Digital in Africa" },
    { time: 480, title: "Key Market Differences" },
    { time: 780, title: "Mobile-First Approach" },
    { time: 1200, title: "Future Trends" }
  ],
  quiz: {
    questions: [
      {
        id: 1,
        time: 300,
        question: "What is the primary device used for internet access in Africa?",
        options: ["Desktop", "Mobile Phone", "Tablet", "Smart TV"],
        correctAnswer: 1
      }
    ]
  },
  notes: [
    {
      id: 1,
      timestamp: 245,
      content: "Important statistics about mobile usage in Africa",
      type: "highlight"
    }

*/

export default function LessonPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClientComponentClient();
  const [lessonData, setLessonData] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('module_lessons')
        .select('id, title, video_url, content_json')
        .eq('id', id)
        .single();
      if (!error) setLessonData(data);
    })();
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">Could not load lesson</h2>
            <p className="text-muted-foreground">{error.message || 'An unexpected error occurred.'}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-8 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </main>
      </div>
    );
  }

  const lesson = lessonData;
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [quality, setQuality] = useState("auto")
  const [showTranscript, setShowTranscript] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNotes, setShowNotes] = useState(true)
  const [noteInput, setNoteInput] = useState("")
  const [isOffline, setIsOffline] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentChapter, setCurrentChapter] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      
      // Update current chapter
      const currentChapterIndex = (lesson.chapters ?? []).findIndex((chapter, index) => {
        const nextChapter = (lesson.chapters ?? [])[index + 1]
        return chapter.time <= currentTime && (!nextChapter || nextChapter.time > currentTime)
      })
      
      if (currentChapterIndex !== -1) {
        setCurrentChapter(currentChapterIndex)
      }
    }
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    setIsMuted(value === 0)
    if (videoRef.current) {
      videoRef.current.volume = value
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      setIsMuted(newMuted)
      videoRef.current.muted = newMuted
      setVolume(newMuted ? 0 : 1)
    }
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const handleQualityChange = (quality: string) => {
    setQuality(quality)
    // Implementation would depend on video player/service being used
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const addNote = () => {
    if (noteInput.trim()) {
      const newNote = {
        id: Date.now(),
        timestamp: currentTime,
        content: noteInput,
        type: "note"
      }
      (lesson.notes ?? []).push(newNote)
      setNoteInput("")
    }
  }

  const downloadForOffline = () => {
    if (lesson.progress !== undefined) {
      setDownloadProgress(lesson.progress)
    } else {
      setDownloadProgress(0)
    }
    // Implementation would handle actual video download
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 bg-background">
        <div className="container py-6">
          {/* Course Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/courses" className="hover:text-foreground">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            {/* Course breadcrumb could be added here when joined */}
            <ChevronRight className="h-4 w-4" />
            <span>{lesson.module ?? ''}</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Video Player Column */}
            <div className="md:col-span-2">
              {/* show BlockNote content if present */}
              {lesson.content_json && (
                <LessonContentDisplay content={lesson.content_json} />
              )}
              {/* Legacy content fallback: render plain HTML if no content_json */}
              {(!lesson.content_json && lesson.content) && (
                <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
              )}

              {/* show video if present */}
              <div ref={playerRef} className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                >
                  <source src={lesson.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="relative mb-4">
                    <Progress
                      value={(currentTime / duration) * 100}
                      className="cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const percent = (e.clientX - rect.left) / rect.width
                        handleSeek(percent * duration)
                      }}
                    />
                    {/* Chapter Markers */}
                    {(lesson.chapters ?? []).map((chapter, index) => (
                      <div
                        key={index}
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-white/50 cursor-pointer hover:bg-white"
                        style={{ left: `${(chapter.time / duration) * 100}%` }}
                        title={chapter.title}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white/80"
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:text-white/80"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-20"
                        />
                      </div>

                      <div className="text-sm text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <select
                        value={playbackSpeed}
                        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                        className="bg-transparent text-white text-sm"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>

                      <select
                        value={quality}
                        onChange={(e) => handleQualityChange(e.target.value)}
                        className="bg-transparent text-white text-sm"
                      >
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                      </select>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white/80"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Information */}
              <div className="mt-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration ?? ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>{Math.round((currentTime / duration) * 100)}% Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Resources */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Lesson Resources</h2>
                  <div className="space-y-4">
                    {(lesson.resources ?? []).map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {resource.type} • {resource.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Notes Section */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">My Notes</h2>
                    <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)}>
                      {showNotes ? "Hide" : "Show"} Notes
                    </Button>
                  </div>

                  {showNotes && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="Add a note..."
                        />
                        <Button onClick={addNote}>Add Note</Button>
                      </div>

                      <div className="space-y-4">
                        {(lesson.notes ?? []).map((note) => (
                          <div key={note.id} className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSeek(note.timestamp)}
                            >
                              {formatTime(note.timestamp)}
                            </Button>
                            <div className="flex-1">
                              <p>{note.content}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Progress */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
                <Progress value={35} className="mb-4" />
                <p className="text-sm text-muted-foreground">
                  35% Complete • 4/12 Lessons
                </p>
              </Card>

              {/* Chapters */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Chapters</h2>
                <div className="space-y-2">
                  {(lesson.chapters ?? []).map((chapter, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-start ${
                        currentChapter === index ? "bg-accent" : ""
                      }`}
                      onClick={() => handleSeek(chapter.time)}
                    >
                      <span className="mr-2">{formatTime(chapter.time)}</span>
                      {chapter.title}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Offline Learning */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Offline Access</h2>
                  {isOffline ? (
                    <div className="flex items-center text-orange-500">
                      <WifiOff className="h-4 w-4 mr-1" />
                      <span className="text-sm">Offline</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-500">
                      <Wifi className="h-4 w-4 mr-1" />
                      <span className="text-sm">Online</span>
                    </div>
                  )}
                </div>

                {downloadProgress > 0 ? (
                  <div className="space-y-2">
                    <Progress value={downloadProgress} />
                    <p className="text-sm text-muted-foreground">
                      Downloading... {downloadProgress}%
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={downloadForOffline}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download for Offline
                  </Button>
                )}
              </Card>

              {/* Navigation */}
              <div className="space-y-2">
                {lesson.previousLesson && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/courses/lesson/${lesson.previousLesson.id}`}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous Lesson
                    </Link>
                  </Button>
                )}
                
                {lesson.nextLesson && (
                  <Button className="w-full justify-between" asChild>
                    <Link href={`/courses/lesson/${lesson.nextLesson.id}`}>
                      Next Lesson
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Help & Support */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Technical Support
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