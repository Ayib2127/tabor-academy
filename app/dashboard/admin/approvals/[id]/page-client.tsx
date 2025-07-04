'use client';

import { useEffect, useState } from 'react';
import ApproveRejectButtons from '@/components/admin/approve-reject-buttons';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminApprovalDetailPageClient() {
  const params = useParams();
  const courseId = params?.id as string;
  const supabase = createClientComponentClient();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('courses')
        .select('*, profiles!courses_instructor_id_fkey(username, full_name)')
        .eq('id', courseId)
        .single();
      if (error || !data) {
        setError(error?.message || 'Course not found');
        setCourse(null);
      } else {
        setCourse(data);
      }
      setLoading(false);
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!course) {
    return <div className="p-6 text-red-600">Course not found</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Review Course</h1>
      <section className="border p-4 rounded-md space-y-3 bg-white">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
        {course.thumbnail_url && (
          <Image
            src={course.thumbnail_url}
            alt="Thumbnail"
            width={800}
            height={450}
            className="rounded-md"
          />
        )}
        <p className="text-sm text-gray-500">
          Instructor: {course.profiles?.full_name || course.profiles?.username}
        </p>
        <p className="text-sm text-gray-500">
          Submitted: {new Date(course.created_at).toLocaleString()}
        </p>
      </section>
      <ApproveRejectButtons courseId={course.id} />
    </main>
  );
} 