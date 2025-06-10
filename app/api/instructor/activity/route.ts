import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'assignment' | 'question';
  student: string;
  action: string;
  course: string;
  time: string;
}

export async function GET(request: Request) {
  console.log('--- API Call: /api/instructor/activity ---');
  console.log('Request URL:', request.url);

  let supabase;
  try {
    // Explicitly inspect cookies before creating the client
    const allCookies = cookies().getAll();
    console.log('SERVER-SIDE: All Request Cookies (Activity):', JSON.stringify(allCookies, null, 2));

    supabase = createRouteHandlerClient({ cookies }, {
      cookieOptions: {
        domain: process.env.NODE_ENV === 'production' ? new URL(process.env.NEXT_PUBLIC_VERCEL_URL || 'https://your-production-domain.com').hostname : 'localhost',
        path: '/',
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      },
    });
    console.log('SERVER-SIDE: Supabase Route Handler Client initialized (Activity).');
  } catch (e: any) {
    console.error('SERVER-SIDE: Error initializing Supabase client in Activity API route:', e.message, e);
    return NextResponse.json({ error: 'Failed to initialize Supabase client.' }, { status: 500 });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('SERVER-SIDE: Supabase getUser Error (Activity):', userError.message, userError);
    return NextResponse.json({ error: userError.message || 'Supabase user error' }, { status: 500 });
  }

  if (!user) {
    console.warn('SERVER-SIDE: Authentication failed (Activity): No user object found from session.');
    return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
  }

  console.log('SERVER-SIDE: User found in Activity API:', user.id, user.email);

  try {
    // Fetch courses taught by the instructor
    const { data: instructorCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('instructor_id', user.id);

    if (coursesError) {
      console.error('SERVER-SIDE: Error fetching instructor courses for activity feed:', coursesError);
      return NextResponse.json({ error: coursesError.message }, { status: 500 });
    }

    const courseIds = instructorCourses?.map(course => course.id) || [];
    const courseTitlesMap = new Map(instructorCourses?.map(course => [course.id, course.title]));

    // Fetch recent enrollments for these courses
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*, users(full_name), courses(title)')
      .in('course_id', courseIds)
      .order('enrolled_at', { ascending: false })
      .limit(10); // Limit to recent 10 enrollments

    if (enrollmentsError) {
      console.error('SERVER-SIDE: Error fetching enrollments for activity feed:', enrollmentsError);
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 });
    }

    // First, fetch lesson IDs related to the instructor\'s courses
    const { data: lessonIdsData, error: lessonIdsError } = await supabase
      .from('lessons')
      .select('id')
      .in('course_id', courseIds);

    if (lessonIdsError) {
      console.error('SERVER-SIDE: Error fetching lesson IDs for activity feed:', lessonIdsError);
      return NextResponse.json({ error: lessonIdsError.message }, { status: 500 });
    }

    const lessonIds = lessonIdsData?.map(lesson => lesson.id) || [];

    // Fetch recent lesson completions for these courses using the fetched lesson IDs
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('*, users(full_name), lessons(title, course_id)')
      .in('lesson_id', lessonIds)
      .order('created_at', { ascending: false })
      .limit(10); // Limit to recent 10 progress entries

    if (progressError) {
      console.error('SERVER-SIDE: Error fetching progress for activity feed:', progressError);
      return NextResponse.json({ error: progressError.message }, { status: 500 });
    }

    const activityFeed: ActivityItem[] = [];

    // Add enrollments to activity feed
    enrollments.forEach(enrollment => {
      activityFeed.push({
        id: `enroll-${enrollment.id}`,
        type: 'enrollment',
        student: enrollment.users?.full_name || 'Unknown Student',
        action: 'enrolled in',
        course: enrollment.courses?.title || courseTitlesMap.get(enrollment.course_id) || 'Unknown Course',
        time: enrollment.enrolled_at,
      });
    });

    // Add lesson completions to activity feed
    progress.forEach(item => {
      activityFeed.push({
        id: `progress-${item.id}`,
        type: 'completion',
        student: item.users?.full_name || 'Unknown Student',
        action: `completed lesson '${item.lessons?.title || 'Unknown Lesson'}'`,
        course: courseTitlesMap.get(item.lessons?.course_id || '') || 'Unknown Course',
        time: item.completed_at || item.created_at,
      });
    });

    // Sort activity feed by time (most recent first)
    activityFeed.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Limit to the most recent 10 activities
    const limitedActivityFeed = activityFeed.slice(0, 10);

    console.log('SERVER-SIDE: API Response: Activity fetched successfully.');
    return NextResponse.json(limitedActivityFeed);

  } catch (err: any) {
    console.error('SERVER-SIDE: Unexpected error fetching instructor activity:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
} 