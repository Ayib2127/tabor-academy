import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

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

export default function StudentManagementPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/instructor/students');
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
  }, []);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to calculate overall progress for a student across all their enrolled courses with this instructor
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
      <div className="container mx-auto py-8">
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
                      <td className="py-2 px-4 font-medium">{student.full_name}</td>
                      <td className="py-2 px-4">{student.email}</td>
                      <td className="py-2 px-4">
                        {student.courses_enrolled.length > 0 ? (
                          <ul>
                            {student.courses_enrolled.map((enrollment, index) => (
                              <li key={index} className="text-sm">
                                {enrollment.course_title} ({enrollment.progress}%)
                              </li>
                            ))}
                          </ul>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getOverallStatus(student) === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
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
    </div>
  );
} 