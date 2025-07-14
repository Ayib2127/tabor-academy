/* eslint-disable react-hooks/rules-of-hooks, react/jsx-no-undef, react-hooks/exhaustive-deps */
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  WifiOff,
  FileText
} from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { supabase } from '@/lib/supabase/client';
import Link from "next/link"

import LessonContent from '@/components/course-player/LessonContent';
import Skeleton from '@/components/ui/skeleton';
import CoursePlayerSidebar from "@/components/course-player/CoursePlayerSidebar";
import Player from '@vimeo/player';
import type PlayerType from '@vimeo/player';
import { useId } from 'react';

export default function LessonPlayerPage() {
  const { id: initialLessonId, courseId } = useParams<{ id: string, courseId: string }>();
  const router = useRouter();
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessonId);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);

  // Alias for easier reference in JSX and handlers
  const lesson = (lessonData as any) ?? {};

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
  const [notes, setNotes] = useState<any[]>([])
  const [isOffline, setIsOffline] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentChapter, setCurrentChapter] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch all modules and lessons for the course
  useEffect(() => {
    async function fetchModulesAndCourse() {
      // Try to get courseId from lesson if not present in params
      let cid = courseId;
      if (!cid && lessonData?.module_id) {
        const { data: moduleData } = await supabase
          .from('course_modules')
          .select('course_id')
          .eq('id', lessonData.module_id)
          .single();
        cid = moduleData?.course_id;
      }
      if (!cid) return;
      // Fetch all modules and lessons
      const response = await fetch(`/api/courses/${cid}/modules`);
      if (response.ok) {
        const modules = await response.json();
        setAllModules(modules);
      }
      // Fetch course title
      const courseRes = await fetch(`/api/courses/${cid}`);
      if (courseRes.ok) {
        const course = await courseRes.json();
        setCourseTitle(course.title);
      }
    }
    fetchModulesAndCourse();
  }, [courseId, lessonData?.module_id]);

  // Fetch lesson data when currentLessonId changes
  useEffect(() => {
    (async () => {
      if (!currentLessonId) return;
      const { data, error } = await supabase
        .from('module_lessons')
        .select('id, title, type, content, is_published, module_id, duration, order')
        .eq('id', currentLessonId)
        .single();
      if (!error) {
        let parsedContent = data.content;
        if (data.type === 'video' || data.type === 'assignment' || data.type === 'text') {
        } else if (data.type === 'quiz') {
          try {
            parsedContent = JSON.parse(data.content);
          } catch { parsedContent = null; }
        }
        setLessonData({ ...data, content: parsedContent });
      } else setError(error);
    })();
  }, [currentLessonId]);

  // Find the current lesson object for highlighting
  const currentLesson = allModules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === currentLessonId) || {};

  // Calculate progress
  const totalLessons = allModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedLessons = allModules.reduce(
    (acc, m) => acc + (m.lessons?.filter((l) => l.completed).length || 0),
    0
  );
  const progress = {
    percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completed: completedLessons,
    total: totalLessons,
  };

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

  useEffect(() => {
    // When lessonData loads, initialize notes from lesson.notes if present
    if (lessonData && lessonData.notes) {
      setNotes(lessonData.notes)
    }
  }, [lessonData])

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
      setNotes(prev => [...prev, newNote])
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

  // Helper to flatten all lessons in order
  const allLessons = allModules.flatMap((m) => m.lessons || []);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 bg-background">
        <div className="container py-6">
          {/* Course Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/courses" className="hover:text-foreground">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            {courseTitle && <span>{courseTitle}</span>}
            <ChevronRight className="h-4 w-4" />
            <span>{currentLesson.title ?? ''}</span>
          </div>

          {/* Updated grid: sidebar left, main content right */}
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar with all modules */}
            <CoursePlayerSidebar
              modules={allModules}
              currentLessonId={currentLessonId}
              progress={progress}
              onNavigate={(lessonId) => {
                setCurrentLessonId(lessonId);
                router.replace(`/courses/lesson/${lessonId}`);
              }}
              courseTitle={courseTitle}
            />

            {/* Main content on the right */}
            <div>
              {/* --- Top Info: Title, Type, Duration, Bookmark, Share --- */}
              {/* This block is now moved inside the Card */}

              {/* --- Video Player Card --- */}
              {lesson.type === "video" && (
                <Card className="mb-8 p-0 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-[#FF6B35]/10 to-[#4ECDC4]/10">
                  <div className="relative">
                    {/* Unified Custom Video Player */}
                    <CustomVideoPlayer
                      src={(() => {
                        if (lesson.content && typeof lesson.content === 'object') {
                          return lesson.content.url || lesson.content.src || '';
                        } else if (typeof lesson.content === 'string') {
                          try {
                            const parsed = JSON.parse(lesson.content);
                            return parsed.url || parsed.src || '';
                          } catch {
                            return lesson.content;
                          }
                        }
                        return '';
                      })()}
                      poster={lesson.thumbnail_url}
                    />
                  </div>
                </Card>
              )}

              {/* --- Text, Quiz, Assignment, etc. --- */}
              {/* Wrap each in a Card with padding, shadow, and rounded corners */}
              {["text", "quiz", "assignment"].includes(lesson.type) && (
                <Card className={`mb-8 ${lesson.type === "video" ? "p-0" : "p-6"} rounded-2xl shadow-lg bg-white`}>
                  {/* Info block (title, type, duration, bookmark, share) */}
                  <div className="flex justify-end items-center mb-2">
                    <Button variant="outline" size="icon" className="ml-2">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="ml-2">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center mb-6">
                    <h1
                      className="text-3xl font-extrabold mb-4 text-center"
                      style={{
                        background: "linear-gradient(90deg, #4ECDC4 0%, #FF6B35 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {lesson.title}
                    </h1>
                    <div className="flex flex-row items-center gap-4">
                      <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#4ECDC4] font-semibold text-base">
                        {lesson.type === "video" ? "🎬 Video" : lesson.type === "quiz" ? "❓ Quiz" : lesson.type === "assignment" ? "📄 Assignment" : "📖 Article"}
                      </span>
                      <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#6E6C75] font-semibold text-base">
                        ⏱️ {lesson.duration} min read
                      </span>
                    </div>
                  </div>
                  {/* The actual lesson content */}
                  {lesson.type === "video" ? (
                    <div className="relative">
                      <CustomVideoPlayer
                        src={(() => {
                          if (lesson.content && typeof lesson.content === 'object') {
                            return lesson.content.url || lesson.content.src || '';
                          } else if (typeof lesson.content === 'string') {
                            try {
                              const parsed = JSON.parse(lesson.content);
                              return parsed.url || parsed.src || '';
                            } catch {
                              return lesson.content;
                            }
                          }
                          return '';
                        })()}
                        poster={lesson.thumbnail_url}
                      />
                    </div>
                  ) : (
                    <LessonContent lesson={lesson} completed={lesson.completed ?? false} />
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-[#4ECDC4]/30 text-[#2C3E50] hover:border-[#4ECDC4] flex items-center justify-center"
                      disabled={!prevLesson}
                      onClick={() => prevLesson && router.push(`/courses/lesson/${prevLesson.id}`)}
                    >
                      <ChevronLeft className="h-5 w-5 mr-2 text-[#4ECDC4]" />
                      Previous Lesson
                    </Button>
                    <Button
                      className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white flex items-center justify-center"
                      disabled={!nextLesson}
                      onClick={() => nextLesson && router.push(`/courses/lesson/${nextLesson.id}`)}
                    >
                      Continue Learning
                      <ChevronRight className="h-5 w-5 ml-2 text-white" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Lesson Information */}
              {/* 
              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div />
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center mb-6">
                  <h1
                    className="text-3xl font-extrabold mb-4 text-center"
                    style={{
                      background: "linear-gradient(90deg, #4ECDC4 0%, #FF6B35 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {lesson.title}
                  </h1>
                  <div className="flex flex-row items-center gap-4">
                    <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#4ECDC4] font-semibold text-base">
                      📖 Article
                    </span>
                    <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#6E6C75] font-semibold text-base">
                      ⏱️ {lesson.duration} min read
                    </span>
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const CustomVideoPlayerStyles = (
  <style jsx global>{`
    .volume-slider {
      accent-color: #FF6B35;
      height: 6px;
    }
    .volume-slider::-webkit-slider-thumb {
      background: #FF6B35;
      border: 2px solid #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 0 2px #FF6B35;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    }
    .volume-slider::-webkit-slider-runnable-track {
      background: #E5E8E8;
      height: 6px;
      border-radius: 6px;
    }
    .volume-slider::-moz-range-thumb {
      background: #FF6B35;
      border: 2px solid #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 0 2px #FF6B35;
      cursor: pointer;
    }
    .volume-slider::-moz-range-track {
      background: #E5E8E8;
      height: 6px;
      border-radius: 6px;
    }
    .volume-slider::-ms-thumb {
      background: #FF6B35;
      border: 2px solid #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 0 2px #FF6B35;
      cursor: pointer;
    }
    .volume-slider::-ms-fill-lower {
      background: #FF6B35;
      border-radius: 6px;
    }
    .volume-slider::-ms-fill-upper {
      background: #E5E8E8;
      border-radius: 6px;
    }
    .volume-slider:focus {
      outline: none;
    }
  `}</style>
);

function isYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}
function getYouTubeEmbedUrl(url) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}
function isVimeoUrl(url) {
  return /^(https?:\/\/)?(www\.)?vimeo\.com\//.test(url);
}
function getVimeoEmbedUrl(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : '';
}

function CustomVideoPlayer({ src, poster }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);
  const ytIntervalRef = useRef<any>(null);
  const ytIframeId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isYouTube = isYouTubeUrl(src);
  const isVimeo = isVimeoUrl(src);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = isYouTube ? `${getYouTubeEmbedUrl(src)}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0&origin=${origin}` : isVimeo ? getVimeoEmbedUrl(src) : '';

  // Ref callback for YouTube iframe
  const handleYTRef = useCallback((node) => {
    if (!isYouTube || !node) return;
    // Only create player if not already created
    if (playerRef.current) return;
    function createPlayer() {
      playerRef.current = new (window as any).YT.Player(node, {
        events: {
          onReady: (event: any) => {
            setYtReady(true);
            setDuration(event.target.getDuration());
            setVolume(event.target.getVolume() / 100);
            setIsMuted(event.target.isMuted());
            setPlaybackSpeed(event.target.getPlaybackRate());
            if (ytIntervalRef.current) clearInterval(ytIntervalRef.current);
            ytIntervalRef.current = setInterval(() => {
              setCurrentTime(event.target.getCurrentTime());
              setDuration(event.target.getDuration());
            }, 500);
          },
          onStateChange: (event: any) => {
            if (event.data === 1) setIsPlaying(true);
            if (event.data === 2) setIsPlaying(false);
          }
        }
      });
    }
    // If API is loaded, create player immediately
    if ((window as any).YT && (window as any).YT.Player) {
      createPlayer();
    } else {
      // Otherwise, load API and create player when ready
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    }
  }, [isYouTube, src]);

  useEffect(() => {
    return () => {
      if (ytIntervalRef.current) clearInterval(ytIntervalRef.current);
      if (isYouTube) {
        setYtReady(false);
        playerRef.current = null;
      }
    };
  }, [isYouTube, src]);

  // Progress/seek (YouTube)
  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (isYouTube && playerRef.current && ytReady && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(time, true);
    } else if (isVimeo && playerRef.current && typeof playerRef.current.setCurrentTime === 'function') {
      playerRef.current.setCurrentTime(time);
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Volume (YouTube)
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
    if (isYouTube && playerRef.current && ytReady && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(value * 100);
      if (value === 0 && typeof playerRef.current.mute === 'function') playerRef.current.mute();
      else if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
    } else if (isVimeo && playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(value);
    } else if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  // Mute (YouTube)
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isYouTube && playerRef.current && ytReady) {
      if (!isMuted && typeof playerRef.current.mute === 'function') playerRef.current.mute();
      else if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
    } else if (isVimeo && playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(isMuted ? volume : 0);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  // Playback speed (YouTube)
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isYouTube && playerRef.current && ytReady && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(speed);
    } else if (isVimeo && playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      playerRef.current.setPlaybackRate(speed);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Fullscreen: toggle on/off and listen for exit
  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          (containerRef.current as any).msRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    // Listen for fullscreen change events
    const handleFsChange = () => {
      const fsElement = document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement;
      setIsFullscreen(!!(fsElement && containerRef.current && fsElement === containerRef.current));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('msfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('msfullscreenchange', handleFsChange);
    };
  }, []);

  // Play/pause (YouTube)
  const handlePlay = () => {
    setIsPlaying(true);
    if (isYouTube && playerRef.current && ytReady && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    } else if (isVimeo && playerRef.current && typeof playerRef.current.play === 'function') {
      playerRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.play();
    }
  };
  const handlePause = () => {
    setIsPlaying(false);
    if (isYouTube && playerRef.current && ytReady && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    } else if (isVimeo && playerRef.current && typeof playerRef.current.pause === 'function') {
      playerRef.current.pause();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Native video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  // Native video loadedmetadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add error overlay if YouTube API fails to load
  const [ytApiError, setYtApiError] = useState(false);
  useEffect(() => {
    if (isYouTube) {
      const timeout = setTimeout(() => {
        if (!ytReady) setYtApiError(true);
      }, 4000); // 4 seconds to load API
      return () => clearTimeout(timeout);
    }
  }, [isYouTube, ytReady]);

  return (
    <div ref={containerRef} className="relative aspect-video rounded-2xl overflow-hidden">
      {ytApiError && isYouTube && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <p className="text-white text-lg font-bold mb-2">YouTube player failed to load.</p>
          <p className="text-white text-sm">This may be due to Content Security Policy (CSP) restrictions or network issues.</p>
        </div>
      )}
      {/* Video or iframe (no native controls, no overlays) */}
      {isYouTube ? (
        <iframe
          id={ytIframeId}
          ref={handleYTRef}
          width="100%"
          height="100%"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      ) : isVimeo ? (
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={embedUrl + "?background=0&autoplay=0&controls=0"}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls={false}
          className="w-full aspect-video rounded-2xl"
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          style={{ display: 'block' }}
        >
          <source src={src} type="video/mp4" />
          <source src={src} type="video/webm" />
          <source src={src} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Play Overlay (shown until play is clicked) */}
      {!isPlaying && (
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
          onClick={handlePlay}
          aria-label="Play video"
        >
          <span className="bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] rounded-full p-6 shadow-lg">
            <Play className="h-16 w-16 text-white drop-shadow-lg" />
          </span>
        </button>
      )}
      {/* Custom Controls (always visible when playing) */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div
              className="h-2 bg-[#E5E8E8] rounded-full cursor-pointer"
              style={{ width: '100%' }}
              onClick={e => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                handleSeek(percent * duration);
              }}
            >
              <div
                className="h-2 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80"
                onClick={isPlaying ? handlePause : handlePlay}
              >
                {isPlaying ? <Pause className="h-6 w-6 text-[#FF6B35]" /> : <Play className="h-6 w-6 text-[#FF6B35]" />}
              </Button>
              {/* Volume */}
              <div className="flex items-center gap-2">
                {/* Volume button with gradient */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:brightness-125"
                  onClick={toggleMute}
                >
                  <div className="bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] p-1 rounded-full">
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </div>
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 volume-slider"
                  style={{
                    accentColor: '#FF6B35', // For browsers that support accent-color
                  }}
                />
              </div>
              {/* Time */}
              <div className="text-sm text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Playback Speed */}
              {/* Speed select with gradient border and hover */}
              <div className="relative group">
                <select
                  value={playbackSpeed}
                  onChange={e => handleSpeedChange(parseFloat(e.target.value))}
                  className="appearance-none bg-transparent text-white text-sm rounded px-4 py-1 pr-8 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-colors duration-200 group-hover:border-gradient-to-br group-hover:from-[#FF6B35] group-hover:to-[#4ECDC4]"
                  style={{
                    borderImage: 'linear-gradient(135deg, #FF6B35, #4ECDC4) 1',
                    boxShadow: '0 2px 8px rgba(78,205,196,0.08)',
                  }}
                >
                  <option value="0.5" className="text-[#FF6B35] bg-black">0.5x</option>
                  <option value="1" className="text-[#4ECDC4] bg-black">1x</option>
                  <option value="1.5" className="text-[#FF6B35] bg-black">1.5x</option>
                  <option value="2" className="text-[#4ECDC4] bg-black">2x</option>
                </select>
                {/* Custom arrow */}
                <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80"
                onClick={handleFullscreen}
              >
                <Maximize className="h-5 w-5 text-[#FF6B35]" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}