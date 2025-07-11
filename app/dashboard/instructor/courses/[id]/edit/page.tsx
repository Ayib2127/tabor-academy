import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CourseEditor from '@/components/instructor/course-editor/CourseEditor';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params and cookies
  const { id: courseId } = await params;
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Use getUser() instead of getSession() for better security
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log('DEBUG: No user found, redirecting to /login');
    redirect('/login');
  }

  // Debug: Log session and params
  console.log('DEBUG: session', user);
  console.log('DEBUG: courseId', courseId);

  // Fetch course data (use course_modules and module_lessons)
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      course_modules(
        *,
        module_lessons(*)
      )
    `)
    .eq('id', courseId)
    .single();

  // Debug: Log course and error
  console.log('DEBUG: course', course);
  console.log('DEBUG: courseError', courseError);

  if (courseError || !course) {
    console.log('DEBUG: No course found or error, redirecting to /dashboard/instructor/courses');
    redirect('/dashboard/instructor/courses');
  }

  // Verify course ownership
  if (course.instructor_id !== user.id) {
    console.log('DEBUG: Instructor mismatch', { courseInstructor: course.instructor_id, userId: user.id });
    redirect('/dashboard/instructor/courses');
  }

  // Transform course_modules to modules for CourseEditor compatibility
  const courseForEditor = {
    ...course,
    modules: (course.course_modules || []).map((mod) => ({
      ...mod,
      description: mod.description ?? "",
      lessons: mod.module_lessons || [],
    })),
  };

  return (
    <div className="container mx-auto py-8">
      <CourseEditor course={courseForEditor} />
    </div>
  );
} 