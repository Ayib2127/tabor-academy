import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/utils/error-handling';
import { trackPerformance } from '@/lib/utils/performance';
import { validateEnv } from '@/lib/utils/env-validation';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Validate environment variables
  validateEnv();
  
  const courseId = context.params.id;
  const supabase = createRouteHandlerClient({ cookies });

  return trackPerformance('GET /api/courses/[id]/enrollments', async () => {
    try {
      // Verify that the user is authenticated and is the instructor of this course
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return createErrorResponse(userError || new Error('User not found'), 401);
      }

      // Verify course ownership
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        return createErrorResponse(courseError || new Error('Course not found'), 404);
      }

      if (courseData.instructor_id !== user.id) {
        return createErrorResponse(
          new Error('Forbidden: You are not the instructor of this course'),
          403
        );
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
        return createErrorResponse(enrollmentsError, 500);
      }

      // Get all published lessons for this course
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, is_published')
        .eq('course_id', courseId);

      if (lessonsError) {
        console.error('Error fetching lessons for progress calculation:', lessonsError);
        Sentry.captureException(lessonsError);
        return createErrorResponse(lessonsError, 500);
      }

      const publishedLessons = lessons.filter(l => l.is_published);
      const totalLessons = publishedLessons.length;

      // Calculate progress for each student
      const studentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          const studentId = enrollment.user_id;

          // Get completed lessons for this student
          const { data: progressRecords, error: progressError } = await supabase
            .from('progress')
            .select('lesson_id, completed')
            .eq('user_id', studentId)
            .in('lesson_id', publishedLessons.map(l => l.id));

          if (progressError) {
            console.error('Error fetching progress records:', progressError);
            Sentry.captureException(progressError);
            return {
              ...enrollment,
              progress: 0,
              completed_lessons: 0,
              total_lessons: totalLessons,
              error: 'Failed to fetch progress'
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
      console.error('Unexpected error in enrollments route:', error);
      Sentry.captureException(error);
      return createErrorResponse(error, 500);
    }
  });
}