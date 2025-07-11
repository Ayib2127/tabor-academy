'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  BarChart,
  Settings,
  ChevronRight,
  AlertCircle,
  Megaphone,
  CheckCircle,
  Lock,
  FileText,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CourseStatusIndicator } from '@/components/instructor/course-status-indicator';
import { CourseAnnouncements } from '@/components/instructor/course-announcements';
import { Badge } from '@/components/ui/badge';

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'pending_review' | 'published' | 'rejected';
  is_published: boolean;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  price?: number;
  rejection_reason?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  students_count: number;
  completion_rate: number;
  rating: number;
}

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

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchCourseDetails();
    fetchCurriculum();
  }, [courseId]);

  const fetchCourseDetails = async () => {
        try {
            setLoading(true);
      const response = await fetch(`/api/instructor/courses/${courseId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch course details');
      }
      
      const data = await response.json();
      setCourse(data);
        } catch (err: any) {
      console.error('Error fetching course details:', err);
      setError(err.message);
      toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

  const fetchCurriculum = async () => {
    if (!courseId) return;
    try {
      const response = await fetch(`/api/courses/${courseId}/modules`);
      if (!response.ok) throw new Error('Failed to fetch curriculum');
      const data = await response.json();
      setModules(data.modules || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load curriculum');
    }
  };

  const handleSubmitForReview = async () => {
    if (!course) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit course for review');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Update local course state
      setCourse(prev => prev ? { ...prev, status: 'pending_review' } : null);
      
    } catch (error: any) {
      console.error('Error submitting course for review:', error);
      toast.error(error.message || 'Failed to submit course for review');
    } finally {
      setIsSubmitting(false);
    }
  };

    if (loading) {
        return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
                </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Failed to Load Course</h3>
              <p className="text-[#2C3E50]/60 mb-4">{error}</p>
              <Button onClick={fetchCourseDetails} className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
        );
    }

    return (
    <div className="flex min-h-screen flex-col">
            <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard/instructor" className="hover:text-foreground">Instructor Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Course Management</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-1">{course.title}</h1>
            <p className="text-[#2C3E50]/70 mb-2">{course.description}</p>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-xs">
                {course.status === 'draft' && <>Draft</>}
                {course.status === 'pending_review' && <>Pending Review</>}
                {course.status === 'published' && <>Published</>}
                {course.status === 'rejected' && <>Needs Changes</>}
              </Badge>
              {/* Add more status info if needed */}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/dashboard/instructor/courses/${courseId}/content`}>
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              </Link>
              <Button
                onClick={handleSubmitForReview}
                disabled={isSubmitting || course.status !== 'draft'}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
              <Link href={`/dashboard/instructor/courses/${courseId}/students`}>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
              </Link>
              <Link href={`/dashboard/instructor/courses/${courseId}/analytics`}>
                <Button variant="outline">
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Course Overview Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Course Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-[#E5E8E8]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#2C3E50] text-lg">Enrolled Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#4ECDC4]/10 p-3 rounded-full">
                          <Users className="w-5 h-5 text-[#4ECDC4]" />
              </div>
              <div>
                          <p className="text-2xl font-bold text-[#2C3E50]">{course.students_count}</p>
                          <p className="text-sm text-[#2C3E50]/60">Total students</p>
                        </div>
                      </div>
                      <Link href={`/dashboard/instructor/courses/${courseId}/students`}>
                        <Button variant="ghost" size="sm" className="text-[#4ECDC4]">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-[#E5E8E8]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#2C3E50] text-lg">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#FF6B35]/10 p-3 rounded-full">
                          <BarChart className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                          <p className="text-2xl font-bold text-[#2C3E50]">{course.completion_rate}%</p>
                          <p className="text-sm text-[#2C3E50]/60">Average completion</p>
                        </div>
                      </div>
                      <Link href={`/dashboard/instructor/courses/${courseId}/analytics`}>
                        <Button variant="ghost" size="sm" className="text-[#4ECDC4]">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-[#E5E8E8]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#2C3E50] text-lg">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-full">
                          <Megaphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                          <p className="text-2xl font-bold text-[#2C3E50]">
                            ${((course.price || 0) * course.students_count).toFixed(2)}
                          </p>
                          <p className="text-sm text-[#2C3E50]/60">Total earnings</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Course Details */}
              <Card className="border-[#E5E8E8]">
                <CardHeader>
                  <CardTitle className="text-[#2C3E50]">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-[#2C3E50] mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#2C3E50]/60">Price:</span>
                          <span className="font-medium text-[#2C3E50]">
                            ${course.price?.toFixed(2) || 'Free'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2C3E50]/60">Created:</span>
                          <span className="font-medium text-[#2C3E50]">
                            {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2C3E50]/60">Last Updated:</span>
                          <span className="font-medium text-[#2C3E50]">
                            {new Date(course.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2C3E50]/60">Status:</span>
                          <span className="font-medium text-[#2C3E50] capitalize">
                            {course.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2C3E50]/60">Rating:</span>
                          <span className="font-medium text-[#2C3E50]">
                            {course.rating ? `${course.rating.toFixed(1)}/5` : 'No ratings yet'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-[#2C3E50] mb-2">Quick Links</h3>
                      <div className="space-y-2">
                        <Link href={`/dashboard/instructor/courses/${courseId}/content`} className="flex items-center justify-between p-2 bg-[#F7F9F9] rounded-lg hover:bg-[#4ECDC4]/10 transition-colors">
                          <span className="text-[#2C3E50]">Edit Course Content</span>
                          <ChevronRight className="w-4 h-4 text-[#4ECDC4]" />
                        </Link>
                        <Link href={`/dashboard/instructor/courses/${courseId}/students`} className="flex items-center justify-between p-2 bg-[#F7F9F9] rounded-lg hover:bg-[#4ECDC4]/10 transition-colors">
                          <span className="text-[#2C3E50]">Manage Students</span>
                          <ChevronRight className="w-4 h-4 text-[#4ECDC4]" />
                        </Link>
                        <Link href={`/dashboard/instructor/courses/${courseId}/analytics`} className="flex items-center justify-between p-2 bg-[#F7F9F9] rounded-lg hover:bg-[#4ECDC4]/10 transition-colors">
                          <span className="text-[#2C3E50]">View Analytics</span>
                          <ChevronRight className="w-4 h-4 text-[#4ECDC4]" />
                        </Link>
                        <Link href={`/dashboard/instructor/courses/${courseId}/settings`} className="flex items-center justify-between p-2 bg-[#F7F9F9] rounded-lg hover:bg-[#4ECDC4]/10 transition-colors">
                          <span className="text-[#2C3E50]">Course Settings</span>
                          <ChevronRight className="w-4 h-4 text-[#4ECDC4]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="students">
              <Card className="border-[#E5E8E8]">
                <CardHeader>
                  <CardTitle className="text-[#2C3E50]">Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Student Management</h3>
                    <p className="text-[#2C3E50]/60 mb-4">
                      View and manage students enrolled in this course.
                    </p>
                    <Link href={`/dashboard/instructor/courses/${courseId}/students`}>
                      <Button className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                        View All Students
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card className="border-[#E5E8E8]">
                <CardHeader>
                  <CardTitle className="text-[#2C3E50]">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Course Analytics</h3>
                    <p className="text-[#2C3E50]/60 mb-4">
                      View detailed analytics and insights for this course.
                    </p>
                    <Link href={`/dashboard/instructor/courses/${courseId}/analytics`}>
                      <Button className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="border-[#E5E8E8]">
                <CardHeader>
                  <CardTitle className="text-[#2C3E50]">Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Course Settings</h3>
                    <p className="text-[#2C3E50]/60 mb-4">
                      Manage course settings and configuration.
                    </p>
                    <Link href={`/dashboard/instructor/courses/${courseId}/settings`}>
                      <Button className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                        Manage Settings
                      </Button>
                    </Link>
            </div>
                </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="curriculum">
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
                              onClick={() => lesson.is_published && setSelectedLesson(lesson)}
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

              {/* Lesson Content Preview */}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
    );
}