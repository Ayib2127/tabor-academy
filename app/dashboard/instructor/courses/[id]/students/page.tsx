"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, User, Mail, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface StudentEnrollmentDetail {
  user_id: string;
  enrolled_at: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
  progress: number;
  completed_lessons: number;
  total_lessons: number;
}

export default function CourseStudentsPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [students, setStudents] = useState<StudentEnrollmentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseTitle, setCourseTitle] = useState('Loading Course...');

  useEffect(() => {
    const fetchCourseAndStudents = async () => {
      try {
        setLoading(true);
        // Fetch course details to get the title
        const courseRes = await fetch(`/api/courses/${courseId}`);
        if (!courseRes.ok) {
          throw new Error('Failed to fetch course details.');
        }
        const courseData = await courseRes.json();
        setCourseTitle(courseData.title);

        // Fetch students enrolled in this course
        const studentsRes = await fetch(`/api/courses/${courseId}/enrollments`);
        if (!studentsRes.ok) {
          throw new Error('Failed to fetch students for this course.');
        }
        const studentsData: StudentEnrollmentDetail[] = await studentsRes.json();
        setStudents(studentsData);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndStudents();
  }, [courseId]);

  const filteredStudents = students.filter(student =>
    student.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.users?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard/instructor" className="hover:text-foreground">Instructor Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/dashboard/instructor/courses/${courseId}`} className="hover:text-foreground">{courseTitle}</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Enrolled Students</span>
          </div>

          <h1 className="text-3xl font-bold mb-6">Students in "{courseTitle}"</h1>
          <Card className="p-6 mb-6">
            <Input
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            {loading ? (
              <p>Loading students...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : filteredStudents.length === 0 ? (
              <p>No students found for this course.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-brand-orange-100 text-brand-orange-700">
                      <th className="py-2 px-4 text-left">Student Name</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Enrolled On</th>
                      <th className="py-2 px-4 text-left">Progress</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.user_id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={student.users?.avatar_url || '/default-avatar.png'}
                              alt={student.users?.full_name || 'Student'}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <span className="font-medium">{student.users?.full_name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4">{student.users?.email || 'N/A'}</td>
                        <td className="py-2 px-4">{new Date(student.enrolled_at).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <Progress value={student.progress} className="h-2" />
                          </div>
                          <span className="ml-2 text-sm">{student.progress}% ({student.completed_lessons}/{student.total_lessons} lessons)</span>
                        </td>
                        <td className="py-2 px-4 space-x-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" variant="outline">Message</Button>
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
