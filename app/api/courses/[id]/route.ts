import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

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
  const supabase = createClient(); // Call without arguments

  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*),
        users ( full_name, avatar_url )
      `) // Select all from courses, and specific fields from users and lessons
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(); // Call without arguments
  const { id: courseId } = params;

  try {
    // 1. Check for authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get the course to verify ownership
    const { data: existingCourse, error: fetchError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (fetchError || !existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 3. Security Check: Ensure the user owns the course they are trying to update
    if (existingCourse.instructor_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this course' }, { status: 403 });
    }

    // 4. Get the updated course data from the request body
    const { title, description, level, price, thumbnail_url, is_published } = await request.json();

    // 5. Update the course in the database
    const { data: updatedCourse, error: updateError } = await supabase
      .from('courses')
      .update({
        title,
        description,
        level,
        price,
        thumbnail_url,
        is_published,
        updated_at: new Date().toISOString(), // Manually set updated_at timestamp
      })
      .eq('id', courseId)
      .select()
      .single();

    if (updateError) {
      // Handle potential duplicate titles if the constraint is active
      if (updateError.code === '23505') { 
          return NextResponse.json({ error: 'A course with this title already exists.'}, { status: 409 });
      }
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedCourse);

  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(); // Initialize Supabase client for DELETE
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