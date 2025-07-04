import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createSupabaseServerClient();

  // Require authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check enrollment
  const { count: enrollmentCount, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', id)
    .eq('user_id', user.id);

  if (enrollmentError || !enrollmentCount || enrollmentCount === 0) {
    return NextResponse.json({ error: 'Forbidden: Not enrolled in this course' }, { status: 403 });
  }

  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*),
        users ( full_name, avatar_url )
      `)
      .eq('id', id)
      .single();

    if (error || !course) {
      console.error('Error fetching course details:', error);
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const courseId = params.id;
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      console.error('Course not found or unauthorized:', courseError);
      return NextResponse.json({ error: 'Course not found or you are not authorized to update this course' }, { status: 404 });
    }

    if (course.instructor_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized: You are not the instructor of this course' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('courses')
      .update({ is_published })
      .eq('id', courseId)
      .select();

    if (error) {
      console.error('Error updating course publication status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Unexpected error updating course publication status:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient(); // Initialize Supabase client for DELETE
  try {
    const id = params.id;
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the user is the instructor of this course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .single();
      
    if (courseError || courseData.instructor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this course' },
        { status: 403 }
      );
    }
    
    // Delete the course
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
      
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}