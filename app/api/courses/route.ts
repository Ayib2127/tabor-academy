import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this API route

export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const searchParams = request.nextUrl.searchParams;
    const levels = searchParams.getAll('level');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        price,
        level,
        users ( full_name, avatar_url )
      `, { count: 'exact' })
      .eq('is_published', true);

    if (levels.length > 0) {
      query = query.in('level', levels);
    }

    if (['created_at', 'title', 'price', 'level'].includes(sortBy)) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    query = query.range(offset, offset + limit - 1);

    const { data: courses, error, count } = await query;

    if (error) {
      console.error('Error fetching courses with filters:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      courses: courses,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

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
    const { title, description, level, price, thumbnail_url } = await request.json();
    
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
        instructor_id: session.user.id,
        is_published: false // Courses are unpublished by default
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
    
    return NextResponse.json(newCourse, { status: 201 });

  } catch (error: any) {
    console.error('Error creating course:', error);
    Sentry.captureException(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}