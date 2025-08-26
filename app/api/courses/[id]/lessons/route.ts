import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET function to list all lessons for a course
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id: courseId } = await context.params;
    console.log('API Route: /api/courses/[id]/lessons - Incoming request');
    const incomingCookies = request.headers.get('cookie');
    console.log('API Route: Incoming Cookies Header:', incomingCookies); // Log the raw cookie header

    const supabase = await createApiSupabaseClient();

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("API Route: Authentication error:", userError?.message);
            // Added more specific logging for debugging
            if (userError) {
                console.error("API Route: Supabase Auth Error Code:", userError.code);
                console.error("API Route: Supabase Auth Error Message:", userError.message);
            }
            throw new ForbiddenError('Auth session missing!');
        }

        console.log("API Route: Authenticated user ID:", user.id); // Confirm user ID

        const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('instructor_id')
            .eq('id', courseId)
            .single();

        if (courseError || !courseData) {
            console.error("API Route: Error fetching course instructor:", courseError?.message);
            throw new ValidationError('Course not found or instructor not linked.');
        }

        const isInstructor = user.id === courseData.instructor_id;
        console.log("API Route: Is user instructor?", isInstructor);

        let query = supabase
            .from('module_lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

        if (!isInstructor) {
            query = query.eq('is_published', true);
        }

        const { data: lessons, error: lessonsError } = await query;

        if (lessonsError) {
            console.error("API Route: Error fetching lessons:", lessonsError.message);
            throw lessonsError;
        }

        console.log("API Route: Successfully fetched lessons count:", lessons?.length);
        return NextResponse.json(lessons);

    } catch (error: any) {
        console.error("API Route: Unexpected error in GET /api/courses/[id]/lessons:", error.message);
        const apiError = await handleApiError(error);
        return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
    }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id: courseId } = await params;

  try {
    // 1. Get the authenticated user's session
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !user) {
      throw new ForbiddenError('Unauthorized');
    }

    // 2. Verify that the user is the instructor of this specific course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !courseData) {
      throw new ValidationError('Course not found');
    }

    if (courseData.instructor_id !== user.id) {
      throw new ForbiddenError('You are not the instructor of this course');
    }

    // 3. Get the new lesson data from the request body
    const { title, content, video_url, duration } = await request.json();
    if (!title) {
      throw new ValidationError('Lesson title is required');
    }

    // 4. Determine the position for the new lesson
    const { count, error: countError } = await supabase
      .from('module_lessons')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId);
    if (countError) {
      throw countError;
    }
    const newPosition = (count || 0) + 1;

    // 5. Insert the new lesson into the database
    const { data: newLesson, error: insertError } = await supabase
      .from('module_lessons')
      .insert({
        title,
        content,
        video_url,
        duration,
        course_id: courseId,
        order_index: newPosition,
        is_published: false // Lessons are drafts by default
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(newLesson, { status: 201 });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    const apiError = await handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
} 