import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Course } from '@/types/course';
import CourseEditor from '@/components/instructor/course-editor/CourseEditor';

interface CourseEditPageProps {
  params: {
    id: string;
  };
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { id: courseId } = params;

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch course data
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      modules(
        *,
        lessons(*)
      )
    `)
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    redirect('/dashboard/instructor/courses');
  }

  // Verify course ownership
  if (course.instructor_id !== session.user.id) {
    redirect('/dashboard/instructor/courses');
  }

  return (
    <div className="container mx-auto py-8">
      <CourseEditor course={course} />
    </div>
  );
} 