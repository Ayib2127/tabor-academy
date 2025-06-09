import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion';
  student: string;
  action: string;
  course: string;
  time: string;
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch courses taught by the instructor
    const { data: instructorCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('instructor_id', user.id);

    if (coursesError) {
      console.error('Error fetching instructor courses for activity feed:', coursesError);
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
      console.error('Error fetching enrollments for activity feed:', enrollmentsError);
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 });
    }

    // First, fetch lesson IDs related to the instructor's courses
    const { data: lessonIdsData, error: lessonIdsError } = await supabase
      .from('lessons')
      .select('id')
      .in('course_id', courseIds);

    if (lessonIdsError) {
      console.error('Error fetching lesson IDs for activity feed:', lessonIdsError);
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
      console.error('Error fetching progress for activity feed:', progressError);
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

    return NextResponse.json(limitedActivityFeed);
  } catch (err: any) {
    console.error('Unexpected error generating activity feed:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
} 