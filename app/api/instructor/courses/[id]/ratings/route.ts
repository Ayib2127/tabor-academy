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
      .select('id, instructor_id')
      .eq('id', courseId)
      .eq('instructor_id', instructorId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Get all ratings for this course
    const { data: ratings, error: ratingsError } = await supabase
      .from('course_ratings')
      .select(`
        id,
        rating,
        review,
        created_at,
        updated_at,
        users (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (ratingsError) {
      throw ratingsError;
    }

    // Get average rating
    const { data: averageRating } = await supabase.rpc(
      'get_course_average_rating',
      { p_course_id: courseId }
    );

    // Get rating distribution
    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
    
    if (ratings) {
      ratings.forEach((rating: any) => {
        if (rating.rating >= 1 && rating.rating <= 5) {
          distribution[rating.rating - 1]++;
        }
      });
    }

    return NextResponse.json({
      ratings,
      averageRating,
      totalRatings: ratings?.length || 0,
      distribution,
    });

  } catch (error: any) {
    console.error('Get course ratings API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
} 