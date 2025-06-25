import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import ApproveRejectButtons from '@/components/admin/approve-reject-buttons';
import Image from 'next/image';

export const dynamic = 'auto';

type Props = { params: { id: string } };

export default async function CourseReviewPage({ params }: Props) {
  const supabase = createRouteHandlerClient({ cookies });

  // auth
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/');

  // fetch course + instructor
  const { data: course, error } = await supabase
    .from('courses')
    .select('*, profiles!courses_instructor_id_fkey(username, full_name)')
    .eq('id', params.id)
    .single();

  if (error || !course) {
    throw new Error(error?.message || 'Course not found');
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
