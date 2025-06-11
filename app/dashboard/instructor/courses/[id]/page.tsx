"use client"

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { SiteHeader } from "@/components/site-header";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Lock, CheckCircle, FileText } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface Lesson {
    id: number;
    title: string;
    is_published: boolean;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  modules: Module[]; // Add modules to the Course interface
}

interface CoursePreviewPageProps {
  params: { id: string };
}

export default function CoursePreviewPage({ params }: CoursePreviewPageProps) {
  const { id: courseId } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*, modules:course_modules(*, lessons:module_lessons(*))') // Fetch modules and lessons
          .eq('id', courseId)
          .single();

        if (courseError) {
          throw new Error(courseError.message);
        }

        if (!courseData) {
          throw new Error('Course not found.');
        }

        setCourse(courseData as Course);

        // Organize lessons into modules
        const organizedModules: Module[] = courseData.modules.map((mod: any) => ({
          id: mod.id,
          title: mod.title,
          lessons: mod.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            is_published: lesson.is_published, // Ensure is_published is fetched
          })),
        }));
        setModules(organizedModules);

      } catch (err: any) {
        console.error("Error fetching course content:", err);
        setError(err.message || 'Failed to fetch course content.');
        toast.error(err.message || 'Failed to load course content.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId]);

  const totalLessons = modules.reduce((count, module) => count + module.lessons.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Course</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-4">The course you are looking for does not exist or you do not have access.</p>
        <Link href="/dashboard/instructor/courses"><Button>Back to My Courses</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteHeader />
      <div className="flex-1 container py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Details Column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-700 mb-6">{course.description}</p>

            {course.thumbnail_url && (
              <div className="mb-6">
                <img src={course.thumbnail_url} alt="Course Thumbnail" className="w-full h-64 object-cover rounded-lg" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Category:</p>
                <p className="font-medium text-gray-800">{course.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Level:</p>
                <p className="font-medium text-gray-800">{course.level}</p>
              </div>
              <div>
                <p className="text-gray-500">Price:</p>
                <p className="font-medium text-gray-800">{course.price === 0 ? 'Free' : `$${course.price}`}</p>
              </div>
              <div>
                <p className="text-gray-500">Status:</p>
                <p className={`font-medium ${course.is_published ? 'text-green-600' : 'text-yellow-600'}`}>
                  {course.is_published ? 'Published' : 'Draft'}
                </p>
              </div>
            </div>
          </Card>

          {/* Course Curriculum Preview */}
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

        {/* Lesson Content Column */}
        <div className="md:col-span-1">
          {selectedLesson ? (
            <Card className="sticky top-20 p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
              {/* Placeholder for lesson content */}
              <p className="text-gray-700">Lesson content would be displayed here.</p>
              <Button className="mt-4">Start Lesson</Button>
            </Card>
          ) : (
            <Card className="sticky top-20 p-6 shadow-md text-center text-gray-600">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>Select a published lesson from the curriculum to preview its content.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}