import { NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { cookies } from 'next/headers';
import { handleApiError } from '@/lib/utils/error-handling';

// CORS configuration
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);

  const headers: HeadersInit = {
    'Access-Control-Allow-Origin': isAllowed ? origin : (ALLOWED_ORIGINS[0] || '*'),
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, prefer',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };

  return headers;
}

export async function OPTIONS(request: Request) {
  const headers = getCorsHeaders(request);
  return new Response(null, { status: 204, headers });
}

interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalCourses: number;
}

interface CourseOverview {
  id: string;
  title: string;
  status: 'draft' | 'pending_review' | 'published' | 'rejected';
  thumbnail_url?: string;
  price: number;
  students: number;
  completionRate: number;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  averageRating: number;
  edited_since_rejection: boolean;
  modules?: Array<{
    id: string;
    title: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      type: 'video' | 'text' | 'quiz' | 'assignment';
      position: number;
      dueDate?: string;
      needsGrading?: boolean;
    }>;
  }>;
}

interface ActionItem {
  type: 'assignment' | 'question' | 'review';
  count: number;
  urgent: boolean;
}

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'assignment' | 'question';
  student: string;
  action: string;
  course: string;
  time: string;
  avatar?: string;
}

interface DashboardData {
  stats: DashboardStats;
  courses: CourseOverview[];
  actionItems: ActionItem[];
  recentActivity: ActivityItem[];
  notifications: Array<{
    id: string;
    type: 'status_change' | 'new_enrollment' | 'system';
    message: string;
    timestamp: string;
    read: boolean;
  }>;
}

export async function GET(request: Request) {
  console.log('--- API Call: /api/instructor/dashboard ---');
  const corsHeaders = getCorsHeaders(request);
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log('API cookies:', allCookies);

  // Log the session cookie value directly
  const sessionCookie = cookieStore.get('sb-fmbakckfxuabratissxg-auth-token');
  console.log('Session cookie value:', sessionCookie);

  if (!sessionCookie || !sessionCookie.value) {
    console.error('No Supabase auth cookie found!');
    return new NextResponse(JSON.stringify({ code: 'AUTH_REQUIRED', error: 'No Supabase auth cookie found' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }

  // Optionally, decode the JWT and log expiry (for debugging)
  try {
    const jwt = Array.isArray(sessionCookie.value)
      ? sessionCookie.value[0]
      : (sessionCookie.value.startsWith('[')
          ? JSON.parse(sessionCookie.value)[0]
          : sessionCookie.value);

    // Only for debugging, do not use in production
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
    console.log('Decoded JWT payload:', payload);
    if (payload.exp) {
      const expiry = new Date(payload.exp * 1000);
      console.log('JWT expiry:', expiry, 'Current time:', new Date());
    }
  } catch (e) {
    console.error('Failed to decode JWT for debugging:', e);
  }
  
  const supabase = await createApiSupabaseClient(cookieStore);

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Supabase user:', user, 'User error:', userError);

    if (userError) {
      console.error('Error getting user session:', userError);
      return new NextResponse(JSON.stringify({ code: 'INTERNAL_SERVER_ERROR', error: userError.message, details: userError }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    if (!user) {
      console.log('Authentication failed: No user found for instructor dashboard API.');
      return new NextResponse(JSON.stringify({ code: 'UNAUTHORIZED', error: 'Unauthorized: No active session' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // Verify user is an instructor
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'instructor') {
      return new NextResponse(JSON.stringify({ code: 'FORBIDDEN', error: 'Instructor access required' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // Fetch all instructor courses with detailed information
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        status,
        thumbnail_url,
        price,
        created_at,
        updated_at,
        rejection_reason,
        reviewed_at,
        reviewed_by,
        edited_since_rejection
      `)
      .eq('instructor_id', user.id)
      .order('updated_at', { ascending: false });

    if (coursesError) {
      console.error('Error fetching instructor courses:', coursesError);
      return new NextResponse(JSON.stringify({ code: 'INTERNAL_SERVER_ERROR', error: coursesError.message, details: coursesError }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // Calculate summary statistics
    let totalStudents = 0;
    let totalRevenue = 0;
    let totalRatingSum = 0;
    let coursesWithRatings = 0;

    const coursesOverview: CourseOverview[] = await Promise.all(
      (coursesData || []).map(async (course) => {
        // Get student count for each course
        const { count: studentCount, error: studentCountError } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id);

        if (studentCountError) {
          console.error(`Error fetching student count for course ${course.id}:`, studentCountError);
        }

        const currentStudentCount = studentCount || 0;
        const revenue = (course.price || 0) * currentStudentCount;

        // Get average completion rate for the course
        const { data: completionRate, error: completionError } = await supabase
          .rpc('get_course_average_completion_rate', {
            p_course_id: course.id,
          });

        if (completionError) {
          console.error(`Error fetching completion rate for course ${course.id}:`, completionError);
        }

        const currentCompletionRate = completionRate || 0;

        // Get average rating for the course
        const { data: courseRating, error: ratingError } = await supabase
          .rpc('get_course_average_rating', {
            p_course_id: course.id,
          });

        if (ratingError) {
          console.error(`Error fetching rating for course ${course.id}:`, ratingError);
        }

        const currentCourseRating = courseRating || 0;

        // Fetch modules and lessons for this course
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select(`
            id,
            title,
            order,
            module_lessons (
              id,
              title,
              type,
              position,
              due_date
            )
          `)
          .eq('course_id', course.id)
          .order('order', { ascending: true });

        if (modulesError) {
          console.error(`Error fetching modules for course ${course.id}:`, modulesError);
        }

        // Transform modules data to match expected format
        const modules = (modulesData || []).map(module => ({
          id: module.id,
          title: module.title,
          order: module.order,
          lessons: (module.module_lessons || []).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type as 'video' | 'text' | 'quiz' | 'assignment',
            position: lesson.position,
            dueDate: lesson.due_date,
            needsGrading: false,
          })).sort((a, b) => a.position - b.position)
        }));

        // Add to totals
        totalStudents += currentStudentCount;
        totalRevenue += revenue;

        if (currentCourseRating > 0) {
          totalRatingSum += currentCourseRating;
          coursesWithRatings++;
        }

        return {
          id: course.id,
          title: course.title,
          status: course.status,
          thumbnail_url: course.thumbnail_url,
          price: course.price,
          students: currentStudentCount,
          completionRate: parseFloat(currentCompletionRate.toFixed(2)),
          created_at: course.created_at,
          updated_at: course.updated_at,
          rejection_reason: course.rejection_reason,
          averageRating: parseFloat(currentCourseRating.toFixed(1)),
          edited_since_rejection: course.edited_since_rejection,
          modules,
        };
      })
    );

    const overallAverageRating = coursesWithRatings > 0 
      ? totalRatingSum / coursesWithRatings 
      : 0;

    // Fetch action item counts
    const courseIds = coursesOverview.map(c => c.id);

    // Get ungraded assignments count
    const { count: ungradedAssignments,  error: assignmentsError } = await supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('instructor_id', user.id)
      .eq('graded', false);

    if (assignmentsError) {
      console.error('Error fetching ungraded assignments:', assignmentsError);
    }

    // Get unanswered questions count
    const { count: unansweredQuestions, error: questionsError } = await supabase
      .from('student_questions')
      .select('*', { count: 'exact', head: true })
      .eq('course_instructor_id', user.id)
      .eq('answered', false);

    if (questionsError) {
      console.error('Error fetching unanswered questions:', questionsError);
    }

    // Get courses needing changes count
    const coursesNeedingChanges = coursesOverview.filter(c => c.status === 'rejected').length;

    // Fetch recent activity from activity_log
    const { data: activityData, error: activityError } = await supabase
      .from('activity_log')
      .select(`
        id,
        type,
        created_at,
        action_description,
        users!activity_log_user_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        courses!activity_log_course_id_fkey(
          id,
          title
        )
      `)
      .eq('instructor_id', user.id)
      .in('course_id', courseIds)
      .order('created_at', { ascending: false })
      .limit(10);

    if (activityError) {
      console.error('Error fetching activity log:', activityError);
    }

    // Process activity data
    const allowedTypes = ['enrollment', 'completion', 'assignment', 'question'] as const;
    type AllowedType = typeof allowedTypes[number];
    const recentActivity: ActivityItem[] = (activityData || []).map((activity: any) => {
      const student = activity.users?.full_name || 'Unknown Student';
      const course = activity.courses?.title || 'Unknown Course';
      const type = allowedTypes.includes(activity.type) ? activity.type as AllowedType : 'assignment';
      return {
        id: activity.id,
        type,
        student,
        action: activity.action_description,
        course,
        time: activity.created_at,
        avatar: activity.users?.avatar_url,
      };
    });

    // If activity log is empty, fall back to enrollments for MVP
    if (recentActivity.length === 0) {
      const { data: enrollmentActivity, error: enrollmentError } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          course_id,
          users!enrollments_user_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          courses!enrollments_course_id_fkey (
            title
          )
        `)
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: false })
        .limit(10);

      if (enrollmentError) {
        console.error('Error fetching enrollment activity:', enrollmentError);
      } else {
        recentActivity.push(...(enrollmentActivity || []).map((enrollment: any) => ({
          id: enrollment.id,
          type: 'enrollment' as const,
          student: enrollment.users?.full_name || 'Unknown Student',
          action: 'enrolled in',
          course: enrollment.courses?.title || 'Unknown Course',
          time: enrollment.enrolled_at,
          avatar: enrollment.users?.avatar_url,
        })));
      }
    }

    // Check for status change notifications
    const notifications = [];
    const recentStatusChanges = coursesOverview.filter(course => 
      course.status === 'published' || course.status === 'rejected'
    );

    for (const course of recentStatusChanges) {
      if (course.status === 'published') {
        notifications.push({
          id: `status-${course.id}`,
          type: 'status_change' as const,
          message: `Your course "${course.title}" has been approved and published!`,
          timestamp: course.updated_at,
          read: false,
        });
      } else if (course.status === 'rejected') {
        notifications.push({
          id: `status-${course.id}`,
          type: 'status_change' as const,
          message: `Your course "${course.title}" needs changes. Please review the feedback.`,
          timestamp: course.updated_at,
          read: false,
        });
      }
    }

    const dashboardData: DashboardData = {
      stats: {
        totalStudents,
        totalRevenue,
        averageRating: parseFloat(overallAverageRating.toFixed(1)),
        totalCourses: coursesOverview.length,
      },
      courses: coursesOverview,
      actionItems: [
        {
          type: 'assignment',
          count: ungradedAssignments || 0,
          urgent: (ungradedAssignments || 0) > 5,
        },
        {
          type: 'question',
          count: unansweredQuestions || 0,
          urgent: (unansweredQuestions || 0) > 0,
        },
        {
          type: 'review',
          count: coursesNeedingChanges,
          urgent: coursesNeedingChanges > 0,
        },
      ],
      recentActivity,
      notifications,
    };

    console.log('Dashboard data fetched successfully:', {
      coursesCount: coursesOverview.length,
      totalStudents,
      totalRevenue,
      activityCount: recentActivity.length,
    });

    const response = NextResponse.json(dashboardData);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      if (value !== undefined) response.headers.set(key, String(value));
    });
    return response;

  } catch (err: any) {
    console.error('Unexpected error fetching instructor dashboard:', err);
    const apiError = await handleApiError(err, 'instructor dashboard');
    return new NextResponse(JSON.stringify({ code: apiError.code, error: apiError.message, details: apiError.details }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } as any });
  }
}