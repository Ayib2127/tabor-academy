import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  console.log('--- API Call: /api/instructor/students ---');
  console.log('Request URL:', request.url);

  // Explicitly inspect cookies before creating the client
  const allCookies = cookies().getAll();
  console.log('SERVER-SIDE: All Request Cookies (Students):', JSON.stringify(allCookies, null, 2));

  const supabase = createRouteHandlerClient();
  console.log('SERVER-SIDE: Supabase Route Handler Client initialized (Students).');

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('SERVER-SIDE: Supabase getUser Error (Students):', userError.message, userError);
      return NextResponse.json({ error: userError.message || 'Supabase user error' }, { status: 500 });
    }

    if (!user) {
      console.warn('SERVER-SIDE: Authentication failed (Students): No user object found from session.');
      return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
    }

    console.log('SERVER-SIDE: User found in Students API:', user.id, user.email);

    // Fetch all courses taught by this instructor
    const { data: instructorCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('instructor_id', user.id);

    if (coursesError) {
      console.error('SERVER-SIDE: Error fetching instructor courses (Students):', coursesError);
      return NextResponse.json({ error: coursesError.message }, { status: 500 });
    }

    const courseIds = instructorCourses?.map(course => course.id) || [];

    // Fetch all enrollments for these courses, along with student details
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        user_id,
        enrolled_at,
        courses (id, title),
        users (id, full_name, email)
      `)
      .in('course_id', courseIds);

    if (enrollmentsError) {
      console.error('SERVER-SIDE: Error fetching enrollments (Students):', enrollmentsError);
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 });
    }

    // Fetch all lessons for these courses
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, course_id, is_published')
      .in('course_id', courseIds);

    if (lessonsError) {
      console.error('SERVER-SIDE: Error fetching lessons (Students):', lessonsError);
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
      console.error('SERVER-SIDE: Error fetching progress records (Students):', progressError);
      return NextResponse.json({ error: progressError.message }, { status: 500 });
    }

    // Process data to build the desired structure
    const studentsMap = new Map();

    enrollments.forEach(enrollment => {
      const studentId = enrollment.user_id;
      const studentFullName = enrollment.users?.full_name || 'N/A';
      const studentEmail = enrollment.users?.email || 'N/A';
      const courseId = enrollment.courses?.id;
      const courseTitle = enrollment.courses?.title || 'N/A';

      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: studentId,
          full_name: studentFullName,
          email: studentEmail,
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

    console.log('SERVER-SIDE: API Response: Students fetched successfully.');
    return NextResponse.json(studentsList);

  } catch (err: any) {
    console.error('SERVER-SIDE: Unexpected error fetching instructor students:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}