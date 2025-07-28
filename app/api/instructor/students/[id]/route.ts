import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { handleApiError, ForbiddenError } from '@/lib/utils/error-handling';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('--- API Call: /api/instructor/students/[id] ---');
    console.log('Request URL:', request.url);
    console.log('Student ID:', params.id);

    const studentId = params.id;
    const supabase = await createApiSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Supabase getUser Error (Student Details API):', userError.message);
      throw userError;
    }

    if (!user) {
      console.warn('Authentication failed (Student Details API): No user object found from session.');
      throw new ForbiddenError('Auth session missing!');
    }

    console.log('Instructor User ID (Student Details API):', user.id);

    // 1. Fetch student's profile information
    const { data: studentProfile, error: profileError } = await supabase
      .from('users') // Assuming 'users' table holds profile data joined on auth.users.id
      .select('id, full_name, email, avatar_url')
      .eq('id', studentId)
      .single();

    if (profileError || !studentProfile) {
      console.error('Error fetching student profile:', profileError);
      throw new ForbiddenError('Student profile not found or access denied.');
    }

    // 2. Fetch courses the student is enrolled in AND are taught by the current instructor
    const { data: enrolledCoursesRaw, error: enrolledCoursesError } = await supabase
      .from('enrollments')
      .select(`
        course_id,
        enrolled_at,
        courses (id, title, instructor_id, is_published, thumbnail_url)
      `)
      .eq('user_id', studentId)
      .eq('courses.instructor_id', user.id); // Crucial: ensure instructor owns the course

    if (enrolledCoursesError) {
      console.error('Error fetching enrolled courses for student:', enrolledCoursesError);
      throw enrolledCoursesError;
    }

    const coursesEnrolledDetails = await Promise.all(
      enrolledCoursesRaw.map(async (enrollment: any) => {
        const course = enrollment.courses;
        if (!course) return null; // Should not happen if join is successful and RLS is correct

        // Fetch all published lessons for this course
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, is_published')
          .eq('course_id', course.id)
          .eq('is_published', true); // Only count published lessons

        if (lessonsError) {
          console.error(`Error fetching lessons for course ${course.id}:`, lessonsError);
          return {
            course_id: course.id,
            course_title: course.title,
            enrolled_at: enrollment.enrolled_at,
            progress: 0,
            completed_lessons: 0,
            total_lessons: 0,
            status: 'in-progress'
          };
        }

        const totalLessons = lessons.length;

        // Fetch progress for this student in this course
        const { data: progressRecords, error: progressError } = await supabase
          .from('progress')
          .select('lesson_id, completed')
          .eq('user_id', studentId)
          .in('lesson_id', lessons.map(l => l.id));

        if (progressError) {
          console.error(`Error fetching progress for student ${studentId} in course ${course.id}:`, progressError);
          return {
            course_id: course.id,
            course_title: course.title,
            enrolled_at: enrollment.enrolled_at,
            progress: 0,
            completed_lessons: 0,
            total_lessons: 0,
            status: 'in-progress'
          };
        }

        const completedLessons = progressRecords.filter(pr => pr.completed).length;
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const status = progressPercentage === 100 ? 'completed' : 'in-progress';

        return {
          course_id: course.id,
          course_title: course.title,
          enrolled_at: enrollment.enrolled_at,
          progress: progressPercentage,
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          status: status
        };
      })
    );

    // Filter out any null entries that might result from courses not found
    const filteredCoursesEnrolledDetails = coursesEnrolledDetails.filter(c => c !== null);

    const studentDetails = {
      id: studentProfile.id,
      full_name: studentProfile.full_name,
      email: studentProfile.email,
      avatar_url: studentProfile.avatar_url,
      courses_enrolled: filteredCoursesEnrolledDetails,
    };

    console.log('API Response: Student details fetched successfully for:', studentId);
    return NextResponse.json(studentDetails);

  } catch (err: any) {
    console.error('Unexpected error fetching individual student data:', err);
    const apiError = handleApiError(err);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
} 