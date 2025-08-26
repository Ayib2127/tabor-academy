import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  const supabase = await createApiSupabaseClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Auth session missing or error:', sessionError?.message);
    throw new ForbiddenError('Auth session missing!');
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
      throw new ValidationError('Course not found or you do not have access');
    }

    if (course.instructor_id !== instructorId) {
      throw new ForbiddenError('Unauthorized access to course');
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
      throw enrollmentsError;
    }

    // Fetch all lessons for the course to calculate total lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('module_lessons')
      .select('*')
      .eq('course_id', courseId);

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError.message);
      throw lessonsError;
    }

    const totalLessons = lessons ? lessons.length : 0;

    const studentsData = enrollments.map(enrollment => {
      const completedLessons = enrollment.progress ? enrollment.progress.filter((p: any) => p.completed).length : 0;
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
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}
