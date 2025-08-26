import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { handleApiError } from '@/lib/utils/error-handling';
import { trackPerformance } from '@/lib/utils/performance';
import { validateEnv } from '@/lib/utils/env-validation';
import * as Sentry from '@sentry/nextjs';

// Explicit type definition for route context
type RouteContext = {
  params: { 
    id: string 
  };
};

type Enrollment = {
  user_id: string;
  enrolled_at: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
  };
};

export const dynamic = 'force-dynamic';

export async function GET(
  _: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  validateEnv();
  
  const courseId = context.params.id;  // Access via context.params
  const supabase = await createApiSupabaseClient();

  return trackPerformance('GET /api/courses/[id]/enrollments', async () => {
    try {
      // Verify authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return NextResponse.json({
          code: 'VALIDATION_ERROR',
          error: 'User not found',
          details: userError || new Error('User not found')
        }, { status: 400 });
      }

      // Verify course ownership
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        return NextResponse.json({
          code: 'VALIDATION_ERROR',
          error: 'Course not found',
          details: courseError || new Error('Course not found')
        }, { status: 400 });
      }

      if (courseData.instructor_id !== user.id) {
        return NextResponse.json({
          code: 'FORBIDDEN',
          error: 'Forbidden: You are not the instructor of this course',
          details: new Error('Forbidden: You are not the instructor of this course')
        }, { status: 403 });
      }

      // Fetch enrollments with user details
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          user_id,
          enrolled_at,
          users (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('course_id', courseId);

      if (enrollmentsError) {
        console.error('Error fetching course enrollments:', enrollmentsError);
        Sentry.captureException(enrollmentsError);
        return NextResponse.json({
          code: 'INTERNAL_SERVER_ERROR',
          error: 'Failed to fetch course enrollments',
          details: enrollmentsError
        }, { status: 500 });
      }

      // Get published lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('module_lessons')  // Changed from 'lessons'
        .select('*')
        .eq('course_id', courseId);

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        Sentry.captureException(lessonsError);
        return NextResponse.json({
          code: 'INTERNAL_SERVER_ERROR',
          error: 'Failed to fetch lessons',
          details: lessonsError
        }, { status: 500 });
      }

      const lessonsTyped = (lessons ?? []) as Lesson[];
      const publishedLessons = lessonsTyped.filter(l => l.is_published);
      const totalLessons = publishedLessons.length;

      const enrollmentsTyped = (enrollments ?? []) as Enrollment[];
      const studentsWithProgress = await Promise.all(
        enrollmentsTyped.map(async (enrollment) => {
          const studentId = enrollment.user_id;

          // Get completed lessons
          const { data: progressRecords, error: progressError } = await supabase
            .from('progress')
            .select('lesson_id, completed')
            .eq('user_id', studentId)
            .in('lesson_id', publishedLessons.map(l => l.id));

          if (progressError) {
            console.error('Error fetching progress:', progressError);
            Sentry.captureException(progressError);
            return {
              ...enrollment,
              progress: 0,
              completed_lessons: 0,
              total_lessons: totalLessons,
              error: 'Progress fetch failed'
            };
          }

          const completedLessonsCount = progressRecords.filter(pr => pr.completed).length;
          const progressPercentage = totalLessons > 0 
            ? Math.round((completedLessonsCount / totalLessons) * 100) 
            : 0;

          return {
            ...enrollment,
            progress: progressPercentage,
            completed_lessons: completedLessonsCount,
            total_lessons: totalLessons
          };
        })
      );

      return NextResponse.json(studentsWithProgress);

    } catch (error) {
      console.error('Unexpected error:', error);
      Sentry.captureException(error);
      const apiError = handleApiError(error);
      return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
    }
  });
}