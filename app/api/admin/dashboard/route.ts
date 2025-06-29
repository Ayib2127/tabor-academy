import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch Key Platform Metrics
    const [
      { count: totalUsers },
      { count: totalActiveCourses },
      enrollmentsData,
      pendingCourses,
    ] = await Promise.all([
      // Total Users
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true }),

      // Total Active Courses
      supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),

      // Revenue calculation
      supabase
        .from('enrollments')
        .select(`
          course_id,
          courses!inner(price)
        `),

      // Course Approval Queue
      supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          category,
          level,
          content_type,
          created_at,
          updated_at,
          users!courses_instructor_id_fkey(
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false }),
    ]);

    // Calculate total revenue
    const totalRevenue = enrollmentsData.data?.reduce((sum, enrollment) => {
      return sum + (enrollment.courses?.price || 0);
    }, 0) || 0;

    // System Health Data (simulated for MVP)
    const systemHealth = {
      serverStatus: 'Operational',
      databaseHealth: 'Good',
      apiLatency: '120ms',
      errorRate: '0.02%',
      uptime: '99.9%',
      lastUpdated: new Date().toISOString(),
    };

    // Critical System Alerts (simulated for MVP)
    const recentAlerts = [
      {
        id: 'alert-1',
        type: 'success',
        message: 'System backup completed successfully',
        time: '2 hours ago',
        priority: 'low',
        resolved: true,
      },
      {
        id: 'alert-2',
        type: 'warning',
        message: 'High server load detected during peak hours',
        time: '6 hours ago',
        priority: 'medium',
        resolved: false,
      },
      {
        id: 'alert-3',
        type: 'info',
        message: 'Scheduled maintenance completed',
        time: '1 day ago',
        priority: 'low',
        resolved: true,
      },
    ];

    // Additional metrics for comprehensive dashboard
    const [
      { count: pendingUsers },
      { count: totalInstructors },
      { count: totalStudents },
      recentActivity,
    ] = await Promise.all([
      // Pending users (if you have a pending status)
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // Total instructors
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'instructor'),

      // Total students
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student'),

      // Recent activity (last 10 activities)
      supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          role,
          created_at,
          last_sign_in_at
        `)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Construct comprehensive response
    const dashboardData = {
      metrics: {
        totalUsers: totalUsers || 0,
        totalActiveCourses: totalActiveCourses || 0,
        totalRevenue,
        pendingUsers: pendingUsers || 0,
        totalInstructors: totalInstructors || 0,
        totalStudents: totalStudents || 0,
        pendingCourses: pendingCourses.data?.length || 0,
      },
      courseApprovalQueue: pendingCourses.data || [],
      systemHealth,
      recentAlerts,
      recentActivity: recentActivity.data || [],
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(dashboardData);

  } catch (error: any) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}