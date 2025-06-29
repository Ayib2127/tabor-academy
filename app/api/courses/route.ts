import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  try {
    // Use our new standardized client
    const supabase = await createApiSupabaseClient();
    
    const searchParams = request.nextUrl.searchParams;
    
    // Enhanced filtering parameters
    const levels = searchParams.getAll('level');
    const categories = searchParams.getAll('category');
    const skills = searchParams.getAll('skill');
    const contentTypes = searchParams.getAll('content_type');
    const deliveryTypes = searchParams.getAll('delivery_type');
    const priceRange = searchParams.get('price_range');
    const searchQuery = searchParams.get('search');
    
    // Sorting and pagination
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build the query with enhanced filtering
    let query = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        price,
        level,
        category,
        content_type,
        delivery_type,
        tags,
        created_at,
        updated_at,
        users!courses_instructor_id_fkey ( 
          id,
          full_name, 
          avatar_url 
        )
      `, { count: 'exact' })
      .eq('is_published', true);

    // Apply filters
    if (levels.length > 0) {
      query = query.in('level', levels);
    }

    if (categories.length > 0) {
      query = query.in('category', categories);
    }

    if (contentTypes.length > 0) {
      query = query.in('content_type', contentTypes);
    }

    if (deliveryTypes.length > 0) {
      query = query.in('delivery_type', deliveryTypes);
    }

    // Price filtering
    if (priceRange === 'free') {
      query = query.eq('price', 0);
    } else if (priceRange === 'paid') {
      query = query.gt('price', 0);
    }

    // Skills filtering (using tags array)
    if (skills.length > 0) {
      query = query.overlaps('tags', skills);
    }

    // Search functionality
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    // Sorting
    const validSortFields = ['created_at', 'title', 'price', 'level'];
    if (validSortFields.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: courses, error, count } = await query;

    if (error) {
      console.error('Error fetching courses with filters:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enhance courses with additional data
    const enhancedCourses = await Promise.all(
      (courses || []).map(async (course) => {
        // Get enrollment count for social proof
        const { count: enrollmentCount } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id);

        // Calculate average rating (mock for now - you can implement actual ratings later)
        const mockRating = 4.2 + Math.random() * 0.8; // Random rating between 4.2-5.0
        const mockReviewCount = Math.floor(Math.random() * 100) + 10;

        return {
          ...course,
          instructor_name: course.users?.full_name || 'Tabor Academy',
          instructor_avatar: course.users?.avatar_url,
          enrollment_count: enrollmentCount || 0,
          rating: Math.round(mockRating * 10) / 10,
          review_count: mockReviewCount,
          // Add Tabor Original badge logic
          is_tabor_original: course.content_type === 'tabor_original'
        };
      })
    );

    return NextResponse.json({
      courses: enhancedCourses,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      },
      filters: {
        applied: {
          levels,
          categories,
          skills,
          contentTypes,
          deliveryTypes,
          priceRange,
          searchQuery
        }
      },
      // Add migration info for testing
      migrationInfo: {
        usingNewSSR: process.env.NEXT_PUBLIC_USE_NEW_SSR === 'true',
        timestamp: new Date().toISOString()
      }
    });

  } catch (err: any) {
    console.error('An unexpected error occurred:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createApiSupabaseClient();

  try {
    // 1. Check for authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if the authenticated user has the 'instructor' role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (userError || userData?.role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden: Only instructors can create courses' }, { status: 403 });
    }

    // 3. Get the new course data from the request body
    const { title, description, level, price, thumbnail_url, category, content_type, delivery_type, tags } = await request.json();
    
    // TEMPORARY: Trigger a server-side error for Sentry testing
    if (title === "trigger_sentry_error") {
      console.error("Intentionally throwing a server-side error for Sentry test.");
      throw new Error("This is a test server-side error for Sentry!");
    }
    
    // Basic validation
    if (!title || !description) {
        return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    
    // 4. Insert the new course into the database
    const { data: newCourse, error: insertError } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        level,
        price: price || 0,
        thumbnail_url,
        category,
        content_type,
        delivery_type,
        tags,
        instructor_id: session.user.id,
        is_published: false,
        status: 'draft'
      })
      .select()
      .single();
      
    if (insertError) {
      // Handle potential duplicate titles if the constraint is active
      if (insertError.code === '23505') { 
          return NextResponse.json({ error: 'A course with this title already exists.'}, { status: 409 });
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Course created successfully',
      course: newCourse
    });

  } catch (err: any) {
    console.error('An unexpected error occurred:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createApiSupabaseClient();
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}