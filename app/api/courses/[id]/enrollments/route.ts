import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/utils/error-handling';
import { trackPerformance } from '@/lib/utils/performance';
import { validateEnv } from '@/lib/utils/env-validation';

type RouteParams = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  // Validate environment variables
  validateEnv();
  
  const courseId = params.id;
  const supabase = createRouteHandlerClient({ cookies });

  return trackPerformance('GET /api/courses/[id]/enrollments', async () => {
    try {
      // Verify that the user is authenticated and is the instructor of this course
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return createErrorResponse(userError || new Error('User not found'));
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        return createErrorResponse(courseError || new Error('Course not found'));
      }

      if (courseData.instructor_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden: You are not the instructor of this course' },
          { status: 403 }
        );
      }

      // Fetch enrollments for the specific course
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          user_id,
          enrolled_at,
          users (id, full_name, email, avatar_url)
        `)
        .eq('course_id', courseId);

      if (enrollmentsError) {
        console.error('Error fetching course enrollments:', enrollmentsError);
        return NextResponse.json({ error: enrollmentsError.message }, { status: 500 });
      }

      // For each enrollment, fetch their progress in this course
      const studentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          const studentId = enrollment.user_id;

          // Get all lessons for this course
          const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id, is_published')
            .eq('course_id', courseId);

          if (lessonsError) {
            console.error('Error fetching lessons for progress calculation:', lessonsError);
            return { ...enrollment, progress: 0, completed_lessons: 0, total_lessons: 0 };
          }

          const publishedLessons = lessons.filter(l => l.is_published);
          const totalLessons = publishedLessons.length;

          // Get completed lessons for this student in this course
          const { data: progressRecords, error: progressError } = await supabase
            .from('progress')
            .select('lesson_id, completed')
            .eq('user_id', studentId)
            .in('lesson_id', publishedLessons.map(l => l.id));

          if (progressError) {
            console.error('Error fetching progress records:', progressError);
            return { ...enrollment, progress: 0, completed_lessons: 0, total_lessons: 0 };
          }

          const completedLessonsCount = progressRecords.filter(pr => pr.completed).length;
          const progressPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

          return {
            ...enrollment,
            progress: progressPercentage,
            completed_lessons: completedLessonsCount,
            total_lessons: totalLessons,
          };
        })
      );

      return NextResponse.json(studentsWithProgress);

    } catch (error) {
      return createErrorResponse(error);
    }
  });
}