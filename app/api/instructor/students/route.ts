import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { handleApiError, ForbiddenError } from '@/lib/utils/error-handling';

export async function GET(request: Request) {
  try {
    console.log('--- API Call: /api/instructor/students ---');
    console.log('Request URL:', request.url);

    const { searchParams } = new URL(request.url);
    const courseIdFilter = searchParams.get('courseId'); // Get courseId from query parameter
    console.log('Course ID Filter:', courseIdFilter);

    const supabase = await createApiSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Supabase getUser Error (Students):', userError.message, userError);
      throw userError;
    }

    if (!user) {
      console.warn('Authentication failed (Students): No user object found from session.');
      throw new ForbiddenError('Auth session missing!');
    }

    console.log('User found in Students API:', user.id, user.email);

    let targetCourseIds: string[] = [];

    if (courseIdFilter) {
      // If a specific courseId is provided, use it directly
      targetCourseIds = [courseIdFilter];
    } else {
      // Otherwise, fetch all courses taught by this instructor
      const { data: instructorCourses, error: coursesError } = await supabase
        .from('courses')
        .select('id') // Only need the ID here
        .eq('instructor_id', user.id);

      if (coursesError) {
        console.error('Error fetching instructor courses (Students):', coursesError);
        throw coursesError;
      }
      targetCourseIds = instructorCourses?.map(course => course.id) || [];
    }

    if (targetCourseIds.length === 0) {
        console.log('No courses found for instructor or given courseId. Returning empty student list.');
        return NextResponse.json([]); // No courses, so no students
    }

    // Fetch all enrollments for these courses, along with student details
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        user_id,
        enrolled_at,
        courses (id, title),
        users (id, full_name, email, avatar_url, funnel_stage)
      `)
      .in('course_id', targetCourseIds);

    if (enrollmentsError) {
      console.error('Error fetching enrollments (Students):', enrollmentsError);
      throw enrollmentsError;
    }

    // Fetch all lessons for these courses
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, course_id, is_published')
      .in('course_id', targetCourseIds);

    if (lessonsError) {
      console.error('Error fetching lessons (Students):', lessonsError);
      throw lessonsError;
    }

    // Fetch all progress records for these enrollments
    const studentIds = [...new Set(enrollments.map(e => e.user_id))];
    const lessonIds = lessons.map(l => l.id);

    const { data: progressRecords, error: progressError } = await supabase
      .from('progress')
      .select('user_id, lesson_id, completed')
      .in('user_id', studentIds)
      .in('lesson_id', lessonIds);

    if (progressError) {
      console.error('Error fetching progress records (Students):', progressError);
      throw progressError;
    }

    // Process data to build the desired structure
    const studentsMap = new Map();

    enrollments.forEach(enrollment => {
      const studentId = enrollment.user_id;
      // Corrected access for user details
      const userObj = Array.isArray(enrollment.users) ? enrollment.users[0] : enrollment.users;
      const studentFullName = userObj?.full_name || 'N/A';
      const studentEmail = userObj?.email || 'N/A';
      const studentAvatarUrl = userObj?.avatar_url || '/default-avatar.png';
      const studentFunnelStage = userObj?.funnel_stage || null;

      // Corrected access for course details
      const courseObj = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses;
      const courseId = courseObj?.id;
      const courseTitle = courseObj?.title || 'N/A';

      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: studentId,
          full_name: studentFullName,
          email: studentEmail,
          avatar_url: studentAvatarUrl,
          funnel_stage: studentFunnelStage,
          courses_enrolled: []
        });
      }

      // Calculate progress for this specific course
      const courseLessons = lessons.filter(l => l.course_id === courseId && l.is_published);
      const totalLessons = courseLessons.length;
      
      let completedLessonsCount = 0;
      if (totalLessons > 0) {
        completedLessonsCount = progressRecords.filter(
          pr => pr.user_id === studentId && 
                courseLessons.some(cl => cl.id === pr.lesson_id) && 
                pr.completed
        ).length;
      }
      
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
      
      studentsMap.get(studentId).courses_enrolled.push({
        course_id: courseId,
        course_title: courseTitle,
        enrolled_at: enrollment.enrolled_at,
        progress: progressPercentage,
        status: progressPercentage === 100 ? 'completed' : 'in-progress'
      });
    });

    const studentsList = Array.from(studentsMap.values());

    console.log('API Response: Students fetched successfully.');
    return NextResponse.json(studentsList);

  } catch (err: any) {
    console.error('Unexpected error fetching instructor students:', err);
    const apiError = handleApiError(err);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}