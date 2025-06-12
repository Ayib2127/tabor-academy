import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Auth session missing or error:', sessionError?.message);
    return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
  }

  const instructorId = session.user.id;

  try {
    // Verify that the instructor owns the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('Course not found or access denied:', courseError?.message);
      return NextResponse.json({ error: 'Course not found or you do not have access' }, { status: 404 });
    }

    if (course.instructor_id !== instructorId) {
      return NextResponse.json({ error: 'Unauthorized access to course' }, { status: 403 });
    }

    // Fetch enrolled students for the course
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        profiles(full_name, avatar_url),
        progress(lesson_id, completed)
      `)
      .eq('course_id', courseId);

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError.message);
      return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
    }

    // Fetch all lessons for the course to calculate total lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError.message);
      return NextResponse.json({ error: 'Failed to fetch lessons for progress calculation' }, { status: 500 });
    }

    const totalLessons = lessons ? lessons.length : 0;

    const studentsData = enrollments.map(enrollment => {
      const completedLessons = enrollment.progress ? enrollment.progress.filter(p => p.completed).length : 0;
      const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        enrollmentId: enrollment.id,
        userId: enrollment.user_id,
        fullName: (enrollment.profiles as any)?.full_name || 'N/A',
        avatarUrl: (enrollment.profiles as any)?.avatar_url || null,
        completedLessons,
        totalLessons,
        completionRate: parseFloat(completionRate.toFixed(2)),
      };
    });

    return NextResponse.json({ students: studentsData });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 