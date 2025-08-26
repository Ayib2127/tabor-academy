import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { handleApiError, ForbiddenError, ValidationError, NotFoundError } from '@/lib/utils/error-handling';

// Mock data (should match your main courses list)
const courses = [
  {
    id: 'course1',
    title: 'Full Stack Web Development',
    description: 'Learn to build modern web applications.',
    instructorId: 'instructor1',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-10',
    status: 'draft',
  },
  {
    id: 'course2',
    title: 'Introduction to Data Science',
    description: 'A beginner-friendly data science course.',
    instructorId: 'instructor1',
    createdAt: '2024-04-15',
    updatedAt: '2024-05-09',
    status: 'published',
  },
];

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const courseId = params.id;
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
  // Fetch course and join instructor info
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users (
        id,
        full_name,
        avatar_url,
        title,
        bio,
        expertise
      ),
      course_modules (
        *,
        module_lessons(*)
      )
    `)
    .eq('id', courseId)
    .single();

  if (error || !course) {
      throw new NotFoundError('Course not found');
  }

  // Transform modules for frontend compatibility
  const modules = (course.course_modules || []).map((mod) => ({
    ...mod,
    description: mod.description ?? "",
    lessons: mod.module_lessons || [],
  }));

  // Return all course details, including instructor info
  return new Response(JSON.stringify({
    ...course,
    instructor: course.instructor,
    modules,
    // Optionally, map/rename other fields as needed for your frontend
  }), { status: 200 });
  } catch (error: any) {
    console.error('Course details API error:', error);
    const apiError = await handleApiError(error);
    return new Response(
      JSON.stringify({ code: apiError.code, error: apiError.message, details: apiError.details }),
      { status: apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 }
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const courseId = params.id;
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new ForbiddenError('Unauthorized');
  }

  try {
    const { is_published } = await request.json();

    // Verify that the user is the instructor of this course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      throw new NotFoundError('Course not found or you are not authorized to update this course');
    }
    if (course.instructor_id !== user.id) {
      throw new ForbiddenError('Unauthorized: You are not the instructor of this course');
    }

    const { data, error } = await supabase
      .from('courses')
      .update({ is_published })
      .eq('id', courseId)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Unexpected error updating course publication status:', err);
    const apiError = await handleApiError(err);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const supabase = await createSupabaseServerClient();
  try {
    const id = params.id;
    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new ForbiddenError('Unauthorized');
    }
    // Check if the user is the instructor of this course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();
    if (courseError || !courseData) {
      throw new NotFoundError('Course not found');
    }
    if (courseData.instructor_id !== session.user.id) {
      throw new ForbiddenError('You do not have permission to delete this course');
    }
    // Delete the course
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'FORBIDDEN' ? 403 : apiError.code === 'VALIDATION_ERROR' ? 400 : 500 });
  }
}