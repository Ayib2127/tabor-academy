import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

  console.log('Incoming cookies (activity API):', (await cookies()).getAll());
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user session:', userError);
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!user) {
    console.log('Authentication failed: No user found for instructor activity API.');
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }

  try {
    // First, get the course IDs
    const { data: courseIds } = await supabase
      .from('courses')
      .select('id')
      .eq('instructor_id', user.id);

    // Then use those IDs in the activity query
    const { data: recentActivityData, error: activityError } = await supabase
      .from('activity_log')
      .select(`
        id,
        type,
        created_at,
        users (full_name),
        courses (title),
        action_description
      `)
      .in('course_id', courseIds?.map(c => c.id) || []);

    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
      return NextResponse.json({ error: activityError.message }, { status: 500 });
    }

    const processedActivity: ActivityItem[] = recentActivityData.map(item => ({
      id: item.id,
      type: item.type as ActivityItem['type'],
      student: item.users?.[0]?.full_name || 'Unknown Student',
      action: item.action_description || 'performed an action',
      course: item.courses?.[0]?.title || 'Unknown Course',
      time: item.created_at, // Use created_at as time
    }));

    return NextResponse.json(processedActivity);

  } catch (err: any) {
    console.error('Unexpected error fetching recent activity:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
} 