"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Star,
  Clock,
  BookOpen,
  Share2,
  Bookmark,
  Gift,
  Globe,
  CheckCircle,
  Download,
  Users,
  Award,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Lock
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { snakeToCamel } from "@/lib/utils/snakeToCamel";
import { EnrollmentButton } from "@/components/course/enrollment-button";
import { supabase } from "@/lib/supabase/client";
import { withValidImageUrl, DEFAULT_BANNER_URL, DEFAULT_AVATAR_URL } from "@/lib/defaults";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalValidLessons, setTotalValidLessons] = useState(0);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);

  // Move these up!
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) throw new Error('Course not found');
        const data = await response.json();
        const courseDetails = {
          ...data,
          subtitles: data.subtitles ?? [],
          videoHours: data.video_hours ?? 0,
          lifetimeAccess: data.lifetime_access ?? false,
        };
        setCourse(snakeToCamel(courseDetails));
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }
    async function fetchModules() {
      try {
        const response = await fetch(`/api/courses/${id}/modules`);
        if (!response.ok) throw new Error('Failed to fetch modules');
        const data = await response.json();
        setModules(data);
      } catch (err) {
        setModules([]);
      }
    }
    if (id) {
      fetchCourse();
      fetchModules();
    }
  }, [id]);

  useEffect(() => {
    async function fetchEnrollmentStatus() {
      if (!currentUserId || !course?.id) return;
      try {
        const res = await fetch(`/api/enrollments?courseId=${course.id}`);
        if (res.ok) {
          const enrollmentData = await res.json();
          // Enhanced enrollment check
          const isEnrolled = !!enrollmentData.enrollment;
          setIsEnrolled(isEnrolled);
          setCompletedLessons(enrollmentData.completedLessons || 0);
          setTotalValidLessons(enrollmentData.totalValidLessons || 0);
          
          // Debug logging
          console.log('Enrollment status:', {
            courseId: course.id,
            isEnrolled,
            enrollment: enrollmentData.enrollment,
            completedLessons: enrollmentData.completedLessons,
            totalValidLessons: enrollmentData.totalValidLessons
          });
        } else {
          console.error('Failed to fetch enrollment status:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('Error fetching enrollment status:', error);
      }
    }
    fetchEnrollmentStatus();
  }, [currentUserId, course?.id]);

  // Calculate first lesson ID when modules change
  useEffect(() => {
    let foundFirstLessonId: string | null = null;
    if (modules && modules.length > 0) {
      const sortedModules = [...modules].sort((a, b) => (a.order ?? a.position ?? 0) - (b.order ?? b.position ?? 0));
      for (const moduleItem of sortedModules) {
        if (moduleItem.lessons && moduleItem.lessons.length > 0) {
          const sortedLessons = [...moduleItem.lessons].sort((a, b) => (a.order ?? a.position ?? 0) - (b.order ?? b.position ?? 0));
          const publishedLesson = sortedLessons.find((lesson) => {
            if (!lesson.is_published) return false;
            switch (lesson.type) {
              case 'video':
                return lesson.content && lesson.content.src;
              case 'text':
                return lesson.content && lesson.content.length > 0;
              case 'quiz':
                try {
                  const quizContent = typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content;
                  return quizContent && Array.isArray(quizContent.questions) && quizContent.questions.length > 0;
                } catch { return false; }
              case 'assignment':
                return lesson.content && lesson.content.length > 0;
              default:
                return false;
            }
          });
          if (publishedLesson) {
            foundFirstLessonId = publishedLesson.id;
            break;
          }
        }
      }
    }
    setFirstLessonId(foundFirstLessonId);
  }, [modules]);

  // Calculate progress percentage
  const progressPercent = totalValidLessons > 0 ? Math.round((completedLessons / totalValidLessons) * 100) : 0;

  // Now you can do early returns
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!course) return null;

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleIndex)
        ? prev.filter(i => i !== moduleIndex)
        : [...prev, moduleIndex]
    )
  }

  return (
    <div className="flex min-h-screen flex-col" suppressHydrationWarning>
      <SiteHeader />
      
      {/* Course Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={withValidImageUrl(course.banner, DEFAULT_BANNER_URL)}
            alt={course.title || "Course Banner"}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container relative py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>{course.language}</span>
                {Array.isArray(course.subtitles) && course.subtitles.length > 0 && (
                  <span className="text-gray-400">
                    (Subtitles: {course.subtitles.join(", ")})
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
              <p className="text-xl text-gray-300">{course.subtitle}</p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{course.rating?.average ?? "N/A"}</span>
                  <span className="text-gray-400">({course.rating?.total ?? 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span>{course.enrollments} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>Last updated {course.lastUpdated}</span>
                </div>
                {/* Progress Bar and Lesson Count UI */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-[#4ECDC4] h-2.5 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span>{progressPercent}% Complete • {completedLessons}/{totalValidLessons} Lessons</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Image
                  src={withValidImageUrl(course.instructor?.avatar_url, DEFAULT_AVATAR_URL)}
                  alt={course.instructor?.full_name || "Instructor"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{course.instructor?.full_name ?? "Unknown"}</p>
                  <p className="text-sm text-gray-400">{course.instructor?.title ?? ""}</p>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-white/10 backdrop-blur-lg text-white">
              <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                <Image
                  src={withValidImageUrl(course.banner, DEFAULT_BANNER_URL)}
                  alt={course.title || "Course Banner"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Button size="lg" className="rounded-full w-16 h-16">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">${course.price}</span>
                </div>

                <EnrollmentButton
                  courseId={course.id}
                  courseTitle={course.title}
                  price={course.price}
                  isEnrolled={isEnrolled}
                  isOwnCourse={course.instructor_id === currentUserId}
                  contentType={course.contentType}
                  enrollmentCount={course.enrollments}
                  onEnrolled={() => setIsEnrolled(true)}
                  firstLessonId={firstLessonId}
                />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Gift className="h-4 w-4 mr-2" />
                    Gift
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/20">
                  <h3 className="font-semibold">This course includes:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>24 hours of video content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>15 downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Community discussion access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center text-sm">
                  <p>30-Day Money-Back Guarantee</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="container py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Curriculum
            </TabsTrigger>
            <TabsTrigger
              value="instructor"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Instructor
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* What You'll Learn */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Array.isArray(course.learningOutcomes) && course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {Array.isArray(course.requirements) && course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Success Stories */}
              <h2 className="text-2xl font-bold">Success Stories</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Array.isArray(course.successStories) && course.successStories.map((story, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={withValidImageUrl(story.photo, DEFAULT_AVATAR_URL)}
                        alt={story.name || "Success Story"}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{story.name}</h3>
                        <p className="text-sm text-green-500">{story.outcome}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{story.story}</p>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Course Content</h2>
              <div className="text-sm text-muted-foreground">
                {modules.reduce((acc, module) => acc + (module.lessons?.filter((l:any) => l.is_published).length ?? 0), 0)} lessons
              </div>
            </div>
            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center justify-between hover:bg-accent"
                    onClick={() => toggleModule(moduleIndex)}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${expandedModules.includes(moduleIndex) ? "rotate-90" : ""}`}
                      />
                      <h3 className="font-medium">{module.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {module.lessons.filter((l:any) => l.is_published).length} lessons
                    </div>
                  </button>
                  {expandedModules.includes(moduleIndex) && (
                    <div className="border-t">
                      {module.lessons.filter((lesson:any) => lesson.is_published).map((lesson:any, lessonIndex:number) => (
                        <div
                          key={lessonIndex}
                          className="p-4 flex items-center justify-between hover:bg-accent/50"
                        >
                          <div className="flex items-center gap-2">
                            {lesson.type === 'video' ? <Play className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                            <span>{lesson.title}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {lesson.duration || ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-8">
            <div className="flex items-start gap-6">
              <Image
                src={withValidImageUrl(course.instructor?.avatar_url, DEFAULT_AVATAR_URL)}
                alt={course.instructor?.full_name || "Instructor"}
                width={120}
                height={120}
                className="rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold mb-2">{course.instructor?.full_name ?? "Unknown"}</h2>
                <p className="text-lg text-muted-foreground mb-4">{course.instructor?.title ?? ""}</p>
                <div className="flex gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{course.instructor?.rating ?? "N/A"} Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.instructor?.students?.toLocaleString() ?? "0"} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.instructor?.courses ?? "0"} Courses</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{course.instructor?.bio ?? ""}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold">Areas of Expertise:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(course.instructor?.expertise) && course.instructor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-8">
            <h2 className="text-2xl font-bold">Student Reviews</h2>
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold">
                {course.reviews?.average ?? "N/A"}
              </span>
              <span className="text-gray-400">({course.rating?.total ?? 0} reviews)</span>
            </div>
            <div className="space-y-6">
              {Array.isArray(course.reviews) && course.reviews.map((review, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={withValidImageUrl(review.user?.avatar_url, "/default-avatar.png")}
                      alt={review.user?.name || "Student"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
              <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {Array.isArray(course.faq) && course.faq.map((item, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}