"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, PlayCircle, Lock, CheckCircle, Video } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  duration: number | null;
  position: number;
  is_published: boolean;
  module_id: string | null; // Assuming lessons can be part of modules
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  // Add other course properties as needed for display
}

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export default function CoursePreviewPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        // Fetch course details
        const courseRes = await fetch(`/api/courses/${courseId}`, {
          credentials: 'include',
        });
        if (!courseRes.ok) {
          const errorData = await courseRes.json();
          throw new Error(errorData.error || 'Failed to fetch course details for preview.');
        }
        const courseData: Course = await courseRes.json();
        setCourse(courseData);

        // Fetch all lessons (published and unpublished for instructor)
        const lessonsRes = await fetch(`/api/courses/${courseId}/lessons`, {
          credentials: 'include',
        });
        if (!lessonsRes.ok) {
          const errorData = await lessonsRes.json();
          throw new Error(errorData.error || 'Failed to fetch lessons for preview.');
        }
        const lessonsData: Lesson[] = await lessonsRes.json();

        // Organize lessons into modules
        const organizedModulesMap = new Map<string | null, Module>();

        lessonsData.forEach(lesson => {
          const moduleId = lesson.module_id || 'no-module'; // Group unassigned lessons
          if (!organizedModulesMap.has(moduleId)) {
            organizedModulesMap.set(moduleId, {
              id: moduleId,
              title: moduleId === 'no-module' ? 'Unassigned Lessons' : `Module ${moduleId}`, // Placeholder title
              position: 0, // Placeholder position, would ideally come from a modules table
              lessons: []
            });
          }
          organizedModulesMap.get(moduleId)?.lessons.push(lesson);
        });

        const organizedModules = Array.from(organizedModulesMap.values()).map(mod => ({
          ...mod,
          lessons: mod.lessons.sort((a, b) => a.position - b.position)
        })).sort((a, b) => a.position - b.position); // Sort modules by position if available

        setModules(organizedModules);

        // NEW: Set initial selected lesson to the first published lesson
        const firstPublishedLesson = lessonsData.find(lesson => lesson.is_published);
        if (firstPublishedLesson) {
          setSelectedLesson(firstPublishedLesson);
        } else if (lessonsData.length > 0) {
          // If no published lessons, select the first draft lesson
          setSelectedLesson(lessonsData[0]);
        }

      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching course content for preview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p>Loading course preview...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p>Course not found for preview.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Back to Editor Button */}
          <div className="mb-6">
            <Link
              href={`/dashboard/instructor/courses/${courseId}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-4">{course.title} (Preview)</h1>
          {course.description && (
            <p className="text-lg text-muted-foreground mb-8">{course.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content Area: Displays selected lesson or course overview */}
            <div className="md:col-span-2">
              <Card className="p-6">
                {selectedLesson ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      {selectedLesson.video_url && <Video className="h-6 w-6" />}
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.video_url && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        <video
                          src={selectedLesson.video_url}
                          controls
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                    {selectedLesson.content && (
                      <div className="prose max-w-none"> {/* Use prose for basic markdown styling if you have @tailwindcss/typography */}
                        <h3 className="text-xl font-semibold mb-2">Lesson Content</h3>
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                      </div>
                    )}
                    {!selectedLesson.video_url && !selectedLesson.content && (
                        <p className="text-muted-foreground">This lesson has no content or video yet.</p>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
                    <p className="text-muted-foreground">
                      This is the general overview of your course. Select a lesson from the curriculum to preview its content.
                    </p>
                    {/* Placeholder for course image or promo video if available */}
                    <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg mt-4">
                      <PlayCircle className="h-16 w-16 text-gray-500" />
                    </div>
                  </>
                )}
              </Card>
            </div>

            {/* Course Curriculum / Lesson List */}
            <div className="md:col-span-1">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
                {modules.length === 0 ? (
                  <p className="text-muted-foreground">No modules or lessons found yet.</p>
                ) : (
                  <nav className="space-y-4">
                    {modules.map(module => (
                      <div key={module.id}>
                        <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                        <ul className="space-y-2">
                          {module.lessons.map(lesson => (
                            <li
                              key={lesson.id}
                              className={`flex items-center gap-2 p-2 rounded-md transition-colors 
                                ${lesson.is_published ? 'cursor-pointer hover:bg-gray-100' : 'bg-gray-50 text-gray-400 opacity-80'}
                                ${selectedLesson?.id === lesson.id ? 'bg-brand-orange-100 text-brand-orange-700 font-medium' : ''}
                              `}
                              onClick={() => lesson.is_published && setSelectedLesson(lesson)} // Make only published lessons clickable
                            >
                              {lesson.is_published ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                              <span>{lesson.title}</span>
                              {!lesson.is_published && (
                                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Draft</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 