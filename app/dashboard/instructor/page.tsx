import { createSupabaseServerClient } from '@/lib/supabase/standardized-client';
import { redirect } from 'next/navigation';
import InstructorDashboardPageClient from './InstructorDashboardPageClient';
import ErrorBoundary from '@/components/ErrorBoundary';
import Link from 'next/link';

// Force dynamic rendering to prevent build-time static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

interface DashboardData {
  stats: DashboardStats;
  courses: CourseOverview[];
  actionItems: Array<{
    type: 'assignment' | 'question' | 'review';
    count: number;
    urgent: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'enrollment' | 'completion' | 'assignment' | 'question';
    student: string;
    action: string;
    course: string;
    time: string;
    avatar?: string;
  }>;
  notifications: Array<{
    id: string;
    type: 'status_change' | 'new_enrollment' | 'system';
    message: string;
    timestamp: string;
    read: boolean;
  }>;
}

async function fetchDashboardData(userId: string): Promise<DashboardData> {
  try {
    const supabase = await createSupabaseServerClient();
    
    if (!supabase) {
      throw new Error('Database connection failed');
    }

    // Type assertion to fix union type issues
    const client = supabase as any;

    // Fetch all instructor courses with detailed information
    const { data: coursesData, error: coursesError } = await client
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
    .eq('instructor_id', userId)
    .order('updated_at', { ascending: false });

  if (coursesError) {
    throw new Error(`Failed to fetch courses: ${coursesError.message}`);
  }

  // Calculate summary statistics
  let totalStudents = 0;
  let totalRevenue = 0;
  let totalRatingSum = 0;
  let coursesWithRatings = 0;

  const coursesOverview: CourseOverview[] = await Promise.all(
    (coursesData || []).map(async (course) => {
      // Get total student count and revenue using functions
      const { data: totalStudentsResult, error: studentsError } = await client.rpc('get_instructor_total_students', { instructor_id: userId });
      const { data: totalRevenueResult, error: revenueError } = await client.rpc('get_instructor_total_revenue', { instructor_id: userId });

      if (studentsError) {
        console.error(`Error fetching total students for instructor ${userId}:`, studentsError);
      }

      if (revenueError) {
        console.error(`Error fetching total revenue for instructor ${userId}:`, revenueError);
      }

      const currentStudentCount = totalStudentsResult || 0;
      const revenue = totalRevenueResult || 0;

      // Get average completion rate for the course
      const { data: completionRate, error: completionError } = await client
        .rpc('get_course_average_completion_rate', {
          p_course_id: course.id,
        });

      if (completionError) {
        console.error(`Error fetching completion rate for course ${course.id}:`, completionError);
      }

      const currentCompletionRate = completionRate || 0;

      // Get average rating for the course
      const { data: courseRating, error: ratingError } = await client
        .rpc('get_course_average_rating', {
          p_course_id: course.id,
        });

      if (ratingError) {
        console.error(`Error fetching rating for course ${course.id}:`, ratingError);
      }

      // Fetch reviews for this course
      const { data: reviewsData, error: reviewsError } = await client
        .from('reviews')
        .select('id, rating')
        .eq('course_id', course.id);

      if (reviewsError) {
        console.error(`Error fetching reviews for course ${course.id}:`, reviewsError);
      }

      const currentCourseRating = reviewsData ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length : 0;

      // Fetch modules and lessons for this course (correct relation)
      let modules: Array<{ id: string; title: string; order: number; lessons: Array<{ id: string; title: string; type: 'video' | 'text' | 'quiz' | 'assignment'; position: number; dueDate?: string; needsGrading?: boolean; }> }> = [];
      try {
        const { data: modulesData, error: modulesError } = await client
          .from('course_modules')
          .select(`
            id,
            title,
            order,
            module_lessons (
              id,
              title,
              type,
              position
            )
          `)
          .eq('course_id', course.id)
          .order('order', { ascending: true });

        if (modulesError) {
          console.error(`Error fetching modules for course ${course.id}:`, modulesError?.message || modulesError);
        }

        modules = (modulesData || []).map((module: any) => ({
          id: module.id,
          title: module.title,
          order: module.order,
          lessons: (module.module_lessons || []).map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            type: (lesson.type || 'text') as 'video' | 'text' | 'quiz' | 'assignment',
            position: lesson.position,
            needsGrading: false,
          })).sort((a: any, b: any) => a.position - b.position),
        }));

        if (modules.length === 0) {
          console.log(`No lessons found for course ${course.id} - this is normal for new courses`);
        }
      } catch (error) {
        console.error(`Error fetching modules for course ${course.id}:`, error);
      }

      // Fetch assignment data for this course to populate due dates and grading status
      let assignmentsData = null;
      let assignmentsError = null;
      
      try {
        const result = await client
          .from('assignments')
          .select(`
            id,
            lesson_id,
            title,
            due_date,
            graded,
            created_at
          `)
          .eq('course_id', course.id);
        
        assignmentsData = result.data;
        assignmentsError = result.error;
      } catch (error) {
        console.error(`Error fetching assignments for course ${course.id}:`, error);
        assignmentsError = error;
      }

      if (assignmentsError) {
        console.error(`Error fetching assignments for course ${course.id}:`, assignmentsError);
      }

      // Update lessons with assignment data
      const updatedModules = modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          // Check if this lesson has an assignment by matching title or lesson_id
          const assignment = (assignmentsData || []).find((a: any) => 
            a.lesson_id === lesson.id || a.title === lesson.title
          );
          
          if (assignment) {
            return {
              ...lesson,
              type: 'assignment' as 'video' | 'text' | 'quiz' | 'assignment',
              dueDate: assignment.due_date,
              needsGrading: !assignment.graded,
            };
          }
          return lesson;
        })
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
        thumbnailUrl: course.thumbnail_url,
        price: course.price,
        students: currentStudentCount,
        completionRate: parseFloat(currentCompletionRate.toFixed(2)),
        created_at: course.created_at,
        updated_at: course.updated_at,
        rejection_reason: course.rejection_reason,
        averageRating: parseFloat(currentCourseRating.toFixed(1)),
        edited_since_rejection: course.edited_since_rejection,
        modules: updatedModules,
      };
    })
  );

  const overallAverageRating = coursesWithRatings > 0 
    ? totalRatingSum / coursesWithRatings 
    : 0;

  // Fetch action item counts
  const courseIds = coursesOverview.map(c => c.id);

  // Get ungraded assignments count
  const { count: ungradedAssignments, error: assignmentsError } = await client
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', userId)
    .eq('graded', false);

  if (assignmentsError) {
    console.error('Error fetching ungraded assignments:', assignmentsError);
  }

  // Get unanswered questions count
  const { count: unansweredQuestions, error: questionsError } = await client
    .from('student_questions')
    .select('*', { count: 'exact', head: true })
    .eq('course_instructor_id', userId)
    .eq('answered', false);

  if (questionsError) {
    console.error('Error fetching unanswered questions:', questionsError);
  }

  // Get courses needing changes count
  const coursesNeedingChanges = coursesOverview.filter(c => c.status === 'rejected').length;

  // Fetch recent activity from activity_log
  const { data: activityData, error: activityError } = await client
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
    .eq('instructor_id', userId)
    .in('course_id', courseIds)
    .order('created_at', { ascending: false })
    .limit(10);

  if (activityError) {
    console.error('Error fetching activity log:', activityError);
  }

  // Process activity data
  const allowedTypes = ['enrollment', 'completion', 'assignment', 'question'] as const;
  type AllowedType = typeof allowedTypes[number];
  const recentActivity = (activityData || []).map((activity: any) => {
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
    // Fetch recent enrollments
    const { data: recentEnrollmentsData, error: enrollmentsError } = await client
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

    if (enrollmentsError) {
      console.error('Error fetching enrollment activity:', enrollmentsError);
    } else {
      recentActivity.push(...(recentEnrollmentsData || []).map((enrollment: any) => ({
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

    return {
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
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return default data structure on error
    return {
      stats: {
        totalStudents: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalCourses: 0,
      },
      courses: [],
      actionItems: [],
      recentActivity: [],
      notifications: [],
    };
  }
}

export default async function InstructorDashboardPage() {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      redirect('/login');
    }

    // Get the current user
    const { data: { user }, error: userError } = await (supabase as any).auth.getUser();

    if (userError || !user) {
      redirect('/login');
    }

    // Verify user is an instructor
    const { data: profile, error: profileError } = await (supabase as any)
      .from('users')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'instructor') {
      redirect('/dashboard');
    }

    // Fetch all dashboard data server-side
    const dashboardData = await fetchDashboardData(user.id);

    return (
      <ErrorBoundary>
        <InstructorDashboardPageClient 
          user={user} 
          role={profile.role}
          initialData={dashboardData} 
        />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error in instructor dashboard:', error);
    redirect('/dashboard');
  }
}