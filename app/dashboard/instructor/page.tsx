import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InstructorDashboardPageClient from './InstructorDashboardPageClient';
import Link from 'next/link';

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
  const supabase = await createApiSupabaseClient();

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

      // Fetch lessons for the course (fallback to old structure)
      let lessonsData = null;
      let lessonsError = null;
      
      try {
        const result = await supabase
          .from('module_lessons')
          .select(`
            id,
            title,
            description,
            content,
            video_url,
            duration,
            position,
            is_published
          `)
          .eq('course_id', course.id)
          .order('position', { ascending: true });
        
        lessonsData = result.data;
        lessonsError = result.error;
      } catch (error) {
        console.error(`Error fetching lessons for course ${course.id}:`, error);
        lessonsError = error;
      }

      if (lessonsError) {
        console.error(`Error fetching lessons for course ${course.id}:`, lessonsError);
      }

      // Transform lessons data to match expected format
      const modules = [{
        id: `module-${course.id}`,
        title: 'Course Content',
        order: 1,
        lessons: (lessonsData || []).map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          type: 'text' as 'video' | 'text' | 'quiz' | 'assignment', // Default to text
          position: lesson.position,
          dueDate: undefined, // Will be populated from assignments table if needed
          needsGrading: false, // Will be populated from assignments table if needed
        })).sort((a, b) => a.position - b.position)
      }];

      // If no lessons found, create a placeholder module to prevent errors
      if (modules[0].lessons.length === 0) {
        console.log(`No lessons found for course ${course.id} - this is normal for new courses`);
      }

      // Fetch assignment data for this course to populate due dates and grading status
      let assignmentsData = null;
      let assignmentsError = null;
      
      try {
        const result = await supabase
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
          const assignment = (assignmentsData || []).find(a => 
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
        thumbnail_url: course.thumbnail_url,
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
  const { count: ungradedAssignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', userId)
    .eq('graded', false);

  if (assignmentsError) {
    console.error('Error fetching ungraded assignments:', assignmentsError);
  }

  // Get unanswered questions count
  const { count: unansweredQuestions, error: questionsError } = await supabase
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
}

export default async function InstructorDashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createApiSupabaseClient(cookieStore);

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  // Verify user is an instructor
  const { data: profile, error: profileError } = await supabase
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
    <InstructorDashboardPageClient 
      user={user} 
      role={profile.role}
      initialData={dashboardData}
    />
  );
} 