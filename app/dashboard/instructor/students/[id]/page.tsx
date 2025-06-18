"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Mail, BookOpen, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface StudentCourseProgress {
  course_id: string;
  course_title: string;
  enrolled_at: string;
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  status: 'completed' | 'in-progress';
}

interface StudentDetails {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  courses_enrolled: StudentCourseProgress[];
}

export default function StudentDetailPage() {
  const { id: studentId } = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/instructor/students/${studentId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch student details.');
        }
        const data: StudentDetails = await response.json();
        setStudent(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching student details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p>Loading student details...</p>
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

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-8 flex items-center justify-center">
          <p>Student not found.</p>
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
            <Link href="/dashboard/instructor/students" className="hover:text-foreground">Student Management</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{student.full_name || 'Student Details'}</span>
          </div>

          <h1 className="text-3xl font-bold mb-6">Student Details: {student.full_name}</h1>

          <Card className="p-6 mb-6">
            <div className="flex items-center gap-6">
              <Image
                src={student.avatar_url || '/logo.jpg'}
                alt={student.full_name || 'Student'}
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-semibold">{student.full_name}</h2>
                <p className="text-muted-foreground">{student.email}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/community/messages?to=${student.id}`}>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" /> Message
                    </Button>
                  </Link>
                  {/* Future: Link to a dedicated feedback/rating page for this student */}
                  <Button variant="outline" size="sm">
                    View Feedback
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Courses Enrolled</h2>
          {student.courses_enrolled.length === 0 ? (
            <Card className="p-6">
              <p>This student is not enrolled in any of your courses.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {student.courses_enrolled.map(course => (
                <Card key={course.course_id} className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-brand-orange-500" />
                      {course.course_title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Enrolled On: {new Date(course.enrolled_at).toLocaleDateString()}</p>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Progress: {course.progress}%</p>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {course.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-brand-orange-500" />
                      )}
                      <span>{course.completed_lessons} / {course.total_lessons} lessons completed</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/instructor/courses/${course.course_id}/content`}>
                      <Button variant="outline" size="sm">Go to Course</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 