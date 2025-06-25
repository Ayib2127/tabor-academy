import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('--- API Call: /api/instructor/students ---');
  console.log('Request URL:', request.url);

  const { searchParams } = new URL(request.url);
  const courseIdFilter = searchParams.get('courseId'); // Get courseId from query parameter
  console.log('Course ID Filter:', courseIdFilter);

  console.log('Incoming cookies (Students):', cookies().getAll());
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Supabase getUser Error (Students):', userError.message, userError);
    return NextResponse.json({ error: userError.message || 'Supabase user error' }, { status: 500 });
  }

  if (!user) {
    console.warn('Authentication failed (Students): No user object found from session.');
    return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
  }

  console.log('User found in Students API:', user.id, user.email);

  try {
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
        return NextResponse.json({ error: coursesError.message }, { status: 500 });
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
        users (id, full_name, email, avatar_url) // Added avatar_url here
      `)
      .in('course_id', targetCourseIds);

    if (enrollmentsError) {
      console.error('Error fetching enrollments (Students):', enrollmentsError);
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 });
    }

    // Fetch all lessons for these courses
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, course_id, is_published')
      .in('course_id', targetCourseIds);

    if (lessonsError) {
      console.error('Error fetching lessons (Students):', lessonsError);
      return NextResponse.json({ error: lessonsError.message }, { status: 500 });
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
      return NextResponse.json({ error: progressError.message }, { status: 500 });
    }

    // Process data to build the desired structure
    const studentsMap = new Map();

    enrollments.forEach(enrollment => {
      const studentId = enrollment.user_id;
      // Corrected access for user details
      const studentFullName = enrollment.users?.full_name || 'N/A';
      const studentEmail = enrollment.users?.email || 'N/A';
      const studentAvatarUrl = enrollment.users?.avatar_url || '/default-avatar.png'; // Added avatar_url

      // Corrected access for course details
      const courseId = enrollment.courses?.id;
      const courseTitle = enrollment.courses?.title || 'N/A';

      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: studentId,
          full_name: studentFullName,
          email: studentEmail,
          avatar_url: studentAvatarUrl, // Added avatar_url
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
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}