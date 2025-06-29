import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

export async function POST(
  req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const courseId = params.id;

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

    const userId = session.user.id;

    // Verify user is enrolled in the course
    const { count: isEnrolled } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('user_id', userId);

    if (!isEnrolled) {
      return NextResponse.json({ 
        error: 'You must be enrolled in this course to rate it' 
      }, { status: 403 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { rating, review } = ratingSchema.parse(body);

    // Check if user has already rated this course
    const { data: existingRating } = await supabase
      .from('course_ratings')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();

    let result;
    
    if (existingRating) {
      // Update existing rating
      result = await supabase
        .from('course_ratings')
        .update({
          rating,
          review,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRating.id)
        .select()
        .single();
    } else {
      // Create new rating
      result = await supabase
        .from('course_ratings')
        .insert({
          course_id: courseId,
          user_id: userId,
          rating,
          review,
        })
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    // Get updated average rating
    const { data: averageRating } = await supabase.rpc(
      'get_course_average_rating',
      { p_course_id: courseId }
    );

    return NextResponse.json({
      success: true,
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating: result.data,
      averageRating,
    });

  } catch (error: any) {
    console.error('Course rating API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid rating data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
    }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const courseId = params.id;

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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