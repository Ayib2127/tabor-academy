import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { handleApiError, ForbiddenError } from '@/lib/utils/error-handling';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = userProfile?.role || 'student';

    // Get analytics data based on role
    if (role === 'instructor') {
      return await getInstructorAnalytics(supabase, user.id);
    } else if (role === 'admin') {
      return await getAdminAnalytics(supabase);
    } else {
      return await getStudentAnalytics(supabase, user.id);
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

async function getInstructorAnalytics(supabase: any, userId: string) {
  // Get instructor's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, created_at, status')
    .eq('instructor_id', userId);

  if (!courses || courses.length === 0) {
    return NextResponse.json({
      overview: {
        totalStudents: 0,
        totalRevenue: 0,
        averageRating: 0,
        completionRate: 0,
        activeCourses: 0,
        totalEnrollments: 0,
      },
      trends: {
        studentGrowth: 0,
        revenueGrowth: 0,
        ratingTrend: 0,
        completionTrend: 0,
      },
      engagement: {
        dailyActiveUsers: 0,
        weeklyActiveUsers: 0,
        monthlyActiveUsers: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
      },
      performance: {
        topPerformingCourses: [],
        studentProgress: [],
        revenueByMonth: [],
      },
      insights: [],
      predictions: {
        nextMonthRevenue: 0,
        studentRetentionRate: 0,
        courseCompletionPrediction: 0,
        atRiskStudents: 0,
      },
    });
  }

  const courseIds = courses.map((course: any) => course.id);

  // Get enrollments for instructor's courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .in('course_id', courseIds);

  // Get course ratings
  const { data: ratings } = await supabase
    .from('course_ratings')
    .select('*')
    .in('course_id', courseIds);

  // Get progress data
  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .in('course_id', courseIds);

  // Calculate analytics
  const totalStudents = new Set(enrollments?.map((e: any) => e.user_id) || []).size;
  const totalEnrollments = enrollments?.length || 0;
  const activeCourses = courses.filter((c: any) => c.status === 'published').length;
  
  // Calculate average rating
  const averageRating = ratings && ratings.length > 0 
    ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length 
    : 0;

  // Calculate completion rate
  const completedProgress = progress?.filter((p: any) => p.completed) || [];
  const completionRate = totalEnrollments > 0 
    ? (completedProgress.length / totalEnrollments) * 100 
    : 0;

  // Calculate revenue (mock calculation - replace with actual payment data)
  const totalRevenue = totalEnrollments * 50; // Assuming $50 per enrollment

  // Get top performing courses
  const coursePerformance = courses.map((course: any) => {
    const courseEnrollments = enrollments?.filter((e: any) => e.course_id === course.id) || [];
    const courseRatings = ratings?.filter((r: any) => r.course_id === course.id) || [];
    const courseProgress = progress?.filter((p: any) => p.course_id === course.id) || [];
    
    const enrollmentsCount = courseEnrollments.length;
    const completionRate = enrollmentsCount > 0 
      ? (courseProgress.filter((p: any) => p.completed).length / enrollmentsCount) * 100 
      : 0;
    const avgRating = courseRatings.length > 0 
      ? courseRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / courseRatings.length 
      : 0;
    const revenue = enrollmentsCount * 50;

    return {
      id: course.id,
      title: course.title,
      enrollments: enrollmentsCount,
      completionRate: Math.round(completionRate * 10) / 10,
      averageRating: Math.round(avgRating * 10) / 10,
      revenue,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Generate insights
  const insights = [];
  
  if (completionRate > 75) {
    insights.push({
      id: '1',
      type: 'success' as const,
      title: 'High Completion Rate',
      description: `Your courses have a ${completionRate.toFixed(1)}% completion rate, which is excellent!`,
      impact: 'high' as const,
    });
  }

  if (averageRating > 4.5) {
    insights.push({
      id: '2',
      type: 'success' as const,
      title: 'Excellent Student Ratings',
      description: `Your average rating of ${averageRating.toFixed(1)} shows high student satisfaction.`,
      impact: 'high' as const,
    });
  }

  if (totalStudents < 10) {
    insights.push({
      id: '3',
      type: 'warning' as const,
      title: 'Low Student Count',
      description: 'Consider promoting your courses to increase enrollments.',
      impact: 'medium' as const,
      action: 'View Marketing Tips',
    });
  }

  // Generate revenue by month (mock data)
  const revenueByMonth = [
    { month: 'Jan', revenue: Math.floor(totalRevenue * 0.15), enrollments: Math.floor(totalEnrollments * 0.15) },
    { month: 'Feb', revenue: Math.floor(totalRevenue * 0.18), enrollments: Math.floor(totalEnrollments * 0.18) },
    { month: 'Mar', revenue: Math.floor(totalRevenue * 0.22), enrollments: Math.floor(totalEnrollments * 0.22) },
    { month: 'Apr', revenue: Math.floor(totalRevenue * 0.20), enrollments: Math.floor(totalEnrollments * 0.20) },
    { month: 'May', revenue: Math.floor(totalRevenue * 0.12), enrollments: Math.floor(totalEnrollments * 0.12) },
    { month: 'Jun', revenue: Math.floor(totalRevenue * 0.13), enrollments: Math.floor(totalEnrollments * 0.13) },
  ];

  // Calculate trends (mock calculations)
  const trends = {
    studentGrowth: totalStudents > 0 ? Math.floor(Math.random() * 20) + 5 : 0,
    revenueGrowth: totalRevenue > 0 ? Math.floor(Math.random() * 15) + 3 : 0,
    ratingTrend: averageRating > 0 ? Math.floor(Math.random() * 10) / 10 : 0,
    completionTrend: completionRate > 0 ? Math.floor(Math.random() * 5) + 1 : 0,
  };

  // Engagement metrics (mock data)
  const engagement = {
    dailyActiveUsers: Math.floor(totalStudents * 0.3),
    weeklyActiveUsers: Math.floor(totalStudents * 0.7),
    monthlyActiveUsers: totalStudents,
    averageSessionDuration: Math.floor(Math.random() * 30) + 30,
    bounceRate: Math.floor(Math.random() * 20) + 15,
  };

  // Predictions (mock data)
  const predictions = {
    nextMonthRevenue: Math.floor(totalRevenue * 1.1),
    studentRetentionRate: Math.floor(Math.random() * 20) + 75,
    courseCompletionPrediction: Math.floor(completionRate * 1.05),
    atRiskStudents: Math.floor(totalStudents * 0.02),
  };

  return NextResponse.json({
    overview: {
      totalStudents,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      activeCourses,
      totalEnrollments,
    },
    trends,
    engagement,
    performance: {
      topPerformingCourses: coursePerformance,
      studentProgress: coursePerformance.map(course => ({
        courseId: course.id,
        courseTitle: course.title,
        enrolledStudents: course.enrollments,
        completedStudents: Math.floor(course.enrollments * (course.completionRate / 100)),
        inProgressStudents: Math.floor(course.enrollments * 0.15),
        droppedStudents: Math.floor(course.enrollments * 0.05),
      })),
      revenueByMonth,
    },
    insights,
    predictions,
  });
}

async function getAdminAnalytics(supabase: any) {
  // Get all courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*');

  // Get all enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*');

  // Get all users
  const { data: users } = await supabase
    .from('users')
    .select('*');

  // Calculate platform-wide analytics
  const totalStudents = users?.filter((u: any) => u.role === 'student').length || 0;
  const totalInstructors = users?.filter((u: any) => u.role === 'instructor').length || 0;
  const totalCourses = courses?.length || 0;
  const totalEnrollments = enrollments?.length || 0;

  // Mock platform analytics
  return NextResponse.json({
    overview: {
      totalStudents,
      totalRevenue: totalEnrollments * 50,
      averageRating: 4.6,
      completionRate: 75.2,
      activeCourses: courses?.filter((c: any) => c.status === 'published').length || 0,
      totalEnrollments,
    },
    trends: {
      studentGrowth: 18.5,
      revenueGrowth: 12.3,
      ratingTrend: 0.2,
      completionTrend: 1.8,
    },
    engagement: {
      dailyActiveUsers: Math.floor(totalStudents * 0.4),
      weeklyActiveUsers: Math.floor(totalStudents * 0.8),
      monthlyActiveUsers: totalStudents,
      averageSessionDuration: 42,
      bounceRate: 21.5,
    },
    performance: {
      topPerformingCourses: [],
      studentProgress: [],
      revenueByMonth: [],
    },
    insights: [
      {
        id: '1',
        type: 'success' as const,
        title: 'Platform Growth',
        description: `Platform has ${totalStudents} active students and ${totalInstructors} instructors.`,
        impact: 'high' as const,
      },
    ],
    predictions: {
      nextMonthRevenue: Math.floor(totalEnrollments * 50 * 1.15),
      studentRetentionRate: 82.1,
      courseCompletionPrediction: 77.8,
      atRiskStudents: Math.floor(totalStudents * 0.03),
    },
  });
}

async function getStudentAnalytics(supabase: any, userId: string) {
  // Get student's enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId);

  // Get student's progress
  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);

  // Get enrolled courses
  const courseIds = enrollments?.map((e: any) => e.course_id) || [];
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .in('id', courseIds);

  // Calculate student analytics
  const totalEnrolledCourses = enrollments?.length || 0;
  const completedCourses = progress?.filter((p: any) => p.completed).length || 0;
  const completionRate = totalEnrolledCourses > 0 
    ? (completedCourses / totalEnrolledCourses) * 100 
    : 0;

  return NextResponse.json({
    overview: {
      totalStudents: 1,
      totalRevenue: 0,
      averageRating: 0,
      completionRate: Math.round(completionRate * 10) / 10,
      activeCourses: totalEnrolledCourses,
      totalEnrollments: totalEnrolledCourses,
    },
    trends: {
      studentGrowth: 0,
      revenueGrowth: 0,
      ratingTrend: 0,
      completionTrend: completionRate > 0 ? 2.1 : 0,
    },
    engagement: {
      dailyActiveUsers: 1,
      weeklyActiveUsers: 1,
      monthlyActiveUsers: 1,
      averageSessionDuration: 35,
      bounceRate: 15.2,
    },
    performance: {
      topPerformingCourses: [],
      studentProgress: [],
      revenueByMonth: [],
    },
    insights: [
      {
        id: '1',
        type: 'info' as const,
        title: 'Learning Progress',
        description: `You've completed ${completedCourses} out of ${totalEnrolledCourses} enrolled courses.`,
        impact: 'medium' as const,
      },
    ],
    predictions: {
      nextMonthRevenue: 0,
      studentRetentionRate: 95.0,
      courseCompletionPrediction: Math.floor(completionRate * 1.1),
      atRiskStudents: 0,
    },
  });
} 