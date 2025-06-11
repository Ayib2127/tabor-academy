import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET function to list all lessons for a course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    console.log('API Route: /api/courses/[id]/lessons - Incoming request');
    const incomingCookies = request.headers.get('cookie');
    console.log('API Route: Incoming Cookies Header:', incomingCookies); // Log the raw cookie header

    const supabase = createRouteHandlerClient({ cookies });
    const courseId = params.id;

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("API Route: Authentication error:", userError?.message);
            // Added more specific logging for debugging
            if (userError) {
                console.error("API Route: Supabase Auth Error Code:", userError.code);
                console.error("API Route: Supabase Auth Error Details:", userError.details);
                console.error("API Route: Supabase Auth Error Hint:", userError.hint);
            }
            return NextResponse.json({ error: 'Auth session missing!' }, { status: 401 });
        }

        console.log("API Route: Authenticated user ID:", user.id); // Confirm user ID

        const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('instructor_id')
            .eq('id', courseId)
            .single();

        if (courseError || !courseData) {
            console.error("API Route: Error fetching course instructor:", courseError?.message);
            return NextResponse.json({ error: 'Course not found or instructor not linked.' }, { status: 404 });
        }

        const isInstructor = user.id === courseData.instructor_id;
        console.log("API Route: Is user instructor?", isInstructor);

        let query = supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('position', { ascending: true });

        if (!isInstructor) {
            query = query.eq('is_published', true);
        }

        const { data: lessons, error: lessonsError } = await query;

        if (lessonsError) {
            console.error("API Route: Error fetching lessons:", lessonsError.message);
            return NextResponse.json({ error: 'Failed to fetch lessons.' }, { status: 500 });
        }

        console.log("API Route: Successfully fetched lessons count:", lessons?.length);
        return NextResponse.json(lessons);

    } catch (error: any) {
        console.error("API Route: Unexpected error in GET /api/courses/[id]/lessons:", error.message);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const courseId = params.id;

  try {
    // 1. Get the authenticated user's session
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify that the user is the instructor of this specific course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !courseData) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (courseData.instructor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You are not the instructor of this course' }, { status: 403 });
    }

    // 3. Get the new lesson data from the request body
    const { title, content, video_url, duration } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Lesson title is required' }, { status: 400 });
    }

    // 4. Determine the position for the new lesson
    const { count, error: countError } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId);
    
    if (countError) {
      throw countError;
    }
    
    const newPosition = (count || 0) + 1;

    // 5. Insert the new lesson into the database
    const { data: newLesson, error: insertError } = await supabase
      .from('lessons')
      .insert({
        title,
        content,
        video_url,
        duration,
        course_id: courseId,
        position: newPosition,
        is_published: false // Lessons are drafts by default
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newLesson, { status: 201 });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 