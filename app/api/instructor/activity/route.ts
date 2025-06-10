import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
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

  // Explicitly inspect cookies before creating the client
  const allCookies = cookies().getAll();
  console.log('SERVER-SIDE: All Request Cookies (Activity):', JSON.stringify(allCookies, null, 2));

  const supabase = createRouteHandlerClient();
  console.log('SERVER-SIDE: Supabase Route Handler Client initialized (Activity).');

  try {
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

    // Fetch recent activity data for the instructor's courses
    // This query needs to join enrollments and courses to filter by instructor_id
    const { data: recentActivityData, error: activityError } = await supabase
      .from('activity_log') // Assuming you have an 'activity_log' table
      .select(`
        id,
        type,
        created_at,
        users (full_name),
        courses (title),
        action_description
      `)
      .in('course_id', supabase
        .from('courses')
        .select('id')
        .eq('instructor_id', user.id)
      );

    if (activityError) {
      console.error('Error fetching recent activity:', activityError);
      return NextResponse.json({ error: activityError.message }, { status: 500 });
    }

    const processedActivity: ActivityItem[] = recentActivityData.map(item => ({
      id: item.id,
      type: item.type as ActivityItem['type'],
      student: item.users?.full_name || 'Unknown Student',
      action: item.action_description || 'performed an action',
      course: item.courses?.title || 'Unknown Course',
      time: item.created_at, // Use created_at as time
    }));

    console.log('SERVER-SIDE: API Response: Activity fetched successfully.');
    return NextResponse.json(processedActivity);

  } catch (err: any) {
    console.error('Unexpected error fetching recent activity:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}