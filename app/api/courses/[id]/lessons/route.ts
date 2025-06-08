import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// GET function to list all lessons for a course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const supabase = createClient();
    const courseId = params.id;

    try {
        // Anyone who is authenticated can see the lesson list for now.
        // We can add more specific instructor/enrollment checks if needed later.
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('position', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(lessons);

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const courseId = params.id;

  try {
    // 1. Get the authenticated user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
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

    if (courseData.instructor_id !== session.user.id) {
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