"use client"

import { useState, useEffect, Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, User, Mail, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Define the structure for a student as returned by the new API
interface StudentCourseEnrollment {
  course_id: string;
  course_title: string;
  enrolled_at: string;
  progress: number;
  status: 'completed' | 'in-progress';
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  courses_enrolled: StudentCourseEnrollment[];
}

function StudentManagementPageInner() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let apiUrl = '/api/instructor/students';
        if (courseId) {
          apiUrl += `?courseId=${courseId}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch students.');
        }
        const data: Student[] = await response.json();
        setStudents(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to calculate overall progress for a student across all their enrolled courses
  const calculateOverallProgress = (student: Student) => {
    if (student.courses_enrolled.length === 0) return 0;
    const totalProgress = student.courses_enrolled.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / student.courses_enrolled.length);
  };

  // Helper to determine overall status
  const getOverallStatus = (student: Student) => {
    if (student.courses_enrolled.length === 0) return 'Not Enrolled';
    const allCompleted = student.courses_enrolled.every(course => course.status === 'completed');
    return allCompleted ? 'Completed' : 'Active';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard/instructor" className="hover:text-foreground">Instructor Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Student Management {courseId && `(Filtered by Course ID: ${courseId})`}</span>
          </div>

      <h1 className="text-3xl font-bold mb-6">Student Management</h1>
      <Card className="p-6 mb-6">
        <Input
          placeholder="Search students by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />
            {loading ? (
              <p>Loading students...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : filteredStudents.length === 0 ? (
              <p>No students found.</p>
            ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-brand-orange-100 text-brand-orange-700">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Courses Enrolled</th>
                      <th className="py-2 px-4 text-left">Overall Status</th>
                      <th className="py-2 px-4 text-left">Overall Progress</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
                    {filteredStudents.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/logo.jpg"
                              alt={student.full_name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <span className="font-medium">{student.full_name}</span>
                          </div>
                        </td>
                  <td className="py-2 px-4">{student.email}</td>
                        <td className="py-2 px-4">
                          {student.courses_enrolled.length > 0 ? (
                            <div className="space-y-1">
                              {student.courses_enrolled.map((enrollment, index) => (
                                <div key={index} className="text-sm">
                                  {enrollment.course_title} ({enrollment.progress}%)
                                </div>
                              ))}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                  <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            getOverallStatus(student) === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {getOverallStatus(student)}
                          </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                            <Progress value={calculateOverallProgress(student)} className="h-2" />
                    </div>
                          <span className="ml-2 text-sm">{calculateOverallProgress(student)}%</span>
                  </td>
                  <td className="py-2 px-4 space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/instructor/students/${student.id}`}>View Details</Link>
                          </Button>
                          <Link href={`/community/messages?to=${student.id}`}>
                    <Button size="sm" variant="outline">Message</Button>
                          </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            )}
      </Card>
        </div>
      </main>
    </div>
  );
}

export default function StudentManagementPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <StudentManagementPageInner />
    </Suspense>
  );
} 