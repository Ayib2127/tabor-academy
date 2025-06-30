import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const courseId = params.id;

  try {
    const supabase = await createApiSupabaseClient();

    // Check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructorId = session.user.id;

    // Verify course ownership
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, instructor_id, created_at')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Fetch course analytics data in parallel
    const [
      enrollmentsData,
      lessonsData,
      progressData,
      ratingsData,
    ] = await Promise.all([
      // 1. Enrollments over time
      supabase
        .from('enrollments')
        .select('id, enrolled_at, user_id')
        .eq('course_id', courseId)
        .order('enrolled_at', { ascending: true }),

      // 2. Course lessons for engagement funnel
      supabase
        .from('module_lessons')
        .select(`
          id,
          title,
          order,
          course_modules!inner(course_id)
        `)
        .eq('course_modules.course_id', courseId)
        .eq('is_published', true)
        .order('order', { ascending: true }),

      // 3. Progress data for completion funnel
      supabase
        .from('progress')
        .select('lesson_id, user_id, completed, completed_at')
        .eq('course_id', courseId),

      // 4. Ratings and reviews
      supabase
        .from('course_ratings')
        .select(`
          id,
          rating,
          review,
          created_at,
          users (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false }),
    ]);

    if (enrollmentsData.error) throw enrollmentsData.error;
    if (lessonsData.error) throw lessonsData.error;
    if (progressData.error) throw progressData.error;
    if (ratingsData.error) throw ratingsData.error;

    // Process enrollment trends (last 6 months)
    const enrollmentTrends = processEnrollmentTrends(enrollmentsData.data || []);

    // Process engagement funnel (lesson-by-lesson completion)
    const engagementFunnel = processEngagementFunnel(
      lessonsData.data || [],
      progressData.data || [],
      enrollmentsData.data || []
    );

    // Process ratings and reviews
    const reviews = (ratingsData.data || []).map((rating: any) => ({
      id: rating.id,
      user_name: rating.users?.full_name || 'Anonymous User',
      rating: rating.rating,
      comment: rating.review || '',
      created_at: rating.created_at,
    }));

    // Calculate key metrics
    const totalEnrollments = enrollmentsData.data?.length || 0;
    const totalLessons = lessonsData.data?.length || 0;
    const completedProgress = progressData.data?.filter(p => p.completed).length || 0;
    const totalProgress = progressData.data?.length || 0;
    
    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;
    
    // Calculate average rating
    const ratings = ratingsData.data || [];
    const totalRatingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRatingSum / ratings.length : 0;
    const totalReviews = ratings.length;

    const analyticsData = {
      course: {
        id: course.id,
        title: course.title,
        created_at: course.created_at,
      },
      metrics: {
        totalEnrollments,
        totalLessons,
        completionRate,
        averageRating,
        totalReviews,
      },
      enrollmentTrends,
      engagementFunnel,
      reviews,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(analyticsData);

  } catch (error: any) {
    console.error('Course analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

function processEnrollmentTrends(enrollments: any[]) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  const monthlyData = [];
  
  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
    const monthEnd = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i + 1, 0);
    
    const monthEnrollments = enrollments.filter(enrollment => {
      const enrollDate = new Date(enrollment.enrolled_at);
      return enrollDate >= monthStart && enrollDate <= monthEnd;
    });

    monthlyData.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      enrollments: monthEnrollments.length,
    });
  }

  return monthlyData;
}

function processEngagementFunnel(lessons: any[], progress: any[], enrollments: any[]) {
  const totalStudents = enrollments.length;
  
  if (totalStudents === 0) {
    return lessons.map(lesson => ({
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      lesson_order: lesson.order,
      completed_count: 0,
      completion_rate: 0,
      drop_off_rate: 0,
    }));
  }

  return lessons.map((lesson, index) => {
    const completedCount = progress.filter(p => 
      p.lesson_id === lesson.id && p.completed
    ).length;
    
    const completionRate = Math.round((completedCount / totalStudents) * 100);
    
    // Calculate drop-off rate compared to previous lesson
    let dropOffRate = 0;
    if (index > 0) {
      const previousLessonCompleted = progress.filter(p => 
        p.lesson_id === lessons[index - 1].id && p.completed
      ).length;
      
      if (previousLessonCompleted > 0) {
        dropOffRate = Math.round(((previousLessonCompleted - completedCount) / previousLessonCompleted) * 100);
      }
    }

    return {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      lesson_order: lesson.order,
      completed_count: completedCount,
      completion_rate: completionRate,
      drop_off_rate: Math.max(0, dropOffRate), // Ensure non-negative
    };
  });
}